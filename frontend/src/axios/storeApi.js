import axiosInstance from './axiosInstance';

export const getAllStores = () => axiosInstance.get('/stores');

export const getStoreById = (id) => axiosInstance.get(`/stores/${id}`);

export const createStore = (data) => axiosInstance.post('/stores', data);

export const updateStore = (id, data) => axiosInstance.put(`/stores/${id}`, data);

export const deleteStore = (id) => axiosInstance.delete(`/stores/${id}`);

export const addItemToStore = (storeId, itemData) => axiosInstance.post(`/stores/${storeId}/items`, itemData);

export const deleteItemFromStore = (storeId, itemId) => axiosInstance.delete(`/stores/${storeId}/items/${itemId}`);

export const recordStorePayment = (storeId, amount) => axiosInstance.post(`/stores/${storeId}/payment`, { amount });
