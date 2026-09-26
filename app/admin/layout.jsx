'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/Loader';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function AdminLayout({ children }) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'admin' && user?.role !== 'Admin') {
                router.push('/dashboard');
            }
        }
    }, [user, loading, isAuthenticated, router]);

    if (loading) {
        return <Loader text="Verifying admin credentials..." />;
    }

    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'Admin')) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
                    <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        You do not have administrative privileges to view this area.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
            </div>
        </div>
    );
}