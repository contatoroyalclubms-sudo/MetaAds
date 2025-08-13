import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, BarChart3, Users, Calendar, ArrowRight, Play, Target, LayoutGrid, TrendingUp } from "lucide-react"

const demoProjects = [
  {
    id: '1',
    title: 'Redesign do Website',
    description: 'Modernizar a interface e melhorar a experiência do usuário',
    status: 'ACTIVE',
    priority: 'HIGH',
    tasksCount: 12,
    completedTasks: 8,
    deadline: '2024-09-15'
  },
  {
    id: '2',
    title: 'App Mobile',
    description: 'Desenvolvimento do aplicativo móvel para iOS e Android',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    tasksCount: 24,
    completedTasks: 15,
    deadline: '2024-10-30'
  },
  {
    id: '3',
    title: 'Sistema de Analytics',
    description: 'Implementar dashboard de métricas e relatórios',
    status: 'COMPLETED',
    priority: 'LOW',
    tasksCount: 8,
    completedTasks: 8,
    deadline: '2024-08-20'
  }
]

const demoTasks = [
  {
    id: '1',
    title: 'Criar wireframes das páginas principais',
    status: 'COMPLETED',
    priority: 'HIGH',
    project: 'Redesign do Website'
  },
  {
    id: '2',
    title: 'Implementar autenticação OAuth',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    project: 'App Mobile'
  },
  {
    id: '3',
    title: 'Configurar banco de dados',
    status: 'PENDING',
    priority: 'HIGH',
    project: 'Sistema de Analytics'
  },
  {
    id: '4',
    title: 'Testes de usabilidade',
    status: 'PENDING',
    priority: 'LOW',
    project: 'Redesign do Website'
  }
]

const statusColors = {
  ACTIVE: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  PENDING: 'bg-gray-100 text-gray-800'
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800'
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow Pro - Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Fazer Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Explore o TaskFlow Pro em Ação
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja como nossa plataforma pode transformar sua produtividade com exemplos reais de projetos e tarefas.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 em andamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">44</div>
                <p className="text-xs text-muted-foreground">
                  31 concluídas (70%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Registrado</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127h</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+23%</div>
                <p className="text-xs text-muted-foreground">
                  vs. mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Projetos em Destaque</h3>
              <Badge variant="outline" className="text-sm">
                Demo - Dados de Exemplo
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                        {project.priority === 'LOW' ? 'Baixa' : 
                         project.priority === 'MEDIUM' ? 'Média' : 'Alta'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">
                          {project.completedTasks}/{project.tasksCount} tarefas
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(project.completedTasks / project.tasksCount) * 100}%` 
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                          {project.status === 'ACTIVE' ? 'Ativo' :
                           project.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Concluído'}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(project.deadline).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Tarefas Recentes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                          {task.priority === 'LOW' ? 'Baixa' : 
                           task.priority === 'MEDIUM' ? 'Média' : 'Alta'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {task.project}
                        </div>
                        <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                          {task.status === 'PENDING' ? 'Pendente' :
                           task.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Concluído'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Demo */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Recursos Principais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Kanban Board</CardTitle>
                  <CardDescription>
                    Visualize e organize suas tarefas com drag & drop
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Play className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Timer Pomodoro</CardTitle>
                  <CardDescription>
                    Aumente sua produtividade com sessões focadas
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Acompanhe seu progresso com relatórios detalhados
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para aumentar sua produtividade?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já transformaram seu fluxo de trabalho com o TaskFlow Pro.
              Comece gratuitamente hoje mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
