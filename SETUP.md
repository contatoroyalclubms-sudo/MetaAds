# TaskFlow Pro - Setup e Execução

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🚀 Como Executar o Projeto

### 1. Clone o Repositório
```bash
git clone https://github.com/contatoroyalclubms-sudo/MetaAds.git
cd MetaAds
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXTAUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-for-security
NEXTAUTH_URL=http://localhost:3000
```

**Importante:** O `NEXTAUTH_SECRET` é obrigatório para o funcionamento da autenticação. Use uma string longa e aleatória.

### 4. Configure o Banco de Dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações (se necessário)
npx prisma db push
```

### 5. Execute o Projeto
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em: **http://localhost:3000**

## 🎯 Funcionalidades Implementadas

### ✅ Funcionalidades Principais
- **Dashboard** - Visão geral com métricas e estatísticas
- **Gerenciamento de Projetos** - CRUD completo de projetos
- **Gerenciamento de Tarefas** - CRUD completo de tarefas
- **Autenticação** - Login/registro com NextAuth.js

### ✅ Funcionalidades Avançadas (Novas)
- **📊 Dashboard de Analytics** - Métricas de produtividade com gráficos
- **🍅 Timer Pomodoro** - Timer integrado com rastreamento de sessões
- **📋 Board Kanban** - Visualização drag-and-drop das tarefas
- **📅 Visualização de Calendário** - Calendário mensal com prazos
- **📈 Timeline/Gantt** - Visualização cronológica de projetos
- **🎯 Página Demo** - Showcase sem necessidade de autenticação

## 🔐 Credenciais de Teste

Para testar a aplicação, use as seguintes credenciais:

**Email:** test@example.com  
**Senha:** password123

## 📱 Navegação

### Páginas Principais
- **Home:** `/` - Página inicial
- **Dashboard:** `/dashboard` - Painel principal (requer login)
- **Projetos:** `/projects` - Gerenciamento de projetos
- **Tarefas:** `/tasks` - Gerenciamento de tarefas com múltiplas visualizações
- **Analytics:** `/analytics` - Dashboard de produtividade
- **Timer:** `/timer` - Timer Pomodoro
- **Demo:** `/demo` - Demonstração das funcionalidades

### Visualizações de Tarefas
No `/tasks`, você pode alternar entre:
1. **Lista** - Visualização em lista tradicional
2. **Kanban** - Board com colunas drag-and-drop
3. **Calendário** - Visualização mensal com prazos
4. **Timeline** - Visualização cronológica

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.4.6** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **@dnd-kit** - Drag and drop para Kanban
- **Recharts** - Gráficos para analytics

### Backend
- **Next.js API Routes** - API backend
- **Prisma ORM** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **NextAuth.js** - Autenticação
- **Zod** - Validação de dados

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar build de produção
npm start

# Linting
npm run lint

# Prisma Studio (visualizar banco)
npx prisma studio
```

## 📁 Estrutura do Projeto

```
MetaAds/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── dev.db                 # Banco SQLite (desenvolvimento)
├── src/
│   ├── app/                   # App Router (Next.js 13+)
│   │   ├── api/              # API Routes
│   │   ├── analytics/        # Dashboard de analytics
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── demo/             # Página de demonstração
│   │   ├── projects/         # Gerenciamento de projetos
│   │   ├── tasks/            # Gerenciamento de tarefas
│   │   └── timer/            # Timer Pomodoro
│   ├── components/           # Componentes React
│   │   ├── tasks/           # Componentes específicos de tarefas
│   │   └── ui/              # Componentes UI base
│   ├── lib/                 # Utilitários e configurações
│   ├── stores/              # Stores Zustand
│   └── types/               # Definições TypeScript
├── .env.local               # Variáveis de ambiente (criar)
└── package.json
```

## 🐛 Troubleshooting

### Erro de Autenticação
Se encontrar erros de "JWEDecryptionFailed":
1. Verifique se o arquivo `.env.local` existe
2. Confirme se `NEXTAUTH_SECRET` está definido
3. Limpe os cookies do navegador
4. Reinicie o servidor de desenvolvimento

### Erro de Banco de Dados
Se encontrar erros relacionados ao Prisma:
```bash
npx prisma generate
npx prisma db push
```

### Erro de Dependências
Se encontrar erros de módulos não encontrados:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte os logs do console do navegador
3. Verifique os logs do servidor no terminal

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**
