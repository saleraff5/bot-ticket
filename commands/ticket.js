const { SlashCommandBuilder } = require('discord.js');
const EmbedManager = require('../embeds');
const ButtonManager = require('../buttons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Envia o painel principal de tickets'),
    
    async execute(interaction) {
        try {
            // Verificar se o usuário tem permissão (staff)
            const config = require('../config');
            const hasPermission = interaction.member.permissions.has('ManageChannels') || 
                                config.staffRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!hasPermission) {
                return await interaction.reply({
                    content: '❌ Você não tem permissão para usar este comando!',
                    ephemeral: true
                });
            }

            // Criar embed e select menu
            const mainEmbed = EmbedManager.createMainEmbed();
            const selectMenu = ButtonManager.createTicketSelectMenu();

            // Enviar o painel no canal (não efêmero)
            await interaction.channel.send({
                embeds: [mainEmbed],
                components: selectMenu
            });

            // Responder de forma efêmera para confirmar
            await interaction.reply({
                content: '✅ Painel de tickets enviado com sucesso!',
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro no comando ticket:', error);
            await interaction.reply({
                content: '❌ Erro ao executar o comando.',
                ephemeral: true
            });
        }
    }
};

