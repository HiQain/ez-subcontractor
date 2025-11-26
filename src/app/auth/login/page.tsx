'use client';

import '../../../styles/login.css';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('admin_s@gmail.com');
    const [password, setPassword] = useState('Password123');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // ⬅️ NEW
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // ⛔ Disable button

        // Validation
        if (!email.trim()) {
            setError('Email is required');
            setIsLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            setIsLoading(false);
            return;
        }

        if (!password.trim()) {
            setError('Password is required');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.data.token;
                if (!token) {
                    setError('Authentication succeeded but no token received.');
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('token', token);
                localStorage.setItem('role', data.data.user.role);

                const role = data.data.user.role;

                console.log(data);
                console.log(data.data.user.role);




                if (role === 'general_contractor') {
                    router.push('/general-contractor/dashboard');
                }
                if (role === 'subcontractor') {
                    router.push('/subcontractor/subscription');
                }
                if (role === 'affiliate') {
                    router.push('/affiliate/subscription');
                }

                setIsLoading(false);

            } else {
                setError(data.message || 'Invalid email or password');
                setIsLoading(false); // 🔄 Re-enable button
            }

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Login error:', err);
            setIsLoading(false); // 🔄 Re-enable button
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
                    <div className="content-wrapper d-flex align-items-center justify-content-center">
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

                            <div className="fw-semibold fs-2 mb-4 text-center">Login</div>

                            <form className="form" onSubmit={handleSubmit}>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="email" className="mb-1 fw-semibold">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="hello@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="password" className="mb-1 fw-semibold">
                                        Password *
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="form-control pe-5"
                                        placeholder="Enter Your Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} id="toggleIcon"></i>
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        href="/auth/forget-password"
                                        className="text-decoration-none fw-semibold text-gray-light"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {error && (
                                    <p className="text-danger mb-3 animate-slide-up">
                                        {error}
                                    </p>
                                )}

                                <input
                                    type="submit"
                                    value={isLoading ? "Please wait..." : "Login"}
                                    disabled={isLoading}
                                    className="btn btn-primary rounded-3 w-100 d-block mb-4"
                                    style={{
                                        opacity: isLoading ? 0.6 : 1,
                                        cursor: isLoading ? "not-allowed" : "pointer",
                                    }}
                                />
                            </form>
                            
                            <div className="text-center fw-medium text-gray-light">
                                Don’t have an account?{' '}
                                <Link href="/auth/register" className="fw-semibold text-black">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
