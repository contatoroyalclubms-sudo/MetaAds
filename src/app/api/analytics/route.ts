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
      totalTasks,
      completedTasks,
      totalProjects,
      pendingTasks,
      inProgressTasks,
      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      timeEntries
    ] = await Promise.all([
      prisma.task.count({
        where: { userId: user.id }
      }),
      prisma.task.count({
        where: { 
          userId: user.id,
          status: 'COMPLETED'
        }
      }),
      prisma.project.count({
        where: { userId: user.id }
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
      prisma.task.count({
        where: { 
          userId: user.id,
          priority: 'LOW'
        }
      }),
      prisma.task.count({
        where: { 
          userId: user.id,
          priority: 'MEDIUM'
        }
      }),
      prisma.task.count({
        where: { 
          userId: user.id,
          priority: 'HIGH'
        }
      }),
      prisma.timeEntry.aggregate({
        where: { userId: user.id },
        _sum: { duration: true }
      })
    ])

    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    const productivityData = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as created,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
      FROM Task 
      WHERE userId = ${user.id} 
        AND createdAt >= ${last30Days}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    ` as Array<{ date: string; created: bigint; completed: bigint }>

    const timeByProject = await prisma.$queryRaw`
      SELECT 
        p.id as projectId,
        p.title as projectTitle,
        COALESCE(SUM(te.duration), 0) as totalTime
      FROM Project p
      LEFT JOIN Task t ON t.projectId = p.id
      LEFT JOIN TimeEntry te ON te.taskId = t.id
      WHERE p.userId = ${user.id}
      GROUP BY p.id, p.title
      HAVING totalTime > 0
      ORDER BY totalTime DESC
    ` as Array<{ projectId: string; projectTitle: string; totalTime: bigint }>

    const analytics = {
      totalTasks,
      completedTasks,
      totalProjects,
      totalTimeSpent: timeEntries._sum.duration || 0,
      tasksByStatus: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks
      },
      tasksByPriority: {
        low: lowPriorityTasks,
        medium: mediumPriorityTasks,
        high: highPriorityTasks
      },
      productivityTrend: productivityData.map(item => ({
        date: new Date(item.date).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        created: Number(item.created),
        completed: Number(item.completed)
      })),
      timeByProject: timeByProject.map(item => ({
        projectId: item.projectId,
        projectTitle: item.projectTitle,
        totalTime: Number(item.totalTime)
      }))
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
