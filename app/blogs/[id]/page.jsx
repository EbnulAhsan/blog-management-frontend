'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blogService } from '@/services/blog.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import { Calendar, User, Tag, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PublicBlogDetailPage({ params }) {
    const resolvedParams = use(params);
    const blogId = resolvedParams.id;

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await blogService.getBlogById(blogId);
                setBlog(data.blog || data.data || data);
            } catch (err) {
                setError(
                    err.response?.status === 404
                        ? 'Blog Not Found'
                        : err.response?.data?.message || 'Unable to retrieve article.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />
                <main className="flex flex-1 items-center justify-center">
                    <Loader text="Loading blog story..." />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />
                <main className="flex flex-1 items-center justify-center p-6">
                    <div className="max-w-md text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            {error || 'Blog Not Found'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            The article you are looking for does not exist or may have been deleted.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const authorName =
        blog.author?.firstname || blog.author?.firstName
            ? `${blog.author.firstname || blog.author.firstName} ${blog.author.lastname || blog.author.lastName || ''
            }`
            : typeof blog.author === 'string'
                ? blog.author
                : 'Community Author';

    const authorImg =
        blog.author?.image ||
        blog.author?.profileImage ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

    const coverImg =
        blog.image ||
        blog.thumbnail ||
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';

    const formattedDate = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : new Date().toLocaleDateString();

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-10">
                <article className="mx-auto max-w-4xl px-4 sm:px-6">
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to all posts</span>
                    </Link>

                    <header className="space-y-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            <Tag className="h-3 w-3" />
                            {blog.category || 'General'}
                        </span>

                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-tight">
                            {blog.title || blog.blogTitle}
                        </h1>

                        {/* Author info */}
                        <div className="flex items-center gap-3 border-b border-t border-gray-200 py-3.5">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100">
                                <Image
                                    src={authorImg}
                                    alt={authorName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-gray-400" />
                                    {authorName}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formattedDate}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Cover image */}
                    <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:h-96">
                        <Image
                            src={coverImg}
                            alt={blog.title || 'Blog cover'}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Story body */}
                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 sm:p-10">
                        <div className="whitespace-pre-line text-base leading-relaxed text-gray-800">
                            {blog.content || blog.blog}
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}