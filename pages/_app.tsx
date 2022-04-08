import '../styles/globals.css'
import { Fragment, useState } from 'react'
import type { AppProps } from 'next/app'
// import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import {
  CalendarIcon,
  ChartBarIcon,
  DotsVerticalIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline'
import ProfileSidebar from '@/components/ProfileSidebar'
import NavigationSidebar from '@/components/NavigationSidebar'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Projects', href: '/projects', icon: FolderIcon, current: false },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: InboxIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
]

export default function MyApp({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false)

  return (
    <>
      <div className="">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed -inset-0 bg-slate-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-900">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <ProfileSidebar />
              </div>
            </Transition.Child>
            <div className="w-14 flex-shrink-0"></div>
          </Dialog>
        </Transition.Root>

        <Transition.Root show={navbarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="absolute top-0 right-0 z-40 flex   md:hidden"
            onClose={setNavbarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute right-20 bg-slate-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full "
              enterTo="-translate-x-0 "
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="-translate-x-0 "
              leaveTo="translate-x-full "
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-900">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 ">
                    <button
                      type="button"
                      className=" flex h-10 w-10 items-center justify-center rounded-full focus:outline-none  "
                      onClick={() => setNavbarOpen(false)}
                    >
                      <span className="sr-only">Close navbar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <NavigationSidebar navigation={navigation} />
              </div>
            </Transition.Child>{' '}
          </Dialog>
        </Transition.Root>

        <div className="sticky top-0 z-10 flex w-full justify-between bg-slate-900 md:hidden">
          <button
            type="button"
            className="app-button"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <DotsVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="app-button"
            onClick={() => setNavbarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className=" flex ">
          <div className="hidden  md:absolute md:flex md:w-72 md:flex-col">
            <ProfileSidebar />
          </div>

          <main className="md:relative md:flex md:pl-72 ">
            <Component {...pageProps} />
          </main>

          <div className=" hidden   md:relative md:flex md:flex-col">
            <NavigationSidebar navigation={navigation} />
          </div>
        </div>
      </div>
    </>
  )
}
