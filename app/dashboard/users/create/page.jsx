'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser } from '@/api/user'
import Button from '@/components/Button'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // إضافة حقل كلمة السر
    role: 2004, // default user role
  })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser(formData)
      showSuccessToast('User created successfully!')
      router.push('/dashboard/users')
    } catch (err) {
      console.error(err)
      showErrorToast('Failed to create user')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2 lowercase"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2 lowercase"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2"
          >
            <option value={1995}>Admin</option>
            <option value={1996}>Seller</option>
            <option value={2004}>User</option>
          </select>
        </div>
        <Button type="submit">Create User</Button>
      </form>
    </div>
  )
}

export default CreateUserPage
