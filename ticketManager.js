const { PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('./config');
const EmbedManager = require('./embeds');
const ButtonManager = require('./buttons');
const TranscriptManager = require('./transcriptManager');

class TicketManager {
    constructor(client) {
        this.client = client;
        this.activeTickets = new Map(); // Armazena tickets ativos
        this.transcriptManager = new TranscriptManager();
    }

    // Criar um novo ticket
    async createTicket(interaction, ticketType) {
        try {
            const guild = interaction.guild;
            const user = interaction.user;
            const ticketConfig = config.ticketTypes[ticketType];

            if (!ticketConfig) {
                return await interaction.reply({
                    content: '❌ Tipo de ticket inválido!',
                    ephemeral: true
                });
            }

            // Verificar se o usuário já tem um ticket aberto
            const existingTicket = this.findUserTicket(user.id);
            if (existingTicket) {
                return await interaction.reply({
                    content: `❌ Você já possui um ticket aberto: <#${existingTicket.id}>`,
                    ephemeral: true
                });
            }

            // Criar permissões do canal
            const permissions = [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles
                    ]
                }
            ];

            // Adicionar permissões para a staff
            config.staffRoleIds.forEach(roleId => {
                if (guild.roles.cache.has(roleId)) {
                    permissions.push({
                        id: roleId,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.ManageMessages
                        ]
                    });
                }
            });

            // Criar o canal
            const channelName = `ticket-${ticketConfig.channelPrefix}-${user.username}`.toLowerCase();
            const ticketChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: config.ticketCategoryId || null,
                permissionOverwrites: permissions,
                topic: `Ticket de ${ticketType} - ${user.tag} (${user.id})`
            });

            // Armazenar informações do ticket
            this.activeTickets.set(ticketChannel.id, {
                userId: user.id,
                type: ticketType,
                createdAt: new Date(),
                channelId: ticketChannel.id
            });

            // Enviar embed específico no canal do ticket
            let ticketEmbed;
            switch (ticketType) {
                case 'compras':
                    ticketEmbed = EmbedManager.createComprasEmbed(user);
                    break;
                case 'suporte':
                    ticketEmbed = EmbedManager.createSuporteEmbed(user);
                    break;
                case 'parceria':
                    ticketEmbed = EmbedManager.createParceriaEmbed(user);
                    break;
            }

            const controlButtons = ButtonManager.createTicketControlButtons();

            await ticketChannel.send({
                content: `${user} Bem-vindo ao seu ticket!`,
                embeds: [ticketEmbed],
                components: [controlButtons]
            });

            // Responder com confirmação
            const confirmationEmbed = EmbedManager.createConfirmationEmbed(ticketChannel.id);
            const goToTicketButton = ButtonManager.createGoToTicketButton(ticketChannel.id);

            await interaction.reply({
                embeds: [confirmationEmbed],
                components: [goToTicketButton],
                ephemeral: true
            });

            // Log do ticket
            await this.logTicket(user, ticketType, channelName, 'criado');

            return ticketChannel;

        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            await interaction.reply({
                content: '❌ Erro ao criar o ticket. Tente novamente mais tarde.',
                ephemeral: true
            });
        }
    }

    // Fechar ticket
    async closeTicket(interaction, channelId = null) {
        try {
            const channel = channelId ? interaction.guild.channels.cache.get(channelId) : interaction.channel;
            
            if (!channel) {
                return await interaction.reply({
                    content: '❌ Canal não encontrado!',
                    ephemeral: true
                });
            }

            const ticketData = this.activeTickets.get(channel.id);
            if (!ticketData) {
                return await interaction.reply({
                    content: '❌ Este não é um canal de ticket válido!',
                    ephemeral: true
                });
            }

            // Confirmar fechamento
            const confirmButtons = ButtonManager.createCloseConfirmationButtons();
            
            await interaction.reply({
                content: '⚠️ **Tem certeza que deseja fechar este ticket?**\nEsta ação não pode ser desfeita.',
                components: [confirmButtons],
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro ao fechar ticket:', error);
            await interaction.reply({
                content: '❌ Erro ao fechar o ticket.',
                ephemeral: true
            });
        }
    }

    // Confirmar fechamento do ticket
    async confirmCloseTicket(interaction) {
        try {
            const channel = interaction.channel;
            const ticketData = this.activeTickets.get(channel.id);

            if (!ticketData) {
                return await interaction.reply({
                    content: '❌ Dados do ticket não encontrados!',
                    ephemeral: true
                });
            }

            const user = await this.client.users.fetch(ticketData.userId);

            // Criar transcrição antes de fechar
            let transcriptInfo = null;
            if (config.transcriptEnabled) {
                await interaction.reply({
                    content: '📝 Criando transcrição do ticket...',
                    ephemeral: false
                });

                transcriptInfo = await this.transcriptManager.createTranscript(channel, ticketData);
            } else {
                await interaction.reply({
                    content: '🔒 **Ticket será fechado em 5 segundos...**',
                    ephemeral: false
                });
            }

            // Log do fechamento (incluindo transcrição se disponível)
            await this.logTicket(user, ticketData.type, channel.name, 'fechado', transcriptInfo);

            // Remover da lista de tickets ativos
            this.activeTickets.delete(channel.id);

            // Deletar canal após 5 segundos
            setTimeout(async () => {
                try {
                    await channel.delete('Ticket fechado');
                } catch (error) {
                    console.error('Erro ao deletar canal:', error);
                }
            }, 5000);

        } catch (error) {
            console.error('Erro ao confirmar fechamento:', error);
            await interaction.reply({
                content: '❌ Erro ao fechar o ticket.',
                ephemeral: true
            });
        }
    }

    // Encontrar ticket de um usuário
    findUserTicket(userId) {
        for (const [channelId, ticketData] of this.activeTickets) {
            if (ticketData.userId === userId) {
                const channel = this.client.channels.cache.get(channelId);
                return channel;
            }
        }
        return null;
    }

    // Registrar log do ticket
    async logTicket(user, ticketType, channelName, action, transcriptInfo = null) {
        try {
            if (!config.logChannelId) return;

            const logChannel = this.client.channels.cache.get(config.logChannelId);
            if (!logChannel) return;

            const logEmbed = EmbedManager.createLogEmbed(user, ticketType, channelName, action);
            
            // Adicionar informações da transcrição se disponível
            if (transcriptInfo) {
                let transcriptValue = `Arquivo: \`${transcriptInfo.filename}\`\nMensagens: ${transcriptInfo.messageCount}`;
                
                // Se há URL do Cloudinary, adicionar link
                if (transcriptInfo.cloudinaryUrl) {
                    transcriptValue += `\n🔗 [Visualizar Transcrição](${transcriptInfo.cloudinaryUrl})`;
                }
                
                logEmbed.addFields({
                    name: '📝 Transcrição',
                    value: transcriptValue,
                    inline: true
                });
            }

            await logChannel.send({ embeds: [logEmbed] });

        } catch (error) {
            console.error('Erro ao registrar log:', error);
        }
    }

    // Ir para o ticket
    async goToTicket(interaction, channelId) {
        try {
            const channel = interaction.guild.channels.cache.get(channelId);
            
            if (!channel) {
                return await interaction.reply({
                    content: '❌ Canal não encontrado!',
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: `📍 Redirecionando para seu ticket: ${channel}`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            await interaction.reply({
                content: '❌ Erro ao redirecionar para o ticket.',
                ephemeral: true
            });
        }
    }
}

module.exports = TicketManager;

