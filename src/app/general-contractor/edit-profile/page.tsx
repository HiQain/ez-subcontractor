'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';

// 🔗 Sidebar links (same as Profile & Change Password)
const links = [
    { href: '/general-contractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/edit.svg' },
    { href: '/general-contractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
];

export default function EditProfile() {
    const [loading, setLoading] = useState(true); // For initial fetch
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
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
                if (res.ok && data.data) {
                    setFormData({
                        name: data.data.name || '',
                        phone: data.data.phone || '',
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
                setError('Failed to load profile data. Please try again.');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!formData.name.trim()) {
            setError('Full Name is required.');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required.');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Phone Number is required.');
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
                setSuccess('Profile updated successfully!');
                // Optional: refetch or redirect after delay
                setTimeout(() => {
                    setSuccess(null);
                }, 3000);
            } else {
                setError(data.message || 'Failed to update profile. Please try again.');
            }
        } catch (err) {
            console.error('Update profile error:', err);
            setError('Network error. Please check your connection.');
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
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar h-100">
                                    <div className="main-wrapper bg-dark p-0 h-100 d-flex flex-column justify-content-between">
                                        {/* Topbar */}
                                        <div className="topbar mb-5 d-flex justify-content-between align-items-start">
                                            <div className="icon-wrapper d-flex align-items-start gap-3">
                                                <Image
                                                    src="/assets/img/profile-img.webp"
                                                    width={80}
                                                    height={80}
                                                    alt="Worker Icon"
                                                />
                                                <div className="content-wrapper">
                                                    <div className="title text-black fs-5 fw-medium mb-2">
                                                        {formData.name || 'N/A'}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                        />
                                                        <Link
                                                            href={`mailto:${formData.email || ''}`}
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            {formData.email || '—'}
                                                        </Link>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/call-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Call Icon"
                                                        />
                                                        <Link
                                                            href={`tel:${formData.phone || ''}`}
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            {formData.phone || '—'}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            <Image
                                                src="/assets/img/icons/arrow-dark.svg"
                                                width={16}
                                                height={10}
                                                alt="Arrow"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>

                                        {/* Sidebar Links */}
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
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="btn btn-primary rounded-3"
                                        >
                                            {submitting ? 'Saving...' : 'Save Changes'}
                                        </button>
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

                                    <Image
                                        src="/assets/img/profile-img.webp"
                                        width={234}
                                        height={234}
                                        alt="Worker Image"
                                        className="d-block mb-4 img-fluid w-100"
                                        style={{ maxWidth: '234px' }}
                                    />

                                    <form onSubmit={handleSubmit}>
                                        <div className="form">
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="name" className="mb-1 fw-semibold">Full Name </label>
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
                                                <label htmlFor="company_name" className="mb-1 fw-semibold">Company Name</label>
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
                                                <label htmlFor="email" className="mb-1 fw-semibold">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="hello@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="phone" className="mb-1 fw-semibold">Phone Number</label>
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

                                            {/*<div className="input-wrapper d-flex flex-column">*/}
                                            {/*    <label htmlFor="address" className="mb-1 fw-semibold">Address</label>*/}
                                            {/*    <input*/}
                                            {/*        type="text"*/}
                                            {/*        id="address"*/}
                                            {/*        name="address"*/}
                                            {/*        className="form-control"*/}
                                            {/*        placeholder="abc street"*/}
                                            {/*        value={formData.address}*/}
                                            {/*        onChange={handleChange}*/}
                                            {/*    />*/}
                                            {/*</div>*/}

                                            {/*<div className="input-wrapper d-flex flex-column">*/}
                                            {/*    <label htmlFor="city" className="mb-1 fw-semibold">City</label>*/}
                                            {/*    <input*/}
                                            {/*        type="text"*/}
                                            {/*        id="city"*/}
                                            {/*        name="city"*/}
                                            {/*        className="form-control"*/}
                                            {/*        placeholder="New York"*/}
                                            {/*        value={formData.city}*/}
                                            {/*        onChange={handleChange}*/}
                                            {/*    />*/}
                                            {/*</div>*/}

                                            {/*<div className="input-wrapper d-flex flex-column">*/}
                                            {/*    <label htmlFor="state" className="mb-1 fw-semibold">State</label>*/}
                                            {/*    <input*/}
                                            {/*        type="text"*/}
                                            {/*        id="state"*/}
                                            {/*        name="state"*/}
                                            {/*        className="form-control"*/}
                                            {/*        placeholder="Texas"*/}
                                            {/*        value={formData.state}*/}
                                            {/*        onChange={handleChange}*/}
                                            {/*    />*/}
                                            {/*</div>*/}

                                            {/*<div className="input-wrapper d-flex flex-column">*/}
                                            {/*    <label htmlFor="zip" className="mb-1 fw-semibold">ZIP Code</label>*/}
                                            {/*    <input*/}
                                            {/*        type="text"*/}
                                            {/*        id="zip"*/}
                                            {/*        name="zip"*/}
                                            {/*        className="form-control"*/}
                                            {/*        placeholder="12345"*/}
                                            {/*        value={formData.zip}*/}
                                            {/*        onChange={handleChange}*/}
                                            {/*    />*/}
                                            {/*</div>*/}
                                        </div>
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