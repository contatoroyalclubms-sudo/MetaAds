# 🚀 TaskFlow Pro - Sistema de Gerenciamento de Tarefas e Projetos

Uma aplicação web completa para gerenciamento de tarefas e projetos com funcionalidades avançadas de produtividade.

![TaskFlow Pro](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Funcionalidades

### 🎯 Funcionalidades Principais
- **Dashboard Interativo** - Visão geral com métricas e estatísticas em tempo real
- **Gerenciamento de Projetos** - CRUD completo com status e prioridades
- **Gerenciamento de Tarefas** - Sistema completo de tarefas com subtarefas
- **Autenticação Segura** - Login/registro com NextAuth.js

### 🚀 Funcionalidades Avançadas
- **📊 Dashboard de Analytics** - Métricas de produtividade com gráficos interativos
- **🍅 Timer Pomodoro** - Timer integrado com rastreamento de sessões por tarefa
- **📋 Board Kanban** - Visualização drag-and-drop das tarefas por status
- **📅 Visualização de Calendário** - Calendário mensal com prazos de tarefas
- **📈 Timeline/Gantt** - Visualização cronológica de projetos e tarefas
- **🎯 Página Demo** - Showcase das funcionalidades sem necessidade de login

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- npm, yarn ou pnpm
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/contatoroyalclubms-sudo/MetaAds.git
cd MetaAds
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXTAUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-for-security
NEXTAUTH_URL=http://localhost:3000
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Execute o projeto**
```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 🔐 Credenciais de Teste

Para testar a aplicação:
- **Email:** test@example.com
- **Senha:** password123

## 🎨 Tecnologias

### Frontend
- **Next.js 15.4.6** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **Framer Motion** - Animações fluidas
- **Zustand** - Gerenciamento de estado
- **@dnd-kit** - Drag and drop para Kanban
- **Recharts** - Gráficos interativos

### Backend
- **Next.js API Routes** - API backend integrada
- **Prisma ORM** - ORM moderno para TypeScript
- **SQLite** - Banco de dados (desenvolvimento)
- **NextAuth.js** - Autenticação completa
- **Zod** - Validação de esquemas

## 📱 Navegação

### Páginas Principais
- **`/`** - Página inicial com apresentação
- **`/dashboard`** - Painel principal (requer login)
- **`/projects`** - Gerenciamento de projetos
- **`/tasks`** - Gerenciamento de tarefas com múltiplas visualizações
- **`/analytics`** - Dashboard de produtividade
- **`/timer`** - Timer Pomodoro integrado
- **`/demo`** - Demonstração sem necessidade de login

### Visualizações de Tarefas
No `/tasks`, alterne entre:
1. **📋 Lista** - Visualização tradicional em lista
2. **🎯 Kanban** - Board com colunas drag-and-drop
3. **📅 Calendário** - Visualização mensal com prazos
4. **📈 Timeline** - Visualização cronológica

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm start        # Executar build de produção
npm run lint     # Verificar código
npx prisma studio # Visualizar banco de dados
```

## 📁 Estrutura do Projeto

```
MetaAds/
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── dev.db                 # Banco SQLite
├── src/
│   ├── app/                   # App Router (Next.js 13+)
│   │   ├── api/              # API Routes
│   │   ├── analytics/        # Dashboard analytics
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── demo/             # Página demo
│   │   ├── projects/         # Gerenciamento projetos
│   │   ├── tasks/            # Gerenciamento tarefas
│   │   └── timer/            # Timer Pomodoro
│   ├── components/           # Componentes React
│   │   ├── tasks/           # Componentes de tarefas
│   │   └── ui/              # Componentes UI base
│   ├── lib/                 # Utilitários
│   ├── stores/              # Stores Zustand
│   └── types/               # Tipos TypeScript
├── .env.local               # Variáveis ambiente
├── SETUP.md                 # Instruções detalhadas
└── README.md               # Este arquivo
```

## 🐛 Troubleshooting

### Erro de Autenticação
Se encontrar "JWEDecryptionFailed":
1. Verifique se `.env.local` existe
2. Confirme se `NEXTAUTH_SECRET` está definido
3. Limpe cookies do navegador
4. Reinicie o servidor

### Erro de Banco
```bash
npx prisma generate
npx prisma db push
```

### Erro de Dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📖 Documentação

- **[SETUP.md](./SETUP.md)** - Instruções detalhadas de instalação
- **[Pull Request](https://github.com/contatoroyalclubms-sudo/MetaAds/pull/1)** - Detalhes das funcionalidades implementadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**
