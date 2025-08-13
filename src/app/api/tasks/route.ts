import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  deadline: z.string().optional(),
  projectId: z.string().optional(),
  parentId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const where: any = {
      userId: user.id,
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          }
        },
        subtasks: {
          select: {
            id: true,
            title: true,
            status: true,
          }
        },
        timeEntries: {
          select: {
            duration: true,
          }
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            url: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Tasks fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, priority, deadline, projectId, parentId } = taskSchema.parse(body)

    const taskData: any = {
      title,
      description,
      priority,
      userId: user.id,
    }

    if (deadline) {
      taskData.deadline = new Date(deadline)
    }

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: user.id
        }
      })

      if (!project) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 })
      }

      taskData.projectId = projectId
    }

    if (parentId) {
      const parentTask = await prisma.task.findFirst({
        where: {
          id: parentId,
          userId: user.id
        }
      })

      if (!parentTask) {
        return NextResponse.json({ message: 'Parent task not found' }, { status: 404 })
      }

      taskData.parentId = parentId
    }

    const task = await prisma.task.create({
      data: taskData,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          }
        },
        subtasks: {
          select: {
            id: true,
            title: true,
            status: true,
          }
        }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error('Task creation error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
