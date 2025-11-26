// app/auth/register/affiliate/page.tsx
'use client';

import '../../../../styles/login.css';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '', // Will be formatted like GC: "(000) 000-0000"
        company_name: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /* ----------  US-phone formatter (EXACTLY like GC page) ---------- */
    const formatUSPhone = (digits: string): string => {
        const d = digits.replace(/\D/g, '').slice(0, 10);
        if (d.length === 0) return '';
        if (d.length < 4) return `(${d}`;
        if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let sanitized = value;

        if (name === 'phone') {
            sanitized = formatUSPhone(value); // Auto-format like GC
        }

        setFormData((prev) => ({ ...prev, [name]: sanitized }));

        if (errors[name]) {
            setErrors((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreed(e.target.checked);
        if (errors.agreement) {
            setErrors((prev) => {
                const { agreement: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setErrors({});

        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        if (!formData.company_name.trim()) newErrors.company_name = 'Company Name is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.password_confirmation.trim()) newErrors.password_confirmation = 'Confirm Password is required';
        else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }
        if (!isAgreed) newErrors.agreement = 'You must agree to the terms and conditions';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        // ✅ SEND PHONE EXACTLY LIKE GC PAGE — formatted string
        const payload: Record<string, any> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone, // ← Same as GC: "(XXX) XXX-XXXX"
            company_name: formData.company_name,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            role: 'affiliate',
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/affiliate/subscription');
            } else {
                let errorMessage = 'Registration failed. Please try again.';
                if (data?.message) {
                    if (Array.isArray(data.message)) {
                        errorMessage = data.message.join(' ');
                    } else if (typeof data.message === 'string') {
                        errorMessage = data.message;
                    }
                }
                setErrors({ api: errorMessage });
            }
        } catch (err) {
            setErrors({ api: 'Network error. Please check your connection.' });
            console.error(err);
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
                    <Link href="https://designspartans.com/" target="_blank" className="text-primary fw-semibold">
                        {' '}Design Spartans
                    </Link>
                </p>
            </div>

            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="content-wrapper d-flex align-items-center justify-content-center" style={{ padding: '20px' }}>
                        <div className="content w-100 mx-auto" style={{ maxWidth: '482px', position: 'relative', minHeight: '600px' }}>
                            <Link href="/" className="d-block mb-4">
                                <Image
                                    src="/assets/img/icons/logo.webp"
                                    width={350}
                                    height={100}
                                    alt="Logo"
                                    className="img-fluid d-block w-100 mx-auto"
                                    style={{ maxWidth: '350px' }}
                                />
                            </Link>

                            <form className="form" onSubmit={handleSubmit}>
                                <div className="fw-semibold fs-2 mb-4 text-center">Register</div>
                                <div className="register-topbar">
                                    <Image
                                        src="/assets/img/icons/portfolio.webp"
                                        width={50}
                                        height={50}
                                        alt="Icon"
                                        priority
                                    />
                                    <div className="fw-semibold">Affiliate</div>
                                </div>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="name" className="mb-1 fw-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Jason Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.name && (
                                        <span className="text-danger animate-slide-up">{errors.name}</span>
                                    )}
                                </div>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="company_name" className="mb-1 fw-semibold">Company Name</label>
                                    <input
                                        type="text"
                                        id="company_name"
                                        name="company_name"
                                        placeholder="Jason Tiles Limited"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.company_name && (
                                        <span className="text-danger animate-slide-up">{errors.company_name}</span>
                                    )}
                                </div>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="email" className="mb-1 fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="hello@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {errors.email && (
                                        <span className="text-danger animate-slide-up">{errors.email}</span>
                                    )}
                                </div>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="phone" className="mb-1 fw-semibold">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        placeholder="(000) 000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={14}
                                    />
                                    {errors.phone && (
                                        <span className="text-danger animate-slide-up">{errors.phone}</span>
                                    )}
                                </div>
                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="password" className="mb-1 fw-semibold">Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className="form-control pe-5"
                                        placeholder="Password123"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                                    </span>
                                    {errors.password && (
                                        <span className="text-danger animate-slide-up">{errors.password}</span>
                                    )}
                                </div>
                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="password_confirmation" className="mb-1 fw-semibold">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="form-control pe-5"
                                        placeholder="Password123"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                                    </span>
                                    {errors.password_confirmation && (
                                        <span className="text-danger animate-slide-up">{errors.password_confirmation}</span>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="agreement"
                                            checked={isAgreed}
                                            onChange={handleAgreementChange}
                                        />
                                        <label className="form-check-label fw-semibold fs-12" htmlFor="agreement">
                                            By registering, you confirm that you have reviewed and accepted our{' '}
                                            <Link href="/privacy" className="text-primary">
                                                Privacy Policy
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/terms" className="text-primary">
                                                Terms &amp; Conditions.
                                            </Link>
                                        </label>
                                        {errors.agreement && (
                                            <span className="text-danger animate-slide-up d-block mt-1">
                                                {errors.agreement}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {errors.api && <p className="text-danger animate-slide-up mb-3">{errors.api}</p>}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 d-block text-center rounded-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Registering...' : 'Complete Registration'}
                                </button>
                                <div className="text-center fw-medium text-gray-light">
                                    Already have an account?{' '}
                                    <Link href="/auth/login" className="fw-semibold text-black">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}