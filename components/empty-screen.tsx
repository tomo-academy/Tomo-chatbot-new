import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

const exampleMessages = [
  {
    heading: 'What is DeepSeek R1?',
    message: 'What is DeepSeek R1?'
  },
  {
    heading: 'Why is Nvidia growing rapidly?',
    message: 'Why is Nvidia growing rapidly?'
  },
  {
    heading: 'Tesla vs Rivian',
    message: 'Tesla vs Rivian'
  },
  {
    heading: 'Summary: https://arxiv.org/pdf/2501.05707',
    message: 'Summary: https://arxiv.org/pdf/2501.05707'
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-3 sm:mt-4 flex flex-col items-start space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ Try asking about:
          </h3>
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-2 sm:p-3 text-left bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 border border-blue-200/50 dark:border-blue-800/50 rounded-lg w-full justify-start group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={14} className="mr-2 sm:mr-3 text-blue-500 group-hover:text-purple-600 transition-colors duration-300 group-hover:translate-x-1 shrink-0" />
              <span className="text-xs sm:text-sm font-medium group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {message.heading}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
