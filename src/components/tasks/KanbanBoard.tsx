'use client'

import React from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'
import type { TaskWithProject, TaskStatus } from '@/types'
import { formatDate } from '@/lib/utils'

interface KanbanBoardProps {
  tasks: TaskWithProject[]
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void
}

interface KanbanColumnProps {
  title: string
  status: TaskStatus
  tasks: TaskWithProject[]
  count: number
}

interface TaskCardProps {
  task: TaskWithProject
}

const statusConfig = {
  PENDING: {
    title: 'Pendente',
    color: 'bg-gray-100 border-gray-200',
    badgeColor: 'bg-gray-500'
  },
  IN_PROGRESS: {
    title: 'Em Progresso',
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-500'
  },
  COMPLETED: {
    title: 'Concluído',
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-500'
  }
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800'
}

function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const totalTime = task.timeEntries.reduce((sum, entry) => sum + entry.duration, 0)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
              <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                {task.priority === 'LOW' ? 'Baixa' : task.priority === 'MEDIUM' ? 'Média' : 'Alta'}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
            )}
            
            {task.project && (
              <div className="flex items-center text-xs text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {task.project.title}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              {task.deadline && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(task.deadline)}
                </div>
              )}
              
              {totalTime > 0 && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.round(totalTime / 60)}h
                </div>
              )}
            </div>
            
            {task.subtasks.length > 0 && (
              <div className="text-xs text-gray-500">
                Subtarefas: {task.subtasks.filter(st => st.status === 'COMPLETED').length}/{task.subtasks.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KanbanColumn({ title, status, tasks, count }: KanbanColumnProps) {
  const config = statusConfig[status]
  
  return (
    <div className={`rounded-lg border-2 ${config.color} p-4 min-h-[600px]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Badge className={`${config.badgeColor} text-white`}>
          {count}
        </Badge>
      </div>
      
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default function KanbanBoard({ tasks, onTaskStatusChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<TaskWithProject | null>(null)

  const tasksByStatus = {
    PENDING: tasks.filter(task => task.status === 'PENDING'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    COMPLETED: tasks.filter(task => task.status === 'COMPLETED')
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    if (newStatus !== activeTask?.status) {
      onTaskStatusChange(taskId, newStatus)
    }

    setActiveTask(null)
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div id="PENDING">
          <KanbanColumn
            title={statusConfig.PENDING.title}
            status="PENDING"
            tasks={tasksByStatus.PENDING}
            count={tasksByStatus.PENDING.length}
          />
        </div>
        
        <div id="IN_PROGRESS">
          <KanbanColumn
            title={statusConfig.IN_PROGRESS.title}
            status="IN_PROGRESS"
            tasks={tasksByStatus.IN_PROGRESS}
            count={tasksByStatus.IN_PROGRESS.length}
          />
        </div>
        
        <div id="COMPLETED">
          <KanbanColumn
            title={statusConfig.COMPLETED.title}
            status="COMPLETED"
            tasks={tasksByStatus.COMPLETED}
            count={tasksByStatus.COMPLETED.length}
          />
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
