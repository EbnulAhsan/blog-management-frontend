'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogService } from '@/services/blog.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import {
    Search,
    Calendar,
    User,
    ArrowRight,
    Tag,
    BookOpen,
    SlidersHorizontal,
} from 'lucide-react';

const CATEGORIES = [
    'All',
    'Testing',
    'Automation',
    'Programming',
    'DevOps',
    'AI',
    'Technology',
];

export default function HomePage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [error, setError] = useState('');

    // Fetch blogs with search and category filters
    const fetchBlogs = async (search = '', category = 'All') => {
        try {
            setLoading(true);
            setError('');

            // Build query parameters
            const params = {};
            if (search.trim()) {
                params.title = search.trim();
            }
            if (category && category !== 'All') {
                params.category = category;
            }

            // Calls GET /api/blogs with query params (Section 6, 7, 8)
            const data = await blogService.getAllBlogs(params);
            const blogList = Array.isArray(data)
                ? data
                : data.blogs || data.data || [];
            setBlogs(blogList);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to retrieve blogs from server.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(searchTerm, selectedCategory);
    }, [selectedCategory]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBlogs(searchTerm, selectedCategory);
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="border-b border-gray-200 bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
                            <BookOpen className="h-3.5 w-3.5" />
                            Discover Knowledge & Tutorials
                        </span>
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Explore the World of Software & Tech
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
                            Read insights, testing methodologies, automation tips, and modern
                            development articles written by tech enthusiasts.
                        </p>

                        {/* Search Input (Section 6 & 8) */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg focus-within:border-blue-500"
                        >
                            <div className="relative flex flex-1 items-center">
                                <Search className="ml-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search blogs by title (e.g. playwright)..."
                                    className="w-full bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </section>

                {/* Content Section */}
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Category Filter Badges (Section 7 & 8) */}
                    <div className="mb-10 flex flex-wrap items-center gap-2">
                        <span className="mr-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Categories:
                        </span>
                        {CATEGORIES.map((cat) => {
                            const active = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${active
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Loading State (Section 32) */}
                    {loading && <Loader text="Loading blogs..." />}

                    {/* Error State (Section 31) */}
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Empty State (Section 33) */}
                    {!loading && !error && blogs.length === 0 && (
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-3 text-lg font-bold text-gray-900">
                                No blogs found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try searching for a different keyword or category.
                            </p>
                        </div>
                    )}

                    {/* Blog Cards Grid (Section 5) */}
                    {!loading && !error && blogs.length > 0 && (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => {
                                const id = blog._id || blog.id;
                                const title = blog.blogTitle || blog.title || 'Untitled Post';
                                const content = blog.blog || blog.content || '';
                                const category = blog.category || 'General';
                                const imageUrl =
                                    blog.image ||
                                    blog.thumbnail ||
                                    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80';

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
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        authorName
                                    )}&background=2563eb&color=fff`;

                                const formattedDate = blog.createdAt
                                    ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                    : 'Recent';

                                return (
                                    <article
                                        key={id}
                                        className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        {/* Cover Image */}
                                        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-xs">
                                                <Tag className="h-3 w-3" />
                                                {category}
                                            </span>
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div>
                                                {/* Author & Date */}
                                                <div className="mb-3 flex items-center gap-2.5">
                                                    <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-gray-200">
                                                        <Image
                                                            src={authorImg}
                                                            alt={authorName}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-700 truncate max-w-[130px]">
                                                        {authorName}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Calendar className="h-3 w-3" />
                                                        {formattedDate}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h2 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition">
                                                    <Link href={`/blogs/${id}`}>{title}</Link>
                                                </h2>

                                                {/* Short Preview */}
                                                <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-3">
                                                    {content}
                                                </p>
                                            </div>

                                            {/* Read More Link */}
                                            <div className="mt-6 border-t border-gray-100 pt-4">
                                                <Link
                                                    href={`/blogs/${id}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-700"
                                                >
                                                    <span>Read More</span>
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}