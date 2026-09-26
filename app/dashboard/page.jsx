'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome, {user?.firstName || 'User'}!</p>
        </div>
    );
}