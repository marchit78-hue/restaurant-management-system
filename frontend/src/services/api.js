import axios from 'axios';

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001/api'
    : 'https://arch-restaurant-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (
  loginId,
  password,
  role
) => {
  const response = await api.post('/auth/login', {
    loginId,
    password,
    role,
  });

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(
    '/auth/register',
    userData
  );

  return response.data;
};

export const getMenu = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const addMenu = async (menuData) => {
  const response = await api.post('/menu', menuData);
  return response.data;
};

export const updateMenu = async (id, menuData) => {
  const response = await api.put(
    `/menu/${id}`,
    menuData
  );

  return response.data;
};

export const deleteMenu = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export const toggleMenuAvailability = async (id) => {
  const response = await api.patch(
    `/menu/${id}/availability`
  );

  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const addOrder = async (orderData) => {
  const response = await api.post(
    '/orders',
    orderData
  );

  return response.data;
};

export const updateOrder = async (
  id,
  orderData
) => {
  const response = await api.put(
    `/orders/${id}`,
    orderData
  );

  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(
    `/orders/${id}`
  );

  return response.data;
};

export const saveCart = async (cartData) => {
  const response = await api.post(
    '/cart',
    cartData
  );

  return response.data;
};

export const getMyCart = async () => {
  const response = await api.get('/cart/my');
  return response.data;
};

export const getAllCarts = async () => {
  const response = await api.get('/cart/all');
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export const submitFeedback = async (
  feedbackData
) => {
  const response = await api.post(
    '/feedback',
    feedbackData
  );

  return response.data;
};

export const getAllFeedback = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

export const getMyFeedback = async () => {
  const response = await api.get('/feedback/my');
  return response.data;
};

export const getFoodRatings = async () => {
  const response = await api.get(
    '/feedback/food-ratings'
  );

  return response.data;
};

export default api;