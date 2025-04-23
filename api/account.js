import api from "./axiosInterceptor";

export const getAccount = () => api.get("/account");
export const updateAccount = (data) => api.put("/account", data);
export const deleteAccount = () => api.delete("/account");