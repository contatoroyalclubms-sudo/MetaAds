'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/stores/projectStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Target,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'
import type { ProjectWithTasks } from '@/types/index'

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { 
    projects, 
    loading, 
    error, 
    filter, 
    setProjects, 
    setLoading, 
    setError, 
    setFilter, 
    filteredProjects 
  } = useProjectStore()

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetchProjects()
  }, [status, router])

  useEffect(() => {
    setFilter({ search: searchTerm })
  }, [searchTerm, setFilter])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      } else {
        setError('Failed to fetch projects')
      }
    } catch (error) {
      setError('An error occurred while fetching projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProjects() // Refresh the list
      } else {
        setError('Failed to delete project')
      }
    } catch (error) {
      setError('An error occurred while deleting the project')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const displayedProjects = filteredProjects()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-blue-600 hover:text-blue-700 mr-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
            </div>
            <Button onClick={() => router.push('/projects/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'No projects match your search criteria.' : 'Get started by creating your first project.'}
              </p>
              <Button onClick={() => router.push('/projects/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/projects/${project.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Status and Priority */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>

                    {/* Task Count */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="h-4 w-4 mr-1" />
                      {project._count?.tasks || 0} tasks
                    </div>

                    {/* Deadline */}
                    {project.deadline && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due {formatDate(project.deadline)}
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Created {formatDate(project.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                      <Button 
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="w-full"
                        size="sm"
                      >
                        View Project
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
