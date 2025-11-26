'use client';

import '../../../../styles/login.css';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

interface Category {
    id: string;
    name: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const params = useParams();
    const accountType = (params.type as string) || 'sub-contractor';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        password: '',
        password_confirmation: '',
        license_number: '',
        zip: '',
        work_radius: '',
        category: '',
    });
    console.log(formData);

    const [currentStep, setCurrentStep] = useState(1); // 1 = Personal, 2 = Business
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Category dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const formatUSPhone = (digits: string): string => {
        const d = digits.replace(/\D/g, '').slice(0, 10);   // ≤10 digits only
        if (d.length === 0) return '';
        if (d.length < 4) return `(${d}`;
        if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    };

    // Close dropdown outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch categories (for GC / subcontractor)
    useEffect(() => {
        if (!['general-contractor', 'sub-contractor'].includes(accountType)) return;

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/specializations`);
                const data = await res.json();

                let fetchedCategories: Category[] = [];
                if (Array.isArray(data)) {
                    fetchedCategories = data;
                } else if (data?.data && Array.isArray(data.data)) {
                    fetchedCategories = data.data;
                } else if (data?.categories && Array.isArray(data.categories)) {
                    fetchedCategories = data.categories;
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
    }, [accountType]);

    // ✅ Unified input handler — now with correct typing and error clearing
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let sanitized = value;

        /* ----  PHONE FIELD  ---- */
        if (name === 'phone') {
            sanitized = formatUSPhone(value);          // digits + auto-format
        }

        setFormData(prev => ({ ...prev, [name]: sanitized }));

        /* clear field error while typing */
        if (errors[name]) {
            setErrors(prev => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    // ➡️ Go to business step (UI only — no API)
    const goToNextStep = () => {
        if (accountType === 'affiliate') return; // affiliate has no Step 2
        setCurrentStep(2);
    };

    // ✅ Final Submit — API + Token + Redirect
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setErrors({});

        const newErrors: Record<string, string> = {};

        // === Validation: Step 1 ===
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

        // === Validation: Step 2 (if applicable) ===
        let categoryValue: number | null = null;
        if (['general-contractor', 'sub-contractor'].includes(accountType)) {
            if (!formData.category) newErrors.category = 'Please select a category';
            else {
                const parsed = parseInt(formData.category);
                if (isNaN(parsed) || parsed <= 0) newErrors.category = 'Invalid category';
                else categoryValue = parsed;
            }

            if (!formData.license_number.trim()) newErrors.license_number = 'License Number is required';
        }

        // === Shared fields ===
        if (!formData.zip.trim()) newErrors.zip = 'Zip Code is required';
        if (!formData.work_radius.trim()) newErrors.work_radius = 'Work Radius is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        // ✅ Build payload
        const roleMap: Record<string, string> = {
            'general-contractor': 'general_contractor',
            'sub-contractor': 'subcontractor',
            'affiliate': 'affiliate',
        };

        const role = localStorage.getItem('role');

        const payload: Record<string, any> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company_name: formData.company_name,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            license_number: formData.license_number,
            zip: formData.zip || '46000',
            work_radius: parseInt(formData.work_radius) || 0,
            category: 1,
            role: role
        };

        if (['general-contractor', 'sub-contractor'].includes(accountType)) {
            payload.license_number = formData.license_number;
            if (categoryValue !== null) payload.category = categoryValue;
        }

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
                // 🔑 Optional: Store token if API returns it (e.g., data.data.token)
                // Example:
                // if (data.data?.token) localStorage.setItem('token', data.data.token);

                // ✅ Redirect based on role
                const redirectPaths: Record<string, string> = {
                    'general-contractor': '/general-contractor/subscription',
                    'sub-contractor': '/subcontractor/subscription',
                    'affiliate': '/affiliate/dashboard',
                };
                const path = redirectPaths[accountType] || '/';
                router.push(path);
            } else {
                setErrors({ api: data.message || 'Registration failed. Please try again.' });
            }
        } catch (err) {
            console.error('Network error:', err);
            setErrors({ api: 'Network error. Please check your connection.' });
        } finally {
            setIsLoading(false);
        }
    };

    // UI Info per role
    const accountTypeInfo = {
        'general-contractor': { title: 'General Contractor', icon: '/assets/img/icons/construction-worker.webp' },
        'sub-contractor': { title: 'Subcontractor', icon: '/assets/img/icons/settings.svg' },
        'affiliate': { title: 'Affiliate', icon: '/assets/img/icons/portfolio.webp' },
    };

    const displayInfo = accountTypeInfo[accountType as keyof typeof accountTypeInfo] || {
        title: 'User',
        icon: '/assets/img/icons/user.svg',
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
                                <div style={{ position: 'relative', overflow: 'hidden', transition: 'height 0.3s' }}>
                                    {/* STEP 1: Personal Info */}
                                    {currentStep === 1 && (
                                        <div className="step-one animate__animated animate__fadeIn">
                                            <div className="fw-semibold fs-2 mb-4 text-center">Register</div>

                                            <div className="register-topbar">
                                                <Image
                                                    src={displayInfo.icon}
                                                    width={50}
                                                    height={50}
                                                    alt={displayInfo.title}
                                                />
                                                <div className="fw-semibold">{displayInfo.title}</div>
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="name" className="mb-1 fw-semibold">Full Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                                {errors.name && <span className="text-danger animate-slide-up">{errors.name}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="email" className="mb-1 fw-semibold">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                                {errors.email && <span className="text-danger animate-slide-up">{errors.email}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="phone" className="mb-1 fw-semibold">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    className="form-control"
                                                    placeholder="(555) 123-4567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                                {errors.phone && (
                                                    <span className="text-danger animate-slide-up">{errors.phone}</span>
                                                )}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="company_name" className="mb-1 fw-semibold">Company Name</label>
                                                <input
                                                    type="text"
                                                    id="company_name"
                                                    name="company_name"
                                                    placeholder="JD Construction"
                                                    value={formData.company_name}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                                {errors.company_name && <span className="text-danger animate-slide-up">{errors.company_name}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column position-relative mb-3">
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
                                                {errors.password && <span className="text-danger animate-slide-up">{errors.password}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column position-relative mb-3">
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
                                                        onChange={() => setIsAgreed(!isAgreed)}
                                                    />
                                                    <label className="form-check-label fw-semibold" htmlFor="agreement">
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
                                                        <span className="text-danger animate-slide-up d-block">{errors.agreement}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {errors.api && <p className="text-danger animate-slide-up mb-3">{errors.api}</p>}

                                            <button
                                                type="button"
                                                onClick={goToNextStep}
                                                disabled={isLoading}
                                                className="btn btn-primary w-100 rounded-3 d-block mb-2"
                                            >
                                                Next
                                            </button>

                                            <div className="text-center fw-medium text-gray-light">
                                                Already have an account?{' '}
                                                <Link href="/auth/login" className="fw-semibold text-black">
                                                    Login
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: Business Details (for GC/subcontractor) */}
                                    {currentStep === 2 && ['general-contractor', 'sub-contractor'].includes(accountType) && (
                                        <div className="step-two animate__animated animate__fadeIn">
                                            <div className="fw-semibold fs-2 mb-4 text-center">Business Details</div>

                                            <div className="register-topbar justify-content-start mb-3 d-flex align-items-center gap-2">
                                                <Image
                                                    src={displayInfo.icon}
                                                    width={50}
                                                    height={50}
                                                    alt={displayInfo.title}
                                                />
                                                <div className="fw-semibold">{displayInfo.title}</div>
                                            </div>

                                            {/* Category Dropdown */}
                                            <div className="input-wrapper d-flex flex-column position-relative mb-3" ref={dropdownRef}>
                                                <label htmlFor="category" className="mb-1 fw-semibold">Category *</label>
                                                {categoriesLoading ? (
                                                    <div className="form-control">Loading categories...</div>
                                                ) : categories.length > 0 ? (
                                                    <div className={`custom-select ${dropdownOpen ? 'open' : ''}`}>
                                                        <div
                                                            className="select-selected form-control"
                                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                                        >
                                                            {formData.category
                                                                ? categories.find((c) => c.id === formData.category)?.name
                                                                : 'Select category'}
                                                        </div>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="select-arrow"
                                                            viewBox="0 0 16 16"
                                                            style={{
                                                                position: 'absolute',
                                                                right: '12px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none',
                                                            }}
                                                        >
                                                            <path fillRule="evenodd" d="M1.646 5.646a.5.5 0 0 1 .708 0L8 11.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                                        </svg>
                                                        <ul className="select-options">
                                                            {categories.map((cat) => (
                                                                <li
                                                                    key={cat.id}
                                                                    onClick={() => {
                                                                        setFormData((prev) => ({ ...prev, category: cat.id }));
                                                                        setDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    {cat.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="form-control text-danger">No categories available</div>
                                                )}
                                                {errors.category && <span className="text-danger animate-slide-up">{errors.category}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="license_number" className="mb-1 fw-semibold">License Number</label>
                                                <input
                                                    type="text"
                                                    id="license_number"
                                                    name="license_number"
                                                    placeholder="LIC123456"
                                                    value={formData.license_number}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                                {errors.license_number && (
                                                    <span className="text-danger animate-slide-up">{errors.license_number}</span>
                                                )}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="zip" className="mb-1 fw-semibold">Zip Code</label>
                                                <input
                                                    type="text"
                                                    id="zip"
                                                    name="zip"
                                                    placeholder="12345"
                                                    value={formData.zip}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                                {errors.zip && <span className="text-danger animate-slide-up">{errors.zip}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="work_radius" className="mb-1 fw-semibold">Work Radius (miles)</label>
                                                <input
                                                    type="number"
                                                    id="work_radius"
                                                    name="work_radius"
                                                    placeholder="25"
                                                    value={formData.work_radius}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                                {errors.work_radius && (
                                                    <span className="text-danger animate-slide-up">{errors.work_radius}</span>
                                                )}
                                            </div>

                                            {errors.api && <p className="text-danger animate-slide-up mb-3">{errors.api}</p>}

                                            {/* Back & Submit */}
                                            <div className="d-flex gap-2 mt-3">

                                                <button
                                                    type="submit"
                                                    className="btn btn-primary justify-content-center rounded-3 w-100"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Registering...' : 'Complete Registration'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Affiliate: no step 2 */}
                                    {accountType === 'affiliate' && currentStep === 1 && (
                                        <>
                                            {errors.api && <p className="text-danger animate-slide-up mb-3">{errors.api}</p>}
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 rounded-3 d-block mt-3"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Registering...' : 'Complete Registration'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}