'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const errs = {};
        if (!formData.firstName.trim()) errs.firstName = 'First name is required';
        if (!formData.lastName.trim()) errs.lastName = 'Last name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errs.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            errs.email = 'Enter a valid email address';
        }

        if (!formData.password) {
            errs.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errs.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errs.confirmPassword = 'Passwords do not match';
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
            // Backend expects lowercase keys: firstname, lastname
            await authService.register({
                firstname: formData.firstName.trim(),
                lastname: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            setSuccessMsg('Registration successful! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Registration failed. Try again.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex flex-1 items-center justify-center p-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                            Create an account
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Join BlogSpace to publish and discover blogs
                        </p>
                    </div>

                    {serverError && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="John"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Doe"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            <span>{loading ? 'Creating account...' : 'Register'}</span>
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}