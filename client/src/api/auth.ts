import { ADMIN_TOKEN_KEY } from './apiClient';
import { authService } from './services/authService';
import { getApiErrorMessage } from './utils/apiError';

export function getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
}

export function clearAdminToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
    return Boolean(getAdminToken());
}

export async function login(email: string, password: string): Promise<void> {
    clearAdminToken();

    try {
        const response = await authService.login({ email, password });
        setAdminToken(response.token);
    } catch (err) {
        throw new Error(getApiErrorMessage(err, 'Sign in failed. Please try again.'));
    }
}

/** Validates JWT against GET /auth/me */
export async function verifyAdminToken(): Promise<boolean> {
    const token = getAdminToken();
    if (!token) return false;

    try {
        await authService.me();
        return true;
    } catch {
        clearAdminToken();
        return false;
    }
}
