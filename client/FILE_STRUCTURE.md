# Estrutura de Arquivos do Prospectopia

## 📁 Visão Geral da Estrutura

```
prospectopia-app/
├── client/                          # Frontend React + Vite
│   ├── public/                      # Assets estáticos (imagens, ícones)
│   ├── src/
│   │   ├── _core/                   # Core do frontend
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts       # Hook de autenticação
│   │   │   └── ...
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx  # Layout principal do dashboard
│   │   │   ├── ErrorBoundary.tsx    # Tratamento de erros
│   │   │   └── ...
│   │   ├── contexts/                # React Contexts
│   │   │   └── ThemeContext.tsx     # Contexto de tema
│   │   ├── hooks/                   # Custom hooks
│   │   │   └── use-toast.ts         # Toast notifications
│   │   ├── lib/                     # Utilitários
│   │   │   └── trpc.ts              # Cliente tRPC
│   │   ├── pages/                   # Páginas (rotas)
│   │   │   ├── Home.tsx             # Página inicial
│   │   │   ├── Login.tsx            # Tela de login
│   │   │   ├── ManagerDashboard.tsx # Painel de gestor
│   │   │   ├── EmployeeDashboard.tsx# Painel de funcionário
│   │   │   ├── Reports.tsx          # Relatórios de produtividade
│   │   │   ├── InviteSignup.tsx     # Cadastro via convite
│   │   │   ├── ProjectDetail.tsx    # Detalhes do projeto
│   │   │   ├── Pomodoro.tsx         # Cronômetro Pomodoro
│   │   │   └── NotFound.tsx         # Página 404
│   │   ├── App.tsx                  # Roteamento principal
│   │   ├── main.tsx                 # Entry point
│   │   ├── index.css                # Estilos globais
│   │   └── const.ts                 # Constantes
│   ├── index.html                   # Template HTML
│   └── package.json                 # Dependências frontend
│
├── server/                          # Backend Express + tRPC
│   ├── _core/                       # Framework core
│   │   ├── index.ts                 # Servidor Express
│   │   ├── context.ts               # Contexto tRPC
│   │   ├── trpc.ts                  # Setup tRPC
│   │   ├── env.ts                   # Variáveis de ambiente
│   │   ├── cookies.ts               # Gerenciamento de cookies
│   │   ├── auth.ts                  # Lógica de autenticação
│   │   ├── llm.ts                   # Integração com LLM
│   │   ├── notification.ts          # Sistema de notificações
│   │   ├── map.ts                   # Integração com Maps
│   │   ├── voiceTranscription.ts    # Transcrição de áudio
│   │   ├── imageGeneration.ts       # Geração de imagens
│   │   └── systemRouter.ts          # Rotas do sistema
│   ├── db.ts                        # Funções de banco de dados
│   ├── photoUpload.ts               # Upload de fotos em S3
│   ├── routers.ts                   # Procedures tRPC (API)
│   ├── prospectopia.test.ts         # Testes unitários
│   └── auth.logout.test.ts          # Teste de logout
│
├── drizzle/                         # ORM Drizzle
│   ├── schema.ts                    # Definição de tabelas
│   └── migrations/                  # Histórico de migrações
│
├── shared/                          # Código compartilhado
│   └── const.ts                     # Constantes globais
│
├── storage/                         # Helpers de S3
│   └── index.ts                     # Funções de storage
│
├── .env.example                     # Exemplo de variáveis
├── .gitignore                       # Arquivos ignorados pelo Git
├── drizzle.config.ts                # Configuração Drizzle
├── vite.config.ts                   # Configuração Vite
├── tsconfig.json                    # Configuração TypeScript
├── package.json                     # Dependências do projeto
├── pnpm-lock.yaml                   # Lock file do pnpm
├── README.md                        # Documentação principal
├── DEPLOY_GUIDE.md                  # Guia de deploy
├── FILE_STRUCTURE.md                # Este arquivo
└── LICENSE                          # Licença MIT
```

---

## 📄 Descrição de Arquivos Principais

### Frontend (client/src/)

#### Páginas
| Arquivo | Descrição | Acesso |
|---------|-----------|--------|
| `pages/Home.tsx` | Página inicial | Público |
| `pages/Login.tsx` | Tela de login com Google | Público |
| `pages/ManagerDashboard.tsx` | Painel de gestor | Admin |
| `pages/EmployeeDashboard.tsx` | Painel de funcionário | Employee |
| `pages/Reports.tsx` | Relatórios de produtividade | Admin |
| `pages/InviteSignup.tsx` | Cadastro via link de convite | Público (com token) |
| `pages/ProjectDetail.tsx` | Detalhes do projeto | Employee |
| `pages/Pomodoro.tsx` | Cronômetro Pomodoro | Employee |

