import axios, { type AxiosError, type AxiosResponse } from 'axios';

const ADMIN_TOKEN_KEY = 'adminToken';

const normalizeApiBaseUrl = (url: string): string => {
    const trimmed = url.replace(/\/$/, '');
    if (trimmed.endsWith('/api/v1')) {
        return trimmed;
    }
    return `${trimmed}/api/v1`;
};

const getApiBaseUrl = (): string => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
    }

    if (import.meta.env.DEV) {
        return '/api/v1';
    }

    return `${window.location.origin}/api/v1`;
};

const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
        }

        return Promise.reject(error);
    },
);

export { ADMIN_TOKEN_KEY };
export default apiClient;
