// lib/api.ts

const BASE = "https://shuvoabdullah.pythonanywhere.com";

// CSRF token cookies থেকে নেওয়া
function getCsrfToken(): string {
    if (typeof document === 'undefined') return '';
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return '';
}

async function req<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
    const csrfToken = getCsrfToken();
    
    const res = await fetch(`${BASE}${endpoint}`, {
        ...init,
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        ...init.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${res.status}`);
    }
    if (res.status === 204) return {} as T;
    return res.json();
}

/* ── Auth ── */
export const authApi = {
    login: (email: string, password: string) =>
        req<{ message: string; user: import('@/types').User }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        }),
    logout: () => req('/auth/logout/', { method: 'POST' }),
    me: () => req<import('@/types').User>('/auth/me/'),
};

/* ── Tasks ── */
export const taskApi = {
    list: (params?: Record<string, string>) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return req<import('@/types').Task[]>(`/tasks/${q}`);
    },
    create: (data: object) =>
        req<import('@/types').Task>('/tasks/', {
        method: 'POST',
        body: JSON.stringify(data),
        }),
    update: (id: number, data: object) =>
        req<import('@/types').Task>(`/tasks/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        }),
    delete: (id: number) => req(`/tasks/${id}/`, { method: 'DELETE' }),
    reorder: (items: object[]) =>
        req('/tasks/reorder/', {
        method: 'PATCH',
        body: JSON.stringify(items),
        }),
};

/* ── Tags ── */
export const tagApi = {
    list: () => req<import('@/types').Tag[]>('/tags/'),
    create: (data: object) =>
        req<import('@/types').Tag>('/tags/', {
        method: 'POST',
        body: JSON.stringify(data),
        }),
};

/* ── Annotation Images ── */
export const imageApi = {
    list: () => req<import('@/types').AnnotationImage[]>('/images/'),

    upload: async (formData: FormData): Promise<import('@/types').AnnotationImage> => {
        const csrfToken = getCsrfToken();
        
        const res = await fetch(`${BASE}/images/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            // Content-Type দেবেন না - browser নিজে multipart boundary সেট করবে
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        },
        body: formData,
        });

        if (!res.ok) {
        // error response details দেখার জন্য
        const errText = await res.text();
        console.error('Upload error response:', errText);
        
        let errMsg = 'Upload failed';
        try {
            const errJson = JSON.parse(errText);
            errMsg = errJson.error || errJson.detail || JSON.stringify(errJson);
        } catch {
            errMsg = errText || `Upload failed: ${res.status}`;
        }
        throw new Error(errMsg);
        }

        return res.json();
    },

    delete: (id: number) => req(`/images/${id}/`, { method: 'DELETE' }),
};

/* ── Polygons ── */
export const polygonApi = {
    list: (imageId: number) =>
        req<import('@/types').Polygon[]>(`/images/${imageId}/polygons/`),

    create: (
        imageId: number,
        data: { label: string; color: string; points: import('@/types').PolygonPoint[] }
    ) =>
        req<import('@/types').Polygon>(`/images/${imageId}/polygons/`, {
        method: 'POST',
        body: JSON.stringify({ ...data, image: imageId }),
        }),

    bulkSave: (
        imageId: number,
        polygons: Array<{
        label: string;
        color: string;
        points: import('@/types').PolygonPoint[];
        }>
    ) =>
        req<{ saved: import('@/types').Polygon[] }>(
        `/images/${imageId}/polygons/bulk/`,
        {
            method: 'POST',
            body: JSON.stringify({ polygons }),
        }
        ),

    delete: (polygonId: number) =>
        req(`/polygons/${polygonId}/`, { method: 'DELETE' }),
};