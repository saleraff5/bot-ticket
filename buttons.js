const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('./config');

class ButtonManager {
    // Select menu principal do sistema de tickets
    static createTicketSelectMenu() {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_ticket_type')
            .setPlaceholder('Selecione o tipo de atendimento...')
            .setMinValues(1)
            .setMaxValues(1);

        const options = [];
        for (const [key, ticketType] of Object.entries(config.ticketTypes)) {
            options.push({
                label: ticketType.label,
                description: ticketType.description,
                value: key,
                emoji: ticketType.emoji
            });
        }
        
        selectMenu.addOptions(options);
        return [new ActionRowBuilder().addComponents(selectMenu)];
    }

    // Botões principais do sistema de tickets (mantido como alternativa)
    static createMainButtons() {
        const buttons = [];
        
        for (const [key, ticketType] of Object.entries(config.ticketTypes)) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId(`ticket_${key}`)
                    .setLabel(ticketType.label)
                    .setEmoji(ticketType.emoji)
                    .setStyle(ButtonStyle.Primary)
            );
        }

        // Dividir em rows se necessário (máximo 5 botões por row)
        const rows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
        }

        return rows;
    }

    // Botão para ir ao ticket
    static createGoToTicketButton(channelId) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`goto_ticket_${channelId}`)
                    .setLabel('Ir para o ticket')
                    .setEmoji('📍')
                    .setStyle(ButtonStyle.Success)
            );
    }

    // Botões de controle do ticket
    static createTicketControlButtons() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Fechar Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('add_user_modal')
                    .setLabel('Adicionar Usuário')
                    .setEmoji('➕')
                    .setStyle(ButtonStyle.Secondary)
            );
    }

    // Botões de confirmação para fechar ticket
    static createCloseConfirmationButtons() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_close')
                    .setLabel('Sim, fechar')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_close')
                    .setLabel('Cancelar')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Secondary)
            );
    }
}

module.exports = ButtonManager;

