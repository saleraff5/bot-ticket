const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Adiciona um usuário ao ticket atual')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para adicionar ao ticket')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        try {
            const config = require('../config');
            const user = interaction.options.getUser('usuario');
            const channel = interaction.channel;

            // Verificar se o usuário tem permissão (staff)
            const hasPermission = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || 
                                config.staffRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!hasPermission) {
                return await interaction.reply({
                    content: '❌ Você não tem permissão para usar este comando!',
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

            // Verificar se o usuário já tem acesso
            const existingPermission = channel.permissionOverwrites.cache.get(user.id);
            if (existingPermission && existingPermission.allow.has(PermissionFlagsBits.ViewChannel)) {
                return await interaction.reply({
                    content: `❌ ${user.tag} já tem acesso a este ticket!`,
                    ephemeral: true
                });
            }

            // Adicionar permissões para o usuário
            await channel.permissionOverwrites.edit(user.id, {
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
            console.error('Erro no comando adduser:', error);
            await interaction.reply({
                content: '❌ Erro ao adicionar usuário ao ticket.',
                ephemeral: true
            });
        }
    }
};

