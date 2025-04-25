'use client'
import { deleteAccount, getAccount } from '@/api/account'
import { BASE_URL } from '@/api/urls'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import { useAuth } from '@/context/authContext'
import Link from 'next/link'
import Swal from 'sweetalert2'

const ProfilePage = () => {
  const { user, loading } = useAuth()
  const roleMap = {
    1995: 'Admin',
    1996: 'Seller',
    2004: 'Customer',
  }

  const handleDeleteProfile = async () => {
    if (!user || !user.username) {
      return Swal.fire('Error', 'User data is not available', 'error')
    }

    const { value: inputValue } = await Swal.fire({
      title: `Enter "${user.username}" to confirm deletion`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
      showLoaderOnConfirm: true,
      preConfirm: (input) => {
        if (!input) {
          Swal.showValidationMessage('Please enter your username')
          return false
        } else if (input !== user.username) {
          Swal.showValidationMessage('Wrong username')
          return false
        }
        return true
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })

    if (inputValue) {
      try {
        await deleteAccount()
        Swal.fire('Account deleted successfully')
        window.location.replace('/')
      } catch (err) {
        console.error(err)
        Swal.fire('Error', 'Failed to delete account', 'error')
      }
    }
  }

  if (!loading && !user) {
    window.location.replace('/')
    return null
  }

  return (
    <>
      {loading && <Loader />}
      {!loading && user && (
        <div className="container">
          <h1 className="text-4xl font-bold mb-4 mt-16 text-center">
            Your Profile
          </h1>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-60 md:h-48 w-full object-cover md:w-48"
                  src={`${BASE_URL}${user?.image || '/default-profile.png'}`}
                  alt={user?.username || 'Profile Image'}
                />
              </div>
              <div className="p-8">
                <div className="tracking-wide text-xl text-slate-900 font-semibold">
                  {user?.username || 'Unknown User'}
                </div>
                <p className="block mt-1 text-md leading-tight font-medium text-gray-500">
                  {user?.email || 'No Email Available'}
                </p>
                <p className="mt-4 text-gray-500">
                  LuxeLane {roleMap[user?.role] || 'Unknown Role'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 max-w-md gap-4 md:max-w-2xl mx-auto">
            <Button>
              <Link href="/profile/update">Update</Link>
            </Button>

            <Button variant="danger" onClick={handleDeleteProfile}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePage
