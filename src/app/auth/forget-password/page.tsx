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
            setError('Email is required');
            setIsLoading(false);
            return;
        }

        if (!isEmailValid(email)) {
            setError('Please enter a valid email address');
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
                setMessage('Password reset link has been sent to your email!');
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
                setError(errorMessage);
            }
        } catch (err) {
            setError('Network error. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero-sec login overflow-hidden position-static">
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
                                    />
                                </div>

                                {error && <p className="text-danger mt-2">{error}</p>}
                                {message && <p className="text-success mt-2">{message}</p>}

                                <div className="buttons-wrapper d-flex align-items-center gap-4 mt-3">
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