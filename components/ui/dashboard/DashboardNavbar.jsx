'use client';
import { Menu, User, Bell, Search, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAccountContext } from '@/context/AccountContext';

export default function DashboardNavbar({
  toggleSidebar,
  className,
  isSidebarOpen,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAccountContext();
  const [isMobile, setIsMobile] = useState(false);

  // Handle resize to detect mobile view - optimized with throttling
  useEffect(() => {
    let resizeTimer = null;

    const handleResize = () => {
      if (resizeTimer) return;

      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth <= 992); // Show on tablet too (< 1024px)
        resizeTimer = null;
      }, 100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleSidebarToggle = useCallback(() => {
    toggleSidebar((prev) => !prev);
  }, [toggleSidebar]);

  return (
    <nav
      className={`flex bg-primary-900 items-center justify-between p-3 ${className} shadow-md z-50`}
    >
      <div className="flex items-center space-x-3">
        {isMobile && (
          <button
            onClick={handleSidebarToggle}
            className="text-soft-ivory p-2 hover:text-dusty-rose focus:outline-none transform hover:scale-105 active:scale-95 transition-all duration-200 rounded-full hover:bg-primary-800"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-semibold text-soft-ivory tracking-wide">
          <span className="hidden md:inline">
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </span>{' '}
          Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Search button - visible on larger screens */}
        <div className="hidden md:flex items-center bg-primary-800 bg-opacity-50 rounded-full px-3 py-1.5 text-soft-ivory">
          <Search size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-sm w-28 lg:w-36 text-soft-ivory placeholder-gray-400"
          />
        </div>

        {/* Home Link */}
        <Link href={'/'}>
          <button
            className="relative p-2 text-soft-ivory hover:text-dusty-rose focus:outline-none transform hover:scale-105 active:scale-95 transition-all duration-200 rounded-full hover:bg-primary-800"
            aria-label="Notifications"
          >
            <Home size={20} />
          </button>
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 text-soft-ivory hover:text-dusty-rose focus:outline-none transform hover:scale-105 active:scale-95 transition-all duration-200 rounded-full hover:bg-primary-800"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dusty-rose opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-dusty-rose"></span>
          </span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-primary-800 text-soft-ivory transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2"
            aria-label="User menu"
          >
            <User size={20} />
            <span className="hidden md:inline text-sm font-medium">
              {user?.username || 'User'}
            </span>
          </button>
          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-primary-900 text-soft-ivory rounded-lg shadow-lg py-2 z-50 custom-scrollbar"
              style={{
                animation: 'fadeIn 0.2s ease-out forwards',
              }}
            >
              <div className="px-4 py-2 border-b border-primary-800 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-primary-800 hover:text-white transition-all duration-200 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 hover:bg-primary-800 hover:text-white transition-all duration-200 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-primary-800 mt-1 pt-1">
                <Link
                  href="/logout"
                  className="block px-4 py-2 hover:bg-primary-800 hover:text-dusty-rose transition-all duration-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
