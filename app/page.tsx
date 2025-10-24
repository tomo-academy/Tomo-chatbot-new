import { generateId } from 'ai'
import Link from 'next/link'

import { getModels } from '@/lib/config/models'

import { Chat } from '@/components/chat'

export default async function Page() {
  const id = generateId()
  const models = await getModels()
  
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <Chat id={id} models={models} />
      </div>
      <div className="w-64 border-l border-gray-200 p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Tomo AI Chatbot</h2>
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-green-800 dark:text-green-200 text-sm font-medium">
              ✅ Morphic AI Engine - Active
            </p>
          </div>
          <Link 
            href="/devochat" 
            className="block px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-center"
          >
            DevoChat Interface
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-4 space-y-2">
            <p><strong>Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Multiple AI Models</li>
              <li>Web Search Integration</li>
              <li>Real-time Streaming</li>
              <li>Artifact Generation</li>
              <li>Dark/Light Themes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
