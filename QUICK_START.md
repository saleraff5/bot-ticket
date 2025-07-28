# 🚀 Guia de Início Rápido

## ⚡ Configuração em 5 Minutos

### 1. Preparação (2 min)
```bash
# Extrair o ZIP e entrar na pasta
cd discord-bot-ramal

# Instalar dependências
npm install
```

### 2. Configurar Discord Bot (2 min)
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá em "Bot" → "Add Bot"
4. **Copie o Token**
5. Em "OAuth2 → URL Generator":
   - Marque: `bot` e `applications.commands`
   - Permissões: `Manage Channels`, `Send Messages`, `Embed Links`, `Use Slash Commands`
6. **Convide o bot** usando a URL gerada

### 3. Configurar Arquivo .env (1 min)
```bash
# Copiar exemplo
cp .env.example .env

# Editar com seus dados
nano .env
```

**Mínimo necessário:**
```env
DISCORD_TOKEN=seu_token_aqui
GUILD_ID=id_do_seu_servidor
TICKET_CHANNEL_ID=id_do_canal_tickets
STAFF_ROLE_IDS=id_cargo1,id_cargo2
```

### 4. Testar
```bash
# Verificar configuração
node test-config.js

# Iniciar bot
npm start
```

### 5. Usar no Discord
```
/ticket
```

## 🆔 Como Obter IDs

**Ativar Modo Desenvolvedor:**
Discord → Configurações → Avançado → Modo Desenvolvedor ✅

**Copiar IDs:**
- **Servidor**: Botão direito no nome do servidor → Copiar ID
- **Canal**: Botão direito no canal → Copiar ID  
- **Cargo**: Configurações do Servidor → Cargos → Botão direito no cargo → Copiar ID

## 🎯 Estrutura Recomendada do Servidor

```
📁 TICKETS
├── 🎫 abrir-ticket (onde usar /ticket)
├── 📂 log-tickets (logs - opcional)
└── [tickets criados automaticamente]

🏷️ CARGOS
├── @Administrador
├── @Atendente  
├── @Suporte
└── @Vendas
```

## ⚠️ Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Token inválido" | Verifique se copiou o token completo |
| "Comandos não aparecem" | Aguarde 1h ou reinicie o Discord |
| "Sem permissão" | Verifique se o bot tem as permissões necessárias |
| "Canal não criado" | Verifique permissão "Manage Channels" |

## 📚 Documentação Completa

- **README.md** - Visão geral completa
- **SETUP.md** - Configuração detalhada  
- **HOSTING.md** - Como hospedar online

## 🆘 Suporte

Se precisar de ajuda:
1. Execute `node test-config.js` para diagnóstico
2. Verifique os logs com `npm start`
3. Consulte a documentação completa
4. Entre em contato com a Ramal Systems

---
**✅ Em 5 minutos seu bot estará funcionando!**

