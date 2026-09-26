'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return <Loader fullScreen text="Checking authentication..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Responsive Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content Area */}
                <main className="flex-1 transition-all md:pl-64 flex flex-col">
                    {/* Mobile Sidebar Toggle Button */}
                    <div className="md:hidden border-b border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 p-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Menu className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-xs">Menu</span>
                        </button>
                    </div>

                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-6xl">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}