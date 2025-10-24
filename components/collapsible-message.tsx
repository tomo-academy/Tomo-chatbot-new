import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import { IconLogo } from './ui/icons'
import { Separator } from './ui/separator'
import { CurrentUserAvatar } from './current-user-avatar'
import { TomoAvatar } from './tomo-avatar'

interface CollapsibleMessageProps {
  children: React.ReactNode
  role: 'user' | 'assistant'
  isCollapsible?: boolean
  isOpen?: boolean
  header?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  showBorder?: boolean
  showIcon?: boolean
}

export function CollapsibleMessage({
  children,
  role,
  isCollapsible = false,
  isOpen = true,
  header,
  onOpenChange,
  showBorder = true,
  showIcon = true
}: CollapsibleMessageProps) {
  const content = <div className="flex-1">{children}</div>

  // User messages (right-aligned)
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2">
        <div className="flex max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[65%] items-end gap-1.5 sm:gap-2 md:gap-3">
          <div className="flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl md:rounded-3xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 shadow-lg message-bubble">
            <div className="text-sm sm:text-base leading-relaxed break-words user-message-content">{children}</div>
          </div>
          {showIcon && (
            <div className="relative flex flex-col items-center shrink-0 mb-0.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-blue-500/20">
                <CurrentUserAvatar />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // AI messages (left-aligned) - handle collapsible case
  if (isCollapsible) {
    return (
      <div className="flex justify-start mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2">
        <div className="flex max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] items-end gap-1.5 sm:gap-2 md:gap-3">
          {showIcon && (
            <div className="relative flex flex-col items-center shrink-0 mb-0.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-purple-500/20">
                <TomoAvatar className="size-6 sm:size-7 md:size-8 lg:size-9" />
              </div>
            </div>
          )}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 message-bubble">
            <Collapsible
              open={isOpen}
              onOpenChange={onOpenChange}
              className="w-full"
            >
              <div className="flex items-center justify-between w-full gap-2">
                {header && <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 w-full">{header}</div>}
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-accent group transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
                <Separator className="my-3 sm:my-4 border-border/50" />
                <div className="text-sm sm:text-base leading-relaxed prose prose-sm sm:prose-base prose-gray dark:prose-invert max-w-none break-words ai-message-content">{children}</div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    )
  }

  // AI messages (left-aligned) - regular case
  return (
    <div className="flex justify-start mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2">
      <div className="flex max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] items-end gap-1.5 sm:gap-2 md:gap-3">
        {showIcon && (
          <div className="relative flex flex-col items-center shrink-0 mb-0.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-purple-500/20">
              <TomoAvatar className="size-6 sm:size-7 md:size-8 lg:size-9" />
            </div>
          </div>
        )}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl md:rounded-3xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 message-bubble">
          <div className="text-sm sm:text-base leading-relaxed prose prose-sm sm:prose-base prose-gray dark:prose-invert max-w-none break-words ai-message-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
