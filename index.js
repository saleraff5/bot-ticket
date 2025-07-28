const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const TicketManager = require('./ticketManager');
const ModalManager = require('./modalManager');

// Criar cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Inicializar gerenciador de tickets
const ticketManager = new TicketManager(client);

// Coleção de comandos
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando carregado: ${command.data.name}`);
    } else {
        console.log(`⚠️ Comando em ${filePath} está faltando "data" ou "execute"`);
    }
}

// Evento: Bot pronto
client.once('ready', async () => {
    console.log(`🤖 Bot conectado como ${client.user.tag}!`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
    console.log(`👥 Usuários: ${client.users.cache.size}`);
    
    // Registrar comandos slash
    await registerSlashCommands();
    
    console.log('✅ Bot totalmente inicializado!');
});

// Evento: Interações (comandos slash, botões, select menus e modais)
client.on('interactionCreate', async interaction => {
    try {
        // Comandos slash
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`Comando não encontrado: ${interaction.commandName}`);
                return;
            }
            
            await command.execute(interaction);
        }
        
        // Select Menus
        else if (interaction.isStringSelectMenu()) {
            const customId = interaction.customId;
            
            // Select menu de tipos de ticket
            if (customId === 'select_ticket_type') {
                const ticketType = interaction.values[0];
                await ticketManager.createTicket(interaction, ticketType);
            }
        }
        
        // Botões
        else if (interaction.isButton()) {
            const customId = interaction.customId;
            
            // Botões de criar ticket (mantido para compatibilidade)
            if (customId.startsWith('ticket_')) {
                const ticketType = customId.replace('ticket_', '');
                await ticketManager.createTicket(interaction, ticketType);
            }
            
            // Botão ir para ticket
            else if (customId.startsWith('goto_ticket_')) {
                const channelId = customId.replace('goto_ticket_', '');
                await ticketManager.goToTicket(interaction, channelId);
            }
            
            // Botão fechar ticket
            else if (customId === 'close_ticket') {
                await ticketManager.closeTicket(interaction);
            }
            
            // Confirmar fechamento
            else if (customId === 'confirm_close') {
                await ticketManager.confirmCloseTicket(interaction);
            }
            
            // Cancelar fechamento
            else if (customId === 'cancel_close') {
                await interaction.reply({
                    content: '❌ Fechamento cancelado.',
                    ephemeral: true
                });
            }
            
            // Botão adicionar usuário (abre modal)
            else if (customId === 'add_user_modal') {
                const modal = ModalManager.createAddUserModal();
                await interaction.showModal(modal);
            }
        }
        
        // Modais
        else if (interaction.isModalSubmit()) {
            const customId = interaction.customId;
            
            // Modal de adicionar usuário
            if (customId === 'add_user_modal') {
                await ModalManager.handleAddUserModal(interaction);
            }
        }
        
    } catch (error) {
        console.error('Erro na interação:', error);
        
        const errorMessage = {
            content: '❌ Ocorreu um erro ao processar sua solicitação.',
            ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Evento: Erros
client.on('error', error => {
    console.error('Erro do cliente Discord:', error);
});

// Função para registrar comandos slash
async function registerSlashCommands() {
    try {
        const commands = [];
        
        for (const [name, command] of client.commands) {
            commands.push(command.data.toJSON());
        }
        
        const rest = new REST().setToken(config.token);
        
        console.log('🔄 Registrando comandos slash...');
        
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, config.guildId),
            { body: commands }
        );
        
        console.log('✅ Comandos slash registrados com sucesso!');
        
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
}

// Função para inicializar o bot
async function startBot() {
    try {
        // Verificar configurações
        if (!config.token) {
            console.error('❌ Token do Discord não configurado! Verifique o arquivo .env');
            process.exit(1);
        }
        
        if (!config.guildId) {
            console.error('❌ ID do servidor não configurado! Verifique o arquivo .env');
            process.exit(1);
        }
        
        // Conectar ao Discord
        await client.login(config.token);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar o bot:', error);
        process.exit(1);
    }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', error => {
    console.error('Erro não tratado:', error);
});

process.on('uncaughtException', error => {
    console.error('Exceção não capturada:', error);
    process.exit(1);
});

// Inicializar o bot
startBot();

module.exports = { client, ticketManager };

