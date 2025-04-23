'use client'
import { useState, useRef, useEffect } from 'react'
import { FaUserCircle, FaBars } from 'react-icons/fa'
import Link from 'next/link'
import Button from '@/components/Button'
import { logout } from '@/api/auth'
import { useAuth } from '@/context/authContext'

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const roleName = {
    1995: 'Admin',
    1996: 'Seller',
  }

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-slate-900 text-slate-100 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <FaBars
          className="text-2xl cursor-pointer md:hidden"
          onClick={() => toggleSidebar(true)}
        />
        <Link href="/dashboard" className="text-2xl font-semibold ml-3">
          Dashboard
        </Link>
      </div>

      <div className="relative" ref={dropdownRef}>
        <FaUserCircle
          className="text-2xl cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
          onClick={() => setDropdownOpen((prev) => !prev)}
        />

        {dropdownOpen && (
          <div className="animate-dropdown absolute right-0 mt-2 w-52 bg-white text-black rounded shadow-lg z-50 py-2 px-4 space-y-2">
            <p className="text-md font-semibold mb-0">
              {user?.username || 'User Name'}
            </p>
            <p className="text-sm text-gray-500">
              {roleName[user?.role] || 'Unknown'}
            </p>
            <hr />
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setDropdownOpen(false)}
            >
              My Profile
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="w-full mb-2"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
