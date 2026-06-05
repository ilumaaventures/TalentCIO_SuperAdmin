import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import api, { SUPER_ADMIN_TOKEN_KEY } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const authRequestIdRef = useRef(0);

    useEffect(() => {
        const fetchMe = async () => {
            const requestId = authRequestIdRef.current + 1;
            authRequestIdRef.current = requestId;
            try {
                const { data } = await api.get('/auth/me');
                if (authRequestIdRef.current !== requestId) return;
                setAdmin(data);
            } catch (err) {
                if (authRequestIdRef.current !== requestId) return;
                sessionStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
                setAdmin(null);
            } finally {
                if (authRequestIdRef.current === requestId) {
                    setLoading(false);
                }
            }
        };
        fetchMe();
    }, []);

    const login = async (email, password) => {
        const requestId = authRequestIdRef.current + 1;
        authRequestIdRef.current = requestId;
        const { data } = await api.post('/auth/login', { email, password });
        if (data?.token) {
            sessionStorage.setItem(SUPER_ADMIN_TOKEN_KEY, data.token);
        }

        try {
            const meResponse = await api.get('/auth/me');
            if (authRequestIdRef.current !== requestId) {
                throw new Error('Superseded login request');
            }
            setAdmin(meResponse.data);
            setLoading(false);
            return { ...data, admin: meResponse.data };
        } catch (err) {
            sessionStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
            setAdmin(null);
            setLoading(false);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            if (err.response?.status && err.response.status !== 401) {
                console.error('Super admin logout failed:', err);
            }
        } finally {
            sessionStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
            setAdmin(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ admin, setAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
