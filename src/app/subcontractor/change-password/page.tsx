'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import SidebarSubcontractor from "../../components/SidebarSubcontractor";

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
    const [logoutLoading, setLogoutLoading] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

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


    // Fetch user info for sidebar (optional, can be skipped if not needed)
    const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);

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
                showToast('Failed to load user information.', 'error');
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

        // Validation
        if (!oldPassword.trim()) {
            showToast('Old password is required.', 'error');
            return;
        }
        if (!newPassword.trim()) {
            showToast('New password is required.', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('New password must be at least 6 characters.', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('New password and confirmation do not match.', 'error');
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
                showToast('Password updated successfully!');
            } else {
                showToast(data.message || 'Failed to change password. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Change password error:', err);
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            setLoading(false);
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
                            {/* SidebarSubcontractor — now dynamic */}
                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
                            </div>

                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div style={{ maxWidth: '482px' }} className="right-bar">
                                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
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
                                            <span className="fs-4 fw-semibold">Change Password</span>
                                        </div>
                                    </div>

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