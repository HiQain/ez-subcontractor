'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';
import SidebarSubcontractor from "../../components/SidebarSubcontractor";

const DEFAULT_PROFILE_IMAGE = '/assets/img/profile-placeholder.webp';

interface Category {
    id: string;
    name: string;
}

export default function EditProfile() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // 🔹 Toast
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const icon = type === 'success' ? '✅' : '❌';

        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                background-color: ${bgColor};
                color: ${textColor};
                border: 1px solid ${borderColor};
                border-radius: 8px;
                padding: 12px 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
            ">
                <span>${icon} ${message}</span>
                <button type="button" class="btn-close" style="font-size: 14px; margin-left: auto;" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast);

        const timeoutId = setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);

        const closeButton = toast.querySelector('.btn-close');
        closeButton?.addEventListener('click', () => {
            clearTimeout(timeoutId);
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    };

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        profile_image: DEFAULT_PROFILE_IMAGE,
        company_name: '',
        license_number: '',
        zip: '',
        work_radius: '',
        category: '',
        address: '',
        city: '',
        state: '',
        email: '',
    });

    const pathname = usePathname();
    const router = useRouter();

    // 🔹 Refetch profile
    const refetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok && data.data) {
                setFormData({
                    name: data.data.name || '',
                    phone: data.data.phone || '',
                    profile_image: data.data.profile_image || DEFAULT_PROFILE_IMAGE,
                    company_name: data.data.company_name || '',
                    license_number: data.data.license_number || '',
                    zip: data.data.zip || '',
                    work_radius: data.data.work_radius || 0,
                    category: data.data.specialization || '',
                    address: data.data.address || '',
                    city: data.data.city || '',
                    state: data.data.state || '',
                    email: data.data.email || '',
                });
            }
        } catch (err) {
            console.error('Failed to refetch profile:', err);
            showToast('Failed to refresh profile data. Please try again.', 'error');
        }
    };

    // Fetch profile on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok && data.data) {
                    setFormData({
                        name: data.data.name || '',
                        phone: data.data.phone || '',
                        profile_image: data.data.profile_image || DEFAULT_PROFILE_IMAGE,
                        company_name: data.data.company_name || '',
                        license_number: data.data.license_number || '',
                        zip: data.data.zip || '',
                        work_radius: data.data.work_radius || 0,
                        category: data.data.specialization || '',
                        address: data.data.address || '',
                        city: data.data.city || '',
                        state: data.data.state || '',
                        email: data.data.email || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
                setError('Failed to load profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/specializations`, {
                    headers: { 'Accept': 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                let fetchedCategories: Category[] = [];
                if (Array.isArray(data)) {
                    fetchedCategories = data.map(item => ({ id: String(item.id), name: item.name }));
                } else if (data?.data?.specializations && Array.isArray(data.data.specializations)) {
                    fetchedCategories = data.data.specializations.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                } else if (data?.data && Array.isArray(data.data)) {
                    fetchedCategories = data.data.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                }
                setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } catch (err) {
                console.error('Failed to load categories:', err);
                setCategories([
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // ✅ Robust Select2 Initialization + Sync
    useEffect(() => {
        if (typeof window === 'undefined' || categoriesLoading) return;

        const $ = require('jquery');
        require('select2');
        require('select2/dist/css/select2.min.css');

        const $select = $('#category-select');
        if ($select.length === 0) return;

        // Destroy if already initialized
        if ($select.data('select2')) {
            $select.select2('destroy');
        }

        // Initialize Select2
        $select.select2({
            placeholder: 'Select category',
            allowClear: false,
            width: '100%',
        }).on('change', function () {
            const val = $(this).val() as string;
            setFormData(prev => ({ ...prev, category: val || '' }));
            if (errors.category) {
                setErrors(prev => {
                    const { category: _, ...rest } = prev;
                    return rest;
                });
            }
        });

        // Sync value after initialization
        setTimeout(() => {
            $select.val(formData.category).trigger('change');
        }, 0);

        // Cleanup
        return () => {
            if ($select.data('select2')) {
                $select.select2('destroy');
            }
        };
    }, [categoriesLoading, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Authentication required. Please log in.', 'error');
            router.push('/auth/login');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('profile_image', file);

        setUploadingImage(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/profile/update-image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData,
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Profile image updated successfully!');
                await refetchProfile();
            } else {
                showToast(result.message || 'Failed to upload image. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            showToast('Network error. Please check your connection.', 'error');
        } finally {
            setUploadingImage(false);
            if (imageFileInputRef.current) {
                imageFileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!formData.name.trim()) {
            showToast('Full Name is required.');
            return;
        }
        if (!formData.email.trim()) {
            showToast('Email is required.');
            return;
        }
        if (!formData.phone.trim()) {
            showToast('Phone Number is required.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        setSubmitting(true); // ✅ Was `false` — now corrected

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    company_name: formData.company_name,
                    license_number: formData.license_number,
                    zip: formData.zip,
                    work_radius: formData.work_radius,
                    category: formData.category,
                    specialization: formData.category,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text || 'Unknown error' };
            }

            if (response.ok) {
                showToast('Profile updated successfully!');
            } else {
                showToast(data.message || 'Failed to update profile. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Update profile error:', err);
            showToast('Network error. Please check your connection.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/logout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text };
            }

            if (response.ok) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('token');
                localStorage.removeItem('subscription');
                router.push('/auth/login');
            } else {
                alert(data?.message || 'Logout failed');
            }
        } catch (err) {
            console.error('Logout Error:', err);
            alert('Network error. Please try again.');
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile position-static">
                    <div className="container">
                        <div className="row g-4">
                            {/* ✅ Sidebar always visible */}
                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
                            </div>

                            {/* ✅ Right Content — loading spinner centered in content area */}
                            <div className="col-xl-9">
                                {loading ? (
                                    <div className="right-bar d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="right-bar">
                                        <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
                                            <div className="icon-wrapper d-flex align-items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => router.back()}
                                                    className="icon"
                                                    aria-label="Go back"
                                                >
                                                    <Image
                                                        src="/assets/img/button-angle.svg"
                                                        width={10}
                                                        height={15}
                                                        alt="Back"
                                                    />
                                                </button>
                                                <span className="fs-4 fw-semibold">Edit Profile</span>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="alert alert-danger mb-4" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {success && (
                                            <div className="alert alert-success mb-4" role="alert">
                                                {success}
                                            </div>
                                        )}

                                        <div className="image-wrapper-s1">
                                            <Image
                                                src={formData.profile_image}
                                                width={234}
                                                height={234}
                                                alt="Worker Image"
                                                className="d-block mb-4 img-fluid rounded-circle object-fit-cover"
                                                style={{ width: '234px', height: '234px' }}
                                            />
                                            <button
                                                type="button"
                                                className="icon"
                                                onClick={() => imageFileInputRef.current?.click()}
                                                disabled={uploadingImage}
                                                aria-label="Upload profile image"
                                            >
                                                <Image
                                                    src="/assets/img/camera-icon.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="Camera Icon"
                                                    style={{ maxWidth: '24px' }}
                                                />
                                            </button>
                                            <input
                                                type="file"
                                                ref={imageFileInputRef}
                                                accept="image/*"
                                                onChange={handleProfileImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="form">
                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="name" className="mb-1 fw-semibold">
                                                        Full Name <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="Jason Doe"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="company_name" className="mb-1 fw-semibold">
                                                        Company Name <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="company_name"
                                                        name="company_name"
                                                        className="form-control"
                                                        placeholder="Jason Tiles Limited"
                                                        value={formData.company_name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="email" className="mb-1 fw-semibold">
                                                        Email Address <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="hello@example.com"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        disabled
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="phone" className="mb-1 fw-semibold">
                                                        Phone Number <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="(000) 000-0000"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="address" className="mb-1 fw-semibold">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        className="form-control"
                                                        placeholder="abc street"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="city" className="mb-1 fw-semibold">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        className="form-control"
                                                        placeholder="New York"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="state" className="mb-1 fw-semibold">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        className="form-control"
                                                        placeholder="Texas"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="zip" className="mb-1 fw-semibold">
                                                        ZIP Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="zip"
                                                        name="zip"
                                                        className="form-control"
                                                        placeholder="12345"
                                                        value={formData.zip}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="category-select" className="mb-1 fw-semibold">
                                                        Category
                                                    </label>
                                                    <select
                                                        id="category-select"
                                                        className="form-control"
                                                        value={formData.category}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            category: e.target.value
                                                        }))}
                                                        disabled={categoriesLoading}
                                                    >
                                                        <option value="">Select category</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-wrapper d-flex flex-column">
                                                    <label htmlFor="license_number" className="mb-1 fw-semibold">
                                                        License Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="license_number"
                                                        name="license_number"
                                                        className="form-control"
                                                        placeholder="223546"
                                                        value={formData.license_number}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="btn btn-primary rounded-3 mt-4"
                                            >
                                                {submitting ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}