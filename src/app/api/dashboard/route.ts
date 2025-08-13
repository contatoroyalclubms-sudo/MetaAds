import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    const [
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      timeEntries
    ] = await Promise.all([
      prisma.project.count({
        where: { userId: user.id }
      }),
      prisma.task.count({
        where: { userId: user.id }
      }),
      prisma.task.count({
        where: { 
          userId: user.id,
          status: 'COMPLETED'
        }
      }),
      prisma.task.count({
        where: { 
          userId: user.id,
          status: 'PENDING'
        }
      }),
      prisma.task.count({
        where: { 
          userId: user.id,
          status: 'IN_PROGRESS'
        }
      }),
      prisma.timeEntry.aggregate({
        where: { userId: user.id },
        _sum: { duration: true }
      })
    ])

    const stats = {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      totalTimeSpent: timeEntries._sum.duration || 0
    }

    const recentProjects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    })

    const recentTasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      stats,
      recentProjects,
      recentTasks
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
