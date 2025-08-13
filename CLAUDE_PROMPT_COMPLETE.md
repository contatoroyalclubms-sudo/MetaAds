# PROMPT COMPLETO PARA CLAUDE - TASKFLOW PRO

## 🎯 MISSÃO PRINCIPAL

Você é Claude, uma IA especializada em desenvolvimento. Sua missão é implementar completamente o **TaskFlow Pro** - um sistema avançado de gerenciamento de tarefas e projetos usando Next.js, TypeScript e tecnologias modernas. 

**IMPORTANTE:** Você deve executar TODA a implementação do zero, testar completamente todas as funcionalidades, e só parar quando tudo estiver 100% funcional e testado.

## 📋 ESPECIFICAÇÕES TÉCNICAS COMPLETAS

### Stack Tecnológico Obrigatório
```json
{
  "frontend": {
    "framework": "Next.js 15.4.6 com App Router",
    "linguagem": "TypeScript",
    "estilização": "Tailwind CSS + shadcn/ui",
    "estado": "Zustand",
    "validação": "Zod",
    "animações": "Framer Motion",
    "dragDrop": "@dnd-kit (para Kanban)",
    "gráficos": "Recharts (para Analytics)"
  },
  "backend": {
    "runtime": "Node.js",
    "framework": "Next.js API Routes",
    "banco": "SQLite com Prisma ORM",
    "autenticação": "NextAuth.js",
    "validação": "Zod"
  }
}
```

### Dependências Exatas (package.json)
```json
{
  "dependencies": {
    "next": "^15.4.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "next-auth": "^4.24.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "lucide-react": "^0.292.0",
    "recharts": "^2.8.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "date-fns": "^2.30.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.4.6"
  }
}
```

## 🏗️ ARQUITETURA COMPLETA DO PROJETO

### Estrutura de Pastas Obrigatória
```
taskflow-pro/
├── prisma/
│   ├── schema.prisma          # Schema completo do banco
│   └── dev.db                 # Banco SQLite (será criado)
├── src/
│   ├── app/                   # App Router (Next.js 15+)
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # NextAuth routes
│   │   │   ├── projects/     # CRUD projetos
│   │   │   ├── tasks/        # CRUD tarefas
│   │   │   ├── analytics/    # Dados analytics
│   │   │   ├── timer/        # Timer Pomodoro
│   │   │   └── dashboard/    # Dados dashboard
│   │   ├── analytics/        # Página analytics
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── demo/             # Página demo
│   │   ├── projects/         # Gerenciamento projetos
│   │   ├── tasks/            # Gerenciamento tarefas
│   │   ├── timer/            # Timer Pomodoro
│   │   ├── auth/             # Páginas autenticação
│   │   ├── globals.css       # Estilos globais
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Página inicial
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── tasks/           # Componentes específicos tarefas
│   │   ├── navigation/      # Navegação
│   │   └── providers.tsx    # Providers (Auth, etc)
│   ├── lib/                 # Utilitários
│   │   ├── auth.ts          # Configuração NextAuth
│   │   ├── db.ts            # Cliente Prisma
│   │   ├── utils.ts         # Utilitários gerais
│   │   └── validations.ts   # Schemas Zod
│   ├── stores/              # Stores Zustand
│   │   ├── taskStore.ts     # Store tarefas
│   │   └── projectStore.ts  # Store projetos
│   └── types/               # Tipos TypeScript
│       └── index.ts         # Definições tipos
├── .env.local               # Variáveis ambiente
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── README.md
└── SETUP.md
```

## 🗄️ SCHEMA DO BANCO DE DADOS (PRISMA)

