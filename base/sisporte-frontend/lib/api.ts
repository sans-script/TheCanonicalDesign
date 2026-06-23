import axios from "axios";
import { getInternalApiRoot } from "@/lib/internal-api-url";

/**
 * Browser: same-origin `/api` → Next proxy → Nest (evita CORS / ERR_FAILED em PDF e blobs).
 * Servidor: URL interna que o processo Next consegue resolver (INTERNAL_API_URL ou fallback).
 */
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return getInternalApiRoot();
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (hadToken && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
