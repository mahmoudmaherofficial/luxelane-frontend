'use client'
import Navbar from "@/components/dashboard/Navbar"
import Sidebar from "@/components/dashboard/Sidebar"
import ProtectedRoute from "@/utils/middleware/protectedRoute"
import { useState } from "react"

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden md:pl-64">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />

      {/* Overlay for small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col min-h-screen">
        <Navbar toggleSidebar={setIsSidebarOpen} />
        <main className="p-4 flex-1 overflow-y-auto bg-gray-100">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
