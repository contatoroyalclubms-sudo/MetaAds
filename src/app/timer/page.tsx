'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Square, RotateCcw, Clock, Coffee } from 'lucide-react'
import type { Task } from '@/types'

type TimerType = 'WORK' | 'BREAK'
type TimerStatus = 'idle' | 'running' | 'paused'

const WORK_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60
const LONG_BREAK_DURATION = 15 * 60

export default function TimerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [timerType, setTimerType] = useState<TimerType>('WORK')
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle')
  const [selectedTaskId, setSelectedTaskId] = useState<string>('none')
  const [sessionCount, setSessionCount] = useState(0)
  const [totalTimeToday, setTotalTimeToday] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    fetchTasks()
  }, [status, router])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerStatus === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerStatus === 'running') {
      handleTimerComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerStatus, timeLeft])

  const handleTimerComplete = async () => {
    setTimerStatus('idle')
    
    if (timerType === 'WORK') {
      setSessionCount(prev => prev + 1)
      setTotalTimeToday(prev => prev + WORK_DURATION)
      
      if (selectedTaskId && selectedTaskId !== 'none') {
        await saveTimeEntry(selectedTaskId, WORK_DURATION)
      }
      
      const nextBreakDuration = (sessionCount + 1) % 4 === 0 ? LONG_BREAK_DURATION : BREAK_DURATION
      setTimerType('BREAK')
      setTimeLeft(nextBreakDuration)
    } else {
      setTimerType('WORK')
      setTimeLeft(WORK_DURATION)
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        timerType === 'WORK' ? 'Hora do intervalo!' : 'Hora de trabalhar!',
        {
          body: timerType === 'WORK' 
            ? 'Você completou uma sessão de trabalho. Faça uma pausa!'
            : 'Intervalo terminado. Hora de voltar ao trabalho!',
          icon: '/favicon.ico'
        }
      )
    }
  }

  const saveTimeEntry = async (taskId: string, duration: number) => {
    try {
      await fetch('/api/timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          duration: Math.floor(duration / 60),
          type: 'WORK'
        }),
      })
    } catch (error) {
      console.error('Error saving time entry:', error)
    }
  }

  const startTimer = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
    setTimerStatus('running')
  }

  const pauseTimer = () => {
    setTimerStatus('paused')
  }

  const stopTimer = () => {
    setTimerStatus('idle')
    resetTimer()
  }

  const resetTimer = () => {
    const duration = timerType === 'WORK' ? WORK_DURATION : 
                    (sessionCount % 4 === 3 ? LONG_BREAK_DURATION : BREAK_DURATION)
    setTimeLeft(duration)
  }

  const switchTimerType = (type: TimerType) => {
    setTimerStatus('idle')
    setTimerType(type)
    const duration = type === 'WORK' ? WORK_DURATION : 
                    (sessionCount % 4 === 3 ? LONG_BREAK_DURATION : BREAK_DURATION)
    setTimeLeft(duration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const progress = timerType === 'WORK' 
    ? ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100
    : ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Timer Pomodoro</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button
                    variant={timerType === 'WORK' ? 'default' : 'outline'}
                    onClick={() => switchTimerType('WORK')}
                    disabled={timerStatus === 'running'}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Trabalho
                  </Button>
                  <Button
                    variant={timerType === 'BREAK' ? 'default' : 'outline'}
                    onClick={() => switchTimerType('BREAK')}
                    disabled={timerStatus === 'running'}
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Intervalo
                  </Button>
                </div>
                <CardTitle className="text-6xl font-mono">
                  {formatTime(timeLeft)}
                </CardTitle>
                <CardDescription>
                  {timerType === 'WORK' ? 'Sessão de Trabalho' : 'Intervalo'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        timerType === 'WORK' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {timerType === 'WORK' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tarefa (opcional)</label>
                      <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma tarefa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma tarefa</SelectItem>
                          {tasks.filter(task => task.status !== 'COMPLETED').map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    {timerStatus === 'idle' || timerStatus === 'paused' ? (
                      <Button onClick={startTimer} size="lg">
                        <Play className="h-5 w-5 mr-2" />
                        {timerStatus === 'paused' ? 'Continuar' : 'Iniciar'}
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} size="lg" variant="outline">
                        <Pause className="h-5 w-5 mr-2" />
                        Pausar
                      </Button>
                    )}
                    
                    <Button onClick={stopTimer} size="lg" variant="outline">
                      <Square className="h-5 w-5 mr-2" />
                      Parar
                    </Button>
                    
                    <Button onClick={resetTimer} size="lg" variant="outline">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Resetar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sessões Completas</span>
                    <Badge variant="secondary">{sessionCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tempo Total</span>
                    <Badge variant="secondary">{formatDuration(totalTimeToday)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Próximo Intervalo</span>
                    <Badge variant="outline">
                      {(sessionCount + 1) % 4 === 0 ? 'Longo (15min)' : 'Curto (5min)'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Trabalhe por 25 minutos com foco total</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Faça uma pausa de 5 minutos</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p>A cada 4 sessões, faça uma pausa longa de 15 minutos</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Associe sessões a tarefas para rastrear tempo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
