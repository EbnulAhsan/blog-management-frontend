'use client';

import { useState } from 'react';
import { userService } from '@/services/user.service';
import { Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
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
        if (!formData.newPassword) {
            errs.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            errs.newPassword = 'Password must be at least 6 characters';
        }

        if (formData.newPassword !== formData.confirmPassword) {
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
            // Backend expects: { password: newPassword }
            await userService.changePassword({ password: formData.newPassword });
            setSuccessMsg('Your password has been changed successfully!');
            setFormData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setServerError(
                err.response?.data?.message || 'Failed to update password. Try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Change Password
                </h1>
                <p className="text-sm text-gray-500">
                    Keep your account secure by using a strong password
                </p>
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

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    {errors.newPassword && (
                        <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        <KeyRound className="h-4 w-4" />
                        <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}