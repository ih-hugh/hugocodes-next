import type { NextPage } from 'next'
import Head from 'next/head'
import ProfileVideo from '@/components/ProfileVideo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const Home: NextPage = () => {
  return (
    <div className="relative w-full">
      <Head>
        <title>hugocodes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <ProfileVideo 
            src="/ferry-ride.mp4" 
            className="h-[50vh] md:h-[60vh] object-cover brightness-50"
          />
        </div>
        
        <div className="relative z-10 flex min-h-[50vh] md:min-h-[60vh] items-center justify-center">
          <div className="text-center p-4">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">Bienvenidos!</h1>
            <p className="mb-6 text-lg text-slate-300 md:text-xl">
              Full Stack Developer building modern web applications
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg">View Projects</Button>
              <Button size="lg" variant="outline">Contact Me</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <h2 className="mb-4 text-2xl font-bold text-slate-100">About My Work</h2>
            <p className="text-slate-300">
              I specialize in building modern web applications using Next.js, React, and other cutting-edge technologies.
              My focus is on creating responsive, user-friendly interfaces with clean design and optimal performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home
