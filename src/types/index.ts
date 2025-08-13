export interface TimerSession {
  id: string
  type: 'WORK' | 'BREAK'
  duration: number
  startTime: Date
  endTime?: Date | null
  completed: boolean
  userId: string
  taskId?: string | null
}

export interface AnalyticsData {
  totalTasks: number
  completedTasks: number
  totalProjects: number
  totalTimeSpent: number
  tasksByStatus: {
    pending: number
    inProgress: number
    completed: number
  }
  tasksByPriority: {
    low: number
    medium: number
    high: number
  }
  productivityTrend: {
    date: string
    completed: number
    created: number
  }[]
  timeByProject: {
    projectId: string
    projectTitle: string
    totalTime: number
  }[]
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'task' | 'project'
  status: TaskStatus | ProjectStatus
  priority: Priority
}

export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type ViewMode = 'list' | 'grid' | 'kanban' | 'calendar' | 'timeline'

export interface User {
  id: string
  name?: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  description?: string | null
  status: ProjectStatus
  priority: Priority
  deadline?: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  deadline?: Date | null
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
  projectId?: string | null
  parentId?: string | null
}

export interface TimeEntry {
  id: string
  duration: number
  date: Date
  userId: string
  taskId: string
}

export interface Attachment {
  id: string
  filename: string
  url: string
  size: number
  type: string
  taskId: string
}

export type ProjectWithTasks = Project & {
  tasks: Task[]
  _count: {
    tasks: number
  }
}

export type TaskWithProject = Task & {
  project?: Project | null
  subtasks: Task[]
  timeEntries: TimeEntry[]
  attachments: Attachment[]
}

export type UserWithStats = User & {
  _count: {
    projects: number
    tasks: number
  }
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  totalTimeSpent: number
}

export interface ProductivityData {
  date: string
  tasksCompleted: number
  timeSpent: number
}
