# Prospectopia - Gestão de Projetos & Produtividade

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

Plataforma completa de gestão de projetos e produtividade com autenticação Google, Pomodoro integrado, sistema de tarefas e relatórios em tempo real.

## 🎯 Características Principais

### 👔 Painel de Gestor
- **Dashboard com Métricas**: Visão geral de projetos, funcionários e produtividade
- **CRUD de Projetos**: Criar, editar, deletar e visualizar projetos com contratos
- **Gerenciamento de Funcionários**: Adicionar, editar e visualizar dados da equipe
- **Geração de Links de Convite**: Convidar novos funcionários via link único
- **Relatórios de Produtividade**: Gráficos e análises detalhadas de desempenho

### 👨‍💼 Painel de Funcionário
- **Dashboard Pessoal**: Visualizar projetos ativos e tarefas pendentes
- **Pomodoro Integrado**: Cronômetro de foco/descanso vinculado a projetos
- **Gerenciamento de Tarefas**: Criar e marcar tarefas como concluídas
- **Entrada/Saída de Projetos**: Modal para adicionar tarefas ao sair
- **Configurações Personalizadas**: Ajustar tempo de foco e pausa

### 🔐 Segurança & Autenticação
- **Google OAuth**: Login seguro com conta Google
- **Senha de Gestor**: Validação adicional (520741) para acesso de gestor
- **Controle de Acesso**: Roles baseados (admin vs employee)
- **Dados Criptografados**: Comunicação segura via HTTPS

### 📊 Dados & Analytics
- **Banco de Dados MySQL**: Schema completo com relacionamentos
- **Notas Automáticas**: Registradas ao entrar/sair de projetos
- **Relatórios em Tempo Real**: Métricas de produtividade e desempenho
- **Upload de Fotos**: Armazenamento em S3

---

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- pnpm 10+
- MySQL 8.0+

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/prospectopia-app.git
cd prospectopia-app

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# 4. Executar migrações
pnpm db:push

# 5. Iniciar desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`

---

## 📚 Documentação

### Guias
- [Deploy Guide](./DEPLOY_GUIDE.md) - Instruções completas de deploy online
- [API Documentation](./API.md) - Referência de procedures tRPC
- [Database Schema](./DATABASE.md) - Estrutura do banco de dados

### Credenciais de Teste
- **Tipo**: Gestor
- **Senha**: `520741`
- **Conta Google**: Use sua conta pessoal

---

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Express 4 + tRPC 11
- **Banco de Dados**: MySQL + Drizzle ORM
- **Autenticação**: Google OAuth + JWT
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Gráficos**: Recharts
- **Testes**: Vitest

### Estrutura de Pastas
```
prospectopia-app/
├── client/              # Frontend React
├── server/              # Backend Express + tRPC
├── drizzle/             # Schema do banco
├── shared/              # Código compartilhado
├── storage/             # Helpers de S3
└── tests/               # Testes unitários
```

---

## 📊 Funcionalidades Implementadas

| Funcionalidade | Status | Descrição |
|---|---|---|
| Autenticação Google OAuth | ✅ | Login seguro com Google |
| Validação de Senha de Gestor | ✅ | Senha: 520741 |
| CRUD de Projetos | ✅ | Criar, editar, deletar projetos |
| Gerenciamento de Funcionários | ✅ | Adicionar e gerenciar equipe |
| Pomodoro Integrado | ✅ | Foco/descanso vinculado a projetos |
| Sistema de Tarefas | ✅ | Criar e gerenciar tarefas |
| Notas Automáticas | ✅ | Registradas ao entrar/sair |
| Dashboard Gestor | ✅ | Métricas e visão geral |
| Dashboard Funcionário | ✅ | Painel pessoal |
| Relatórios de Produtividade | ✅ | Gráficos e análises |
| Upload de Fotos em S3 | ✅ | Armazenamento em cloud |
| Testes Unitários | ✅ | 11 testes passando |

---

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em watch mode
pnpm test:watch

# Gerar coverage
pnpm test:coverage
```

**Resultado**: ✅ 11/11 testes passando

---

## 🌐 Deploy

### Opções Gratuitas Recomendadas

1. **Railway** (Recomendado)
   - Deploy automático via GitHub
   - Banco MySQL incluído
   - Free tier: $5/mês de crédito
   - [Instruções](./DEPLOY_GUIDE.md#opção-1-railway-recomendado---mais-fácil)

2. **Render**
   - Deploy gratuito com limitações
   - Banco MySQL separado
   - Free tier: 0.5GB RAM
   - [Instruções](./DEPLOY_GUIDE.md#opção-2-render-alternativa-gratuita)

3. **Vercel + Railway**
   - Frontend no Vercel (gratuito)
   - Backend no Railway
   - Melhor performance
   - [Instruções](./DEPLOY_GUIDE.md#opção-3-vercel-frontend--railway-backend)

Ver [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) para instruções detalhadas.

---

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Banco de Dados
DATABASE_URL=mysql://user:pass@host:3306/prospectopia

# Autenticação
JWT_SECRET=sua-chave-secreta-de-32-caracteres
VITE_APP_ID=seu-app-id-oauth

# URLs
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://seu-oauth-portal

# Ambiente
NODE_ENV=production
PORT=3000
```

---

## 📈 Roadmap

### v1.1 (Próximas)
- [ ] WebSocket para notificações em tempo real
- [ ] Exportar relatórios em PDF
- [ ] Integração com Slack
- [ ] App mobile React Native

### v2.0 (Futuro)
- [ ] Integração com calendário (Google Calendar)
- [ ] Automações com Zapier
- [ ] Análise de IA para produtividade
- [ ] Multi-idioma (PT, EN, ES)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Ver [LICENSE](./LICENSE) para detalhes.

---

## 📞 Suporte

- 📧 Email: support@prospectopia.com
- 💬 Discord: [Comunidade](https://discord.gg/prospectopia)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/prospectopia-app/issues)

---

## 🙏 Agradecimentos

- React, Vite, Express, tRPC comunidades
- shadcn/ui por componentes incríveis
- Recharts por gráficos
- Todos os contribuidores

---

**Versão**: 1.0.0  
**Última atualização**: 22 de Janeiro de 2026  
**Status**: ✅ Pronto para Produção

---

Made with ❤️ by Prospectopia Team
