'use client'
import { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { deleteUser, getAllUsers } from '@/api/user' // تعديل دالة API
import DataTable from '@/components/dashboard/DataTable'
import { useAuth } from '@/context/authContext'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'

const UsersPage = () => {
  const { user } = useAuth()
  const [allUsers, setAllUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await getAllUsers(currentPage, itemsPerPage)
        let users = res.data.data || []

        // ترتيب: خلي المستخدم الحالي في الأول
        if (user) {
          users.sort((a, b) => {
            if (a._id === user._id) return -1
            if (b._id === user._id) return 1
            return 0
          })
        }

        setAllUsers(users)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error('Error fetching users:', err)
      }
      setLoading(false)
    }

    if (user) fetchUsers()
  }, [user, currentPage, itemsPerPage])

  // تغيير في الـ currentPage أو itemsPerPage يعيد تحميل البيانات

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0f172b',
    })

    if (result.isConfirmed) {
      try {
        await deleteUser(id)
        setAllUsers(allUsers.filter((u) => u._id !== id)) // حذف المستخدم من الواجهة
        Swal.fire('Deleted!', 'User has been deleted.', 'success')
      } catch (err) {
        Swal.fire('Error!', 'Could not delete user.', 'error')
      }
    }
  }

  const handleEditUser = (id) => {
    router.push(`/dashboard/users/${id}/edit`)
  }

  const ActionButtons = ({ row }) => (
    <>
      <button onClick={() => handleEditUser(row._id)}>
        <FaEdit className="text-slate-900" />
      </button>
      {row._id !== user?._id && (
        <button onClick={() => handleDeleteUser(row._id)}>
          <FaTrash className="text-red-600" />
        </button>
      )}
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
        <h2 className="text-3xl font-bold text-slate-900">Users</h2>
        <DataTable
          columns={[
            { key: 'username', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
          ]}
          data={allUsers}
          actions={[ActionButtons]}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          formData={{
            name: 'user',
            link: 'users',
          }}
        />
      </div>
    </>
  )
}

export default UsersPage