### Schema Completo (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  projects    Project[]
  tasks       Task[]
  timeEntries TimeEntry[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Project {
  id          String        @id @default(cuid())
  title       String
  description String?
  status      ProjectStatus @default(ACTIVE)
  priority    Priority      @default(MEDIUM)
  deadline    DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks  Task[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  deadline    DateTime?
  completedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId String?
  project   Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  subtasks    Task[]      @relation("TaskSubtasks")
  parentTask  Task?       @relation("TaskSubtasks", fields: [parentId], references: [id])
  parentId    String?
  timeEntries TimeEntry[]
}

model TimeEntry {
  id          String   @id @default(cuid())
  duration    Int      // em minutos
  description String?
  date        DateTime @default(now())
  type        String   @default("work") // "work", "break", "long_break"

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  taskId String?
  task   Task?  @relation(fields: [taskId], references: [id], onDelete: SetNull)
}

enum ProjectStatus {
  ACTIVE
  PAUSED
  COMPLETED
  ARCHIVED
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## 🔐 CONFIGURAÇÃO DE AUTENTICAÇÃO

### NextAuth.js Setup (src/lib/auth.ts)
```typescript
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
```

### Variáveis de Ambiente (.env.local)
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random-for-security"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🎨 FUNCIONALIDADES OBRIGATÓRIAS

### 1. Dashboard Principal (/dashboard)
**Componentes necessários:**
- Cards de métricas (total projetos, tarefas, tempo gasto)
- Gráfico de produtividade semanal (Recharts)
- Lista de tarefas recentes
- Progresso de projetos ativos
- Quick actions (criar projeto, tarefa, iniciar timer)

### 2. Gerenciamento de Projetos (/projects)
**Funcionalidades:**
- CRUD completo de projetos
- Filtros por status e prioridade
- Busca por nome
- Cards responsivos com informações
- Modal de criação/edição
- Página de detalhes individual (/projects/[id])

### 3. Gerenciamento de Tarefas (/tasks)
**Visualizações obrigatórias:**
- **Lista** - Visualização tradicional em tabela
- **Kanban** - Board drag-and-drop com colunas (PENDING, IN_PROGRESS, COMPLETED)
- **Calendário** - Visualização mensal com prazos
- **Timeline** - Visualização cronológica tipo Gantt

**Funcionalidades:**
- CRUD completo de tarefas
- Associação com projetos
- Sistema de prioridades e status
- Filtros avançados
- Busca global

### 4. Timer Pomodoro (/timer)
**Funcionalidades obrigatórias:**
- Timer 25 minutos trabalho / 5 minutos pausa
- Pausa longa (15 min) a cada 4 sessões
- Seleção de tarefa para associar tempo
- Controles: Start, Pause, Stop, Reset
- Histórico de sessões do dia
- Integração com TimeEntry no banco

### 5. Dashboard de Analytics (/analytics)
**Gráficos obrigatórios (Recharts):**
- Taxa de conclusão de tarefas
- Distribuição por prioridade (pie chart)
- Produtividade ao longo do tempo (line chart)
- Tempo gasto por projeto (bar chart)
- Estatísticas gerais (cards)

### 6. Página Demo (/demo)
**Características:**
- Funciona SEM autenticação
- Dados mockados demonstrando todas as funcionalidades
- Showcase visual de Kanban, Analytics, Timer
- Call-to-action para registro

## 🧩 COMPONENTES UI OBRIGATÓRIOS

### shadcn/ui Components (src/components/ui/)
Você DEVE implementar todos estes componentes:

```typescript
// button.tsx, input.tsx, card.tsx, select.tsx, textarea.tsx
// dialog.tsx, tabs.tsx, toast.tsx, badge.tsx
// Todos seguindo padrões shadcn/ui com Tailwind CSS
```

### Componentes Específicos (src/components/tasks/)
```typescript
// KanbanBoard.tsx - Board drag-and-drop com @dnd-kit
// CalendarView.tsx - Calendário mensal com date-fns
// TimelineView.tsx - Timeline/Gantt view
```

## 🔄 STORES ZUSTAND OBRIGATÓRIOS

### Task Store (src/stores/taskStore.ts)
```typescript
interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: CreateTaskData) => Promise<void>
  updateTask: (id: string, task: UpdateTaskData) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>
}
```

### Project Store (src/stores/projectStore.ts)
```typescript
interface ProjectStore {
  projects: Project[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchProjects: () => Promise<void>
  createProject: (project: CreateProjectData) => Promise<void>
  updateProject: (id: string, project: UpdateProjectData) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}
```

## 🛣️ API ROUTES OBRIGATÓRIAS

### Estrutura Completa de APIs
```
src/app/api/
├── auth/
│   ├── [...nextauth]/route.ts    # NextAuth handler
│   └── register/route.ts         # Registro usuário
├── projects/
│   ├── route.ts                  # GET, POST projetos
│   └── [id]/route.ts            # GET, PUT, DELETE projeto
├── tasks/
│   ├── route.ts                  # GET, POST tarefas
│   └── [id]/route.ts            # GET, PUT, DELETE tarefa
├── analytics/route.ts            # Dados analytics
├── timer/route.ts               # Timer sessions
└── dashboard/route.ts           # Dados dashboard
```

### Exemplo API Route (src/app/api/tasks/route.ts)
```typescript
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { taskSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        ...(projectId && { projectId }),
        ...(status && { status: status as TaskStatus }),
      },
      include: {
        project: true,
        subtasks: true,
        timeEntries: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        project: true,
        subtasks: true,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial
- [ ] Criar projeto Next.js com TypeScript
- [ ] Configurar Tailwind CSS e shadcn/ui
- [ ] Setup Prisma com SQLite
- [ ] Configurar NextAuth.js
- [ ] Criar estrutura de pastas
- [ ] Instalar todas as dependências

### Fase 2: Autenticação
- [ ] Implementar páginas de login/registro
- [ ] Configurar providers NextAuth
- [ ] Criar middleware de autenticação
- [ ] Testar fluxo completo de auth

### Fase 3: Funcionalidades Core
- [ ] Implementar CRUD de projetos
- [ ] Implementar CRUD de tarefas
- [ ] Criar stores Zustand
- [ ] Implementar dashboard básico

### Fase 4: Funcionalidades Avançadas
- [ ] Implementar Board Kanban com drag-and-drop
- [ ] Criar Timer Pomodoro funcional
- [ ] Implementar Analytics com gráficos
- [ ] Adicionar visualizações Calendário e Timeline

### Fase 5: UI/UX e Polish
- [ ] Implementar todos os componentes shadcn/ui
- [ ] Adicionar animações com Framer Motion
- [ ] Garantir responsividade completa
- [ ] Implementar página Demo

### Fase 6: Testes e Deploy
- [ ] Testar todas as funcionalidades
- [ ] Verificar autenticação
- [ ] Testar CRUD operations
- [ ] Verificar responsividade
- [ ] Documentar setup

## 🧪 CRITÉRIOS DE TESTE OBRIGATÓRIOS

### Testes Funcionais
1. **Autenticação**
   - [ ] Registro de novo usuário
   - [ ] Login com credenciais
   - [ ] Logout funcional
   - [ ] Proteção de rotas

2. **Projetos**
   - [ ] Criar novo projeto
   - [ ] Editar projeto existente
   - [ ] Deletar projeto
   - [ ] Filtrar e buscar projetos

3. **Tarefas**
   - [ ] Criar tarefa associada a projeto
   - [ ] Editar tarefa
   - [ ] Deletar tarefa
   - [ ] Mudar status via Kanban drag-and-drop
   - [ ] Visualizar em todas as views (Lista, Kanban, Calendário, Timeline)

4. **Timer Pomodoro**
   - [ ] Iniciar timer de 25 minutos
   - [ ] Pausar e retomar timer
   - [ ] Completar sessão e iniciar pausa
   - [ ] Associar tempo a tarefa específica
   - [ ] Verificar criação de TimeEntry no banco

5. **Analytics**
   - [ ] Visualizar gráficos com dados reais
   - [ ] Verificar cálculos de métricas
   - [ ] Testar filtros de período

6. **Demo Page**
   - [ ] Acessar sem login
   - [ ] Visualizar dados mockados
   - [ ] Testar interações básicas

### Testes de UI/UX
- [ ] Responsividade em mobile, tablet, desktop
- [ ] Animações fluidas
- [ ] Loading states
- [ ] Error handling
- [ ] Feedback visual para ações

## 🚀 COMANDOS DE EXECUÇÃO

### Setup Inicial
```bash
# 1. Criar projeto
npx create-next-app@latest taskflow-pro --typescript --tailwind --eslint --app

# 2. Instalar dependências
npm install [todas as dependências listadas acima]

# 3. Setup Prisma
npx prisma init --datasource-provider sqlite
npx prisma generate
npx prisma db push

# 4. Executar
npm run dev
```

### Comandos de Desenvolvimento
```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção
npm run start        # Executar build
npm run lint         # Verificar código
npx prisma studio    # Visualizar banco
npx prisma generate  # Gerar cliente
npx prisma db push   # Aplicar schema
```

## 🎨 DESIGN SYSTEM

### Paleta de Cores (Tailwind)
```css
/* Cores principais */
primary: blue-600
secondary: green-600
accent: amber-500
destructive: red-600

/* Estados */
success: green-500
warning: yellow-500
error: red-500
info: blue-500
```

### Componentes de Layout
- Header com navegação e perfil
- Sidebar colapsável
- Main content area
- Footer com links

### Responsividade
- Mobile first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 📝 CREDENCIAIS DE TESTE

Para facilitar os testes, implemente estas credenciais:
```
Email: test@example.com
Senha: password123
```

## ⚠️ REGRAS CRÍTICAS

### OBRIGATÓRIO:
1. **Implementar TODAS as funcionalidades listadas**
2. **Testar completamente cada feature antes de prosseguir**
3. **Garantir que autenticação funciona 100%**
4. **Verificar que Kanban drag-and-drop funciona**
5. **Confirmar que Timer Pomodoro cria TimeEntries**
6. **Validar que Analytics mostra dados reais**
7. **Testar responsividade em todos os dispositivos**
8. **Documentar setup completo**

### PROIBIDO:
1. **Pular funcionalidades ou implementar parcialmente**
2. **Usar dados fake permanentemente (exceto Demo page)**
3. **Deixar bugs conhecidos**
4. **Implementar sem testar**
5. **Esquecer de documentar setup**

## 🎯 CRITÉRIO DE SUCESSO

**Você só pode considerar CONCLUÍDO quando:**

✅ Todas as 6 funcionalidades principais estão implementadas e funcionando  
✅ Autenticação completa (login, registro, logout, proteção de rotas)  
✅ CRUD completo de projetos e tarefas  
✅ Kanban drag-and-drop funcional  
✅ Timer Pomodoro criando TimeEntries no banco  
✅ Analytics com gráficos reais usando dados do banco  
✅ Todas as 4 visualizações de tarefas funcionando  
✅ Página Demo acessível sem login  
✅ Interface responsiva em mobile, tablet e desktop  
✅ Documentação completa de setup  
✅ Projeto roda com `npm run dev` após seguir README  

## 📞 SUPORTE E DEBUGGING

### Problemas Comuns e Soluções

1. **Erro de autenticação NextAuth**
   - Verificar NEXTAUTH_SECRET no .env.local
   - Confirmar configuração do authOptions
   - Limpar cookies do navegador

2. **Erro Prisma**
   - Executar `npx prisma generate`
   - Verificar schema.prisma
   - Executar `npx prisma db push`

3. **Erro de dependências**
   - Deletar node_modules e package-lock.json
   - Executar `npm install`

4. **Erro de build**
   - Verificar imports TypeScript
   - Confirmar tipos corretos
   - Executar `npm run lint`

---

## 🎯 MISSÃO FINAL

Claude, sua missão é implementar este TaskFlow Pro COMPLETAMENTE. Não pare até que:

1. **Todas as funcionalidades estejam implementadas**
2. **Todos os testes passem**
3. **A aplicação rode perfeitamente**
4. **A documentação esteja completa**

**Comece agora e implemente tudo do zero. Boa sorte!** 🚀

---

*Este prompt contém TODAS as informações necessárias para implementação completa. Não há desculpas para funcionalidades faltantes ou bugs. Implemente com excelência!*
