import axios from 'axios';

type ApiErrorBody = {
    message?: string;
    errors?: string[];
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiErrorBody | undefined;
        if (data?.errors?.length) {
            return data.errors.join(', ');
        }
        if (data?.message) {
            return data.message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
