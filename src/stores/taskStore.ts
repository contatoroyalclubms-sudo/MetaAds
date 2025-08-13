import { create } from 'zustand'
import type { Task, TaskStatus, Priority, TaskWithProject } from '../types'

interface TaskStore {
  tasks: TaskWithProject[]
  loading: boolean
  error: string | null
  
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  updateTaskById: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTaskById: (id: string) => Promise<void>
  
  setTasks: (tasks: TaskWithProject[]) => void
  addTask: (task: TaskWithProject) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  filter: {
    status?: TaskStatus
    priority?: Priority
    projectId?: string
    search?: string
  }
  setFilter: (filter: Partial<TaskStore['filter']>) => void
  
  filteredTasks: () => TaskWithProject[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filter: {},
  
  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const tasks = await response.json()
        set({ tasks, loading: false })
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to fetch tasks', loading: false })
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        set(state => ({
          tasks: [newTask, ...state.tasks],
          loading: false
        }))
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to create task', loading: false })
        throw new Error(errorData.message || 'Failed to create task')
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
      throw error
    }
  },

  updateTaskById: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? updatedTask : task
          ),
          loading: false
        }))
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to update task', loading: false })
        throw new Error(errorData.message || 'Failed to update task')
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
      throw error
    }
  },

  deleteTaskById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id),
          loading: false
        }))
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to delete task', loading: false })
        throw new Error(errorData.message || 'Failed to delete task')
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
      throw error
    }
  },
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter }
  })),
  
  filteredTasks: () => {
    const { tasks, filter } = get()
    
    return tasks.filter(task => {
      if (filter.status && task.status !== filter.status) return false
      if (filter.priority && task.priority !== filter.priority) return false
      if (filter.projectId && task.projectId !== filter.projectId) return false
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false
      
      return true
    })
  }
}))
