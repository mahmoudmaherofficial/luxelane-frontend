import api from "@/lib/axiosInterceptor"

export const getAllCategories = () => api.get(`/categories`)
export const getPaginatedCategories = (page = 1, limit = 10) => api.get(`/categories?page=${page}&limit=${limit}`)
export const getCategoryById = (categoryId) => api.get(`/categories/${categoryId}`)
export const createCategory = (data) => api.post("/categories", data)
export const updateCategory = (categoryId, data) => api.put(`/categories/${categoryId}`, data)
export const deleteCategory = (categoryId) => api.delete(`/categories/${categoryId}`)
