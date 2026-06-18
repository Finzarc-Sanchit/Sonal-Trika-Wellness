import apiClient from '../apiClient';
import type { ApiResponse } from '../types/api';
import { getApiErrorMessage } from '../utils/apiError';
import type { ContactServiceSlug } from '../../data/contactServices';

export type ContactStatus = 'new' | 'contacted' | 'in_progress' | 'completed';

export interface Contact {
    _id: string;
    name: string;
    phone: string;
    email: string;
    service: ContactServiceSlug;
    message: string;
    status: ContactStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactData {
    phone: string;
    email: string;
    name: string;
    service: ContactServiceSlug;
    message: string;
}

export interface UpdateContactData {
    status?: ContactStatus;
}

export interface ContactListParams {
    page?: number;
    limit?: number;
    status?: ContactStatus;
    subject?: string;
    email?: string;
    startDate?: string;
    endDate?: string;
}

export interface ContactPagination {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ContactStatsOverview {
    totalContacts?: number;
    newContacts?: number;
    contactedContacts?: number;
    inProgressContacts?: number;
    completedContacts?: number;
}

export interface MonthlyContactStat {
    _id: {
        year: number;
        month: number;
    };
    count: number;
}

export interface ContactStats {
    overview: ContactStatsOverview;
    subjects: Record<string, number>;
    monthly: MonthlyContactStat[];
}

export interface ContactsResponse {
    success: boolean;
    message: string;
    data: {
        contacts: Contact[];
        pagination: ContactPagination;
    };
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data: Contact;
}

export interface StatsResponse {
    success: boolean;
    message: string;
    data: ContactStats;
}

const CONTACTS_PATH = '/contacts';

function buildQueryString(params?: ContactListParams): string {
    if (!params) return '';

    const query = new URLSearchParams();

    if (params.page != null) query.append('page', String(params.page));
    if (params.limit != null) query.append('limit', String(params.limit));
    if (params.status) query.append('status', params.status);
    if (params.subject) query.append('subject', params.subject);
    if (params.email) query.append('email', params.email);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);

    const qs = query.toString();
    return qs ? `?${qs}` : '';
}

export const contactService = {
    getContacts: async (params?: ContactListParams): Promise<ContactsResponse> => {
        try {
            const response = await apiClient.get<ContactsResponse>(
                `${CONTACTS_PATH}${buildQueryString(params)}`,
            );
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch contacts'));
        }
    },

    getContactById: async (id: string): Promise<ContactResponse> => {
        try {
            const response = await apiClient.get<ContactResponse>(`${CONTACTS_PATH}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch contact'));
        }
    },

    createContact: async (contactData: CreateContactData): Promise<ContactResponse> => {
        try {
            const response = await apiClient.post<ContactResponse>(CONTACTS_PATH, contactData);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to submit contact form'));
        }
    },

    updateContact: async (id: string, updateData: UpdateContactData): Promise<ContactResponse> => {
        try {
            const response = await apiClient.put<ContactResponse>(`${CONTACTS_PATH}/${id}`, updateData);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to update contact'));
        }
    },

    deleteContact: async (id: string): Promise<ApiResponse> => {
        try {
            const response = await apiClient.delete<ApiResponse>(`${CONTACTS_PATH}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to delete contact'));
        }
    },

    getContactStats: async (): Promise<StatsResponse> => {
        try {
            const response = await apiClient.get<StatsResponse>(`${CONTACTS_PATH}/stats`);
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch contact statistics'));
        }
    },
};

export const {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getContactStats,
} = contactService;

export default contactService;
