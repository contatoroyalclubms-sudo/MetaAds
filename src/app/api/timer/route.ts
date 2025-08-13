import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const timerSessionSchema = z.object({
  taskId: z.string().optional(),
  duration: z.number().min(1),
  type: z.enum(['WORK', 'BREAK']),
})

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
    const { taskId, duration, type } = timerSessionSchema.parse(body)

    if (taskId) {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId: user.id
        }
      })

      if (!task) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 })
      }

      const timeEntry = await prisma.timeEntry.create({
        data: {
          duration,
          userId: user.id,
          taskId: taskId,
        }
      })

      return NextResponse.json(timeEntry, { status: 201 })
    }

    return NextResponse.json({ message: 'Timer session recorded' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error('Timer session error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayTimeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        task: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    const totalTime = todayTimeEntries.reduce((sum, entry) => sum + entry.duration, 0)
    const sessionCount = todayTimeEntries.length

    return NextResponse.json({
      totalTime,
      sessionCount,
      entries: todayTimeEntries
    })
  } catch (error) {
    console.error('Timer stats error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
