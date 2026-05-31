import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────────────────────────
//  CONFIGURACAO DO IP — LEIA ANTES DE INICIAR
// ─────────────────────────────────────────────────────────────────
//
//  WINDOWS:
//    1. Abre o CMD e executa: ipconfig
//    2. Copia o "Endereco IPv4" (ex: 192.168.1.45)
//    3. Substitui abaixo: 'http://192.168.1.45:3000/api'
//
//  LINUX / MAC:
//    1. Abre o terminal e executa: hostname -I
//    2. Copia o primeiro IP (ex: 192.168.1.45)
//    3. Substitui abaixo: 'http://192.168.1.45:3000/api'
//
//  ANDROID EMULATOR (AVD) em qualquer sistema:
//    Usa: 'http://10.0.2.2:3000/api'  (ja esta definido abaixo)
//
//  IMPORTANTE: O telemovel e o computador devem estar
//              na mesma rede Wi-Fi!
// ─────────────────────────────────────────────────────────────────

const API_URL = 'http://192.168.107.195:3000/api'; // <- substitui pelo teu IP se usares telemovel fisico

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || 'Erro de ligacao ao servidor';
    return Promise.reject(new Error(msg));
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const userAPI = {
  getDocentes: (params) => api.get('/users/docentes', { params }),
  getDocenteById: (id) => api.get(`/users/docentes/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const meetingAPI = {
  create: (data) => api.post('/meetings', data),
  getAll: (params) => api.get('/meetings', { params }),
  getById: (id) => api.get(`/meetings/${id}`),
  updateStatus: (id, data) => api.patch(`/meetings/${id}/status`, data),
  cancel: (id) => api.patch(`/meetings/${id}/cancel`),
  avaliar: (id, data) => api.post(`/meetings/${id}/avaliacao`, data),
};

export const dispAPI = {
  getByDocente: (id) => api.get(`/disponibilidades/${id}`),
  create: (data) => api.post('/disponibilidades', data),
  delete: (id) => api.delete(`/disponibilidades/${id}`),
};

export const messageAPI = {
  send: (meetingId, data) => api.post(`/messages/${meetingId}`, data),
  getAll: (meetingId) => api.get(`/messages/${meetingId}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
};

export default api;
