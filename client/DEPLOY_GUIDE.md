# Guia Completo de Deploy do Prospectopia

## 📋 Índice
1. [Estrutura do Projeto](#estrutura-do-projeto)
2. [Requisitos](#requisitos)
3. [Instalação Local](#instalação-local)
4. [Deploy Gratuito Online](#deploy-gratuito-online)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Troubleshooting](#troubleshooting)

---

## 🗂️ Estrutura do Projeto

```
prospectopia-app/
├── client/                      # Frontend React + Vite
│   ├── src/
│   │   ├── pages/              # Páginas (Login, ManagerDashboard, EmployeeDashboard, Reports)
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilitários (tRPC client)
│   │   ├── contexts/           # React contexts
│   │   ├── App.tsx             # Roteamento principal
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Assets estáticos
│   └── index.html              # HTML template
├── server/                      # Backend Express + tRPC
│   ├── routers.ts              # Procedimentos tRPC (API)
│   ├── db.ts                   # Funções de banco de dados
│   ├── photoUpload.ts          # Upload de fotos em S3
│   ├── _core/                  # Framework core (OAuth, context, etc)
│   └── auth.logout.test.ts     # Testes
├── drizzle/                     # Schema do banco de dados
│   └── schema.ts               # Definição de tabelas
├── shared/                      # Código compartilhado
│   └── const.ts                # Constantes
├── storage/                     # Helpers de S3
│   └── index.ts                # Funções de storage
├── package.json                # Dependências
├── tsconfig.json               # Configuração TypeScript
├── vite.config.ts              # Configuração Vite
└── drizzle.config.ts           # Configuração Drizzle ORM
```

---

## 📦 Requisitos

### Local
- **Node.js**: v18+ (recomendado v22)
- **pnpm**: v10+ (gerenciador de pacotes)
- **MySQL/TiDB**: Banco de dados (pode usar Railway ou PlanetScale gratuito)

### Online
- Conta em plataforma de hosting (Railway, Render, Vercel, Heroku)
- Banco de dados MySQL hospedado (Railway, PlanetScale, Supabase)
- Conta Google OAuth (para autenticação)

---

## 🚀 Instalação Local

### 1. Clonar/Preparar o Projeto
```bash
cd /home/ubuntu/prospectopia-app
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Configurar Banco de Dados
```bash
# Criar arquivo .env.local com:
DATABASE_URL="mysql://user:password@localhost:3306/prospectopia"
JWT_SECRET="sua-chave-secreta-aqui"
VITE_APP_ID="seu-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
```

### 4. Executar Migrações
```bash
pnpm db:push
```

### 5. Iniciar Desenvolvimento
```bash
pnpm dev
```

Acesse: `http://localhost:3000`

---

## 🌐 Deploy Gratuito Online

### Opção 1: Railway (Recomendado - Mais Fácil)

#### Passo 1: Criar Conta
- Acesse [railway.app](https://railway.app)
- Faça login com GitHub
- Crie novo projeto

#### Passo 2: Conectar Repositório
```bash
# No seu repositório local
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/prospectopia-app.git
git push -u origin main
```

#### Passo 3: Configurar no Railway
1. Clique em "New Project" → "Deploy from GitHub"
2. Selecione seu repositório
3. Railway detectará automaticamente como Node.js
4. Adicione banco de dados MySQL:
   - Clique em "Add" → "MySQL"
   - Railway criará automaticamente a variável `DATABASE_URL`

#### Passo 4: Configurar Variáveis de Ambiente
No painel do Railway, adicione:
```
JWT_SECRET=sua-chave-secreta
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
```

#### Passo 5: Deploy
Railway faz deploy automaticamente a cada push para main

---

### Opção 2: Render (Alternativa Gratuita)

#### Passo 1: Criar Conta
- Acesse [render.com](https://render.com)
- Faça login com GitHub

#### Passo 2: Criar Web Service
1. Clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: prospectopia-app
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`

#### Passo 3: Adicionar Banco de Dados
1. Clique em "New +" → "MySQL"
2. Configure nome e região
3. Copie a connection string

#### Passo 4: Configurar Variáveis
Adicione no painel de Environment:
```
DATABASE_URL=sua-connection-string
JWT_SECRET=sua-chave-secreta
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
NODE_ENV=production
```

#### Passo 5: Deploy
Clique em "Deploy" e aguarde

---

### Opção 3: Vercel (Frontend) + Railway (Backend)

#### Frontend no Vercel
```bash
# Fazer push para GitHub
git push origin main

# No Vercel:
# 1. Conectar repositório
# 2. Configurar build: `pnpm build`
# 3. Output directory: `dist`
```

#### Backend no Railway
Seguir passos da Opção 1

---

## 🔐 Variáveis de Ambiente

### Obrigatórias
```env
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=sua-chave-secreta-de-32-caracteres
VITE_APP_ID=seu-app-id-do-oauth
OAUTH_SERVER_URL=https://api.manus.im
```

### Opcionais
```env
NODE_ENV=production
PORT=3000
VITE_OAUTH_PORTAL_URL=https://seu-oauth-portal
```

---

## 📁 Arquivos Principais

### Backend
- **server/routers.ts**: Define todas as APIs (procedures tRPC)
- **server/db.ts**: Funções de banco de dados
- **drizzle/schema.ts**: Definição de tabelas
- **server/photoUpload.ts**: Upload de fotos em S3

### Frontend
- **client/src/pages/Login.tsx**: Tela de login
- **client/src/pages/ManagerDashboard.tsx**: Painel de gestor
- **client/src/pages/EmployeeDashboard.tsx**: Painel de funcionário
- **client/src/pages/Reports.tsx**: Relatórios de produtividade
- **client/src/App.tsx**: Roteamento principal

### Testes
- **server/prospectopia.test.ts**: Testes unitários (11 testes)
- **server/auth.logout.test.ts**: Teste de logout

---

## 🔧 Troubleshooting

### Erro: "Cannot find module"
```bash
pnpm install
pnpm build
```

### Erro: "Database connection failed"
- Verificar `DATABASE_URL` está correto
- Verificar firewall permite conexão
- Testar conexão: `mysql -u user -p -h host`

### Erro: "OAuth callback failed"
- Verificar `VITE_APP_ID` está correto
- Verificar `OAUTH_SERVER_URL` é acessível
- Verificar callback URL registrada no OAuth provider

### Erro: "Port already in use"
```bash
# Mudar porta
PORT=3001 pnpm dev
```

### Erro: "Build failed"
```bash
# Limpar cache
rm -rf node_modules .next dist
pnpm install
pnpm build
```

---

## 📊 Funcionalidades Implementadas

✅ Autenticação Google OAuth com senha de gestor (520741)
✅ Banco de dados MySQL com schema completo
✅ Painel de Gestor com CRUD de projetos
✅ Painel de Funcionário com acesso limitado
✅ Pomodoro integrado aos projetos
✅ Sistema de tarefas com prazos
✅ Sistema de notas automáticas
✅ Dashboard com métricas
✅ Relatórios de produtividade com gráficos
✅ Upload de fotos em S3
✅ Testes unitários (11 testes passando)

---

## 🚀 Próximos Passos

1. **WebSocket para notificações em tempo real**
   - Implementar Socket.io para notificações instantâneas
   - Notificar quando funcionário entra/sai de projeto

2. **Exportar Relatórios**
   - Adicionar botão para exportar relatórios em PDF
   - Gerar gráficos em alta resolução

3. **Integração com Slack**
   - Enviar notificações para Slack
   - Sincronizar tarefas com Slack

4. **App Mobile**
   - Criar app React Native
   - Sincronizar dados com backend

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs: `pnpm dev` (local) ou painel de hosting
2. Verificar variáveis de ambiente
3. Verificar conexão com banco de dados
4. Verificar permissões OAuth

---

**Versão**: 1.0.0  
**Última atualização**: 22 de Janeiro de 2026  
**Status**: ✅ Pronto para Produção