#### Componentes
| Arquivo | Descrição |
|---------|-----------|
| `components/DashboardLayout.tsx` | Layout principal com sidebar |
| `components/ErrorBoundary.tsx` | Tratamento de erros React |
| `components/ui/*` | Componentes shadcn/ui (Button, Card, Dialog, etc) |

#### Hooks
| Arquivo | Descrição |
|---------|-----------|
| `_core/hooks/useAuth.ts` | Hook de autenticação |
| `hooks/use-toast.ts` | Hook para notificações |

### Backend (server/)

#### Procedures tRPC
| Arquivo | Descrição |
|---------|-----------|
| `routers.ts` | Todas as procedures da API |

#### Banco de Dados
| Arquivo | Descrição |
|---------|-----------|
| `db.ts` | Funções de query (CRUD) |
| `photoUpload.ts` | Upload de fotos em S3 |
| `../drizzle/schema.ts` | Definição de tabelas |

#### Testes
| Arquivo | Descrição |
|---------|-----------|
| `prospectopia.test.ts` | Testes das funcionalidades |
| `auth.logout.test.ts` | Teste de logout |

---

## 🗄️ Banco de Dados (drizzle/schema.ts)

### Tabelas Principais

```typescript
// Usuários (autenticação)
users {
  id: int (PK)
  openId: string (unique)
  name: string
  email: string
  role: 'admin' | 'employee'
  createdAt: timestamp
  updatedAt: timestamp
}

// Projetos
projects {
  id: int (PK)
  name: string
  type: string
  ownerId: int (FK users)
  scope: text
  objectives: text
  deliverables: text
  status: 'active' | 'completed'
  createdAt: timestamp
}

// Funcionários
employees {
  id: int (PK)
  userId: int (FK users)
  photo: string (URL S3)
  specialties: text
  qualities: text
  pomodoroFocus: int (minutos)
  pomodoroBreak: int (minutos)
  currentProjectId: int (FK projects)
  currentStatus: 'project' | 'rest' | 'idle'
  createdAt: timestamp
}

// Tarefas
tasks {
  id: int (PK)
  projectId: int (FK projects)
  employeeId: int (FK employees)
  description: text
  status: 'pending' | 'completed'
  dueDate: date
  createdAt: timestamp
}

// Notas Automáticas
notes {
  id: int (PK)
  employeeId: int (FK employees)
  projectId: int (FK projects)
  type: 'entry' | 'exit' | 'break'
  content: text
  deadline: time (18:00)
  createdAt: timestamp
}

// Links de Convite
inviteLinks {
  id: int (PK)
  token: string (unique)
  createdBy: int (FK users)
  usedBy: int (FK users, nullable)
  expiresAt: timestamp
  createdAt: timestamp
}
```

---

## 🔌 API Procedures (tRPC)

### Autenticação
```typescript
auth.me                              // Obter usuário atual
auth.validateManagerPassword         // Validar senha de gestor
auth.logout                          // Fazer logout
```

### Projetos
```typescript
project.getAll                       // Listar todos os projetos
project.getById                      // Obter projeto por ID
project.create                       // Criar novo projeto
project.update                       // Atualizar projeto
project.delete                       // Deletar projeto
```

### Funcionários
```typescript
employee.getAll                      // Listar todos os funcionários
employee.getMe                       // Obter dados do funcionário atual
employee.create                      // Criar novo funcionário
employee.update                      // Atualizar funcionário
employee.updateStatus                // Atualizar status (projeto/descanso)
employee.delete                      // Deletar funcionário
```

### Tarefas
```typescript
task.create                          // Criar nova tarefa
task.getByProject                    // Listar tarefas do projeto
task.update                          // Atualizar tarefa
task.delete                          // Deletar tarefa
task.markComplete                    // Marcar como concluída
```

### Notas
```typescript
note.create                          // Criar nota automática
note.getByEmployee                   // Listar notas do funcionário
note.delete                          // Deletar nota
```

### Convites
```typescript
invite.generate                      // Gerar link de convite
invite.validate                      // Validar link de convite
invite.redeem                        // Usar link de convite
```

