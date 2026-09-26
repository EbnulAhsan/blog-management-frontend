'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

export default function ResetPasswordPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const token = resolvedParams.token;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password) {
            setError('Password is required.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            // Backend expects PATCH /api/auth/reset-password/:token with payload { password }
            await authService.resetPassword(token, password);
            setSuccess('Password successfully changed. Redirecting to login...');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Token is invalid or expired.';
            setError(msg);
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
                            <KeyRound className="h-6 w-6" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                            Reset Your Password
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter your new secure password below
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-600">
                        Remember your credentials?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}