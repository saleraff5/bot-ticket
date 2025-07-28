# 🌐 Guia de Hospedagem

Este guia explica como hospedar seu bot Discord da Ramal Systems em diferentes plataformas.

## 📋 Visão Geral

### Opções de Hospedagem

| Plataforma | Custo | Dificuldade | Uptime | Recomendado Para |
|------------|-------|-------------|--------|------------------|
| **Heroku** | Gratuito/Pago | Fácil | 99%+ | Iniciantes |
| **Railway** | Gratuito/Pago | Fácil | 99%+ | Iniciantes |
| **Render** | Gratuito/Pago | Fácil | 99%+ | Iniciantes |
| **DigitalOcean** | Pago | Médio | 99.9%+ | Intermediário |
| **AWS EC2** | Pago | Difícil | 99.9%+ | Avançado |
| **VPS** | Pago | Médio | Variável | Intermediário |

## 🆓 Hospedagem Gratuita

### 1. Heroku (Recomendado)

#### Pré-requisitos
- Conta no [Heroku](https://heroku.com)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado
- Git instalado

#### Passo a Passo

1. **Preparar o projeto**:
```bash
# Inicializar git (se não feito)
git init

# Adicionar arquivos
git add .
git commit -m "Initial commit"
```

2. **Criar aplicação no Heroku**:
```bash
# Login no Heroku
heroku login

# Criar app (substitua 'ramal-tickets-bot' por um nome único)
heroku create ramal-tickets-bot

# Adicionar remote
heroku git:remote -a ramal-tickets-bot
```

3. **Configurar variáveis de ambiente**:
```bash
# Configurar token
heroku config:set DISCORD_TOKEN=seu_token_aqui

# Configurar outras variáveis
heroku config:set GUILD_ID=123456789012345678
heroku config:set TICKET_CHANNEL_ID=123456789012345678
heroku config:set LOG_CHANNEL_ID=123456789012345678
heroku config:set STAFF_ROLE_IDS=id1,id2,id3
heroku config:set TICKET_CATEGORY_ID=123456789012345678
```

4. **Criar Procfile**:
```bash
echo "worker: node index.js" > Procfile
```

5. **Deploy**:
```bash
git add Procfile
git commit -m "Add Procfile"
git push heroku main
```

6. **Ativar o worker**:
```bash
heroku ps:scale worker=1
```

#### Verificação
```bash
# Ver logs
heroku logs --tail

# Ver status
heroku ps
```

### 2. Railway

#### Passo a Passo

1. **Acesse [Railway](https://railway.app)**
2. **Conecte sua conta GitHub**
3. **Clique "New Project"**
4. **Selecione "Deploy from GitHub repo"**
5. **Escolha seu repositório**
6. **Configure as variáveis de ambiente**:
   - Vá em "Variables"
   - Adicione todas as variáveis do `.env`
7. **Deploy automático** será iniciado

### 3. Render

#### Passo a Passo

1. **Acesse [Render](https://render.com)**
2. **Conecte sua conta GitHub**
3. **Clique "New +"**
4. **Selecione "Web Service"**
5. **Conecte seu repositório**
6. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
7. **Adicione variáveis de ambiente**
8. **Deploy**

## 💰 Hospedagem Paga

### 1. DigitalOcean Droplet

#### Criando o Droplet

1. **Acesse [DigitalOcean](https://digitalocean.com)**
2. **Crie um Droplet**:
   - **Imagem**: Ubuntu 22.04 LTS
   - **Plano**: Basic ($6/mês)
   - **CPU**: Regular Intel
   - **Região**: Mais próxima dos usuários

#### Configuração do Servidor

1. **Conectar via SSH**:
```bash
ssh root@seu_ip_do_droplet
```

2. **Atualizar sistema**:
```bash
apt update && apt upgrade -y
```

3. **Instalar Node.js**:
```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

4. **Instalar PM2** (gerenciador de processos):
```bash
npm install -g pm2
```

5. **Criar usuário para o bot**:
```bash
adduser botuser
usermod -aG sudo botuser
su - botuser
```

6. **Clonar/enviar projeto**:
```bash
# Opção 1: Git clone
git clone https://github.com/seu-usuario/ramal-tickets-bot.git
cd ramal-tickets-bot

# Opção 2: Upload via SCP
# scp -r ./discord-bot-ramal botuser@seu_ip:/home/botuser/
```

7. **Instalar dependências**:
```bash
npm install
```

8. **Configurar variáveis de ambiente**:
```bash
cp .env.example .env
nano .env
# Edite com suas configurações
```

9. **Iniciar com PM2**:
```bash
pm2 start index.js --name "ramal-bot"
pm2 startup
pm2 save
```

#### Configuração de Firewall

```bash
# Configurar UFW
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### 2. AWS EC2

#### Criando a Instância

1. **Acesse [AWS Console](https://aws.amazon.com/console/)**
2. **Vá para EC2**
3. **Launch Instance**:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.micro (free tier)
   - **Key Pair**: Crie ou use existente
   - **Security Group**: Permitir SSH (22)

#### Configuração (Similar ao DigitalOcean)

```bash
# Conectar
ssh -i sua-chave.pem ubuntu@ip-da-instancia

# Seguir passos similares ao DigitalOcean
```

## 🔧 Configuração Avançada

### 1. Monitoramento com PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs ramal-bot

# Reiniciar
pm2 restart ramal-bot

# Parar
pm2 stop ramal-bot

# Remover
pm2 delete ramal-bot
```

### 2. Configuração de Domínio (Opcional)

Se você quiser um domínio personalizado para monitoramento:

```bash
# Instalar Nginx
sudo apt install nginx

# Configurar proxy reverso
sudo nano /etc/nginx/sites-available/ramal-bot
```

Conteúdo do arquivo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/ramal-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento e Logs

### 1. Logs do Sistema

```bash
# Logs do PM2
pm2 logs ramal-bot --lines 100

# Logs do sistema
sudo journalctl -u pm2-botuser -f

# Logs do Nginx (se usando)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Monitoramento de Recursos

```bash
# Uso de CPU e memória
htop

# Espaço em disco
df -h

# Status dos serviços
systemctl status pm2-botuser
```

### 3. Alertas (Opcional)

Configure alertas para:
- Bot offline
- Alto uso de CPU/memória
- Erros frequentes
- Espaço em disco baixo

## 🔄 Backup e Recuperação

### 1. Backup Automático

Crie um script de backup:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/botuser/backups"
BOT_DIR="/home/botuser/ramal-tickets-bot"

mkdir -p $BACKUP_DIR

# Backup do código
tar -czf $BACKUP_DIR/bot_$DATE.tar.gz $BOT_DIR

# Backup das configurações
cp $BOT_DIR/.env $BACKUP_DIR/env_$DATE.backup

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.backup" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

```bash
# Tornar executável
chmod +x backup.sh

# Agendar no crontab (diário às 2h)
crontab -e
# Adicionar: 0 2 * * * /home/botuser/backup.sh
```

### 2. Recuperação

```bash
# Restaurar backup
cd /home/botuser
tar -xzf backups/bot_YYYYMMDD_HHMMSS.tar.gz

# Restaurar configurações
cp backups/env_YYYYMMDD_HHMMSS.backup ramal-tickets-bot/.env

# Reinstalar dependências
cd ramal-tickets-bot
npm install

# Reiniciar bot
pm2 restart ramal-bot
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### Bot não inicia
```bash
# Verificar logs
pm2 logs ramal-bot

# Verificar configuração
node -c index.js

# Verificar variáveis de ambiente
cat .env
```

#### Falta de memória
```bash
# Verificar uso de memória
free -h

# Aumentar swap (se necessário)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### Bot desconecta frequentemente
- Verificar conexão de internet
- Verificar logs para erros
- Considerar aumentar recursos do servidor

### Comandos Úteis

```bash
# Reiniciar serviços
sudo systemctl restart nginx
pm2 restart all

# Verificar portas em uso
netstat -tlnp

# Verificar processos
ps aux | grep node

# Limpar logs
pm2 flush
```

## 📈 Otimização de Performance

### 1. Configuração do PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ramal-bot',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 2. Otimizações do Sistema

```bash
# Limitar logs do sistema
sudo nano /etc/systemd/journald.conf
# Adicionar: SystemMaxUse=100M

# Otimizar swap
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

---

## 🎯 Resumo de Recomendações

### Para Iniciantes
1. **Heroku** - Mais fácil de configurar
2. **Railway** - Interface moderna
3. **Render** - Boa documentação

### Para Uso Profissional
1. **DigitalOcean** - Bom custo-benefício
2. **AWS EC2** - Máxima flexibilidade
3. **VPS dedicado** - Controle total

### Checklist Final
- [ ] Bot funcionando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Plataforma de hospedagem escolhida
- [ ] Deploy realizado com sucesso
- [ ] Monitoramento configurado
- [ ] Backup automatizado
- [ ] Documentação atualizada

**🚀 Seu bot está pronto para produção!**

Para suporte adicional, consulte a documentação da plataforma escolhida ou entre em contato com a equipe da Ramal Systems.

