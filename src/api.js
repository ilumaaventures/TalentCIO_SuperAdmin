import axios from 'axios';

const SUPER_ADMIN_TOKEN_KEY = 'talentcio_superadmin_access_token';
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
const LOGIN_ROUTE = '/login';

const resolveApiBaseUrl = (rawUrl) => {
    if (typeof window === 'undefined' || !rawUrl) {
        return rawUrl;
    }

    const browserHost = String(window.location.hostname || '').trim().toLowerCase();
    const isLocalBrowserHost = browserHost === 'localhost' || browserHost === '127.0.0.1';

    if (!isLocalBrowserHost) {
        return rawUrl;
    }

    try {
        const parsedUrl = new URL(rawUrl);
        const apiHost = parsedUrl.hostname.toLowerCase();
        const isLocalApiHost = apiHost === 'localhost' || apiHost === '127.0.0.1';

        if (!isLocalApiHost || apiHost === browserHost) {
            return parsedUrl.toString().replace(/\/$/, '');
        }

        parsedUrl.hostname = browserHost;
        return parsedUrl.toString().replace(/\/$/, '');
    } catch {
        return rawUrl;
    }
};

const api = axios.create({
    baseURL: `${resolveApiBaseUrl(DEFAULT_API_BASE_URL)}/api/superadmin`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem(SUPER_ADMIN_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const isAuthSessionRequest = (requestUrl = '') => (
    requestUrl.includes('/auth/me') || requestUrl.includes('/auth/logout')
);

const isLoginRoute = () => (
    typeof window !== 'undefined'
    && window.location.pathname === LOGIN_ROUTE
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = String(error.config?.url || '');
        if (error.response?.status === 401 && isAuthSessionRequest(requestUrl)) {
            sessionStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);

            if (!isLoginRoute()) {
                window.location.replace(LOGIN_ROUTE);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
export { SUPER_ADMIN_TOKEN_KEY };
