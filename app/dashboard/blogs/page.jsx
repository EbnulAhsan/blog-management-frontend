'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/blog.service';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { PlusCircle, Edit3, Trash2, ExternalLink, Calendar, Tag } from 'lucide-react';

export default function DashboardBlogsPage() {
    const { user, isAdmin } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Delete modal state
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await blogService.getAllBlogs();
            const allList = Array.isArray(data) ? data : data.blogs || data.data || [];

            // If regular user, filter only user's own blogs
            if (!isAdmin && user) {
                const userId = user._id || user.id;
                const filtered = allList.filter(
                    (b) => (b.author?._id || b.author?.id || b.author || b.user || b.userId) === userId
                );
                setBlogs(filtered);
            } else {
                setBlogs(allList);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, user]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await blogService.deleteBlog(deleteId);
            setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== deleteId));
            setDeleteId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete blog.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading your articles..." />;
    }

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        {isAdmin ? 'All Platform Blogs' : 'My Published Blogs'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isAdmin
                            ? 'Manage and moderate all blog posts published on BlogSpace'
                            : 'Create, update, and manage your published articles'}
                    </p>
                </div>
                <Link
                    href="/dashboard/blogs/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition w-fit"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>Write New Blog</span>
                </Link>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {blogs.length === 0 ? (
                <EmptyState
                    title="No blogs found"
                    description={
                        isAdmin
                            ? 'No blog articles exist in the platform yet.'
                            : "You haven't written any blogs yet. Start writing your first post!"
                    }
                    action={
                        <Link
                            href="/dashboard/blogs/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Create Blog</span>
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => {
                        const id = blog._id || blog.id;
                        const fallbackImg =
                            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60';
                        const imageUrl = blog.image || blog.thumbnail || fallbackImg;
                        const dateStr = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

                        return (
                            <div
                                key={id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div>
                                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            unoptimized
                                        />
                                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                                            <Tag className="h-3 w-3" />
                                            {blog.category || 'General'}
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{dateStr}</span>
                                        </div>

                                        <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                                            {blog.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-3 text-xs text-gray-600 leading-relaxed">
                                            {blog.content}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4">
                                    <Link
                                        href={`/blogs/${id}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
                                    >
                                        <span>View Public</span>
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/dashboard/blogs/edit/${id}`}
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
                                            title="Edit Blog"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteId(id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50 transition"
                                            title="Delete Blog"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Blog Post?"
                message="Are you sure you want to delete this blog post? This action is permanent and cannot be reversed."
                confirmText="Confirm Delete"
                cancelText="Cancel"
                isDanger={true}
                loading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}