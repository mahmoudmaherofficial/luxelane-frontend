'use client'
import { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { deleteCategory, getPaginatedCategories } from '@/api/category'
import { useAuth } from '@/context/authContext'
import Loader from '@/components/Loader'
import DataTable from '@/components/dashboard/DataTable'

const CategoriesPage = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await getPaginatedCategories(currentPage, itemsPerPage)
        setCategories(res.data.data || [])
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
      setLoading(false)
    }

    if (user) fetchCategories()
  }, [user, currentPage, itemsPerPage])

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0f172b',
    })

    if (result.isConfirmed) {
      try {
        await deleteCategory(id)
        setCategories(categories.filter((cat) => cat._id !== id))
        Swal.fire('Deleted!', 'Category has been deleted.', 'success')
      } catch (err) {
        Swal.fire('Error!', 'Could not delete category.', 'error')
      }
    }
  }

  const handleEditCategory = (id) => {
    router.push(`/dashboard/categories/${id}/edit`)
  }

  const ActionButtons = ({ row }) => (
    <>
      <button onClick={() => handleEditCategory(row._id)}>
        <FaEdit className="text-slate-900" />
      </button>
      <button onClick={() => handleDeleteCategory(row._id)}>
        <FaTrash className="text-red-600" />
      </button>
    </>
  )

  const pagination = {
    currentPage,
    totalPages,
    itemsPerPage,
  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-4 space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Categories</h2>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
            {
              key: 'updatedAt',
              label: 'Last Updated',
              render: (row) => new Date(row.updatedAt).toLocaleDateString(),
            },
          ]}
          data={categories}
          actions={[ActionButtons]}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          formData={{
            link: 'categories',
            name: 'category',
          }}
        />
      </div>
    </>
  )
}

export default CategoriesPage
