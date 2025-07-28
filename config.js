require('dotenv').config();

module.exports = {
    // Token do bot
    token: process.env.DISCORD_TOKEN,
    
    // IDs importantes
    guildId: process.env.GUILD_ID,
    ticketChannelId: process.env.TICKET_CHANNEL_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    ticketCategoryId: process.env.TICKET_CATEGORY_ID,
    
    // Cargos da staff (separados por vírgula)
    staffRoleIds: process.env.STAFF_ROLE_IDS ? process.env.STAFF_ROLE_IDS.split(',') : [],
    
    // Configurações do bot
    embedColor: '#00ff88', // Cor verde da Ramal
    
    // Configurações de transcrição
    transcriptEnabled: true,
    transcriptDir: './transcripts',
    
    // URL da imagem para o embed principal (opcional)
    embedImageUrl: process.env.EMBED_IMAGE_URL || null,
    embedThumbnailUrl: process.env.EMBED_THUMBNAIL_URL || null,

    // Configurações do Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    
    // Tipos de ticket
    ticketTypes: {
        compras: {
            emoji: '🛒',
            label: 'Compras / Renovação',
            channelPrefix: 'compras',
            description: 'Precisa adquirir a calculadora penal ou renovar seu acesso?'
        },
        suporte: {
            emoji: '🛠️',
            label: 'Suporte',
            channelPrefix: 'suporte',
            description: 'Já é cliente e está com dúvidas ou problemas técnicos?'
        },
        parceria: {
            emoji: '🤝',
            label: 'Parceria',
            channelPrefix: 'parceria',
            description: 'Tem um servidor e quer fechar parceria com a Ramal?'
        }
    }
};

