'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAccount } from '@/api/account'
import {  updateUser } from '@/api/user'
import Button from '@/components/Button'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'
import Loader from '@/components/Loader'
import { useAuth } from '@/context/authContext'

const EditProfilePage = () => {
  const router = useRouter()
  const { user } = useAuth() // Get current user from AuthContext
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const res = await getAccount() // Fetch current user's data
        setFormData({
          username: res.data.username,
          email: res.data.email,
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
        showErrorToast('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserProfile()
    } else {
      // Redirect to login if not authenticated
      router.replace('/login')
    }
  }, [user, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUser(user._id, formData) // Update current user's profile
      showSuccessToast('Profile updated successfully!')
      router.push('/profile') // Redirect to profile page
    } catch (err) {
      console.error('Error updating profile:', err)
      showErrorToast('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900 m-14 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded px-3 py-2 lowercase md:px-4 md:py-3"
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
              className="w-full border border-slate-300 rounded px-3 py-2 lowercase md:px-4 md:py-3"
              required
            />
          </div>
          <Button type="submit" className="w-full md:w-auto">Update Profile</Button>
        </form>
      </div>
    </>
  )
}

export default EditProfilePage
