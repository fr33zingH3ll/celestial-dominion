import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { verify } from '../../../api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const location = useLocation();
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const fetchResult = async (token) => {
            const result = await verify(token);
            setLogged(result);
        };
        fetchResult(token);
    }, [location]);

    return (
        <AuthContext.Provider value={{ logged }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
