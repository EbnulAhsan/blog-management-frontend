'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blog.service';
import { PenTool, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    'Technology',
    'Development',
    'Design',
    'Career',
    'Lifestyle',
    'Tutorial',
    'Other',
];

export default function CreateBlogPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        category: 'Technology',
        content: '',
        image: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!formData.title.trim()) {
            errs.title = 'Title is required';
        } else if (formData.title.trim().length < 5) {
            errs.title = 'Title must be at least 5 characters long';
        }

        if (!formData.category) {
            errs.category = 'Please select a category';
        }

        if (!formData.content.trim()) {
            errs.content = 'Content is required';
        } else if (formData.content.trim().length < 20) {
            errs.content = 'Content must be at least 20 characters long';
        }

        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMsg('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Backend expects blogTitle, blog, category (Requirement Section 16)
            const payload = {
                blogTitle: formData.title.trim(),
                title: formData.title.trim(),
                blog: formData.content.trim(),
                content: formData.content.trim(),
                category: formData.category,
            };

            if (formData.image.trim()) {
                payload.image = formData.image.trim();
                payload.thumbnail = formData.image.trim();
            }

            await blogService.createBlog(payload);
            setSuccessMsg('Blog published successfully! Redirecting...');
            setTimeout(() => {
                router.push('/dashboard/blogs');
            }, 1500);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to create blog.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <Link
                        href="/dashboard/blogs"
                        className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Blogs</span>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Blog</h1>
                    <p className="text-sm text-gray-500">Share your thoughts and ideas with the community</p>
                </div>
            </div>

            {serverError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <span>{serverError}</span>
                </div>
            )}

            {successMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <span>{successMsg}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Blog Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Getting Started with Modern Next.js"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Cover Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/cover.jpg"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Article Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="content"
                        rows={10}
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write the complete story here..."
                        className="w-full rounded-xl border border-gray-300 p-4 text-sm leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Link
                        href="/dashboard/blogs"
                        className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        <PenTool className="h-4 w-4" />
                        <span>{loading ? 'Publishing...' : 'Publish Blog'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}