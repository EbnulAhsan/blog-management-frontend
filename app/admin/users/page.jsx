'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { userService } from '@/services/user.service';
import Loader from '@/components/Loader';
import {
    Users,
    Shield,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await userService.getAllUsers();
            const list = Array.isArray(data) ? data : data.users || data.data || [];
            setUsers(list);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to fetch user accounts.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId, currentStatus) => {
        setActionLoadingId(userId);
        const newStatus = !currentStatus;

        try {
            await userService.updateUserStatus(userId, newStatus);
            setUsers((prev) =>
                prev.map((u) => {
                    const id = u._id || u.id;
                    if (id === userId) {
                        return { ...u, isActive: newStatus };
                    }
                    return u;
                })
            );
        } catch (err) {
            alert(
                err.response?.data?.message || 'Failed to update user active status.'
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    if (loading) {
        return <Loader text="Loading registered user records..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        User Management
                    </h1>
                    <p className="text-sm text-gray-500">
                        Oversee user permissions, monitor roles, and manage access status
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="border-b border-gray-200 bg-gray-50/75 text-xs uppercase font-semibold text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-4">User</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Role</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400">
                                        <Users className="mx-auto h-8 w-8 text-gray-300" />
                                        <p className="mt-2 text-sm font-medium">No users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const id = u._id || u.id;
                                    const fullName = `${u.firstname || u.firstName || ''} ${u.lastname || u.lastName || ''
                                        }`.trim() || 'Unknown User';
                                    const avatar =
                                        u.image ||
                                        u.profileImage ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            fullName
                                        )}&background=2563eb&color=fff`;

                                    const isActive = u.isActive ?? true;

                                    return (
                                        <tr key={id} className="transition hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-gray-200">
                                                        <Image
                                                            src={avatar}
                                                            alt={fullName}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <span>{fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                    <Shield className="h-3 w-3" />
                                                    {u.role || 'User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isActive ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Active</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                                                        <XCircle className="h-4 w-4" />
                                                        <span>Inactive</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleToggleStatus(id, isActive)}
                                                    disabled={actionLoadingId === id}
                                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${isActive
                                                        ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        }`}
                                                >
                                                    {actionLoadingId === id
                                                        ? 'Processing...'
                                                        : isActive
                                                            ? 'Deactivate'
                                                            : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}