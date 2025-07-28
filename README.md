# 🤖 Bot de Tickets Discord - Ramal Systems v2.0

Um bot profissional de sistema de tickets para Discord, desenvolvido especificamente para a **Ramal Systems**. Esta versão inclui transcrição automática, select menu, imagens nos embeds e funcionalidade completa de adicionar usuários.

## 📋 Índice

- [Características](#-características)
- [Novidades v2.0](#-novidades-v20)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Comandos](#-comandos)
- [Hospedagem](#-hospedagem)
- [Solução de Problemas](#-solução-de-problemas)
- [Suporte](#-suporte)

## ✨ Características

### 🎯 Funcionalidades Principais
- **Sistema de Tickets Automatizado**: Criação automática de canais privados
- **Select Menu Moderno**: Interface elegante com caixa suspensa
- **Transcrição Automática**: Backup completo de todas as conversas
- **Três Categorias de Atendimento**: Compras, Suporte e Parcerias
- **Embeds com Imagens**: Suporte a imagens e thumbnails
- **Adicionar Usuários**: Funcionalidade completa via modal e comando
- **Comando Efêmero**: Sem poluição visual no canal
- **Sistema de Logs Avançado**: Logs com informações de transcrição
- **Controle de Permissões**: Acesso restrito à staff e usuário do ticket

### 🆕 Novidades v2.0
- ✅ **Transcrição automática** de tickets com backup em arquivo
- ✅ **Select menu** substituindo botões para melhor UX
- ✅ **Imagens nos embeds** (principal e thumbnail)
- ✅ **Comando efêmero** - não mostra quem usou o comando
- ✅ **Adicionar usuário funcional** via modal interativo
- ✅ **Comando `/adduser`** para adicionar usuários
- ✅ **Logs aprimorados** com informações de transcrição

### 🛡️ Segurança e Controle
- Verificação de tickets duplicados por usuário
- Permissões granulares por canal
- Logs detalhados de todas as ações
- Controle de acesso baseado em cargos
- Validação completa de usuários adicionados

### 🎨 Interface Profissional
- Design personalizado com cores da Ramal Systems
- Select menu com descrições detalhadas
- Modal interativo para adicionar usuários
- Embeds informativos para cada tipo de atendimento
- Suporte a imagens personalizadas

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16.0.0 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Git** (para controle de versão)
- Uma conta no **Discord Developer Portal**

### Verificando as Instalações

```bash
node --version    # Deve mostrar v16.0.0 ou superior
npm --version     # Deve mostrar a versão do npm
git --version     # Deve mostrar a versão do git
```

## 📦 Instalação

### 1. Preparação do Ambiente

1. **Extraia o arquivo ZIP** em uma pasta de sua escolha
2. **Abra o terminal/prompt** na pasta do projeto
3. **Instale as dependências**:

```bash
npm install
```

### 2. Configuração do Bot no Discord

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **"New Application"**
3. Dê um nome ao seu bot (ex: "Ramal Tickets")
4. Vá para a aba **"Bot"**
5. Clique em **"Add Bot"**
6. **Copie o Token** (mantenha em segredo!)
7. Na aba **"OAuth2 > URL Generator"**:
   - Selecione **"bot"** e **"applications.commands"**
   - Selecione as permissões necessárias:
     - Manage Channels
     - Send Messages
     - Embed Links
     - Read Message History
     - Use Slash Commands

### 3. Convite do Bot

Use a URL gerada para convidar o bot ao seu servidor.

## ⚙️ Configuração

### 1. Arquivo de Ambiente

1. **Copie o arquivo de exemplo**:
```bash
cp .env.example .env
```

2. **Edite o arquivo `.env`** com suas informações:

```env
# Token do bot Discord
DISCORD_TOKEN=seu_token_aqui

# ID do servidor Discord
GUILD_ID=123456789012345678

# ID do canal onde ficará o embed principal
TICKET_CHANNEL_ID=123456789012345678

# ID do canal de logs (opcional)
LOG_CHANNEL_ID=123456789012345678

# IDs dos cargos que podem ver os tickets
STAFF_ROLE_IDS=123456789012345678,987654321098765432

# Categoria onde os tickets serão criados (opcional)
TICKET_CATEGORY_ID=123456789012345678
```

### 2. Como Obter os IDs

#### ID do Servidor (GUILD_ID)
1. Ative o **Modo Desenvolvedor** no Discord (Configurações > Avançado > Modo Desenvolvedor)
2. Clique com botão direito no nome do servidor
3. Selecione **"Copiar ID"**

#### ID dos Canais
1. Clique com botão direito no canal desejado
2. Selecione **"Copiar ID"**

#### ID dos Cargos
1. Vá em Configurações do Servidor > Cargos
2. Clique com botão direito no cargo desejado
3. Selecione **"Copiar ID"**

### 3. Configurações Opcionais

No arquivo `config.js`, você pode personalizar:

- **Cor dos embeds**: Altere `embedColor`
- **Prefixos dos canais**: Modifique `channelPrefix` em cada tipo
- **Emojis dos botões**: Altere `emoji` em cada categoria

## 🚀 Como Usar

### 1. Iniciando o Bot

```bash
npm start
```

Você deve ver:
```
✅ Comando carregado: ticket
🤖 Bot conectado como SeuBot#1234!
📊 Servidores: 1
👥 Usuários: 50
🔄 Registrando comandos slash...
✅ Comandos slash registrados com sucesso!
✅ Bot totalmente inicializado!
```

### 2. Configurando o Painel de Tickets

1. No Discord, vá ao canal onde deseja o painel
2. Digite `/ticket`
3. O bot enviará o embed principal com os botões

### 3. Fluxo de Uso

1. **Usuário clica em um botão** (Compras, Suporte ou Parceria)
2. **Bot cria canal privado** com nome `ticket-categoria-usuario`
3. **Usuário recebe confirmação** com botão para ir ao ticket
4. **Canal é criado** com embed específico e botões de controle
5. **Staff pode gerenciar** o ticket através dos botões

## 📁 Estrutura do Projeto

```
discord-bot-ramal/
├── 📄 index.js              # Arquivo principal do bot
├── 📄 config.js             # Configurações centralizadas
├── 📄 embeds.js             # Gerenciador de embeds
├── 📄 buttons.js            # Gerenciador de botões
├── 📄 ticketManager.js      # Lógica principal dos tickets
├── 📄 package.json          # Dependências e scripts
├── 📄 .env.example          # Exemplo de variáveis de ambiente
├── 📄 .env                  # Suas variáveis de ambiente (não incluído)
├── 📄 README.md             # Esta documentação
├── 📄 SETUP.md              # Guia de configuração detalhado
├── 📄 HOSTING.md            # Guia de hospedagem
└── 📁 commands/
    └── 📄 ticket.js         # Comando slash /ticket
```

### Descrição dos Arquivos

- **`index.js`**: Ponto de entrada, gerencia eventos e interações
- **`config.js`**: Centralizador de configurações e constantes
- **`embeds.js`**: Classe para criar todos os embeds do sistema
- **`buttons.js`**: Classe para criar todos os botões interativos
- **`ticketManager.js`**: Lógica completa do sistema de tickets
- **`commands/ticket.js`**: Comando slash para enviar o painel

## 🎮 Comandos

### Comandos Slash

| Comando | Descrição | Permissão | Novidade |
|---------|-----------|-----------|----------|
| `/ticket` | Envia o painel principal de tickets | Staff apenas | ✅ Agora efêmero |
| `/adduser` | Adiciona usuário ao ticket atual | Staff apenas | 🆕 Novo comando |

### Interações

| Elemento | Função | Novidade |
|----------|--------|----------|
| **Select Menu** | Selecionar tipo de ticket | 🆕 Substitui botões |
| 🛒 Compras / Renovação | Abre ticket de vendas | ✅ Via select menu |
| 🛠️ Suporte | Abre ticket de suporte técnico | ✅ Via select menu |
| 🤝 Parceria | Abre ticket de parcerias | ✅ Via select menu |
| 📍 Ir para o ticket | Redireciona para o canal do ticket | - |
| 🔒 Fechar Ticket | Inicia processo de fechamento | ✅ Com transcrição |
| ➕ Adicionar Usuário | Abre modal para adicionar usuário | 🆕 Totalmente funcional |

### Modais Interativos

| Modal | Função | Novidade |
|-------|--------|----------|
| **Adicionar Usuário** | Interface para adicionar usuário ao ticket | 🆕 Novo modal |

### Funcionalidades Automáticas

| Funcionalidade | Descrição | Novidade |
|----------------|-----------|----------|
| **Transcrição** | Backup automático da conversa | 🆕 Nova funcionalidade |
| **Logs Avançados** | Registro com informações de transcrição | ✅ Aprimorado |
| **Validação** | Verificação de usuários e permissões | ✅ Melhorada |

## 🌐 Hospedagem

### Opções de Hospedagem Gratuita

1. **Heroku** (Recomendado para iniciantes)
2. **Railway**
3. **Render**
4. **Glitch**

### Opções de Hospedagem Paga

1. **DigitalOcean**
2. **AWS EC2**
3. **Google Cloud Platform**
4. **VPS tradicional**

Para instruções detalhadas de hospedagem, consulte o arquivo `HOSTING.md`.

## 🔧 Solução de Problemas

### Problemas Comuns

#### Bot não responde aos comandos
- Verifique se o token está correto no `.env`
- Confirme se o bot tem as permissões necessárias
- Verifique se o `GUILD_ID` está correto

#### Comandos slash não aparecem
- Aguarde até 1 hora para sincronização
- Verifique se o bot tem permissão "Use Slash Commands"
- Reinicie o bot

#### Erro ao criar canais
- Verifique se o bot tem permissão "Manage Channels"
- Confirme se a categoria existe (se configurada)
- Verifique se há limite de canais no servidor

#### Permissões incorretas nos tickets
- Verifique os IDs dos cargos no `.env`
- Confirme se os cargos existem no servidor
- Verifique a hierarquia de cargos

### Logs de Debug

Para ativar logs detalhados, adicione no início do `index.js`:

```javascript
// Ativar logs detalhados
process.env.DEBUG = 'discord.js:*';
```

### Verificação de Configuração

Execute este comando para verificar sua configuração:

```bash
node -e "console.log(require('./config.js'))"
```

## 📞 Suporte

### Documentação Adicional
- `SETUP.md` - Guia detalhado de configuração
- `HOSTING.md` - Instruções de hospedagem
- `TROUBLESHOOTING.md` - Solução de problemas avançados

### Contato
- **Desenvolvedor**: Carlos Ramal
- **Empresa**: Ramal Systems
- **Versão**: 1.0.0

### Recursos Úteis
- [Documentação Discord.js](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**© 2024 Ramal Systems - Todos os direitos reservados**

> Este bot foi desenvolvido especificamente para a Ramal Systems. Para suporte técnico ou customizações, entre em contato com a equipe de desenvolvimento.

