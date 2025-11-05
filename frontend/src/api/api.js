import axios from "axios";

export const API_URL = "https://cross-platform-mt.vercel.app/api/users"; 

// GET: Lấy tất cả users
export const getUsers = () => axios.get(API_URL);

// POST: Tạo user mới
export const addUser = (data) =>
  axios.post(API_URL, data, { 
    headers: { "Content-Type": "multipart/form-data" } 
  });

// PUT: Cập nhật user
export const updateUser = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, { 
    headers: { "Content-Type": "multipart/form-data" } 
  });

// DELETE: Xóa user
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
