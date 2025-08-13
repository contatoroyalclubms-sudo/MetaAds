import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  deadline: z.string().optional(),
  projectId: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
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
            priority: true,
            deadline: true,
          }
        },
        parentTask: {
          select: {
            id: true,
            title: true,
          }
        },
        timeEntries: {
          select: {
            id: true,
            duration: true,
            date: true,
          }
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            url: true,
            size: true,
            type: true,
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Task fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateTaskSchema.parse(body)

    const updateData: any = { ...validatedData }

    if (validatedData.deadline) {
      updateData.deadline = new Date(validatedData.deadline)
    }

    if (validatedData.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      updateData.completedAt = new Date()
    } else if (validatedData.status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
      updateData.completedAt = null
    }

    if (validatedData.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: validatedData.projectId,
          userId: user.id
        }
      })

      if (!project) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 })
      }
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error('Task update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Task deletion error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
