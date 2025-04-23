'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUserById, updateUser } from '@/api/user'
import Button from '@/components/Button'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'
import Loader from '@/components/Loader'

const EditUserPage = () => {
  const { userId } = useParams() // ✅ استخدم نفس اسم الملف
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 2004, // default user
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await getUserById(userId)
        setFormData({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchUser()
  }, [userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUser(userId, formData)
      showSuccessToast('User updated successfully!')
      router.push('/dashboard/users')
    } catch (err) {
      console.error(err)
      // Swal.fire('Error', 'Failed to update user', 'error')
      showErrorToast('Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
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
          <Button type="submit">Update</Button>
        </form>
      </div>
    </>
  )
}

export default EditUserPage
