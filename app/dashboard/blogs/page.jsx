'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogService } from '@/services/blog.service';
import Loader from '@/components/Loader';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Calendar,
    Tag,
    AlertCircle,
    FileText,
} from 'lucide-react';

export default function DashboardBlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await blogService.getAllBlogs();
            const blogList = Array.isArray(data)
                ? data
                : data.blogs || data.data || [];
            setBlogs(blogList);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to load your blog articles.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            await blogService.deleteBlog(deleteId);
            setBlogs((prev) => prev.filter((item) => (item._id || item.id) !== deleteId));
            setDeleteId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete the blog post.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading your blog articles..." />;
    }

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        My Published Blogs
                    </h1>
                    <p className="text-sm text-gray-500">
                        Create, update, and manage your published articles
                    </p>
                </div>
                <Link
                    href="/dashboard/blogs/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Write New Blog</span>
                </Link>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && blogs.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <FileText className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                        No blogs found
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        You have not written any articles yet. Publish your very first blog story today.
                    </p>
                    <Link
                        href="/dashboard/blogs/create"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Blog</span>
                    </Link>
                </div>
            )}

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => {
                    const id = blog._id || blog.id;
                    const title = blog.blogTitle || blog.title || 'Untitled Post';
                    const content = blog.blog || blog.content || '';
                    const imageUrl =
                        blog.image ||
                        blog.thumbnail ||
                        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80';

                    const formattedDate = blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : 'Recent';

                    return (
                        <div
                            key={id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            {/* Cover Image with proper alt property */}
                            <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                                    <Tag className="h-3 w-3" />
                                    {blog.category || 'General'}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{formattedDate}</span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 line-clamp-2 text-base">
                                        {title}
                                    </h3>

                                    <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-3">
                                        {content}
                                    </p>
                                </div>

                                {/* Actions Footer */}
                                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <Link
                                        href={`/blogs/${blog.id || blog._id}`}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        <span>View Public</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/dashboard/blogs/${id}/edit`}
                                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                            title="Edit Post"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(id)}
                                            className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                            title="Delete Post"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                isOpen={Boolean(deleteId)}
                title="Delete Blog Post"
                message="Are you sure you want to delete this blog? This action cannot be undone."
                confirmText={deleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}