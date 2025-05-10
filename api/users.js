import api from "@/lib/axiosInterceptor";

export const getAllUsers = () => api.get(`/users`);
export const getPaginatedUsers = (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`);
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
