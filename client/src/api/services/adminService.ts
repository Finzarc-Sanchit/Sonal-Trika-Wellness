import apiClient from '../apiClient';
import { getApiErrorMessage } from '../utils/apiError';

export type OverviewRange = '3_months' | '6_months' | 'ytd' | 'all_time';

export interface ServiceBarDataItem {
    service: string;
    count: number;
}

export interface RetreatBarDataItem {
    location: string;
    count: number;
}

export interface OverviewStats {
    range: OverviewRange;
    servicesData: ServiceBarDataItem[];
    retreatsData: RetreatBarDataItem[];
}

export interface OverviewStatsResponse {
    success: boolean;
    message: string;
    data: OverviewStats;
}

export const adminService = {
    getOverviewStats: async (range: OverviewRange = '6_months'): Promise<OverviewStatsResponse> => {
        try {
            const response = await apiClient.get<OverviewStatsResponse>('/admin/overview-stats', {
                params: { range },
            });
            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Failed to fetch overview statistics'));
        }
    },
};

export default adminService;
