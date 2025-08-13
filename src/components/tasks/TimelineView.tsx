'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'
import type { TaskWithProject } from '@/types'
import { formatDate, formatDateTime } from '@/lib/utils'

interface TimelineViewProps {
  tasks: TaskWithProject[]
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-red-100 text-red-800 border-red-200'
}

const statusColors = {
  PENDING: 'bg-gray-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500'
}

export default function TimelineView({ tasks }: TimelineViewProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = a.deadline || a.createdAt
    const dateB = b.deadline || b.createdAt
    return new Date(dateA).getTime() - new Date(dateB).getTime()
  })

  const groupTasksByMonth = (tasks: TaskWithProject[]) => {
    const groups: { [key: string]: TaskWithProject[] } = {}
    
    tasks.forEach(task => {
      const date = new Date(task.deadline || task.createdAt)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long' 
      })
      
      if (!groups[monthName]) {
        groups[monthName] = []
      }
      groups[monthName].push(task)
    })
    
    return groups
  }

  const taskGroups = groupTasksByMonth(sortedTasks)

  const getTaskDuration = (task: TaskWithProject) => {
    if (task.completedAt && task.createdAt) {
      const start = new Date(task.createdAt)
      const end = new Date(task.completedAt)
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return null
  }

  const getTaskProgress = (task: TaskWithProject) => {
    if (task.status === 'COMPLETED') return 100
    if (task.status === 'IN_PROGRESS') return 50
    return 0
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Timeline das Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(taskGroups).map(([monthName, monthTasks]) => (
              <div key={monthName} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  {monthName}
                </h3>
                
                <div className="space-y-4">
                  {monthTasks.map((task, index) => {
                    const duration = getTaskDuration(task)
                    const progress = getTaskProgress(task)
                    
                    return (
                      <div key={task.id} className="relative">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div 
                              className={`w-4 h-4 rounded-full ${statusColors[task.status]} border-2 border-white shadow-md`}
                            />
                            {index < monthTasks.length - 1 && (
                              <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 truncate">
                                        {task.title}
                                      </h4>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>
                                    <Badge className={`ml-2 ${priorityColors[task.priority]}`}>
                                      {task.priority === 'LOW' ? 'Baixa' : 
                                       task.priority === 'MEDIUM' ? 'Média' : 'Alta'}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-4">
                                      {task.project && (
                                        <div className="flex items-center">
                                          <User className="h-4 w-4 mr-1" />
                                          {task.project.title}
                                        </div>
                                      )}
                                      
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
                                    
                                    <div className="text-right">
                                      <div className="text-xs font-medium">
                                        {task.status === 'PENDING' ? 'Pendente' : 
                                         task.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Concluído'}
                                      </div>
                                      {duration && (
                                        <div className="text-xs text-gray-400">
                                          {duration} dia{duration !== 1 ? 's' : ''}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span>Progresso</span>
                                      <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                          task.status === 'COMPLETED' ? 'bg-green-500' :
                                          task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-400'
                                        }`}
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                  
                                  {task.subtasks.length > 0 && (
                                    <div className="text-xs text-gray-500">
                                      Subtarefas: {task.subtasks.filter(st => st.status === 'COMPLETED').length}/{task.subtasks.length} concluídas
                                    </div>
                                  )}
                                  
                                  {task.completedAt && (
                                    <div className="text-xs text-green-600">
                                      Concluído em: {formatDateTime(task.completedAt)}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            
            {sortedTasks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma tarefa para exibir na timeline</p>
                <p className="text-sm">Crie tarefas para visualizar o progresso</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
