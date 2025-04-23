'use client'
import React from 'react'

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-6 text-slate-900">
      <h1 className="text-3xl font-bold mb-4">👋 Welcome to Your Dashboard!</h1>
      <p className="text-lg text-slate-700 mb-6">
        Here's your dashboard overview. You can manage your profile, check
        stats, and much more!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">📊 Stats</h2>
          <p>View your latest analytics and reports.</p>
        </div>

        <div className="p-4 bg-slate-100 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">⚙️ Settings</h2>
          <p>Update your preferences and profile settings.</p>
        </div>
      </div>
    </div>
  )
}