### Dashboard
```typescript
dashboard.getStats                   // Obter estatísticas gerais
dashboard.getEmployeeStats           // Obter estatísticas do funcionário
```

---

## 🔐 Fluxo de Autenticação

```
1. Usuário clica "Login com Google"
   ↓
2. Redireciona para OAuth provider
   ↓
3. Usuário autoriza acesso
   ↓
4. Callback em /api/oauth/callback
   ↓
5. Criar/atualizar usuário no banco
   ↓
6. Gerar JWT e salvar em cookie
   ↓
7. Redirecionar para dashboard
   ↓
8. Verificar role (admin/employee)
```

---

## 🚀 Como Adicionar Novas Funcionalidades

### 1. Adicionar Nova Tabela
```typescript
// drizzle/schema.ts
export const newTable = mysqlTable('new_table', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }),
  // ... mais campos
});

// Executar: pnpm db:push
```

### 2. Adicionar Função de Query
```typescript
// server/db.ts
export async function getNewItems() {
  const db = await getDb();
  return await db.select().from(newTable);
}
```

### 3. Adicionar Procedure tRPC
```typescript
// server/routers.ts
export const appRouter = router({
  newFeature: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getNewItems()
    ),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(({ input }) =>
        db.createNewItem(input)
      ),
  }),
});
```

### 4. Usar no Frontend
```typescript
// client/src/pages/NewPage.tsx
import { trpc } from "@/lib/trpc";

export default function NewPage() {
  const { data } = trpc.newFeature.list.useQuery();
  const createMutation = trpc.newFeature.create.useMutation();

  return (
    <div>
      {data?.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={() => createMutation.mutate({ name: "New" })}>
        Criar
      </button>
    </div>
  );
}
```

---

## 📦 Dependências Principais

### Frontend
- **React 19**: Framework UI
- **Vite**: Build tool
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **shadcn/ui**: Componentes UI
- **Recharts**: Gráficos
- **Wouter**: Roteamento
- **tRPC Client**: Comunicação com backend

### Backend
- **Express 4**: Framework web
- **tRPC 11**: RPC framework
- **Drizzle ORM**: Database ORM
- **MySQL2**: Driver MySQL
- **JWT**: Autenticação
- **Zod**: Validação de dados

### Testes
- **Vitest**: Framework de testes
- **@testing-library/react**: Testes de componentes

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento
pnpm build            # Build para produção
pnpm start            # Iniciar servidor de produção

# Banco de Dados
pnpm db:push          # Executar migrações
pnpm db:studio        # Abrir Drizzle Studio

# Testes
pnpm test             # Executar testes
pnpm test:watch       # Testes em watch mode

# Qualidade
pnpm check            # Type check
pnpm format           # Formatar código
```

---

## 📝 Convenções de Código

### Nomes de Arquivos
- **Componentes**: `PascalCase.tsx` (ex: `ManagerDashboard.tsx`)
- **Páginas**: `PascalCase.tsx` (ex: `Login.tsx`)
- **Hooks**: `camelCase.ts` (ex: `useAuth.ts`)
- **Utilitários**: `camelCase.ts` (ex: `photoUpload.ts`)

### Nomes de Variáveis
- **Constantes**: `UPPER_SNAKE_CASE`
- **Variáveis**: `camelCase`
- **Tipos**: `PascalCase`

### Estrutura de Componentes
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ComponentProps {
  title: string;
  onSubmit?: () => void;
}

export default function Component({ title, onSubmit }: ComponentProps) {
  const [state, setState] = useState("");

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
```

---

## 🐛 Debugging

### Logs do Servidor
```bash
# Ver logs em tempo real
tail -f .manus-logs/devserver.log

# Procurar por erros
grep "ERROR" .manus-logs/devserver.log
```

### Logs do Cliente
```bash
# Abrir DevTools do navegador
F12 ou Cmd+Option+I

# Ver console.log
console.log("Debug message")
```

### Banco de Dados
```bash
# Abrir Drizzle Studio
pnpm db:studio

# Executar query manual
mysql -u user -p -h host -D prospectopia
```

---

## 📚 Recursos Adicionais

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [tRPC Docs](https://trpc.io)
- [Drizzle Docs](https://orm.drizzle.team)
- [Tailwind Docs](https://tailwindcss.com)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

**Versão**: 1.0.0  
**Última atualização**: 22 de Janeiro de 2026
