const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const config = require('./config');

class TranscriptManager {
    constructor() {
        this.ensureTranscriptDir();
        this.configureCloudinary();
    }

    // Configurar Cloudinary
    configureCloudinary() {
        if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
            cloudinary.config({
                cloud_name: config.cloudinary.cloudName,
                api_key: config.cloudinary.apiKey,
                api_secret: config.cloudinary.apiSecret
            });
            console.log('✅ Cloudinary configurado com sucesso');
        } else {
            console.warn('⚠️ Credenciais do Cloudinary não configuradas - transcrições serão salvas apenas localmente');
        }
    }

    // Garantir que o diretório de transcrições existe
    ensureTranscriptDir() {
        if (!fs.existsSync(config.transcriptDir)) {
            fs.mkdirSync(config.transcriptDir, { recursive: true });
        }
    }

    // Criar transcrição de um ticket
    async createTranscript(channel, ticketData) {
        try {
            if (!config.transcriptEnabled) {
                return null;
            }

            // Buscar todas as mensagens do canal
            const messages = await this.fetchAllMessages(channel);
            
            if (messages.length === 0) {
                console.log('Nenhuma mensagem encontrada para transcrever');
                return null;
            }

            // Formatar transcrição
            const transcript = this.formatTranscript(messages, ticketData, channel);
            
            // Salvar arquivo localmente
            const filename = this.generateFilename(ticketData, channel);
            const filepath = path.join(config.transcriptDir, filename);
            
            fs.writeFileSync(filepath, transcript, 'utf8');
            console.log(`Transcrição salva localmente: ${filepath}`);

            // Tentar fazer upload para o Cloudinary
            let cloudinaryUrl = null;
            if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
                try {
                    cloudinaryUrl = await this.uploadToCloudinary(filepath, filename);
                    console.log(`✅ Transcrição enviada para o Cloudinary: ${cloudinaryUrl}`);
                } catch (cloudinaryError) {
                    console.error('❌ Erro ao enviar para o Cloudinary:', cloudinaryError);
                }
            }

            return {
                filepath: filepath,
                filename: filename,
                messageCount: messages.length,
                cloudinaryUrl: cloudinaryUrl
            };

        } catch (error) {
            console.error('Erro ao criar transcrição:', error);
            return null;
        }
    }

    // Upload da transcrição para o Cloudinary
    async uploadToCloudinary(filepath, filename) {
        try {
            const result = await cloudinary.uploader.upload(filepath, {
                resource_type: 'raw', // Para arquivos que não são imagens/vídeos
                public_id: `transcripts/${filename.replace('.txt', '')}`, // Organizar em pasta
                folder: 'ramal-tickets', // Pasta no Cloudinary
                use_filename: true,
                unique_filename: false
            });

            return result.secure_url;
        } catch (error) {
            throw new Error(`Falha no upload para Cloudinary: ${error.message}`);
        }
    }

    // Buscar todas as mensagens do canal
    async fetchAllMessages(channel) {
        const messages = [];
        let lastMessageId = null;

        try {
            while (true) {
                const options = { limit: 100 };
                if (lastMessageId) {
                    options.before = lastMessageId;
                }

                const batch = await channel.messages.fetch(options);
                
                if (batch.size === 0) {
                    break;
                }

                messages.push(...batch.values());
                lastMessageId = batch.last().id;

                // Limite de segurança para evitar loops infinitos
                if (messages.length > 10000) {
                    console.warn('Limite de mensagens atingido (10000)');
                    break;
                }
            }

            // Ordenar mensagens por data (mais antigas primeiro)
            return messages.reverse();

        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
            return [];
        }
    }

    // Formatar transcrição em texto
    formatTranscript(messages, ticketData, channel) {
        const header = this.createTranscriptHeader(ticketData, channel, messages.length);
        const messageLines = messages.map(msg => this.formatMessage(msg));
        const footer = this.createTranscriptFooter();

        return [header, ...messageLines, footer].join('\n');
    }

    // Criar cabeçalho da transcrição
    createTranscriptHeader(ticketData, channel, messageCount) {
        const date = new Date().toLocaleString('pt-BR');
        
        return `
═══════════════════════════════════════════════════════════════
                    TRANSCRIÇÃO DE TICKET - RAMAL SYSTEMS
═══════════════════════════════════════════════════════════════

📋 INFORMAÇÕES DO TICKET:
   • Canal: #${channel.name}
   • Tipo: ${ticketData.type}
   • Usuário: ${ticketData.userId}
   • Criado em: ${ticketData.createdAt.toLocaleString('pt-BR')}
   • Transcrição gerada em: ${date}
   • Total de mensagens: ${messageCount}

═══════════════════════════════════════════════════════════════
                              CONVERSA
═══════════════════════════════════════════════════════════════
`;
    }

    // Formatar uma mensagem individual
    formatMessage(message) {
        const timestamp = message.createdAt.toLocaleString('pt-BR');
        const author = message.author.tag;
        const content = message.content || '[Mensagem sem texto]';
        
        let formattedMessage = `[${timestamp}] ${author}: ${content}`;

        // Adicionar informações sobre anexos
        if (message.attachments.size > 0) {
            const attachments = Array.from(message.attachments.values())
                .map(att => `📎 ${att.name} (${att.url})`)
                .join('\n                    ');
            formattedMessage += `\n                    ${attachments}`;
        }

        // Adicionar informações sobre embeds
        if (message.embeds.length > 0) {
            const embedInfo = message.embeds.map(embed => {
                let info = '📋 Embed';
                if (embed.title) info += `: ${embed.title}`;
                if (embed.description) info += ` - ${embed.description.substring(0, 100)}...`;
                return info;
            }).join('\n                    ');
            formattedMessage += `\n                    ${embedInfo}`;
        }

        return formattedMessage;
    }

    // Criar rodapé da transcrição
    createTranscriptFooter() {
        return `
═══════════════════════════════════════════════════════════════
                           FIM DA TRANSCRIÇÃO
═══════════════════════════════════════════════════════════════

Gerado automaticamente pelo Bot de Tickets da Ramal Systems
© ${new Date().getFullYear()} Ramal Systems - Todos os direitos reservados
`;
    }

    // Gerar nome do arquivo
    generateFilename(ticketData, channel) {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
        const channelName = channel.name.replace(/[^a-zA-Z0-9-_]/g, ''); // Remover caracteres especiais
        
        return `transcript-${channelName}-${date}-${time}.txt`;
    }

    // Obter estatísticas das transcrições
    getTranscriptStats() {
        try {
            if (!fs.existsSync(config.transcriptDir)) {
                return { count: 0, totalSize: 0 };
            }

            const files = fs.readdirSync(config.transcriptDir);
            const transcriptFiles = files.filter(file => file.startsWith('transcript-') && file.endsWith('.txt'));
            
            let totalSize = 0;
            transcriptFiles.forEach(file => {
                const filepath = path.join(config.transcriptDir, file);
                const stats = fs.statSync(filepath);
                totalSize += stats.size;
            });

            return {
                count: transcriptFiles.length,
                totalSize: totalSize,
                formattedSize: this.formatBytes(totalSize)
            };

        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return { count: 0, totalSize: 0 };
        }
    }

    // Formatar bytes em formato legível
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Limpar transcrições antigas (opcional)
    cleanOldTranscripts(daysOld = 30) {
        try {
            if (!fs.existsSync(config.transcriptDir)) {
                return 0;
            }

            const files = fs.readdirSync(config.transcriptDir);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            
            let deletedCount = 0;
            
            files.forEach(file => {
                const filepath = path.join(config.transcriptDir, file);
                const stats = fs.statSync(filepath);
                
                if (stats.mtime < cutoffDate && file.startsWith('transcript-')) {
                    fs.unlinkSync(filepath);
                    deletedCount++;
                }
            });

            console.log(`Limpeza concluída: ${deletedCount} transcrições antigas removidas`);
            return deletedCount;

        } catch (error) {
            console.error('Erro na limpeza de transcrições:', error);
            return 0;
        }
    }
}

module.exports = TranscriptManager;

