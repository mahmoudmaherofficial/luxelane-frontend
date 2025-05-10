import api from "@/lib/axiosInterceptor";

export const getAllOrders = () => api.get(`/orders`);
export const getPaginatedOrders = (page, limit) => api.get(`/orders?page=${page}&limit=${limit}`);
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getOrdersByUserId = (id) => api.get(`/orders/user/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);