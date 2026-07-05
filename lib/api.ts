// lib/api.ts
const BASE = "https://shuvoabdullah.pythonanywhere.com";

// ✅ JWT Token helpers - localStorage তে store করবো
export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
  getRefresh: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },
  set: (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// ✅ Token refresh করার function
async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      tokenStorage.clear();
      return null;
    }

    const data = await res.json();
    // নতুন access token save করো
    localStorage.setItem('access_token', data.access);
    return data.access;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

// ✅ Main request function - CSRF সরিয়ে JWT দিলাম
async function req<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  let accessToken = tokenStorage.getAccess();

  const makeRequest = async (token: string | null) => {
    return fetch(`${BASE}${endpoint}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        // ✅ Bearer token header
        ...(token && { Authorization: `Bearer ${token}` }),
        ...init.headers,
      },
    });
  };

  let res = await makeRequest(accessToken);

  // ✅ 401 হলে token refresh করে retry করো
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await makeRequest(newToken);
    } else {
      // Refresh ও fail - logout করো
      tokenStorage.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Session expired. Please login again.');
    }
  }

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
    // ✅ এখন access + refresh + user return করবে
    req<{ message: string; access: string; refresh: string; user: import('@/types').User }>(
      '/auth/login/',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),
  signup: (data: {
        username: string;
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
    }) =>
        req<{ message: string }>('/auth/signup/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
  // ✅ Logout এ refresh token পাঠাতে হবে
  logout: () =>
    req('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: tokenStorage.getRefresh() }),
    }),

  me: () => req<import('@/types').User>('/auth/me/'),
  // ✅ নতুন Google Login method
  googleLogin: (credential: string) =>
    req<{
      message: string;
      access: string;
      refresh: string;
      user: import('@/types').User;
    }>('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
    forgotPasswordRequest: (email: string) =>
      req<{ message: string }>('/auth/forgot-password/', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    forgotPasswordVerify: (email: string, otp: string) =>
      req<{ message: string; reset_token: string }>(
        '/auth/forgot-password/verify/',
        {
          method: 'POST',
          body: JSON.stringify({ email, otp }),
        }
      ),

    forgotPasswordReset: (
      email: string,
      reset_token: string,
      new_password: string
    ) =>
      req<{ message: string }>('/auth/forgot-password/reset/', {
        method: 'POST',
        body: JSON.stringify({ email, reset_token, new_password }),
      }),
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
    const accessToken = tokenStorage.getAccess();

    const res = await fetch(`${BASE}/images/`, {
      method: 'POST',
      headers: {
        // ✅ Content-Type দেবো না (multipart এর জন্য)
        // ✅ JWT header দিচ্ছি
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: formData,
    });

    if (!res.ok) {
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