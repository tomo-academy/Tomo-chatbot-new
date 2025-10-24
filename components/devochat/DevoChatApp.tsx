'use client'

import { useEffect, useState, useCallback, useRef, useContext, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import ImageHeader from './ImageHeader'
import Home from './pages/Home'
import Chat from './pages/Chat'
import ImageChat from './pages/ImageChat'
import ImageHome from './pages/ImageHome'
import View from './pages/View'
import Realtime from './pages/Realtime'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Toast from './Toast'
import { SettingsProvider } from './contexts/SettingsContext'
import { SettingsContext } from './contexts/SettingsContext'
import { ConversationsProvider, ConversationsContext } from './contexts/ConversationsContext'

export default function DevoChatApp() {
  return (
    <SettingsProvider>
      <ConversationsProvider>
        <AppContent />
      </ConversationsProvider>
    </SettingsProvider>
  )
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [userInfo, setUserInfo] = useState(null)
  const [isResponsive, setIsResponsive] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userSidebarOpen, setUserSidebarOpen] = useState<boolean | null>(null)
  const [isTouch, setIsTouch] = useState(false)
  const [toastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const shouldShowLayout = useMemo(() => {
    return (
      isLoggedIn && (
        pathname === '/devochat' ||
        pathname.startsWith('/devochat/chat/') ||
        pathname.startsWith('/devochat/image')
      )
    )
  }, [isLoggedIn, pathname])

  const shouldShowLogo = useMemo(() => {
    return pathname.startsWith('/devochat/view')
  }, [pathname])

  const chatMessageRef = useRef<HTMLDivElement>(null)
  const { fetchConversations } = useContext(ConversationsContext)
  const { isModelReady } = useContext(SettingsContext)

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 768)
    }

    setIsResponsive(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'
        const statusRes = await fetch(`${fastApiUrl}/auth/status`, { credentials: 'include' })
        if (!statusRes.ok) {
          setIsLoggedIn(false)
          setUserInfo(null)
          return
        }
        const statusData = await statusRes.json()
        setIsLoggedIn(statusData.logged_in)
        if (statusData.logged_in) {
          fetchConversations()
          try {
            const userRes = await fetch(`${fastApiUrl}/auth/user`, { credentials: 'include' })
            if (userRes.ok) {
              const userData = await userRes.json()
              setUserInfo(userData)
            }
          } catch (error) {
            console.error('Failed to fetch user info:', error)
          }
        }
      } catch (error) {
        console.error('Failed to check login status:', error)
        setIsLoggedIn(false)
        setUserInfo(null)
      }
    }
    checkLoginStatus()
  }, [fetchConversations])

  useEffect(() => {
    if (isResponsive) {
      setIsSidebarOpen(false)
    } else {
      if (userSidebarOpen !== null) {
        setIsSidebarOpen(userSidebarOpen)
      } else {
        setIsSidebarOpen(true)
      }
    }
  }, [isResponsive, userSidebarOpen])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => {
      const newState = !prev
      if (!isResponsive) setUserSidebarOpen(newState)
      return newState
    })
  }, [isResponsive])

  const navigate = useCallback((path: string) => {
    router.push(`/devochat${path}`)
  }, [router])

  if (isLoggedIn === null) return <div>Loading...</div>
  if (isLoggedIn && !isModelReady) return <div>Initializing models...</div>

  const currentPath = pathname.replace('/devochat', '') || '/'

  const renderCurrentPage = () => {
    if (!isLoggedIn) {
      if (currentPath === '/register') {
        return <Register />
      }
      return <Login />
    }

    switch (true) {
      case currentPath === '/':
        return <Home isTouch={isTouch} />
      case currentPath.startsWith('/chat/'):
        const chatId = currentPath.split('/')[2]
        return <Chat isTouch={isTouch} chatMessageRef={chatMessageRef} conversationId={chatId} />
      case currentPath === '/image':
        return <ImageHome isTouch={isTouch} />
      case currentPath.startsWith('/image/'):
        const imageId = currentPath.split('/')[2]
        return <ImageChat isTouch={isTouch} chatMessageRef={chatMessageRef} conversationId={imageId} />
      case currentPath.startsWith('/view/'):
        const viewParts = currentPath.split('/')
        return <View viewType={viewParts[2]} conversationId={viewParts[3]} />
      case currentPath === '/realtime':
        return <Realtime />
      case currentPath === '/admin':
        return <Admin />
      default:
        if (isLoggedIn) {
          navigate('/')
          return <Home isTouch={isTouch} />
        }
        return <Login />
    }
  }

  return (
    <div style={{ display: 'flex', margin: '0', overflow: 'hidden' }}>
      {shouldShowLayout && (
        <div
          style={{
            width: '260px',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1000,
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            isResponsive={isResponsive}
            isTouch={isTouch}
            userInfo={userInfo}
            navigate={navigate}
          />
        </div>
      )}

      {shouldShowLayout && isSidebarOpen && isResponsive && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 100,
          }}
        />
      )}

      <div
        style={{
          width: '100%',
          height: '100dvh',
          marginLeft: (shouldShowLayout && isSidebarOpen && !isResponsive) ? '260px' : '0',
          transition: 'margin-left 0.3s ease',
          scrollbarGutter: 'stable',
          backfaceVisibility: 'hidden',
        }}
      >
        {shouldShowLogo && (
          <div className="header" style={{ padding: '0 20px' }}>
            <img
              src="/devochat-logo.png"
              alt="DEVOCHAT"
              width="143.5px"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}

        {shouldShowLayout && (
          currentPath.startsWith('/image') ? (
            <ImageHeader
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isTouch={isTouch}
              chatMessageRef={chatMessageRef}
            />
          ) : (
            <Header
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              isTouch={isTouch}
              chatMessageRef={chatMessageRef}
            />
          )
        )}

        {renderCurrentPage()}
      </div>

      <Toast
        type="error"
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}