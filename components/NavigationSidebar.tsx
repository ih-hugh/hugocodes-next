import { useState } from 'react'
import Link from 'next/link'
import { 
  Home, 
  FolderOpen, 
  Menu, 
  X 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export type NavigationItem = {
  name: string
  href: string
  current: boolean
  icon: any
}

type Props = {
  navigation: NavigationItem[]
}

export default function NavigationSidebar({ navigation }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const icons = {
    Home: Home,
    FolderIcon: FolderOpen
  }

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="fixed right-4 top-4 z-40">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[240px] p-0">
          <div className="flex h-full flex-col bg-slate-900 p-4">
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    item.current
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden h-full md:flex md:flex-col md:border-l">
        <nav className="flex flex-col space-y-1 p-4">
          {navigation.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                item.current
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
