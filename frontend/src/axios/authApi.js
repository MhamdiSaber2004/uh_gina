import axiosInstance from './axiosInstance';

export const login = (credentials) => axiosInstance.post('/auth/login', credentials);

export const register = (userData) => axiosInstance.post('/auth/register', userData);

export const addlivreur = (data) => axiosInstance.post('/auth/addlivreur' , data);

export const getUser = (role, id) => axiosInstance.get(`/auth/${role}/${id}`);

export const modifyUser = (role, id, data) => axiosInstance.put(`/auth/${role}/modify/${id}`, data);

export const getAllClients = () => axiosInstance.get('/auth/clients');
export const getAllLivreurs = () => axiosInstance.get('/auth/livreurs');
export const getAllAdmins = () => axiosInstance.get('/auth/admins');
