'use client'

import { ReactNode } from 'react'

interface DevoChatLayoutProps {
  children: ReactNode
}

export default function DevoChatLayout({ children }: DevoChatLayoutProps) {
  return (
    <div className="devochat-app">
      {children}
    </div>
  )
}