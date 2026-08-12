import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const getMenu = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const addMenu = async (menuData) => {
  const response = await api.post('/menu', menuData);
  return response.data;
};

export const updateMenu = async (id, menuData) => {
  const response = await api.put(`/menu/${id}`, menuData);
  return response.data;
};

export const deleteMenu = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const addOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await api.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export default api;
