import { create } from 'zustand'
import type { Project, ProjectStatus, Priority, ProjectWithTasks } from '../types'

interface ProjectStore {
  projects: ProjectWithTasks[]
  loading: boolean
  error: string | null
  
  fetchProjects: () => Promise<void>
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  updateProjectById: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProjectById: (id: string) => Promise<void>
  
  setProjects: (projects: ProjectWithTasks[]) => void
  addProject: (project: ProjectWithTasks) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  filter: {
    status?: ProjectStatus
    priority?: Priority
    search?: string
  }
  setFilter: (filter: Partial<ProjectStore['filter']>) => void
  
  filteredProjects: () => ProjectWithTasks[]
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  filter: {},
  
  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        set({ projects: data.projects, loading: false })
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to fetch projects', loading: false })
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
    }
  },

  createProject: async (projectData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        const newProject = await response.json()
        set(state => ({
          projects: [newProject, ...state.projects],
          loading: false
        }))
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to create project', loading: false })
        throw new Error(errorData.message || 'Failed to create project')
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
      throw error
    }
  },

  updateProjectById: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        set(state => ({
          projects: state.projects.map(project => 
            project.id === id ? updatedProject : project
          ),
          loading: false
        }))
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to update project', loading: false })
        throw new Error(errorData.message || 'Failed to update project')
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
      throw error
    }
  },

  deleteProjectById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        set(state => ({
          projects: state.projects.filter(project => project.id !== id),
          loading: false
        }))
      } else {
        const errorData = await response.json()
        set({ error: errorData.message || 'Failed to delete project', loading: false })
        throw new Error(errorData.message || 'Failed to delete project')
      }
    } catch (error) {
      set({ error: 'Network error occurred', loading: false })
      throw error
    }
  },
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    )
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter }
  })),
  
  filteredProjects: () => {
    const { projects, filter } = get()
    
    return projects.filter(project => {
      if (filter.status && project.status !== filter.status) return false
      if (filter.priority && project.priority !== filter.priority) return false
      if (filter.search && !project.title.toLowerCase().includes(filter.search.toLowerCase())) return false
      
      return true
    })
  }
}))
