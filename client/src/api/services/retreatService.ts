import apiClient from '../apiClient';
import type { ApiResponse } from '../types/api';
import { getApiErrorMessage } from '../utils/apiError';

export type RetreatStatus =
    | 'inquiry'
    | 'waitlisted'
    | 'deposit_pending'
    | 'confirmed'
    | 'cancelled';

export type RetreatLocation = 'rishikesh' | 'jaisalmer' | 'sri-lanka' | 'gangtok';

export interface Retreat {
    _id: string;
    name: string;
    phone: string;
    email: string;
    location: RetreatLocation;
    details: string;
    status: RetreatStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateRetreatData {
    status?: RetreatStatus;
    location?: RetreatLocation;
}

export interface RetreatStatsOverview {
    totalRetreats: number;
    inquiry: number;
    waitlisted: number;
    deposit_pending: number;
    confirmed: number;
    cancelled: number;
}

export interface RetreatStats {
    overview: RetreatStatsOverview;
    locations: Record<RetreatLocation, number>;
}

export interface RetreatsResponse {
    success: boolean;
    message: string;
    data: {
        retreats: Retreat[];
        total: number;
    };
}

export interface RetreatResponse {
    success: boolean;
    message: string;
    data: Retreat;
}

export interface RetreatStatsResponse {
    success: boolean;
    message: string;
    data: RetreatStats;
}

export interface SubmitRetreatInquiryData {
    name: string;
    phone: string;
    email: string;
    location: string;
    details: string;
}

export interface SubmitRetreatInquiryResponse {
    success: boolean;
    message: string;
    data: Retreat;
}

const RETREATS_PATH = '/retreats';

export const retreatService = {
    /** POST /api/v1/retreats — public inquiry (validate(schemas.retreat)) */
    submitRetreatInquiry: async (
        formData: SubmitRetreatInquiryData,
    ): Promise<SubmitRetreatInquiryResponse> => {
        try {
            const response = await apiClient.post<SubmitRetreatInquiryResponse>(
                RETREATS_PATH,
                formData,
            );
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to submit retreat inquiry'));
        }
    },

    getRetreats: async (): Promise<RetreatsResponse> => {
        try {
            const response = await apiClient.get<RetreatsResponse>(RETREATS_PATH);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch retreats'));
        }
    },

    getRetreatStats: async (): Promise<RetreatStatsResponse> => {
        try {
            const response = await apiClient.get<RetreatStatsResponse>(`${RETREATS_PATH}/stats`);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch retreat statistics'));
        }
    },

    updateRetreat: async (id: string, data: UpdateRetreatData): Promise<RetreatResponse> => {
        try {
            const response = await apiClient.patch<RetreatResponse>(`${RETREATS_PATH}/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to update retreat'));
        }
    },

    deleteRetreat: async (id: string): Promise<ApiResponse> => {
        try {
            const response = await apiClient.delete<ApiResponse>(`${RETREATS_PATH}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to delete retreat'));
        }
    },
};

export const {
    submitRetreatInquiry,
    getRetreats,
    getRetreatStats,
    updateRetreat,
    deleteRetreat,
} = retreatService;

export default retreatService;
