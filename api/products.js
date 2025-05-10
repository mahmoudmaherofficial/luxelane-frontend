// api/products.js
import api from "@/lib/axiosInterceptor";

export const getAllProducts = () => api.get(`/products`);
export const getPaginatedProducts = (page = 1, limit = 10) => api.get(`/products?page=${page}&limit=${limit}`);
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const deleteProductImage = (productId, imageName) => api.delete(`/products/delete-image/${productId}/${imageName}`);