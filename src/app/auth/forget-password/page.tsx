'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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

    // ✅ Helper: Check if email is valid
    const isEmailValid = (email: string) => {
        return /\S+@\S+\.\S+/.test(email.trim());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (isLoading) return;

        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        // Validation already ensured by button disable, but keep for safety
        if (!email.trim()) {
            showToast('Email is required', 'error');
            setIsLoading(false);
            return;
        }

        if (!isEmailValid(email)) {
            showToast('Please enter a valid email address', 'error');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Password reset link has been sent to your email!');
                setEmail('');
                localStorage.setItem('forgotPasswordEmail', email);
                setTimeout(() => {
                    router.push('/auth/verify-email');
                }, 1500);
            } else {
                let errorMessage = 'Something went wrong. Please try again.';
                if (Array.isArray(data.message)) {
                    errorMessage = data.message[0];
                } else if (typeof data.message === 'string') {
                    errorMessage = data.message;
                }
                showToast(errorMessage, 'error');
            }
        } catch (err) {
            showToast('Network error. Please check your internet connection.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero-sec login login-s1 overflow-hidden position-static">
            <div className="image-wrapper">
                <Image
                    src="/assets/img/left-image.webp"
                    className="left-image"
                    alt="Section Image"
                    width={500}
                    height={800}
                />
                <p className="main-title mb-0">
                    Developed by:
                    <Link href="https://designspartans.com/" target="_blank" className="text-primary fw-semibold"> Design Spartans</Link>
                </p>
            </div>

            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="content-wrapper">
                        <div className="content mx-auto w-100">
                            <Link href="/" className="d-block mb-4">
                                <Image
                                    src="/assets/img/icons/logo.webp"
                                    width={350}
                                    height={100}
                                    alt="Login Logo"
                                    style={{ maxWidth: '350px' }}
                                    className="img-fluid d-block w-100 mx-auto"
                                />
                            </Link>

                            <div className="fw-semibold fs-2 mb-4 text-center form-title">
                                Forgot Password
                            </div>

                            <form className="form" onSubmit={handleSubmit}>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="email" className="mb-1 fw-semibold">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="buttons-wrapper d-flex align-items-center gap-4 mt-3">
                                    <button
                                        type="button" onClick={() => router.back()} className="btn btn-outline-dark rounded-3 justify-content-center w-100"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-3 justify-content-center w-100"
                                        // ✅ Disable until email is valid AND not loading
                                        disabled={isLoading || !isEmailValid(email)}
                                        style={{
                                            opacity: (isLoading || !isEmailValid(email)) ? 0.6 : 1,
                                            cursor: (isLoading || !isEmailValid(email)) ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {isLoading ? 'Please wait...' : 'Next'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}