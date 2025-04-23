'use client'
import { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { deleteProduct, getPaginatedProducts } from '@/api/product'
import DataTable from '@/components/dashboard/DataTable'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Loader from '@/components/Loader'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await getPaginatedProducts(currentPage, itemsPerPage)
        if (!res.data) {
          throw new Error('No data returned from API')
        }
        setProducts(res.data.data || [])
        setTotalPages(res.data.totalPages || 1)
      } catch (err) {
        console.error(err)
        Swal.fire('Error!', 'Could not fetch products.', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, itemsPerPage])

  const handleDeleteProduct = async (id) => {
    if (!id || !products.find((p) => p._id === id)) {
      return Swal.fire('Error!', 'Product not found.', 'error')
    }
    const productName = products.find((p) => p._id === id).name
    const result = await Swal.fire({
      title: 'Delete ' + productName + '?',
      text: 'This product will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0f172b',
    })

    if (result.isConfirmed) {
      try {
        await deleteProduct(id)
        setProducts(products.filter((p) => p._id !== id))
        Swal.fire('Deleted!', productName + ' has been deleted.', 'success')
      } catch (err) {
        Swal.fire('Error!', 'Could not delete product.', 'error')
      }
    }
  }

  const handleEditProduct = (id) => {
    if (!id || !products.find((p) => p._id === id)) {
      return Swal.fire('Error!', 'Product not found.', 'error')
    }
    router.push(`/dashboard/products/${id}/edit`)
  }

  const Actions = ({ row }) => (
    <>
      <button onClick={() => handleEditProduct(row._id)}>
        <FaEdit className="text-slate-900 text-lg" />
      </button>
      <button onClick={() => handleDeleteProduct(row._id)}>
        <FaTrash className="text-red-600 text-lg h-full" />
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
        <h2 className="text-3xl font-bold text-slate-900">Products</h2>
        <DataTable
          columns={[
            { key: 'category', label: 'Category' },
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
            { key: 'price', label: 'Price' },
            { key: 'stock', label: 'Stock' },
            {
              key: 'size',
              label: 'Available Size',
              render: (row) => {
                return (
                  <div className="flex flex-wrap gap-1">
                    {row.size?.map((size, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded bg-slate-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )
              },
            },
            {
              key: 'image',
              label: 'Image',
              render: (row) => (
                <div className="flex space-x-2">
                  {row.images?.length > 0 ? (
                    <img
                      src={row.images[0]}
                      alt={row.name}
                      width={32}
                      height={32}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={'/images/image-placeholder.png'}
                      alt="placeholder"
                      width={32}
                      height={32}
                      loading="lazy"
                    />
                  )}
                </div>
              ),
            },
            {
              key: 'updatedAt',
              label: 'Last Updated',
              render: (row) => new Date(row.updatedAt).toLocaleDateString(),
            },
            {
              key: 'createdBy',
              label: 'Created By',
              render: (row) => row.createdBy?.username,
            },
          ]}
          data={products}
          actions={[Actions]}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          formData={{
            name: 'product',
            link: 'products',
          }}
        />
      </div>
    </>
  )
}

export default ProductsPage
