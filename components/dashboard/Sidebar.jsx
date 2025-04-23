'use client'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/images/logo-w.svg'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/authContext'
import { navLinks } from '@/constants/navLinks'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth()
  const pathname = usePathname()
  const activeLink = useMemo(() => {
    const currentLink = navLinks.find((link) =>
      pathname.startsWith(`/dashboard/${link.link}`)
    )
    return currentLink?.link || ''
  }, [pathname])

  const renderNavLinks = useMemo(() => {
    if (!user) return null

    return navLinks
      .filter((link) =>
        Array.isArray(link.role) ? link.role.includes(user?.role) : true
      )
      .map((link) => (
        <li key={link.title} className="mb-3">
          <Link
            onClick={() => toggleSidebar(false)}
            href={`/dashboard/${link.link}`}
            className={`block p-2 rounded-md hover:bg-slate-700 ${activeLink === link.link ? 'bg-slate-700' : ''}`}
          >
            <div className="flex items-center">
              {link.icon}
              <span className="ml-3">{link.title}</span>
            </div>
          </Link>
        </li>
      ))
  }, [user, activeLink])

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white z-50 p-5 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
    >
      <div className="flex justify-center items-center mb-6">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={40}
          style={{ width: 'auto', height: 'auto' }}
          priority={true}
        />
      </div>

      <ul>{renderNavLinks}</ul>
    </aside>
  )
}

export default Sidebar
