# ✅ Checklist de Implantação - Prospectopia

Use este checklist para acompanhar o progresso da implantação do Prospectopia.

---

## 📋 Fase 1: Preparação (Antes de Começar)

- [ ] Você tem conta GitHub
- [ ] Você tem conta Google
- [ ] Você tem conta Railway
- [ ] Você tem acesso ao código do Prospectopia
- [ ] Você leu o arquivo IMPLANTACAO_RAILWAY.md

---

## 🔧 Fase 2: Configuração do Repositório GitHub

### Criar Repositório
- [ ] Acessei github.com/new
- [ ] Criei repositório chamado "prospectopia-app"
- [ ] Defini como Public (ou Private)

### Fazer Upload do Código
- [ ] Executei `git init`
- [ ] Executei `git add .`
- [ ] Executei `git commit -m "Initial commit"`
- [ ] Executei `git remote add origin https://github.com/SEU_USUARIO/prospectopia-app.git`
- [ ] Executei `git push -u origin main`
- [ ] Verifiquei que o código está no GitHub

---

## 🚂 Fase 3: Configuração do Railway

### Criar Projeto
- [ ] Acessei railway.app
- [ ] Fiz login com GitHub
- [ ] Cliquei em "Create New Project"
- [ ] Selecionei "Deploy from GitHub repo"
- [ ] Selecionei "prospectopia-app"
- [ ] Cliquei em "Deploy"
- [ ] Aguardei o build completar

### Adicionar Banco de Dados
- [ ] Cliquei em "Add Service"
- [ ] Selecionei "MySQL"
- [ ] Aguardei o banco ser criado
- [ ] Verifiquei que `DATABASE_URL` foi criada automaticamente

---

## 🔐 Fase 4: Configurar Variáveis de Ambiente

### Gerar Chaves
- [ ] Executei `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"` para gerar JWT_SECRET
- [ ] Copiei o resultado

### Adicionar Variáveis no Railway
- [ ] Fui para a aba "Variables"
- [ ] Adicionei `JWT_SECRET` = (valor gerado)
- [ ] Adicionei `VITE_APP_ID` = `prospectopia-dev-app`
- [ ] Adicionei `OAUTH_SERVER_URL` = `https://api.manus.im`
- [ ] Adicionei `NODE_ENV` = `production`
- [ ] Cliquei em "Save"

---

## 🗄️ Fase 5: Executar Migrações

### Verificar Banco
- [ ] Verifiquei que `DATABASE_URL` está configurada
- [ ] Aguardei 2-3 minutos para o banco estar pronto

### Executar Migrações
- [ ] O Railway executou automaticamente `pnpm db:push`
- [ ] Verifiquei nos logs que as migrações completaram
- [ ] Procurei por erros nos logs (linhas em vermelho)

---

## 🌐 Fase 6: Acessar a Aplicação

### Obter URL Pública
- [ ] Fui para "Deployments" no Railway
- [ ] Cliquei no deployment mais recente
- [ ] Copiei a URL pública

### Testar Acesso
- [ ] Abri a URL em um navegador
- [ ] Vi a página inicial do Prospectopia
- [ ] Verifiquei que o site carregou sem erros

---

## 🧪 Fase 7: Testar Funcionalidades

### Login como Gestor
- [ ] Cliquei em "Login com Google"
- [ ] Autorizei com minha conta Google
- [ ] Digitei a senha: `520741`
- [ ] Fui redirecionado para o painel de gestor

### Testar Dashboard
- [ ] Visualizei o dashboard
- [ ] Vi as métricas (projetos, funcionários, tarefas)
- [ ] Não houve erros na página

### Testar Projetos
- [ ] Criei um novo projeto
- [ ] Preenchi nome, tipo, escopo, objetivos, entregáveis
- [ ] Cliquei em "Criar Projeto"
- [ ] O projeto apareceu na lista

### Testar Funcionários
- [ ] Cliquei em "Novo Funcionário"
- [ ] Cliquei em "Gerar Link de Convite"
- [ ] Copiei o link
- [ ] Testei o link em uma aba anônima (ou outro navegador)

