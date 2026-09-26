'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogService } from '@/services/blog.service';
import Loader from '@/components/Loader';
import {
    Calendar,
    User,
    Tag,
    ArrowLeft,
    Clock,
    BookOpen,
    Edit3,
} from 'lucide-react';

export default function DashboardBlogDetailsPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await blogService.getBlogById(id);

                const data = res?.blog || res?.data || res;

                if (!data || Object.keys(data).length === 0) {
                    setError('Blog not found or has been removed.');
                } else {
                    setBlog(data);
                }
            } catch (err) {
                setError(
                    err.response?.data?.message || err.message || 'Blog not found.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogDetail();
        }
    }, [id]);

    if (loading) {
        return <Loader text="Loading blog story..." />;
    }

    if (error || !blog) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <BookOpen className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                    Blog Not Found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {error || 'The requested article could not be located.'}
                </p>
                <div className="mt-6">
                    <Link
                        href="/dashboard/blogs"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to My Blogs</span>
                    </Link>
                </div>
            </div>
        );
    }

    const title = blog.blogTitle || blog.title || 'Untitled Post';
    const content = blog.blog || blog.content || '';
    const category = blog.category || 'General';
    const imageUrl =
        blog.image ||
        blog.thumbnail ||
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';

    const authorName =
        `${blog.author?.firstname || ''} ${blog.author?.lastname || ''}`.trim() ||
        blog.authorFirstname ||
        'Author';

    const authorImg =
        blog.author?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            authorName
        )}&background=2563eb&color=fff`;

    const dateValue = blog.createdAt || blog.createAt;
    const formattedDate = dateValue
        ? new Date(dateValue).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Recent';

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/blogs"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to My Blogs</span>
                </Link>

                <Link
                    href={`/dashboard/blogs/${id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-blue-600"
                >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Blog</span>
                </Link>
            </div>

            <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:p-10">
                {/* Header Metadata */}
                <header className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <Tag className="h-3 w-3" />
                            {category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            3 min read
                        </span>
                    </div>

                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                        {title}
                    </h1>

                    <div className="flex items-center gap-3 border-y border-gray-100 py-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-blue-100 bg-gray-100">
                            <Image
                                src={authorImg}
                                alt={authorName}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{authorName}</p>
                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                Published on {formattedDate}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="relative my-8 h-72 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs sm:h-96">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        priority
                        className="object-cover"
                        unoptimized
                    />
                </div>

                {/* Body Content */}
                <div className="prose max-w-none text-base leading-relaxed text-gray-800 whitespace-pre-line">
                    {content}
                </div>
            </article>
        </div>
    );
}