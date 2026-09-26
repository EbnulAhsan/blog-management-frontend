'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/blog.service';
import Loader from '@/components/Loader';
import {
    FileText,
    PlusCircle,
    User,
    Shield,
    ArrowRight,
    Calendar,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllBlogs();
                const list = Array.isArray(data) ? data : data.blogs || data.data || [];
                setBlogs(list);
            } catch (err) {
                console.error('Failed to load dashboard blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <Loader text="Loading your dashboard..." />;
    }

    // Name extraction based on backend response keys
    const displayName =
        `${user?.firstname || user?.firstName || ''} ${user?.lastname || user?.lastName || ''
            }`.trim() || user?.name || user?.email?.split('@')[0] || 'User';

    const userRole = user?.role || 'User';
    const recentBlogs = blogs.slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
                <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                <Sparkles className="h-3 w-3 text-amber-300" />
                                {userRole.toUpperCase()} DASHBOARD
                            </span>
                        </div>
                        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                            Welcome back, {displayName}!
                        </h1>
                        <p className="mt-1 text-sm text-blue-100">
                            Manage your publications, review analytics, and publish stories.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/blogs/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow transition hover:bg-blue-50"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Create New Blog</span>
                    </Link>
                </div>
            </div>

            {/* Metrics & Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Blogs Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {userRole.toLowerCase() === 'admin' ? 'Total Platform Blogs' : 'My Total Blogs'}
                        </span>
                        <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                            <FileText className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{blogs.length}</span>
                        <span className="text-xs text-gray-500">Articles</span>
                    </div>
                    <Link
                        href="/dashboard/blogs"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                        <span>View all blogs</span>
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Account Status
                        </span>
                        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold text-gray-900 truncate">{user?.email}</p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            Active Member
                        </span>
                    </div>
                    <Link
                        href="/dashboard/profile"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                        <span>Edit Profile</span>
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {/* Role Permissions Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            System Access
                        </span>
                        <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold text-gray-900 capitalize">{userRole} Privileges</p>
                        <p className="mt-1 text-xs text-gray-500">
                            {userRole.toLowerCase() === 'admin'
                                ? 'Full administrative control over users and all content'
                                : 'Can create, edit, and delete own blogs'}
                        </p>
                    </div>
                    {userRole.toLowerCase() === 'admin' && (
                        <Link
                            href="/admin/users"
                            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                        >
                            <span>Manage Users</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Recent Blogs Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Publications</h2>
                        <p className="text-xs text-gray-500">Recently published articles on the platform</p>
                    </div>
                    <Link
                        href="/dashboard/blogs"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                        <span>See All</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="mt-4 divide-y divide-gray-100">
                    {recentBlogs.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-500">No blogs published yet.</p>
                    ) : (
                        recentBlogs.map((blog) => {
                            const id = blog._id || blog.id;
                            const title = blog.blogTitle || blog.title || 'Untitled Post';
                            const imageUrl =
                                blog.image ||
                                blog.thumbnail ||
                                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&auto=format&fit=crop&q=80';
                            const formattedDate = blog.createdAt
                                ? new Date(blog.createdAt).toLocaleDateString()
                                : 'Recent';

                            return (
                                <div key={id} className="flex items-center justify-between py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <Link
                                                href={`/blogs/${id}`}
                                                className="font-semibold text-gray-900 line-clamp-1 text-sm hover:text-blue-600 transition"
                                            >
                                                {title}
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                                <span className="text-blue-600 font-medium">{blog.category || 'General'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formattedDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/blogs/${id}`}
                                        className="flex items-center gap-1 rounded-lg p-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition"
                                    >
                                        <span>Read</span>
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}