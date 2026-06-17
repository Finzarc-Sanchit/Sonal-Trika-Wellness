export interface ContactSubmissionPayload {
    name: string;
    phone: string;
    email: string;
    message: string;
}

export interface ContactSubmissionErrors {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error';