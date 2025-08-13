'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import type { TaskWithProject } from '@/types'
import { formatDate } from '@/lib/utils'

interface CalendarViewProps {
  tasks: TaskWithProject[]
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-red-100 text-red-800 border-red-200'
}

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800'
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getTasksForDate = (date: number) => {
    const targetDate = new Date(year, month, date)
    return tasks.filter(task => {
      if (!task.deadline) return false
      const taskDate = new Date(task.deadline)
      return (
        taskDate.getDate() === targetDate.getDate() &&
        taskDate.getMonth() === targetDate.getMonth() &&
        taskDate.getFullYear() === targetDate.getFullYear()
      )
    })
  }

  const renderCalendarDays = () => {
    const days = []
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-gray-200 bg-gray-50"></div>
      )
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const dayTasks = getTasksForDate(date)
      const isToday = new Date().toDateString() === new Date(year, month, date).toDateString()
      
      days.push(
        <div
          key={date}
          className={`h-32 border border-gray-200 p-2 overflow-y-auto ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {date}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded border ${priorityColors[task.priority]} cursor-pointer hover:shadow-sm`}
                title={task.description || ''}
              >
                <div className="font-medium truncate">{task.title}</div>
                {task.project && (
                  <div className="text-xs opacity-75 truncate">{task.project.title}</div>
                )}
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayTasks.length - 3} mais
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const upcomingTasks = tasks
    .filter(task => task.deadline && new Date(task.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-0">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="h-10 border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-700"
                  >
                    {day}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximas Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma tarefa com prazo definido</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          {task.project && (
                            <p className="text-xs text-gray-500 truncate">{task.project.title}</p>
                          )}
                        </div>
                        <Badge className={`ml-2 ${priorityColors[task.priority]}`}>
                          {task.priority === 'LOW' ? 'Baixa' : task.priority === 'MEDIUM' ? 'Média' : 'Alta'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {formatDate(task.deadline!)}
                        </span>
                        <Badge className={statusColors[task.status]}>
                          {task.status === 'PENDING' ? 'Pendente' : 
                           task.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Concluído'}
                        </Badge>
                      </div>
                      <hr className="border-gray-200" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
