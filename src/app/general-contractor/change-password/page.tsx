'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';

export default function ChangePassword() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    // Fetch user info for sidebar (optional, can be skipped if not needed)
    const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);

    const links = [
        { href: '/general-contractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/lock.svg' },
        { href: '/general-contractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
    ];


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        // Optional: fetch user for sidebar (reuse profile API)
        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.data) {
                    setUser({
                        name: data.data.name || 'N/A',
                        email: data.data.email || 'N/A',
                        phone: data.data.phone || 'N/A',
                    });
                }
            } catch (err) {
                console.warn('Failed to load sidebar user info');
            }
        };

        fetchUser();
    }, [router]);

    const EyeIcon = ({ active }: { active: boolean }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`eye-icon ${active ? 'active' : ''}`}
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            <line
                className="slash"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                style={{ stroke: active ? 'none' : 'currentColor' }}
            />
        </svg>
    );


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!oldPassword.trim()) {
            setError('Old password is required.');
            return;
        }
        if (!newPassword.trim()) {
            setError('New password is required.');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    old_password: oldPassword, // ✅ snake_case as per API
                    new_password: newPassword,
                    password_confirmation: confirmPassword,
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
                setSuccess('Password updated successfully!');
                // Optional: auto-logout & redirect to login (recommended for security)
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    router.push('/auth/login');
                }, 1500);
            } else {
                setError(data.message || 'Failed to change password. Please try again.');
            }
        } catch (err) {
            console.error('Change password error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile position-static">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar — now dynamic */}
                            <div className="col-xl-3">
                                <div className="sidebar h-100">
                                    <div className="main-wrapper bg-dark p-0 h-100 d-flex flex-column justify-content-between">
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
                                                        {user?.name || 'Loading...'}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                        />
                                                        <Link
                                                            href={`mailto:${user?.email || ''}`}
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            {user?.email || '—'}
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
                                                            href={`tel:${user?.phone || ''}`}
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            {user?.phone || '—'}
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
                                                            alt="Icon"
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

                                        <div className="bottom-bar mt-auto">
                                            <div className="buttons-wrapper">
                                                <button
                                                    onClick={async () => {
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
                                                        } catch {}
                                                        localStorage.removeItem('token');
                                                        localStorage.removeItem('isLoggedIn');
                                                        localStorage.removeItem('userEmail');
                                                        router.push('/auth/login');
                                                    }}
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
                                <div style={{ maxWidth: '482px' }} className="right-bar">
                                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <Link href="/general-contractor/profile" className="icon">
                                                <Image
                                                    src="/assets/img/button-angle.svg"
                                                    width={10}
                                                    height={15}
                                                    alt="Back Icon"
                                                />
                                            </Link>
                                            <span className="fs-4 fw-semibold">Change Password</span>
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

                                    <form onSubmit={handleSubmit}>
                                        {/* Old Password */}
                                        <div className="input-wrapper d-flex flex-column position-relative mb-4">
                                            <label htmlFor="old_password" className="mb-1 fw-semibold">
                                                Old Password <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type={showOld ? 'text' : 'password'}
                                                id="old_password"
                                                className="form-control pe-5"
                                                placeholder="Enter old password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                            <span
                                                className="toggle-password position-absolute"
                                                style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                                onClick={() => setShowOld(!showOld)}
                                            >
                                                <EyeIcon active={showOld} />
                                            </span>
                                        </div>

                                        {/* New Password */}
                                        <div className="input-wrapper d-flex flex-column position-relative mb-4">
                                            <label htmlFor="password" className="mb-1 fw-semibold">
                                                New Password <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type={showNew ? 'text' : 'password'}
                                                id="password"
                                                className="form-control pe-5"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                            <span
                                                className="toggle-password position-absolute"
                                                style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                                onClick={() => setShowNew(!showNew)}
                                            >
                                                <EyeIcon active={showNew} />
                                            </span>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="input-wrapper d-flex flex-column position-relative mb-4">
                                            <label htmlFor="confirm_password" className="mb-1 fw-semibold">
                                                Confirm Password <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                id="confirm_password"
                                                className="form-control pe-5"
                                                placeholder="Enter confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                            <span
                                                className="toggle-password position-absolute"
                                                style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                                onClick={() => setShowConfirm(!showConfirm)}
                                            >
                                                <EyeIcon active={showConfirm} />
                                            </span>
                                        </div>

                                        <div className="buttons-wrapper d-flex align-items-center gap-4">
                                            <input
                                                type="submit"
                                                className="btn btn-primary rounded-3 w-100"
                                                value={loading ? 'Changing...' : 'Change Password'}
                                                disabled={loading}
                                            />
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