const { EmbedBuilder } = require('discord.js');
const config = require('./config');

class EmbedManager {
    // Embed principal do sistema de tickets
    static createMainEmbed() {
        const embed = new EmbedBuilder()
            .setTitle('📩 CENTRAL DE ATENDIMENTO RAMAL')
            .setDescription(
                'Escolha abaixo o tipo de atendimento que você precisa e abriremos um canal privado com a equipe responsável.\n\n' +
                '🛒 **Compras ou Renovações**\n' +
                '📌 Precisa adquirir a calculadora penal ou renovar seu acesso?\n\n' +
                '🛠️ **Suporte**\n' +
                '📌 Já é cliente e está com dúvidas ou problemas técnicos?\n\n' +
                '🤝 **Parcerias**\n' +
                '📌 Tem um servidor e quer fechar parceria com a Ramal?\n\n' +
                '👇 **Selecione uma opção abaixo para abrir seu ticket.**'
            )
            .setColor(config.embedColor)
            .setFooter({ text: 'Ramal Systems - Sistema de Tickets' })
            .setTimestamp();

        // Adicionar imagem principal se configurada
        if (config.embedImageUrl) {
            embed.setImage(config.embedImageUrl);
        }

        // Adicionar thumbnail se configurada
        if (config.embedThumbnailUrl) {
            embed.setThumbnail(config.embedThumbnailUrl);
        }

        return embed;
    }

    // Embed de confirmação após criar ticket
    static createConfirmationEmbed(channelId) {
        return new EmbedBuilder()
            .setTitle('✅ Ticket Criado com Sucesso!')
            .setDescription(
                'Seu ticket foi criado com sucesso!\n' +
                `Clique no botão abaixo para ser redirecionado ao seu canal privado de atendimento.\n\n` +
                `📍 Canal: <#${channelId}>`
            )
            .setColor(config.embedColor)
            .setFooter({ text: 'Ramal Systems' })
            .setTimestamp();
    }

    // Embed para canal de compras
    static createComprasEmbed(user) {
        return new EmbedBuilder()
            .setTitle('🛒 Atendimento - Compra ou Renovação')
            .setDescription(
                `Olá ${user}, tudo bem? 👋\n` +
                'Você está no canal de compra ou renovação da sua licença da Calculadora Penal.\n\n' +
                '**Envie:**\n' +
                '1. Nome e usuário do Discord\n' +
                '2. Se deseja comprar ou renovar\n' +
                '3. Forma de pagamento desejada\n\n' +
                '📌 Após o pagamento, envie o comprovante aqui.\n' +
                '🕐 Liberação em até 30 minutos (horário comercial)\n\n' +
                '💡 **Dica:** Veja o canal #💰・formas-de-pagamento'
            )
            .setColor(config.embedColor)
            .setFooter({ text: 'Ramal Systems - Compras' })
            .setTimestamp();
    }

    // Embed para canal de suporte
    static createSuporteEmbed(user) {
        return new EmbedBuilder()
            .setTitle('🛠️ Suporte Técnico')
            .setDescription(
                `Olá ${user}!\n` +
                'Esse canal é exclusivo para clientes com dúvidas ou problemas técnicos.\n\n' +
                '**Informe:**\n' +
                '1. O erro encontrado\n' +
                '2. Nome do seu servidor\n' +
                '3. Prints ou logs\n\n' +
                '⏱️ **Resposta em até 12h úteis.**'
            )
            .setColor(config.embedColor)
            .setFooter({ text: 'Ramal Systems - Suporte' })
            .setTimestamp();
    }

    // Embed para canal de parceria
    static createParceriaEmbed(user) {
        return new EmbedBuilder()
            .setTitle('🤝 Parcerias e Afiliados')
            .setDescription(
                `Olá ${user}! Que bom que você quer ser parceiro da Ramal Systems.\n\n` +
                '**Informe:**\n' +
                '1. Nome do servidor e número de membros\n' +
                '2. Link de convite permanente\n' +
                '3. Tipo de parceria desejada\n\n' +
                '📌 **Analisaremos sua proposta em breve.**'
            )
            .setColor(config.embedColor)
            .setFooter({ text: 'Ramal Systems - Parcerias' })
            .setTimestamp();
    }

    // Embed para logs
    static createLogEmbed(user, ticketType, channelName, action = 'criado') {
        return new EmbedBuilder()
            .setTitle(`📂 Ticket ${action}`)
            .addFields(
                { name: '👤 Usuário', value: `${user.tag} (${user.id})`, inline: true },
                { name: '🎫 Tipo', value: ticketType, inline: true },
                { name: '📍 Canal', value: channelName, inline: true },
                { name: '🕐 Data/Hora', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
            )
            .setColor(action === 'criado' ? '#00ff88' : '#ff4444')
            .setFooter({ text: 'Sistema de Logs - Ramal' })
            .setTimestamp();
    }
}

module.exports = EmbedManager;

