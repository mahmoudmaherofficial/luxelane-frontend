"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct, deleteProductImage } from "@/api/products";
import { getAllCategories } from "@/api/categories";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ChromePicker } from "react-color";

const EditProductPage = () => {
  const { productId } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    size: [],
    colors: [],
    images: [],
  });
  const formDataImages = formData.images || [];
  const [customSize, setCustomSize] = useState("");
  const [customSizeType, setCustomSizeType] = useState("number");
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");

  // Predefined colors (hex codes)
  const predefinedColors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#000000", // Black
    "#FFFFFF", // White
    "#FFA500", // Orange
    "#800080", // Purple
  ];

  // Maximum file size (5MB in bytes)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5,000,000 bytes

  // Fetch product and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch product
        const productRes = await getProductById(productId);
        if (!productRes.data) {
          throw new Error("No product data returned");
        }
        const product = productRes.data;
        setFormData({
          name: product.name || "",
          price: product.price?.toString() || "",
          description: product.description || "",
          stock: product.stock?.toString() || "",
          category: product.category?._id || product.category || "",
          size: product.size || [],
          colors: product.colors || [],
          images: product.images || [],
        });
        setImagePreviews(product.images || []);

        // Fetch categories
        const categoriesRes = await getAllCategories();
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load product or categories");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    setFormData((prev) => {
      const newSizes = prev.size.includes(size) ? prev.size.filter((s) => s !== size) : [...prev.size, size];
      return { ...prev, size: newSizes };
    });
  };

  // Add custom size
  const addCustomSize = () => {
    if (!customSize) return;
    let newSize = customSize;
    if (customSizeType === "xl") {
      newSize = `${customSize}XL`;
    }
    if (!formData.size.includes(newSize)) {
      setFormData((prev) => ({ ...prev, size: [...prev.size, newSize] }));
      setCustomSize("");
    }
  };

  // Remove size
  const removeSize = (size) => {
    setFormData((prev) => ({ ...prev, size: prev.size.filter((s) => s !== size) }));
  };

  // Handle predefined color selection
  const handleColorChange = (color) => {
    if (!formData.colors.includes(color)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }));
    }
  };

  // Handle custom color selection
  const handleCustomColorChange = (color) => {
    setCustomColor(color.hex);
  };

  // Add custom color
  const addCustomColor = () => {
    if (!formData.colors.includes(customColor)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, customColor] }));
    }
    setShowColorPicker(false);
  };

  // Remove color
  const removeColor = (color) => {
    setFormData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
  };

  // Handle new image upload with size validation
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];
    const validPreviews = [];
    const oversizedFiles = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      }
    });

    if (oversizedFiles.length > 0) {
      toast.error(`Files too large: ${oversizedFiles.join(", ")}. Maximum size is 5MB.`);
    }

    setNewImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...validPreviews]);

    e.target.value = "";
  };

  // Remove image (existing or new)
  const removeImage = (index) => {
    const images = formData.images;
    const isExistingImage = index < images.length;
    if (isExistingImage) {
      const imageUrl = images[index];
      setDeletedImages((prev) => [...prev, imageUrl]);
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index),
      }));
    } else {
      const newImageIndex = index - images.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newImageIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.size.length === 0 || formData.colors.length === 0) {
      toast.error("At least one size and one color are required");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("description", formData.description || "");
    form.append("stock", formData.stock);
    form.append("category", formData.category);
    // Append size and colors as individual array elements
    formData.size.forEach((size) => form.append("size[]", size));
    formData.colors.forEach((color) => form.append("colors[]", color));
    // Append existing images (URLs)
    formData.images?.forEach((image) => form.append("existingImages[]", image));
    // Append new images (Files)
    newImages.forEach((image) => form.append("images", image));
    // Append deleted images (filenames) for backward compatibility
    deletedImages.forEach((image) => {
      const imageName = image.split("/").pop() || image;
      form.append("deletedImages[]", imageName);
    });

    // Debug: Log FormData entries
    for (const [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      setIsLoading(true);
      // Delete images explicitly
      for (const image of deletedImages) {
        const imageName = image.split("/").pop() || image;
        console.log(`Deleting image: ${imageName}`);
        try {
          await deleteProductImage(productId, encodeURIComponent(imageName));
          console.log(`Successfully deleted image: ${imageName}`);
        } catch (err) {
          console.error(`Failed to delete image ${imageName}:`, err);
          toast.warn(`Failed to delete image ${imageName}, continuing with update`);
          // Continue with other deletions and update
        }
      }

      // Update product
      console.log("Updating product...");
      await updateProduct(productId, form);
      console.log("Product updated successfully");
      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="p-4 md:p-6 lg:p-8 bg-primary-50 min-h-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md text-slate-900">
          <style jsx>{`
            .color-swatch {
              position: relative;
            }
            .color-swatch:hover::after {
              content: attr(data-hex);
              position: absolute;
              top: -2rem;
              left: 50%;
              transform: translateX(-50%);
              background: #333;
              color: white;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-size: 0.75rem;
              z-index: 10;
            }
            .color-swatch.selected::before {
              content: "✔";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 1.5rem;
              font-weight: bold;
            }
          `}</style>
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                label="Product Name"
              />
            </div>
            <div>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                label="Price"
                min={0}
              />
            </div>
            <div>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                label="Description"
              />
            </div>
            <div>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                label="Stock"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Sizes</label>
              <div className="grid grid-cols-3 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    className={`p-2 rounded-md border text-center transition-colors ${
                      formData.size.includes(size)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white border-slate-300 hover:bg-primary-100"
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  label="Custom size (e.g., 42 or 3)"
                  className="flex-1"
                />
                <select
                  value={customSizeType}
                  onChange={(e) => setCustomSizeType(e.target.value)}
                  className="p-2 border border-slate-300 rounded-md">
                  <option value="number">Number</option>
                  <option value="xl">XL</option>
                </select>
                <Button type="button" onClick={addCustomSize}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.size.map((size) => (
                  <div key={size} className="flex items-center px-2 py-1 bg-primary-100 rounded-md text-sm">
                    {size}
                    <button type="button" onClick={() => removeSize(size)} className="ml-2 text-red-500">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Colors</label>
              <div className="grid grid-cols-5 gap-4">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`color-swatch w-12 h-12 rounded-full border transition-transform transform hover:scale-110 ${
                      formData.colors.includes(color) ? "selected border-4 border-primary-500" : "border-slate-300"
                    }`}
                    style={{ backgroundColor: color }}
                    data-hex={color}
                  />
                ))}
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={() => setShowColorPicker(true)}
                  className="bg-primary-100 hover:bg-primary-200 text-slate-900">
                  Add Custom Color
                </Button>
              </div>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <ChromePicker color={customColor} onChange={handleCustomColorChange} disableAlpha={true} />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        type="button"
                        onClick={() => setShowColorPicker(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-slate-900">
                        Cancel
                      </Button>
                      <Button type="button" onClick={addCustomColor}>
                        Save
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <div key={color} className="flex items-center px-2 py-1 bg-primary-100 rounded-md text-sm">
                    <span className="w-5 h-5 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                    {color}
                    <button type="button" onClick={() => removeColor(color)} className="ml-2 text-red-500">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Images</label>
              {imagePreviews.length > 0 && (
                <div className="space-y-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-300 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={preview} alt={`Image ${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
                        <div>
                          <p className="text-sm font-medium">
                            {index < formDataImages.length
                              ? `Existing Image ${index + 1}`
                              : newImages[index - formDataImages.length]?.name}
                          </p>
                          {index >= formDataImages.length && (
                            <p className="text-sm text-slate-600">
                              {formatFileSize(newImages[index - formDataImages.length]?.size)}
                            </p>
                          )}
                          <div className="w-32 h-2 bg-primary-100 rounded-full mt-1">
                            <div className="h-2 bg-primary-500 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button type="button" onClick={() => document.getElementById("imageInput")?.click()}>
                Add Images
              </Button>
              <input
                id="imageInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Update
            </Button>
          </form>
        </motion.div>
      </section>
    </>
  );
};

export default EditProductPage;
