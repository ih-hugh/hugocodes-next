import Image from 'next/image'
import { useState } from "react"
import { Check, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const languages: any = { English: 90, Spanish: 82 }
const skills: any = {
  html: 75,
  css: 62,
  javascript: 83,
  node: 70,
}
const technologies: any = {
  frontend: ['React', 'Vue', 'Sass'],
  backend: ['Node', 'Express', 'GraphQL', 'Mongo', 'SQL'],
  testing: ['Jest', 'Mocha', 'Chai', 'Cypress'],
  frameworks: ['Nuxt.js', 'Next.js'],
  web3: ['Web3', 'Ethers', 'Solidity', 'Truffle', 'Hardhat', 'Ganache'],
  other: ['Git', 'Linux', 'Docker', 'AWS'],
}

type SkillProgressBarType = { label: string; value: number }
function SkillProgressBar({ label, value }: SkillProgressBarType) {
  return (
    <div className="flex w-full flex-col">
      <div className="my-1 flex justify-between">
        <div className="text-sm text-slate-300">{label}</div>
        <div className="text-sm text-slate-300">{value}%</div>
      </div>
      <div className="flex h-1 bg-slate-700">
        <div className="h-1 bg-amber-500" style={{ width: value + '%' }}></div>
      </div>
    </div>
  )
}

function loadResume() {
  window.open('/resume.pdf')
}

type ProfileSidebarProps = {}

export default function ProfileSidebar(props: ProfileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 overflow-y-auto">
      <div className="flex w-full flex-col items-center justify-center bg-slate-800 p-5">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src="https://avatars.githubusercontent.com/u/1256596?v=4" 
            alt="Hugo Cedano" 
          />
          <AvatarFallback>HC</AvatarFallback>
        </Avatar>
        <div className="mt-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-white">Hugo Cedano</h2>
          <p className="text-slate-400">Fullstack Developer</p>
          <p className="text-slate-400">Web 2.5</p>
        </div>
      </div>
      
      <div className="flex w-full flex-col divide-y divide-slate-700 p-4">
        <Card className="mb-4 border-slate-700 bg-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Residence</span>
              <span className="text-slate-400">Alabama, US</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">City</span>
              <span className="text-slate-400">Deatsville</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Age</span>
              <span className="text-slate-400">32</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="py-4">
          <h3 className="mb-3 text-lg font-medium text-white">Skills</h3>
          <div className="space-y-3">
            {Object.keys(skills).map((skill, i) => (
              <SkillProgressBar
                key={i}
                label={skill}
                value={skills[skill]}
              />
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="mb-3 text-lg font-medium text-white">Technologies</h3>
          <div className="space-y-2">
            {Object.keys(technologies).map((kind: any, i) => (
              <div key={i} className="group flex text-sm text-slate-400">
                <Check className="mr-2 h-5 w-5 text-amber-500" />
                <span>{technologies[kind].join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="mb-3 text-lg font-medium text-white">Connect</h3>
          <div className="space-y-2">
            <a 
              href="https://github.com/HugoCe17" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-slate-300 hover:text-white"
            >
              GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/hceda17/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-slate-300 hover:text-white"
            >
              LinkedIn
            </a>
            <button 
              onClick={loadResume}
              className="flex items-center text-slate-300 hover:text-white"
            >
              Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Profile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-40">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle profile menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="h-full">
            <div className="absolute right-4 top-4">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Profile Sidebar */}
      <div className="hidden h-full w-64 md:flex">
        {sidebarContent}
      </div>
    </>
  )
}
