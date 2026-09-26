'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from './ProfileMenu';
import { BookOpen, LayoutDashboard, PlusCircle } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, loading } = useAuth();

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-gray-900 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition group-hover:bg-blue-700">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="tracking-tight">
                        Blog<span className="text-blue-600">Space</span>
                    </span>
                </Link>

                {/* Center / Right Navigation Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {loading ? (
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
                    ) : isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                <LayoutDashboard className="h-4 w-4 text-gray-500" />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href="/dashboard/blogs/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Write Blog</span>
                            </Link>

                            <ProfileMenu />
                        </>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/login"
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}