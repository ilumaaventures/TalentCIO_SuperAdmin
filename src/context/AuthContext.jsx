import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            if (localStorage.getItem('superadminToken')) {
                try {
                    const { data } = await api.get('/auth/me');
                    setAdmin(data);
                } catch (err) {
                    localStorage.removeItem('superadminToken');
                }
            }
            setLoading(false);
        };
        fetchMe();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('superadminToken', data.token);
        setAdmin(data.admin);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('superadminToken');
        setAdmin(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ admin, setAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
