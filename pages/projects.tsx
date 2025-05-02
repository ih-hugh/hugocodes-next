import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import posts from '@/fixtures/projects'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Projects: NextPage = () => {
  return (
    <div className="container mx-auto py-6">
      <Head>
        <title>hugocodes - projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-100">Projects</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          A collection of my recent work and side projects
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.title} className="overflow-hidden border-slate-700 bg-slate-800">
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-all hover:scale-105"
              />
            </div>
            
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <a
                  href={post.category.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-400 hover:underline"
                >
                  {post.category.name}
                </a>
                <span className="text-xs text-slate-400">{post.date}</span>
              </div>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block hover:underline"
              >
                <h3 className="text-xl font-semibold text-slate-100">{post.title}</h3>
              </a>
            </CardHeader>
            
            <CardContent className="p-4 pt-0">
              <p className="text-slate-300">{post.description}</p>
            </CardContent>
            
            <CardFooter className="border-t border-slate-700 p-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-200">{post.author.name}</p>
                  <p className="text-xs text-slate-400">{post.readingTime} read</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Projects
