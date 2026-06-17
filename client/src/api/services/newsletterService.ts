import apiClient from '../apiClient';
import type { ApiResponse } from '../types/api';
import { getApiErrorMessage } from '../utils/apiError';

export type NewsletterStatus = 'active' | 'unsubscribed';

export interface NewsletterSubscriber {
    _id: string;
    email: string;
    status: NewsletterStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNewsletterData {
    email: string;
}

export interface NewsletterListParams {
    page?: number;
    limit?: number;
    status?: NewsletterStatus;
}

export interface NewsletterPagination {
    currentPage: number;
    totalPages: number;
    totalSubscribers: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface NewsletterListResponse {
    success: boolean;
    message: string;
    data: {
        subscribers: NewsletterSubscriber[];
        pagination: NewsletterPagination;
    };
}

export interface NewsletterResponse {
    success: boolean;
    message: string;
    data: NewsletterSubscriber;
}

export interface NewsletterSubscribeResponse {
    success: boolean;
    message: string;
}

export interface NewsletterCampaignPayload {
    subject: string;
    content: string;
}

export interface NewsletterCampaignResult {
    sent: number;
    failed: number;
    total: number;
}

export interface NewsletterCampaignResponse {
    success: boolean;
    message: string;
    data: NewsletterCampaignResult;
}

const NEWSLETTER_PATH = '/newsletter';

function buildQueryString(params?: NewsletterListParams): string {
    if (!params) return '';

    const query = new URLSearchParams();
    if (params.page != null) query.append('page', String(params.page));
    if (params.limit != null) query.append('limit', String(params.limit));
    if (params.status) query.append('status', params.status);

    const qs = query.toString();
    return qs ? `?${qs}` : '';
}

export const newsletterService = {
    /** POST /api/v1/newsletter */
    subscribe: async (
        data: CreateNewsletterData,
    ): Promise<NewsletterSubscribeResponse> => {
        try {
            const response = await apiClient.post<NewsletterSubscribeResponse>(
                NEWSLETTER_PATH,
                data,
            );

            return response.data;
        } catch (error) {
            throw new Error(
                getApiErrorMessage(
                    error,
                    'Failed to subscribe to newsletter',
                ),
            );
        }
    },

    getSubscribers: async (params?: NewsletterListParams): Promise<NewsletterListResponse> => {
        try {
            const response = await apiClient.get<NewsletterListResponse>(
                `${NEWSLETTER_PATH}${buildQueryString(params)}`,
            );
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch newsletter subscribers'));
        }
    },

    deleteSubscriber: async (id: string): Promise<ApiResponse> => {
        try {
            const response = await apiClient.delete<ApiResponse>(`${NEWSLETTER_PATH}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to delete subscriber'));
        }
    },

    /** POST /api/v1/newsletter/send */
    sendCampaign: async (
        data: NewsletterCampaignPayload,
    ): Promise<NewsletterCampaignResponse> => {
        try {
            const response = await apiClient.post<NewsletterCampaignResponse>(
                `${NEWSLETTER_PATH}/send`,
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(
                getApiErrorMessage(error, 'Failed to send newsletter campaign'),
            );
        }
    },
};

export const { subscribe, getSubscribers, deleteSubscriber, sendCampaign } = newsletterService;

/** Subscribe to newsletter — POST /api/v1/newsletter */
export const createNewsletter = subscribe;

export default newsletterService;
