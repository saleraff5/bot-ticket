const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

class ModalManager {
    // Modal para adicionar usuário
    static createAddUserModal() {
        const modal = new ModalBuilder()
            .setCustomId('add_user_modal')
            .setTitle('Adicionar Usuário ao Ticket');

        const userInput = new TextInputBuilder()
            .setCustomId('user_input')
            .setLabel('ID ou @menção do usuário')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o ID do usuário ou @mencione')
            .setRequired(true)
            .setMaxLength(100);

        const firstActionRow = new ActionRowBuilder().addComponents(userInput);
        modal.addComponents(firstActionRow);

        return modal;
    }

    // Processar modal de adicionar usuário
    static async handleAddUserModal(interaction) {
        try {
            const config = require('./config');
            const userInput = interaction.fields.getTextInputValue('user_input');
            const channel = interaction.channel;

            // Verificar se o usuário tem permissão (staff)
            const hasPermission = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || 
                                config.staffRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!hasPermission) {
                return await interaction.reply({
                    content: '❌ Você não tem permissão para adicionar usuários!',
                    ephemeral: true
                });
            }

            // Verificar se é um canal de ticket
            if (!channel.name.startsWith('ticket-')) {
                return await interaction.reply({
                    content: '❌ Este comando só pode ser usado em canais de ticket!',
                    ephemeral: true
                });
            }

            // Extrair ID do usuário
            let userId = userInput.trim();
            
            // Se for uma menção, extrair o ID
            if (userId.startsWith('<@') && userId.endsWith('>')) {
                userId = userId.slice(2, -1);
                if (userId.startsWith('!')) {
                    userId = userId.slice(1);
                }
            }

            // Verificar se é um ID válido
            if (!/^\d{17,19}$/.test(userId)) {
                return await interaction.reply({
                    content: '❌ ID de usuário inválido! Use o ID numérico ou @mencione o usuário.',
                    ephemeral: true
                });
            }

            // Buscar o usuário
            let user;
            try {
                user = await interaction.client.users.fetch(userId);
            } catch (error) {
                return await interaction.reply({
                    content: '❌ Usuário não encontrado! Verifique se o ID está correto.',
                    ephemeral: true
                });
            }

            // Verificar se o usuário está no servidor
            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (!member) {
                return await interaction.reply({
                    content: '❌ Este usuário não está no servidor!',
                    ephemeral: true
                });
            }

            // Verificar se o usuário já tem acesso
            const existingPermission = channel.permissionOverwrites.cache.get(userId);
            if (existingPermission && existingPermission.allow.has(PermissionFlagsBits.ViewChannel)) {
                return await interaction.reply({
                    content: `❌ ${user.tag} já tem acesso a este ticket!`,
                    ephemeral: true
                });
            }

            // Adicionar permissões para o usuário
            await channel.permissionOverwrites.edit(userId, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true
            });

            // Responder com sucesso
            await interaction.reply({
                content: `✅ ${user.tag} foi adicionado ao ticket com sucesso!`,
                ephemeral: false
            });

            // Mencionar o usuário adicionado
            await channel.send(`👋 ${user}, você foi adicionado a este ticket!`);

        } catch (error) {
            console.error('Erro ao processar modal de adicionar usuário:', error);
            await interaction.reply({
                content: '❌ Erro ao adicionar usuário ao ticket.',
                ephemeral: true
            });
        }
    }
}

module.exports = ModalManager;

