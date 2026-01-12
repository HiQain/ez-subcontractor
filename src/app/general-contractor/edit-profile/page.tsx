// app/general-contractor/edit-profile/page.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';

// 🔗 SidebarSubcontractor links (same as Profile & Change Password)
const links = [
    { href: '/general-contractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/user.svg' },
    { href: '/general-contractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
    { href: '/general-contractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/subscription.svg' },
];

// 🔹 Default profile placeholder
const DEFAULT_PROFILE_IMAGE = '/assets/img/profile-placeholder.webp';

export default function EditProfile() {
    const [loading, setLoading] = useState(true); // For initial fetch
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false); // For image upload state
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Ref for hidden file input
    const imageFileInputRef = useRef<HTMLInputElement>(null);

    // 🔹 Show non-blocking toast notification
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
        work_radius: 0,
        category: 1,
        address: '',
        city: '',
        state: '',
        email: '', // Added for form completeness
    });

    const pathname = usePathname();
    const router = useRouter();

    // 🔹 Refetch profile data
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

            console.log('Profile refetched:', data);
            if (res.ok && data.data) {
                setFormData({
                    name: data.data.name || '',
                    phone: data.data.phone || '',
                    profile_image: data.data.profile_image || DEFAULT_PROFILE_IMAGE,
                    company_name: data.data.company_name || '',
                    license_number: data.data.license_number || '',
                    zip: data.data.zip || '',
                    work_radius: data.data.work_radius || 0,
                    category: data.data.category || 1,
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

    // Fetch current profile data
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

                console.log(data);
                if (res.ok && data.data) {
                    setFormData({
                        name: data.data.name || '',
                        phone: data.data.phone || '',
                        profile_image: data.data.profile_image || DEFAULT_PROFILE_IMAGE,
                        company_name: data.data.company_name || '',
                        license_number: data.data.license_number || '',
                        zip: data.data.zip || '',
                        work_radius: data.data.work_radius || 0,
                        category: data.data.category || 1,
                        address: data.data.address || '',
                        city: data.data.city || '',
                        state: data.data.state || '',
                        email: data.data.email || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
                showToast('Failed to load profile data. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 👇 NEW: Handle profile image upload with automatic refetch
    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Authentication required. Please log in.', 'error');
            router.push('/auth/login');
            return;
        }

        const formData = new FormData();
        formData.append('profile_image', file);

        setUploadingImage(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/profile/update-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Profile image updated successfully!');
                // ✅ Refetch profile data to update the image URL
                await refetchProfile();
            } else {
                showToast(result.message || 'Failed to upload image. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            showToast('Network error. Please check your connection.', 'error');
        } finally {
            setUploadingImage(false);
            // Reset input so same file can be re-selected
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
            showToast('Full Name is required.', 'error');
            return;
        }
        if (!formData.email.trim()) {
            showToast('Email is required.', 'error');
            return;
        }
        if (!formData.phone.trim()) {
            showToast('Phone Number is required.', 'error');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        setSubmitting(true);

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
                // Redirect to profile page after thank-you
                setTimeout(() => {
                    router.push('/general-contractor/profile');
                }, 1500);
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

    // Logout handler
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.warn('Logout failed, still clearing local storage.');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('subscription');
        router.push('/auth/login');
    };

    // 🌀 Loading State — same as ProfilePage
    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile position-static">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile position-static">
                    <div className="container">
                        <div className="row g-4">
                            {/* SidebarSubcontractor */}
                            <div className="col-xl-3">
                                <div className="sidebar h-100">
                                    <div className="main-wrapper bg-dark p-0 h-100 d-flex flex-column justify-content-between">
                                        {/* SidebarSubcontractor Links */}
                                        <div className="buttons-wrapper">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`custom-btn ${pathname === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image
                                                            src={link.icon}
                                                            width={20}
                                                            height={20}
                                                            alt={link.label}
                                                        />
                                                        <span className="text-white">{link.label}</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        width={15}
                                                        height={9}
                                                        alt="Arrow"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Logout */}
                                        <div className="bottom-bar mt-auto">
                                            <div className="buttons-wrapper">
                                                <button
                                                    onClick={handleLogout}
                                                    className="custom-btn bg-danger w-100 border-0"
                                                    style={{ borderColor: '#DC2626' }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/assets/img/icons/logout.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Logout Icon"
                                                        />
                                                        <span className="text-white">Logout</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        width={15}
                                                        height={9}
                                                        alt="Arrow"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <Link href="/general-contractor/profile" className="icon">
                                                <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Back Icon" />
                                            </Link>
                                            <span className="fs-4 fw-semibold">Edit Profile</span>
                                        </div>
                                    </div>

                                    {/* 👇 Image Upload Section (NEW) */}
                                    <div className="image-wrapper-s1">
                                        <Image
                                            src={formData.profile_image}
                                            width={234}
                                            height={234}
                                            alt="Worker Image"
                                            className="d-block mb-4 img-fluid rounded-circle object-fit-cover"
                                            style={{ width: '234px', height: '234px', border: '1px, solid, black' }}
                                        />
                                        <button
                                            type="button" // Important: not "submit"
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
                                        {/* Hidden file input */}
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
                                                <label htmlFor="license_number" className="mb-1 fw-semibold">License Number</label>
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
                                        <br />
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn btn-primary rounded-3"
                                        >
                                            {submitting ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}