'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken, clearAuth, setUserData, getUserData } from '@/utils/auth';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 1. Logout handler defined first
    const logout = useCallback(() => {
        clearAuth();
        setUser(null);
        setAuthToken(null);
        router.push('/login');
    }, [router]);

    // 2. Load user profile from backend
    const fetchUserProfile = useCallback(async () => {
        try {
            const data = await userService.getProfile();
            const profile = data.user || data.data || data;
            setUser(profile);
            setUserData(profile);
            return profile;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            logout();
            return null;
        }
    }, [logout]);

    // 3. Restore authentication state on mount or refresh
    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = getToken();
            const savedUser = getUserData();

            if (savedToken) {
                setAuthToken(savedToken);
                if (savedUser) {
                    setUser(savedUser);
                }
                await fetchUserProfile();
            }
            setLoading(false);
        };

        initializeAuth();
    }, [fetchUserProfile]);

    // 4. Login handler
    const login = async (credentials) => {
        const data = await authService.login(credentials);
        const authToken = data.token || data.accessToken || data.data?.token;

        if (!authToken) {
            throw new Error('Authentication token not received.');
        }

        setToken(authToken);
        setAuthToken(authToken);

        const profile = await fetchUserProfile();
        return { token: authToken, user: profile };
    };

    // 5. Instant update for profile details and avatar without re-login
    const updateUserState = (updatedFields) => {
        setUser((prev) => {
            const updated = { ...prev, ...updatedFields };
            setUserData(updated);
            return updated;
        });
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'Admin',
        login,
        logout,
        fetchUserProfile,
        updateUserState,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};