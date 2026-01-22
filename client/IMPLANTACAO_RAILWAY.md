# 🚀 Guia Passo a Passo - Implantar Prospectopia no Railway

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. **Conta GitHub** - [Criar em github.com](https://github.com/signup)
2. **Conta Google OAuth** - Sua conta Google pessoal
3. **Conta Railway** - [Criar em railway.app](https://railway.app)

---

## ✅ Passo 1: Preparar o Repositório GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Preencha os dados:
   - **Repository name**: `prospectopia-app`
   - **Description**: `Plataforma de Gestão de Projetos e Produtividade`
   - **Visibility**: Public (ou Private se preferir)
3. Clique em **Create repository**

### 1.2 Fazer Upload do Código

```bash
# No seu terminal, na pasta do projeto
cd /home/ubuntu/prospectopia-app

# Inicializar Git (se não estiver já inicializado)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Prospectopia v1.0.0"

# Adicionar remote (substitua SEU_USUARIO pelo seu usuário GitHub)
git remote add origin https://github.com/SEU_USUARIO/prospectopia-app.git

# Fazer push para main
git branch -M main
git push -u origin main
```

**Resultado esperado**: Seu código está no GitHub

---

## 🚂 Passo 2: Configurar Railway

### 2.1 Fazer Login no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **Login** → **GitHub**
3. Autorize o Railway a acessar sua conta GitHub

### 2.2 Criar Novo Projeto

1. Clique em **Create New Project**
2. Selecione **Deploy from GitHub repo**
3. Procure e selecione `prospectopia-app`
4. Clique em **Deploy**

**Resultado esperado**: Railway começa a fazer build do projeto

### 2.3 Adicionar Banco de Dados MySQL

1. No painel do Railway, clique em **Add Service**
2. Selecione **MySQL**
3. Railway criará automaticamente:
   - Banco de dados MySQL
   - Variável `DATABASE_URL` com a connection string

**Resultado esperado**: Banco de dados criado e conectado

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Adicionar Variáveis no Railway

1. No painel do Railway, vá para a aba **Variables**
2. Clique em **Add Variable** e adicione cada uma:

```
JWT_SECRET = sua-chave-secreta-de-32-caracteres
VITE_APP_ID = seu-app-id-oauth
OAUTH_SERVER_URL = https://api.manus.im
NODE_ENV = production
```

### 3.2 Gerar JWT_SECRET

```bash
# No terminal, execute:
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Copie o resultado e use como `JWT_SECRET`

### 3.3 Obter VITE_APP_ID

Se você tiver um app OAuth registrado, use o ID dele. Caso contrário, use um valor temporário:
```
VITE_APP_ID = prospectopia-dev-app
```

**Resultado esperado**: Todas as variáveis configuradas

---

## 🗄️ Passo 4: Executar Migrações do Banco

### 4.1 Conectar ao Banco via Railway

1. No painel do Railway, vá para **MySQL**
2. Clique em **Connect** e copie a connection string
3. Guarde para usar depois

### 4.2 Executar Migrações

Após o primeiro deploy, o Railway executará automaticamente:
```bash
pnpm db:push
```

Se precisar fazer manualmente:

```bash
# No seu terminal local
DATABASE_URL="sua-connection-string" pnpm db:push
```

**Resultado esperado**: Tabelas criadas no banco de dados

---

## 🌐 Passo 5: Acessar a Aplicação

### 5.1 Obter URL Pública

1. No painel do Railway, vá para **Deployments**
2. Clique no deployment mais recente
3. Copie a **URL pública** (algo como `https://prospectopia-app-production.up.railway.app`)

### 5.2 Testar a Aplicação

1. Abra a URL em seu navegador
2. Você deve ver a página inicial do Prospectopia
3. Clique em **Login com Google**

**Resultado esperado**: Aplicação funcionando online!

---

## 🧪 Passo 6: Testar Funcionalidades

### 6.1 Fazer Login como Gestor

1. Clique em **Login com Google**
2. Autorize com sua conta Google
3. Na tela de validação, digite a senha: `520741`
4. Você deve ser redirecionado para o painel de gestor

### 6.2 Testar Funcionalidades Básicas

- [ ] Visualizar dashboard
- [ ] Criar um novo projeto
- [ ] Gerar link de convite
- [ ] Visualizar relatórios

**Resultado esperado**: Todas as funcionalidades funcionando

---

## 📊 Passo 7: Monitorar a Aplicação

### 7.1 Ver Logs

1. No painel do Railway, vá para **Logs**
2. Você pode ver logs em tempo real
3. Procure por erros (linhas em vermelho)

### 7.2 Ver Métricas

1. Vá para **Metrics**
2. Monitore CPU, RAM e requisições
3. Se usar muito recurso, considere upgrade

**Resultado esperado**: Aplicação monitorada e saudável

---

## 🔧 Troubleshooting

### Erro: "Database connection failed"

**Solução**:
1. Verifique se `DATABASE_URL` está correto
2. Aguarde 2-3 minutos para o banco estar pronto
3. Reinicie o deployment

### Erro: "OAuth callback failed"

**Solução**:
1. Verifique `VITE_APP_ID` está correto
2. Verifique `OAUTH_SERVER_URL` está acessível
3. Limpe cookies do navegador

### Erro: "Build failed"

**Solução**:
1. Vá para **Logs** e procure pelo erro específico
2. Verifique se todos os arquivos foram feitos push
3. Tente fazer novo push para GitHub

### Aplicação lenta

**Solução**:
1. Verifique métricas de CPU/RAM
2. Considere upgrade no Railway
3. Otimize queries do banco de dados

---

## 📈 Próximos Passos

### Depois de Implantado

1. **Configurar Domínio Customizado**
   - Railway permite adicionar domínio próprio
   - Vá para **Settings** → **Domains**

2. **Fazer Backup do Banco**
   - Railway faz backup automático
   - Você pode exportar dados quando necessário

3. **Monitorar Uso**
   - Railway oferece $5/mês de crédito gratuito
   - Monitore uso para não exceder limite

4. **Adicionar Mais Funcionários**
   - Gere links de convite no painel
   - Envie para seus funcionários

---

## 💰 Custos

### Railway Free Tier
- **Crédito**: $5/mês gratuito
- **Suficiente para**: Pequenas equipes (até 10 pessoas)
- **Depois**: Pague conforme usar (~$0.50/GB RAM/mês)

### Estimativa de Uso
- **Servidor**: ~$2-3/mês
- **Banco de Dados**: ~$1-2/mês
- **Total**: ~$3-5/mês (dentro do free tier)

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código feito push para GitHub
- [ ] Projeto criado no Railway
- [ ] Banco MySQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas
- [ ] Aplicação acessível via URL pública
- [ ] Login com Google funcionando
- [ ] Senha de gestor testada (520741)
- [ ] Dashboard carregando corretamente
- [ ] Relatórios com gráficos funcionando

---

## 📞 Suporte

Se tiver problemas:

1. **Verificar Logs**: Railway → Logs
2. **Verificar Variáveis**: Railway → Variables
3. **Verificar Banco**: Railway → MySQL → Connect
4. **Fazer Novo Deploy**: Railway → Redeploy

---

**Versão**: 1.0.0  
**Data**: 22 de Janeiro de 2026  
**Status**: ✅ Pronto para Implantação
