'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import Loader from '@/components/Loader';
import {
    User,
    Mail,
    Shield,
    Camera,
    Save,
    AlertCircle,
    CheckCircle2,
    UploadCloud,
} from 'lucide-react';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        image: '',
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [serverError, setServerError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            const profile = data.user || data.data || data;

            setFormData({
                firstname: profile.firstname || profile.firstName || '',
                lastname: profile.lastname || profile.lastName || '',
                email: profile.email || '',
                role: profile.role || 'User',
                image: profile.image || profile.profileImage || '',
            });
        } catch (err) {
            setServerError(
                err.response?.data?.message || 'Failed to load profile details.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMsg('');
        setUpdating(true);

        try {
            // Backend expects lowercase: firstname, lastname
            const payload = {
                firstname: formData.firstname.trim(),
                lastname: formData.lastname.trim(),
            };

            const res = await userService.updateProfile(payload);
            const updatedUser = res.user || res.data || { ...user, ...payload };
            if (setUser) setUser(updatedUser);

            setSuccessMsg('Profile information updated successfully!');
        } catch (err) {
            setServerError(
                err.response?.data?.message || 'Failed to update profile details.'
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validation: 2MB limit & image types
            if (file.size > 2 * 1024 * 1024) {
                setServerError('Image size must be less than 2MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setServerError('Only valid image files (JPG, PNG, WebP) are allowed.');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setServerError('');
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile) return;

        setUploadingAvatar(true);
        setServerError('');
        setSuccessMsg('');

        try {
            const data = new FormData();
            data.append('image', selectedFile);

            const res = await userService.uploadAvatar(data);
            const newImageUrl =
                res.imageUrl || res.image || res.user?.image || previewUrl;

            setFormData((prev) => ({ ...prev, image: newImageUrl }));
            if (setUser) setUser((prev) => ({ ...prev, image: newImageUrl }));

            setSelectedFile(null);
            setSuccessMsg('Profile avatar updated successfully!');
        } catch (err) {
            setServerError(
                err.response?.data?.message || 'Failed to upload profile image.'
            );
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) {
        return <Loader text="Loading profile details..." />;
    }

    const currentAvatar =
        previewUrl ||
        formData.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            formData.firstname + ' ' + formData.lastname || 'User'
        )}&background=2563eb&color=fff`;

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Account Profile
                </h1>
                <p className="text-sm text-gray-500">
                    Manage your personal details and avatar image
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Avatar Upload (Section 22) */}
                <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-blue-50">
                        <Image
                            src={currentAvatar}
                            alt="Profile Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    <h3 className="mt-4 font-bold text-gray-900 text-lg">
                        {formData.firstname} {formData.lastname}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        <Shield className="h-3 w-3" />
                        {formData.role}
                    </span>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="mt-6 flex w-full flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <Camera className="h-4 w-4" />
                            <span>Choose Image</span>
                        </button>

                        {selectedFile && (
                            <button
                                type="button"
                                onClick={handleAvatarUpload}
                                disabled={uploadingAvatar}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                            >
                                <UploadCloud className="h-4 w-4" />
                                <span>{uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}</span>
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400">
                        Max image size 2MB (JPG, PNG, WebP)
                    </p>
                </div>

                {/* Right Column: Edit Profile Details (Section 21) */}
                <div className="lg:col-span-2">
                    <form
                        onSubmit={handleProfileUpdate}
                        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Email Address (Read-only)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Account Role (Read-only)
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.role}
                                    disabled
                                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-3">
                            <button
                                type="submit"
                                disabled={updating}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                <span>{updating ? 'Saving...' : 'Update Profile'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}