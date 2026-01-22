# Prospectopia - TODO

## Autenticação & Acesso
- [x] Implementar login com Google OAuth
- [x] Validar senha de gestor (520741) no primeiro acesso
- [x] Gerar links de convite para funcionários
- [x] Implementar cadastro de funcionário (nome + foto apenas)
- [x] Sistema de roles (gestor vs funcionário)

## Banco de Dados - Schema
- [x] Tabela de usuários (gestor/funcionário)
- [x] Tabela de projetos (nome, tipo, proprietário, escopo, objetivos, entregáveis)
- [x] Tabela de funcionários (nome, foto, especialidades, qualidades, configurações Pomodoro)
- [x] Tabela de tarefas (descrição, projeto, prazo, status)
- [x] Tabela de notas automáticas (tipo, conteúdo, deadline)
- [x] Tabela de status de funcionário (projeto atual, status, timestamp)

## Painel de Gestor
- [x] Dashboard com visão geral (funcionários ativos, projetos, métricas)
- [x] CRUD de projetos (criar, editar, deletar, visualizar contratos)
- [x] Gerenciamento de funcionários (criar, editar, deletar, visualizar dados)
- [x] Visualizar tarefas de projetos
- [x] Gerar links de convite para funcionários
- [x] Visualizar métricas de produtividade

## Painel de Funcionário
- [x] Dashboard (sem dados de gestor, sem contratos)
- [x] Visualizar projetos (escopo e objetivos apenas)
- [x] Entrar/sair de projetos
- [x] Adicionar tarefas aos projetos
- [x] Configurar Pomodoro pessoal
- [x] Visualizar tarefas atribuídas

## Integração Pomodoro-Projetos
- [x] Foco obrigatoriamente vinculado a projeto
- [x] Modal de seleção de projeto ao iniciar foco
- [x] Descanso com modal de saída do projeto
- [x] Parar Pomodoro ao sair do projeto
- [x] Iniciar Pomodoro ao entrar no projeto

## Sistema de Tarefas
- [x] Criar tarefas ao sair de projeto
- [x] Vincular tarefas a projetos
- [x] Status de tarefas (pendente/concluída)
- [x] Prazos de tarefas
- [x] Visualizar tarefas por projeto

## Sistema de Notas Automáticas
- [x] Criar nota ao entrar em projeto
- [x] Criar nota ao sair de projeto
- [x] Criar nota ao entrar em descanso
- [x] Deadline automático às 18:00

## Dashboard em Tempo Real
- [x] Funcionários ativos por status
- [x] Projetos em andamento
- [x] Métricas de produtividade
- [x] Tempo gasto em projetos
- [x] Taxa de conclusão de tarefas

## Testes & QA
- [x] Testar fluxo de login com Google
- [x] Testar validação de senha de gestor
- [x] Testar convite de funcionário
- [x] Testar CRUD de projetos
- [x] Testar Pomodoro-Projetos
- [x] Testar sistema de tarefas
- [x] Testar permissões de acesso

## Implementação Concluída
- [x] Autenticação Google OAuth com validação de senha de gestor
- [x] Banco de dados MySQL com schema completo
- [x] Painel de Gestor com CRUD de projetos e funcionários
- [x] Painel de Funcionário com acesso limitado
- [x] Pomodoro integrado aos projetos
- [x] Sistema de tarefas com prazos
- [x] Sistema de notas automáticas
- [x] Dashboard em tempo real com métricas
- [x] Testes unitários (11 testes passando)
- [x] Controle de acesso baseado em roles


## Melhorias Implementadas
- [x] Upload de fotos em S3 (ao invés de base64)
- [x] Relatórios de produtividade com gráficos
- [x] Documentação completa de deploy online gratuito
- [x] Documentação de estrutura de arquivos
- [x] README com instruções completas

## Limpeza Final
- [x] Remover referências ao Fivecon/favicon
