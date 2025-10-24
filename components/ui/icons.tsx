'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'

interface IconLogoProps {
  className?: string
}

function IconLogo({ className }: IconLogoProps) {
  return (
    <div
      className={cn('h-4 w-4 relative rounded-full overflow-hidden shadow-lg ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300', className)}
    >
      <Image
        src="/images/tomo-the-hub.png"
        alt="TOMO AI BUDDY Logo"
        fill
        className="object-cover hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-60"></div>
    </div>
  )
}

export { IconLogo }
