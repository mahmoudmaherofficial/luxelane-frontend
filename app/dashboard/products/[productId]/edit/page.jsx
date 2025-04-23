'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getProductById,
  updateProduct,
  deleteProductImage,
} from '@/api/product'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import { getAllCategories } from '@/api/category'
import { FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa'

const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL']

const EditProductPage = () => {
  const { productId } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [allSizes, setAllSizes] = useState([])
  const [customSize, setCustomSize] = useState('')
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    size: [],
    image: [],
  })
  const [imagePreview, setImagePreview] = useState([])
  const [currentImages, setCurrentImages] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await getProductById(productId)
        const { name, price, stock, category, description, size, images } =
          res.data

        const mergedSizes = Array.from(
          new Set([...defaultSizes, ...(size || [])])
        )

        setAllSizes(mergedSizes)
        setProductDetails({
          name,
          price,
          stock,
          category: category._id,
          description,
          size: size || [],
          image: [],
        })
        setCurrentImages(images || [])
        setImagePreview('')
      } catch (err) {
        showErrorToast('Failed to load product data.')
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchProduct()
  }, [productId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories()
        setCategories(res.data.data)
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }

    fetchCategories()
  }, [])

  const handleSizeChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setProductDetails((prev) => ({
        ...prev,
        size: [...prev.size, value],
      }))
    } else {
      setProductDetails((prev) => ({
        ...prev,
        size: prev.size.filter((s) => s !== value),
      }))
    }
  }

  const handleAddCustomSize = () => {
    const trimmedSize = customSize.trim()
    const finalSize = `${trimmedSize}XL`
    if (trimmedSize) {
      if (!allSizes.includes(finalSize)) {
        setAllSizes((prev) => [...prev, finalSize])
      }
      if (!productDetails.size.includes(finalSize)) {
        setProductDetails((prev) => ({
          ...prev,
          size: [...prev.size, finalSize],
        }))
      }
      setCustomSize('')
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const updatedImages = [...productDetails.image, ...files]

    setProductDetails((prev) => ({
      ...prev,
      image: updatedImages,
    }))

    // Generate previews for all selected files
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveNewImage = (indexToRemove) => {
    const updatedPreview = imagePreview.filter((_, i) => i !== indexToRemove)
    const updatedFiles = productDetails.image.filter(
      (_, i) => i !== indexToRemove
    )

    setImagePreview(updatedPreview)
    setProductDetails((prev) => ({
      ...prev,
      image: updatedFiles,
    }))
  }

  const handleImageDelete = async (imageUrl) => {
    try {
      setLoading(true)
      const imageName = imageUrl.split('/').pop()
      await deleteProductImage(productId, imageName)
      setCurrentImages((prev) => prev.filter((img) => img !== imageUrl))
      showSuccessToast('Image deleted successfully!')
    } catch (err) {
      showErrorToast('Failed to delete image')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formDataToSubmit = new FormData()

      formDataToSubmit.append('name', productDetails.name)
      formDataToSubmit.append('price', productDetails.price)
      formDataToSubmit.append('stock', productDetails.stock)
      formDataToSubmit.append('category', productDetails.category)
      formDataToSubmit.append('description', productDetails.description)

      productDetails.size.forEach((s) => {
        formDataToSubmit.append('size', s)
      })

      if (productDetails.image && productDetails.image.length > 0) {
        productDetails.image.forEach((file) => {
          formDataToSubmit.append('images', file)
        })
      }

      await updateProduct(productId, formDataToSubmit)

      showSuccessToast('Product updated successfully!')
      router.push('/dashboard/products')
    } catch (err) {
      showErrorToast('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={productDetails.category}
              onChange={(e) =>
                setProductDetails((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded px-3 py-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={(e) =>
                setProductDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={productDetails.price}
              onChange={(e) =>
                setProductDetails((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={productDetails.stock}
              onChange={(e) =>
                setProductDetails((prev) => ({
                  ...prev,
                  stock: e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={productDetails.description}
              onChange={(e) =>
                setProductDetails((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Sizes</label>
            <div className="flex flex-wrap gap-3 mb-2">
              {allSizes.map((size, index) => (
                <label key={index} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={size}
                    checked={productDetails.size.includes(size)}
                    onChange={handleSizeChange}
                  />
                  {size}
                </label>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Custom (XL)"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                className="w-32 border rounded-s-lg rounded-e-none px-3 py-2 border-r-0 focus:outline-none focus:border-slate-900 border-slate-300"
              />
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="rounded-e-lg rounded-s-none"
                onClick={handleAddCustomSize}
              >
                <FaPlus />
              </Button>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Images</label>
            <div className="flex gap-3 mb-2 flex-wrap">
              {currentImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Product Image ${index}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="danger"
                    className="absolute top-1 right-1"
                    onClick={() => handleImageDelete(imageUrl)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              ))}
              {imagePreview.length > 0 &&
                imagePreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`New Preview ${index}`}
                      className="w-32 h-32 object-cover border rounded"
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      className="absolute top-1 right-1"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className=" border border-slate-300 rounded px-3 py-2"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Add Photos
            </Button>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </>
  )
}

export default EditProductPage
