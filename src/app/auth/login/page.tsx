'use client';

import '../../../styles/login.css';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('johndoe@gmail.com');
    const [password, setPassword] = useState('Password123!');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
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

    // ✅ Eye Icon — identical to RegisterPage
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
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <line
                className="slash"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                style={{ stroke: active ? 'none' : 'currentColor' }}
            ></line>
        </svg>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Trim inputs for robustness
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Validation
        if (!trimmedEmail) {
            setError('Email is required');
            showToast('Email is required', 'error');
            setIsLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            setError('Email is invalid');
            showToast('Email is invalid', 'error');
            setIsLoading(false);
            return;
        }

        if (!trimmedPassword) {
            setError('Password is required');
            showToast('Password is required', 'error');
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
                    email: trimmedEmail,
                    password: trimmedPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.data?.token;
                const user = data.data?.user;
                if (!token || !user) {
                    setError('Authentication succeeded but no token/user received.');
                    showToast('Authentication succeeded but no token/user received.', 'error');
                    setIsLoading(false);
                    return;
                }

                // ✅ Persist auth
                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role);
                localStorage.setItem('userName', user.name || '');
                localStorage.setItem('userEmail', trimmedEmail);

                // Optional: persist email if "Remember me"
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', trimmedEmail);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // 🔹 Show success toast
                showToast('Login successful! Redirecting to dashboard...');

                // Delay for UX
                setTimeout(() => {
                    switch (user.role) {
                        case 'general_contractor':
                            router.push('/general-contractor/dashboard');
                            break;
                        case 'subcontractor':
                            router.push('/subscription-list');
                            break;
                        case 'affiliate':
                            router.push('/subscription-list');
                            break;
                        default:
                            router.push('/');
                    }
                }, 1000);

            } else {
                const errorMsg = data.message || 'Invalid email or password';
                setError(errorMsg);
                showToast(errorMsg, 'error');
            }
        } catch (err) {
            const errorMsg = 'Something went wrong. Please try again.';
            setError(errorMsg);
            showToast(errorMsg, 'error');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔁 Optional: Auto-fill remembered email on mount
    React.useEffect(() => {
        const remembered = localStorage.getItem('rememberedEmail');
        if (remembered) {
            setEmail(remembered);
            setRememberMe(true);
        }
    }, []);

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
                    <Link href="https://designspartans.com/" target="_blank" className="text-primary fw-semibold">
                        {' '}Design Spartans
                    </Link>
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

                            <form className="form" onSubmit={handleSubmit} noValidate>
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

                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="password" className="mb-1 fw-semibold">
                                        Password <span className="text-danger">*</span>
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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setShowPassword(!showPassword);
                                            }
                                        }}
                                        tabIndex={0} // make it focusable
                                        role="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <EyeIcon active={showPassword} />
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        href="/auth/forget-password"
                                        className="text-decoration-none text-gray-light"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {error && (
                                    <p className="text-danger mb-3 animate-slide-up">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-3 w-100 d-block mb-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Please wait...' : 'Login'}
                                </button>
                            </form>

                            <div className="text-center fw-medium text-gray-light">
                                Don't have an account?{' '}
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