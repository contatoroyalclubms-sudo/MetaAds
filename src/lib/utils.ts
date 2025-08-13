import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  
  if (isToday(d)) {
    return `Today at ${format(d, 'HH:mm')}`
  }
  
  if (isTomorrow(d)) {
    return `Tomorrow at ${format(d, 'HH:mm')}`
  }
  
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'HH:mm')}`
  }
  
  return format(d, 'MMM dd, yyyy')
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}m`
  }
  
  return `${hours}h ${mins}m`
}

export function getPriorityColor(priority: 'LOW' | 'MEDIUM' | 'HIGH') {
  switch (priority) {
    case 'HIGH':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'LOW':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getStatusColor(status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED') {
  switch (status) {
    case 'COMPLETED':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'IN_PROGRESS':
    case 'ACTIVE':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'PENDING':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'PAUSED':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'ARCHIVED':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
