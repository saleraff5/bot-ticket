# 🛠️ Guia Detalhado de Configuração

Este guia fornece instruções passo a passo para configurar o bot de tickets da Ramal Systems.

## 📋 Pré-requisitos Detalhados

### 1. Instalação do Node.js

#### Windows
1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS (recomendada)
3. Execute o instalador
4. Marque a opção "Add to PATH"
5. Reinicie o computador

#### macOS
```bash
# Usando Homebrew (recomendado)
brew install node

# Ou baixe do site oficial
```

#### Linux (Ubuntu/Debian)
```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js e npm
sudo apt install nodejs npm

# Verificar versões
node --version
npm --version
```

### 2. Preparação do Discord

#### Criando a Aplicação
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Faça login com sua conta Discord
3. Clique em **"New Application"**
4. Digite o nome: **"Ramal Tickets Bot"**
5. Aceite os termos e clique **"Create"**

#### Configurando o Bot
1. Na aba **"General Information"**:
   - Adicione uma descrição
   - Faça upload de um avatar (opcional)
   
2. Na aba **"Bot"**:
   - Clique **"Add Bot"**
   - Confirme clicando **"Yes, do it!"**
   - **COPIE O TOKEN** (guarde com segurança!)
   - Ative as seguintes opções:
     - ✅ Public Bot (se quiser que outros possam adicionar)
     - ✅ Requires OAuth2 Code Grant
     - ✅ Message Content Intent
     - ✅ Server Members Intent

#### Configurando Permissões
1. Na aba **"OAuth2 > URL Generator"**:
   - **Scopes**: Marque `bot` e `applications.commands`
   - **Bot Permissions**: Marque:
     - ✅ Manage Channels
     - ✅ Send Messages
     - ✅ Embed Links
     - ✅ Attach Files
     - ✅ Read Message History
     - ✅ Use Slash Commands
     - ✅ Manage Messages
     - ✅ Read Message History

2. **Copie a URL gerada** e use para convidar o bot

## 🔧 Configuração do Servidor Discord

### 1. Estrutura Recomendada

#### Categorias
```
📁 TICKETS
├── 🎫 abrir-ticket
├── 📂 log-tickets (privado)
└── [tickets criados automaticamente]

📁 INFORMAÇÕES
├── 💰 formas-de-pagamento
├── 📋 regras
└── 📢 anúncios
```

#### Cargos Necessários
- **@Administrador** - Acesso total
- **@Atendente** - Acesso aos tickets
- **@Suporte** - Acesso a tickets de suporte
- **@Vendas** - Acesso a tickets de compras

### 2. Configuração de Permissões

#### Canal #🎫・abrir-ticket
```
@everyone:
✅ Ver canal
✅ Ler histórico de mensagens
❌ Enviar mensagens
❌ Usar comandos slash

@Atendente:
✅ Ver canal
✅ Enviar mensagens
✅ Usar comandos slash
✅ Gerenciar mensagens
```

#### Canal #📂・log-tickets
```
@everyone:
❌ Ver canal

@Administrador:
✅ Ver canal
✅ Ler histórico de mensagens

@Atendente:
✅ Ver canal
✅ Ler histórico de mensagens
```

## 📝 Configuração do Arquivo .env

### 1. Criando o Arquivo

1. **Copie o arquivo exemplo**:
```bash
cp .env.example .env
```

2. **Abra o arquivo `.env`** no seu editor preferido

### 2. Preenchendo as Variáveis

#### DISCORD_TOKEN
```env
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.GhIjKl.MnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx
```
- Obtido na aba "Bot" do Developer Portal
- **NUNCA compartilhe este token!**

#### GUILD_ID
```env
GUILD_ID=123456789012345678
```
- ID do seu servidor Discord
- Ative o Modo Desenvolvedor: Configurações > Avançado > Modo Desenvolvedor
- Clique com botão direito no servidor > Copiar ID

#### TICKET_CHANNEL_ID
```env
TICKET_CHANNEL_ID=123456789012345678
```
- ID do canal onde ficará o painel de tickets
- Recomendado: #🎫・abrir-ticket

#### LOG_CHANNEL_ID (Opcional)
```env
LOG_CHANNEL_ID=123456789012345678
```
- ID do canal para logs de tickets
- Recomendado: #📂・log-tickets

#### STAFF_ROLE_IDS
```env
STAFF_ROLE_IDS=123456789012345678,987654321098765432,456789012345678901
```
- IDs dos cargos que podem ver tickets
- Separados por vírgula, sem espaços
- Exemplo: Administrador, Atendente, Suporte

