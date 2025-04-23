'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/api/product'
import Button from '@/components/Button'
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils'
import { getAllCategories } from '@/api/category'
import { FaPlus, FaTimes } from 'react-icons/fa'

const CreateProductPage = () => {
  const [categories, setCategories] = useState([])
  const [productDetails, setProductDetails] = useState({
    category: '',
    name: '',
    price: '',
    stock: '',
    size: [],
    description: '',
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const router = useRouter()

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
  const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL']

  const handleCategoryChange = (e) => {
    const { value } = e.target
    setProductDetails((prevState) => ({
      ...prevState,
      category: value || '',
    }))
  }

  const handleSizeChange = (e) => {
    const { value, checked } = e.target
    setProductDetails((prevState) => {
      const updatedSizes = checked
        ? [...prevState.size, value]
        : prevState.size.filter((size) => size !== value)
      return {
        ...prevState,
        size: updatedSizes,
      }
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value || '',
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.size <= MAX_IMAGE_SIZE)

    if (validFiles.length !== files.length) {
      showErrorToast('Some images are too large. Maximum size is 5MB.')
    }

    setImages(validFiles)
    setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    Object.entries(productDetails).forEach(([key, value]) => {
      if (key !== 'size') {
        formData.append(key, value)
      }
    })

    productDetails.size.forEach((sizeValue) => {
      formData.append('size', sizeValue)
    })

    images.forEach((file) => {
      formData.append('images', file)
    })

    try {
      await createProduct(formData)
      showSuccessToast('Product created successfully!')
      router.push('/dashboard/products')
    } catch (err) {
      console.error(err)
      showErrorToast(err?.response?.data?.error || 'Unknown error')
    }
  }

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.size <= MAX_IMAGE_SIZE)

    if (validFiles.length !== files.length) {
      showErrorToast('Some images are too large. Maximum size is 5MB.')
    }

    setImages((prev) => [...prev, ...validFiles])
    setImagePreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ])
  }

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories()
        setCategories(res.data.data || [])
      } catch (err) {
        console.error(err)
        showErrorToast('Failed to load categories')
      }
    }

    fetchCategories()
  }, [])

  const isDisabled = productDetails.category === ''
  const disabledClasses =
    'bg-slate-100 text-slate-500 cursor-not-allowed opacity-70'

  // كل المقاسات في مكان واحد
  const allSizes = [
    ...new Set([
      ...AVAILABLE_SIZES,
      ...productDetails.size.filter((s) => !AVAILABLE_SIZES.includes(s)),
    ]),
  ]

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={productDetails.category}
            onChange={handleCategoryChange}
            className="w-full border border-slate-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleInputChange}
            className={`w-full border rounded px-3 py-2 transition-all duration-300 ${isDisabled ? disabledClasses : 'border-slate-300'}`}
            required
            disabled={isDisabled}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={productDetails.price}
            onChange={handleInputChange}
            className={`w-full border rounded px-3 py-2 transition-all duration-300 ${isDisabled ? disabledClasses : 'border-slate-300'}`}
            step="0.01"
            required
            disabled={isDisabled}
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={productDetails.stock}
            onChange={handleInputChange}
            className={`w-full border rounded px-3 py-2 transition-all duration-300 ${isDisabled ? disabledClasses : 'border-slate-300'}`}
            required
            disabled={isDisabled}
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block mb-1 font-medium">Available Sizes</label>
          <div className="flex flex-wrap gap-4">
            {allSizes.map((size) => (
              <label key={size} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={size}
                  checked={productDetails.size.includes(size)}
                  onChange={handleSizeChange}
                  disabled={isDisabled}
                />
                {size}
              </label>
            ))}
          </div>

          {/* Custom Size */}
          <div className="flex mt-2">
            <input
              type="number"
              min={1}
              max={100}
              value={productDetails.customSize || ''}
              onChange={(e) =>
                setProductDetails((prevState) => ({
                  ...prevState,
                  customSize: e.target.value,
                }))
              }
              placeholder="Custom (XL)"
              className={`w-32 border rounded-s-lg rounded-e-none px-3 py-2 transition-all border-r-0 duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-slate-900 ${isDisabled ? disabledClasses : 'border-slate-300'}`}
              disabled={isDisabled}
            />
            <Button
              size="sm"
              variant="outline"
              type="button"
              disabled={isDisabled}
              className="rounded-e-lg rounded-s-none"
              onClick={() => {
                if (productDetails.customSize) {
                  const newSize = `${productDetails.customSize}XL`
                  if (!productDetails.size.includes(newSize)) {
                    setProductDetails((prevState) => ({
                      ...prevState,
                      size: [...prevState.size, newSize],
                      customSize: '',
                    }))
                  } else {
                    setProductDetails((prevState) => ({
                      ...prevState,
                      customSize: '',
                    }))
                  }
                }
              }}
            >
              <FaPlus />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={productDetails.description}
            onChange={handleInputChange}
            className={`w-full border rounded px-3 py-2 transition-all duration-300 ${isDisabled ? disabledClasses : 'border-slate-300'}`}
            rows={4}
            disabled={isDisabled}
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input
            id="mainImageInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className={`w-full border rounded px-3 py-2 transition-all duration-300 ${isDisabled ? disabledClasses : 'border-slate-300'}`}
            disabled={isDisabled}
          />

          {imagePreviews.length > 0 && (
            <div className="mt-2 space-y-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={src}
                    alt={`Preview ${images[index]?.name}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 max-w-5/9 md:max-w-6/9">
                    <p className="text-sm font-medium truncate">
                      {images[index]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size:{' '}
                      {images[index]?.size > 1024 * 1024
                        ? (images[index]?.size / (1024 * 1024)).toFixed(2) +
                          ' MB'
                        : (images[index]?.size / 1024).toFixed(2) + ' KB'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-red-500 text-white rounded-full p-1 text-xs "
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              {!isDisabled && (
                <>
                  <input
                    id="extraImageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleExtraImages}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById('extraImageInput')?.click()
                    }
                    className="flex gap-2 items-center"
                  >
                    <FaPlus /> Upload More
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isDisabled}>
          Create Product
        </Button>
      </form>
    </div>
  )
}

export default CreateProductPage
