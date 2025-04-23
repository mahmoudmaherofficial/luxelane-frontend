'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory as createCategoryApi } from '@/api/category' // تأكد إنها موجودة
import Button from '@/components/Button'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'

const CreateCategoryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCategoryApi(formData)
      showSuccessToast('Category created successfully!')
      router.push('/dashboard/categories') // غير المسار حسب نظامك
    } catch (err) {
      console.error(err)
      showErrorToast('Failed to create category')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
      <h2 className="text-2xl font-bold mb-4">Create New Category</h2>
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
            rows={4}
          />
        </div>
        <Button type="submit">Create Category</Button>
      </form>
    </div>
  )
}

export default CreateCategoryPage

