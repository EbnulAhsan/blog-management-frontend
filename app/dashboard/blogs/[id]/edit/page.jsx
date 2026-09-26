'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { blogService } from '@/services/blog.service';
import Loader from '@/components/Loader';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
    'Testing',
    'Automation',
    'Programming',
    'DevOps',
    'AI',
    'Technology',
    'Career',
    'Tutorial',
];

export default function EditBlogPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [formData, setFormData] = useState({
        blogTitle: '',
        category: '',
        blog: '',
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await blogService.getBlogById(id);
                const data = res?.blog || res?.data || res;

                if (!data || Object.keys(data).length === 0) {
                    setError('Blog post not found.');
                    return;
                }

                setFormData({
                    blogTitle: data.blogTitle || data.title || '',
                    category: data.category || '',
                    blog: data.blog || data.content || '',
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load blog data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.blogTitle.trim() || !formData.category || !formData.blog.trim()) {
            setError('All fields are required.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            await blogService.updateBlog(id, {
                blogTitle: formData.blogTitle.trim(),
                blog: formData.blog.trim(),
                category: formData.category,
            });

            setSuccess('Blog updated successfully! Redirecting...');
            setTimeout(() => {
                router.push('/dashboard/blogs');
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update blog.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading blog editor..." />;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <Link
                    href="/dashboard/blogs"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to My Blogs</span>
                </Link>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Edit Blog Post
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        Modify the title, category, or body of your article.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                            Blog Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="blogTitle"
                            value={formData.blogTitle}
                            onChange={handleChange}
                            placeholder="Enter blog title"
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                        >
                            <option value="" disabled>
                                Select category...
                            </option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                            Blog Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="blog"
                            rows={12}
                            value={formData.blog}
                            onChange={handleChange}
                            placeholder="Write your article content here..."
                            required
                            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <Link
                            href="/dashboard/blogs"
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{submitting ? 'Updating...' : 'Update Blog'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}