### Testar Relatórios
- [ ] Cliquei em "Relatórios"
- [ ] Vi os gráficos carregando
- [ ] Vi as métricas (horas, tarefas, taxa)
- [ ] Verifiquei que os gráficos estão funcionando

---

## 📊 Fase 8: Monitorar a Aplicação

### Verificar Logs
- [ ] Fui para "Logs" no Railway
- [ ] Procurei por erros (linhas em vermelho)
- [ ] Não havia erros críticos

### Verificar Métricas
- [ ] Fui para "Metrics"
- [ ] Verifiquei CPU (deve estar baixo)
- [ ] Verifiquei RAM (deve estar baixo)
- [ ] Verifiquei requisições (deve estar normal)

### Verificar Banco de Dados
- [ ] Fui para "MySQL" no Railway
- [ ] Cliquei em "Connect"
- [ ] Verifiquei que a connection string está disponível

---

## 🎯 Fase 9: Preparar para Produção

### Configuração Final
- [ ] Verifiquei que `NODE_ENV` = `production`
- [ ] Verifiquei que todas as variáveis estão corretas
- [ ] Fiz um novo deploy para garantir

### Backup
- [ ] Anotei a URL pública da aplicação
- [ ] Anotei a connection string do banco
- [ ] Guardei em local seguro

### Documentação
- [ ] Imprimi ou salvei IMPLANTACAO_RAILWAY.md
- [ ] Imprimi ou salvei GUIA_USO.md
- [ ] Imprimi ou salvei README.md

---

## 👥 Fase 10: Onboarding de Funcionários

### Preparar Funcionários
- [ ] Criei lista de funcionários que vão usar
- [ ] Preparei emails/mensagens com instruções
- [ ] Testei o link de convite

### Enviar Convites
- [ ] Gerei link de convite para cada funcionário
- [ ] Enviei os links por email ou WhatsApp
- [ ] Expliquei como usar (ver GUIA_USO.md)

### Treinar Funcionários
- [ ] Mostrei como fazer login
- [ ] Mostrei como entrar em projetos
- [ ] Mostrei como usar o Pomodoro
- [ ] Mostrei como adicionar tarefas
- [ ] Respondi dúvidas

---

## 🎉 Fase 11: Lançamento

### Comunicação
- [ ] Enviei email anunciando o lançamento
- [ ] Expliquei os benefícios (Pomodoro, relatórios, etc)
- [ ] Ofereci suporte para dúvidas

### Monitoramento Inicial
- [ ] Monitorei logs nos primeiros dias
- [ ] Verifiquei se havia erros
- [ ] Respondi rapidamente a problemas

### Feedback
- [ ] Pedi feedback dos funcionários
- [ ] Anotei sugestões de melhoria
- [ ] Planejei próximas versões

---

## 📈 Fase 12: Otimização Contínua

### Primeira Semana
- [ ] Monitore uso de recursos
- [ ] Verifique se todos conseguem fazer login
- [ ] Recolha feedback dos usuários

### Primeira Mês
- [ ] Analise relatórios de produtividade
- [ ] Identifique padrões de uso
- [ ] Planeje melhorias

### Manutenção Contínua
- [ ] Faça backup do banco regularmente
- [ ] Monitore custos no Railway
- [ ] Atualize documentação conforme necessário

---

## 📞 Troubleshooting

Se algo não funcionar, marque aqui:

### Problemas Encontrados
- [ ] Problema: ________________
  - Solução: ________________
  
- [ ] Problema: ________________
  - Solução: ________________

- [ ] Problema: ________________
  - Solução: ________________

---

## ✅ Status Final

- [ ] Todas as fases completadas
- [ ] Aplicação funcionando em produção
- [ ] Funcionários onboarded
- [ ] Documentação entregue
- [ ] Suporte configurado

---

## 📝 Notas

Use este espaço para anotar informações importantes:

```
URL da Aplicação: ___________________________________
Senha de Gestor: 520741
Contato de Suporte: ___________________________________
Data de Lançamento: ___________________________________
Observações: ___________________________________
___________________________________
___________________________________
```

---

**Versão**: 1.0.0  
**Data**: 22 de Janeiro de 2026  
**Status**: ✅ Pronto para Usar
