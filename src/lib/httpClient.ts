import axiosInstance from './axiosInstance';

// ─── Backend response envelope ────────────────────────────────────────────────
// The backend wraps responses in:
// { success: boolean, message: string, data: T, timestamp: string, path: string, total?: number, meta?: ... }
// We unwrap data while preserving pagination metadata (meta, total, totalPages, page, limit)
// so list endpoints retain their pagination information.

interface BackendEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  timestamp?: string;
  path?: string;
}

function unwrap<T>(body: unknown): T {
  if (
    body !== null &&
    typeof body === 'object' &&
    'success' in (body as object) &&
    'data' in (body as object)
  ) {
    const env = body as BackendEnvelope<T> & Record<string, unknown>;

    // If data is an array AND the envelope carries pagination metadata (meta, total, totalPages, etc.),
    // return an object that combines data with the metadata so list normalisers can read total/totalPages.
    if (Array.isArray(env.data)) {
      const hasMeta = env.meta || env.total !== undefined || env.totalPages !== undefined || env.totalCount !== undefined;
      if (hasMeta) {
        return {
          data: env.data,
          meta: env.meta ?? {
            total: env.total ?? env.totalCount ?? env.count,
            totalPages: env.totalPages,
            page: env.page,
            limit: env.limit,
          },
          total: env.total ?? env.totalCount ?? env.count,
          totalPages: env.totalPages,
          page: env.page,
          limit: env.limit,
        } as unknown as T;
      }
    }

    return env.data;
  }
  // Otherwise return as-is (handles plain array or direct-object responses)
  return body as T;
}

// ─── Generic API methods ──────────────────────────────────────────────────────

export const api = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await axiosInstance.get(url, { params });
    return unwrap<T>(response.data);
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.post(url, data);
    return unwrap<T>(response.data);
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.put(url, data);
    return unwrap<T>(response.data);
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.patch(url, data);
    return unwrap<T>(response.data);
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.delete(url);
    return unwrap<T>(response.data);
  },

  upload: async <T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return unwrap<T>(response.data);
  },
};

export default api;
