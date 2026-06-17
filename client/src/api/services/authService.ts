import apiClient from '../apiClient';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
}

export interface MeResponse {
    success: boolean;
    message: string;
    data: { email: string; };
}

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', payload);
        return response.data;
    },

    me: async (): Promise<MeResponse> => {
        const response = await apiClient.get<MeResponse>('/auth/me');
        return response.data;
    },
};

export default authService;
