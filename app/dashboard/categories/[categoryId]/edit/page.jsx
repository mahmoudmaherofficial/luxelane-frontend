'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCategoryById, updateCategory } from '@/api/category'
import Button from '@/components/Button'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'
import Loader from '@/components/Loader'

const EditCategoryPage = () => {
  const { categoryId } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const res = await getCategoryById(categoryId)
        setFormData({
          name: res.data.name,
          description: res.data.description || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) fetchCategory()
  }, [categoryId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateCategory(categoryId, formData)
      showSuccessToast('Category updated successfully!')
      router.push('/dashboard/categories')
    } catch (err) {
      console.error(err)
      showErrorToast('Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded px-3 py-2"
            />
          </div>
          <Button type="submit">Update</Button>
        </form>
      </div>
    </>
  )
}

export default EditCategoryPage
