import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/components/ThemeProvider'
import ProfileSidebar from '@/components/ProfileSidebar'
import NavigationSidebar from '@/components/NavigationSidebar'
import { Home, FolderOpen } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home, current: true },
  { name: 'Projects', href: '/projects', icon: FolderOpen, current: false },
]

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex min-h-screen flex-col">
        {/* Mobile Navigation */}
        <div className="relative flex min-h-screen md:hidden">
          <ProfileSidebar />
          <main className="flex-1 p-4">
            <Component {...pageProps} />
          </main>
          <NavigationSidebar navigation={navigation} />
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:flex md:min-h-screen">
          <div className="fixed left-0 top-0 h-full">
            <ProfileSidebar />
          </div>
          
          <main className="ml-64 flex-1 p-6">
            <Component {...pageProps} />
          </main>
          
          <div className="fixed right-0 top-0 h-full">
            <NavigationSidebar navigation={navigation} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
