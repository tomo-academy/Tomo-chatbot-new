'use client'

import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TomoAvatarProps {
  className?: string
  alt?: string
}

export function TomoAvatar({ 
  className,
  alt = 'TOMO AI BUDDY' 
}: TomoAvatarProps) {
  return (
    <Avatar className={cn('size-6 ring-2 ring-gradient-to-r from-blue-500/30 to-purple-600/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300', className)}>
      <AvatarImage 
        src="/images/tomo-the-hub.png" 
        alt={alt}
        className="object-cover hover:brightness-110 transition-all duration-300"
      />
      <AvatarFallback>
        <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white text-xs font-bold shadow-inner">
          AI
        </div>
      </AvatarFallback>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </Avatar>
  )
}

export default TomoAvatar