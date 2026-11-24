import axiosInstance from './axiosInstance';

export const getAllCommandes = () => axiosInstance.get('/commandes');

export const getClientCommandes = () => axiosInstance.get('/commandes/client');

export const getLivreurCommandes = () => axiosInstance.get('/commandes/livreur');

export const createCommandeByClient = (data) => axiosInstance.post('/commandes/create', data);

export const createCommandeByAdmin = (data) => axiosInstance.post('/commandes/admin/create', data);

export const modifyEtatCommande = (id, data) => axiosInstance.put(`/commandes/modify/${id}`, data);

export const setFraisLivraison = (id, data) => axiosInstance.put(`/commandes/frais/${id}`, data);

export const toggleItemPickup = (commandeId, itemId, pickedUp) => 
  axiosInstance.put(`/commandes/${commandeId}/items/${itemId}/pickup`, { pickedUp });

export const togglePayeMagasin = (commandeId, payeAuMagasinParLivreur) => 
  axiosInstance.put(`/commandes/${commandeId}/paye-magasin`, { payeAuMagasinParLivreur });

export const annulerCommandeByClient = (id) => axiosInstance.put(`/commandes/client/annuler/${id}`);

export const annulerCommande = (id) => axiosInstance.put(`/commandes/annuler/${id}`);
