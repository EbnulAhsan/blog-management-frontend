'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { User, KeyRound, LogOut, ChevronDown, Shield } from 'lucide-react';

export default function ProfileMenu() {
    const { user, logout, isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff`;
    const avatarUrl = user.profileImage || user.avatar || defaultAvatar;

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1.5 pl-2 pr-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none"
            >
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100 ring-2 ring-blue-500/20">
                    <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        sizes="32px"
                        className="object-cover"
                        unoptimized
                    />
                </div>
                <div className="hidden text-left md:block">
                    <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-semibold text-gray-800">{displayName}</span>
                        {isAdmin && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-blue-700">
                                ADMIN
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5 z-50">
                    <div className="border-b border-gray-100 px-4 py-2.5 md:hidden">
                        <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                        href="/dashboard/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Profile</span>
                    </Link>

                    <Link
                        href="/dashboard/change-password"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                        <KeyRound className="h-4 w-4 text-gray-500" />
                        <span>Change Password</span>
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/admin/users"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-700 transition hover:bg-blue-50"
                        >
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>Admin Management</span>
                        </Link>
                    )}

                    <div className="my-1 border-t border-gray-100" />

                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            logout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}