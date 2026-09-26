'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    User,
    KeyRound,
    Users,
    LogOut,
    X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const { isAdmin, logout } = useAuth();

    const userNavItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Blogs', href: '/dashboard/blogs', icon: FileText },
        { label: 'Create Blog', href: '/dashboard/blogs/create', icon: PlusCircle },
        { label: 'Profile', href: '/dashboard/profile', icon: User },
        { label: 'Change Password', href: '/dashboard/change-password', icon: KeyRound },
    ];

    const adminNavItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'All Blogs', href: '/dashboard/blogs', icon: FileText },
        { label: 'Create Blog', href: '/dashboard/blogs/create', icon: PlusCircle },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Profile', href: '/dashboard/profile', icon: User },
        { label: 'Change Password', href: '/dashboard/change-password', icon: KeyRound },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs transition-opacity"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Mobile Header with close button */}
                <div className="flex items-center justify-between px-4 py-3 md:hidden border-b border-gray-100">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Navigation</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer Logout */}
                <div className="border-t border-gray-200 p-3">
                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5 text-red-500" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}