#### TICKET_CATEGORY_ID (Opcional)
```env
TICKET_CATEGORY_ID=123456789012345678
```
- ID da categoria onde os tickets serão criados
- Se não definido, tickets serão criados na raiz

### 3. Exemplo Completo

```env
# Token do bot Discord
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.GhIjKl.MnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx

# ID do servidor Discord
GUILD_ID=123456789012345678

# ID do canal onde ficará o embed principal
TICKET_CHANNEL_ID=987654321098765432

# ID do canal de logs
LOG_CHANNEL_ID=456789012345678901

# IDs dos cargos que podem ver os tickets
STAFF_ROLE_IDS=111111111111111111,222222222222222222,333333333333333333

# Categoria onde os tickets serão criados
TICKET_CATEGORY_ID=444444444444444444
```

## 🎨 Personalização

### 1. Cores e Visual

No arquivo `config.js`, você pode alterar:

```javascript
// Cor principal dos embeds (formato hexadecimal)
embedColor: '#00ff88', // Verde Ramal

// Você pode usar outras cores:
// embedColor: '#ff0000', // Vermelho
// embedColor: '#0099ff', // Azul
// embedColor: '#ff9900', // Laranja
```

### 2. Tipos de Ticket

Para adicionar novos tipos de ticket, edite `config.js`:

```javascript
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
    },
    // Novo tipo de ticket
    financeiro: {
        emoji: '💰',
        label: 'Financeiro',
        channelPrefix: 'financeiro',
        description: 'Questões sobre pagamentos e faturas?'
    }
}
```

### 3. Mensagens Personalizadas

Para alterar as mensagens dos embeds, edite o arquivo `embeds.js`:

```javascript
// Exemplo: Alterando a mensagem de compras
static createComprasEmbed(user) {
    return new EmbedBuilder()
        .setTitle('🛒 Sua mensagem personalizada aqui')
        .setDescription(
            `Olá ${user}, sua descrição personalizada...\n\n` +
            '**Suas instruções:**\n' +
            '1. Primeira instrução\n' +
            '2. Segunda instrução\n'
            // ... resto da configuração
        )
}
```

## 🧪 Testando a Configuração

### 1. Verificação Básica

Execute este comando para verificar se tudo está configurado:

```bash
node -e "
const config = require('./config.js');
console.log('✅ Configuração carregada:');
console.log('Token:', config.token ? '✅ Definido' : '❌ Não definido');
console.log('Guild ID:', config.guildId || '❌ Não definido');
console.log('Ticket Channel:', config.ticketChannelId || '❌ Não definido');
console.log('Staff Roles:', config.staffRoleIds.length, 'cargos');
"
```

### 2. Teste de Conexão

```bash
# Instalar dependências
npm install

# Iniciar o bot
npm start
```

Você deve ver:
```
✅ Comando carregado: ticket
🤖 Bot conectado como RamalTickets#1234!
📊 Servidores: 1
👥 Usuários: 50
🔄 Registrando comandos slash...
✅ Comandos slash registrados com sucesso!
✅ Bot totalmente inicializado!
```

### 3. Teste Funcional

1. **No Discord, digite `/ticket`** no canal configurado
2. **Verifique se o embed aparece** com os botões
3. **Clique em um botão** para testar a criação de ticket
4. **Verifique se o canal é criado** com as permissões corretas
5. **Teste o fechamento** do ticket

## 🔍 Verificação de Problemas

### Checklist de Configuração

- [ ] Node.js instalado (versão 16+)
- [ ] Dependências instaladas (`npm install`)
- [ ] Bot criado no Developer Portal
- [ ] Token copiado corretamente
- [ ] Bot convidado ao servidor
- [ ] Permissões corretas no servidor
- [ ] Arquivo `.env` configurado
- [ ] IDs corretos no `.env`
- [ ] Cargos existem no servidor
- [ ] Canais existem no servidor

### Comandos de Debug

```bash
# Verificar versão do Node.js
node --version

# Verificar dependências
npm list

# Verificar configuração
node -c config.js

# Testar sintaxe do arquivo principal
node -c index.js
```

## 📚 Próximos Passos

Após a configuração bem-sucedida:

1. **Leia o arquivo `README.md`** para entender o funcionamento
2. **Consulte `HOSTING.md`** para instruções de hospedagem
3. **Configure monitoramento** para manter o bot online
4. **Faça backup** das configurações importantes

---

**🎉 Parabéns! Seu bot está configurado e pronto para uso!**

Para suporte adicional, consulte a documentação completa ou entre em contato com a equipe da Ramal Systems.

