'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Calendar, Clock, Edit, Trash2, Plus, BarChart3, Target, CheckCircle } from 'lucide-react'
import type { ProjectWithTasks, TaskWithProject } from '@/types'
import { formatDate, formatDuration } from '@/lib/utils'
import Link from 'next/link'

interface ProjectDetailPageProps {
  params: { id: string }
}

const statusColors = {
  ACTIVE: 'bg-blue-100 text-blue-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800'
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800'
}

const taskStatusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800'
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<ProjectWithTasks | null>(null)
  const [tasks, setTasks] = useState<TaskWithProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    fetchProject()
    fetchProjectTasks()
  }, [status, router, params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        setError('Projeto não encontrado')
      }
    } catch (error) {
      setError('Erro ao carregar projeto')
    }
  }

  const fetchProjectTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async () => {
    if (!confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/projects')
      } else {
        setError('Erro ao excluir projeto')
      }
    } catch (error) {
      setError('Erro ao excluir projeto')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Projeto não encontrado'}</p>
          <Button onClick={() => router.push('/projects')} className="mt-4">
            Voltar aos Projetos
          </Button>
        </div>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const totalTimeSpent = tasks.reduce((sum, task) => 
    sum + task.timeEntries.reduce((taskSum, entry) => taskSum + entry.duration, 0), 0
  )

  const tasksByStatus = {
    PENDING: tasks.filter(task => task.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter(task => task.status === 'COMPLETED').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => router.push('/projects')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Projetos
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{project.title}</CardTitle>
                      {project.description && (
                        <CardDescription className="text-base">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={deleteProject}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={statusColors[project.status]}>
                        {project.status === 'ACTIVE' ? 'Ativo' :
                         project.status === 'PAUSED' ? 'Pausado' :
                         project.status === 'COMPLETED' ? 'Concluído' : 'Arquivado'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Prioridade</p>
                      <Badge className={priorityColors[project.priority]}>
                        {project.priority === 'LOW' ? 'Baixa' :
                         project.priority === 'MEDIUM' ? 'Média' : 'Alta'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Criado em</p>
                      <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
                    </div>
                    {project.deadline && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Prazo</p>
                        <p className="text-sm font-medium">{formatDate(project.deadline)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total de Tarefas</span>
                      <Badge variant="secondary">{totalTasks}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Concluídas</span>
                      <Badge variant="secondary">{completedTasks}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                      <Badge variant="secondary">{completionRate}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tempo Total</span>
                      <Badge variant="secondary">{formatDuration(totalTimeSpent * 60)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Conclusão Geral</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
                          Pendente
                        </span>
                        <span>{tasksByStatus.PENDING}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                          Em Progresso
                        </span>
                        <span>{tasksByStatus.IN_PROGRESS}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                          Concluído
                        </span>
                        <span>{tasksByStatus.COMPLETED}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tarefas do Projeto</h3>
                <Link href={`/tasks/new?projectId=${project.id}`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </Link>
              </div>

              {tasks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-4">Nenhuma tarefa criada ainda</p>
                    <Link href={`/tasks/new?projectId=${project.id}`}>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar primeira tarefa
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <Link href={`/tasks/${task.id}`}>
                                <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                  {task.title}
                                </h4>
                              </Link>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Badge className={priorityColors[task.priority]}>
                                {task.priority === 'LOW' ? 'Baixa' :
                                 task.priority === 'MEDIUM' ? 'Média' : 'Alta'}
                              </Badge>
                              <Badge className={taskStatusColors[task.status]}>
                                {task.status === 'PENDING' ? 'Pendente' :
                                 task.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Concluído'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Criado: {formatDate(task.createdAt)}
                              </div>
                              {task.deadline && (
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Prazo: {formatDate(task.deadline)}
                                </div>
                              )}
                            </div>
                            
                            {task.timeEntries.length > 0 && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDuration(task.timeEntries.reduce((sum, entry) => sum + entry.duration, 0) * 60)}
                              </div>
                            )}
                          </div>
                          
                          {task.subtasks.length > 0 && (
                            <div className="text-sm text-gray-500">
                              Subtarefas: {task.subtasks.filter(st => st.status === 'COMPLETED').length}/{task.subtasks.length} concluídas
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline do Projeto</CardTitle>
                  <CardDescription>
                    Histórico de atividades e marcos importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                        <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          Projeto criado
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(project.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {tasks.filter(task => task.status === 'COMPLETED').map((task, index) => (
                      <div key={task.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md" />
                          {index < tasks.filter(t => t.status === 'COMPLETED').length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            Tarefa concluída: {task.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.completedAt ? formatDate(task.completedAt) : 'Data não disponível'}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {tasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma atividade registrada ainda</p>
                        <p className="text-sm">Crie tarefas para ver o progresso do projeto</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
