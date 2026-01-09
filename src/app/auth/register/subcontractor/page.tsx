'use client';

import '../../../../styles/login.css';
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
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
    const accountType = (params.type as string) || 'subcontractor';

    // 🔑 Form state
    const [formData, setFormData] = useState({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phone: '(342) 432-4324',
        company_name: 'ABC Corporation',
        password: 'Password123!',
        password_confirmation: 'Password123!',
        license_number: '',
        zip: '10000',
        work_radius: 25,
        category: '',
    });

    const [currentStep, setCurrentStep] = useState(1); // 1 = Personal, 2 = Business
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // ✅ Eye Icon Component
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

    /* ---------- US Phone Formatter ---------- */
    const formatUSPhone = (digits: string): string => {
        const d = digits.replace(/\D/g, '').slice(0, 10);
        if (d.length === 0) return '';
        if (d.length < 4) return `(${d}`;
        if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    };

    // ✅ Input handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let sanitized = value;

        if (name === 'phone') sanitized = formatUSPhone(value);

        setFormData(prev => ({ ...prev, [name]: sanitized }));

        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    // ✅ Agreement handler
    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreed(e.target.checked);
        if (errors.agreement) {
            setErrors(prev => {
                const { agreement: _, ...rest } = prev;
                return rest;
            });
        }
    };

    // 🔹 Unified Toast Utility (✅ matches your original design)
    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        // Remove any existing toast first
        const existing = document.querySelector('.spartans-toast');
        if (existing) existing.remove();

        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const icon = type === 'success' ? '✅' : '❌';

        const toast = document.createElement('div');
        toast.className = 'spartans-toast';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                max-width: 400px;
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
                font-size: 14px;
            ">
                <span>${icon} ${message}</span>
                <button type="button" class="btn-close" style="font-size: 12px; margin-left: auto; opacity: 0.7;" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast);

        const timeoutId = setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);

        // const el = toast.firstChild as HTMLElement;
        // const timeoutId = setTimeout(() => {
        //     el.classList.remove('show');
        //     el.style.opacity = '0';
        //     setTimeout(() => {
        //         if (toast.parentNode) toast.parentNode.removeChild(toast);
        //     }, 300);
        // }, 4000);
        //
        // const closeButton = el.querySelector('.btn-close');
        // closeButton?.addEventListener('click', () => {
        //     clearTimeout(timeoutId);
        //     el.classList.remove('show');
        //     el.style.opacity = '0';
        //     setTimeout(() => {
        //         if (toast.parentNode) toast.parentNode.removeChild(toast);
        //     }, 300);
        // });
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/specializations`, {
                    headers: { 'Accept': 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                let fetchedCategories: Category[] = [];
                if (Array.isArray(data)) {
                    fetchedCategories = data.map(item => ({ id: String(item.id), name: item.name }));
                } else if (data?.data?.specializations && Array.isArray(data.data.specializations)) {
                    fetchedCategories = data.data.specializations.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                } else if (data?.data && Array.isArray(data.data)) {
                    fetchedCategories = data.data.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
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
    }, []);

    // Initialize Select2 on Step 2 (only for GC/Sub)
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            currentStep !== 2 ||
            !['general-contractor', 'sub-contractor'].includes(accountType) ||
            categoriesLoading
        ) {
            return;
        }

        // Dynamically import select2 (avoids SSR issues)
        import('select2').then(() => {
            require('select2/dist/css/select2.min.css');

            const $select = $('#category-select');
            if ($select.length === 0) return;

            // Destroy if already initialized
            if ($select.data('select2')) {
                $select.select2('destroy');
            }

            $select.select2({
                placeholder: 'Select category',
                allowClear: false,
                width: '100%',
            }).on('change', function () {
                const val = $(this).val() as string;
                setFormData(prev => ({ ...prev, category: val || '1' }));
                if (errors.category) {
                    setErrors(prev => {
                        const { category: _, ...rest } = prev;
                        return rest;
                    });
                }
            });

            return () => {
                if ($select.data('select2')) {
                    $select.select2('destroy');
                }
            };
        });
    }, [currentStep, categoriesLoading, categories, accountType]);

    // ✅ Go to Step 2 (with validation)
    const goToNextStep = () => {

        const step1Errors: Record<string, string> = {};

        if (!formData.name.trim()) step1Errors.name = 'Full Name is required';
        if (!formData.email.trim()) step1Errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) step1Errors.email = 'Email is invalid';
        if (!formData.phone.trim()) step1Errors.phone = 'Phone Number is required';
        if (!formData.password.trim()) step1Errors.password = 'Password is required';
        else if (formData.password.length < 6) step1Errors.password = 'Password must be at least 6 characters';
        if (!formData.password_confirmation.trim()) step1Errors.password_confirmation = 'Confirm Password is required';
        else if (formData.password !== formData.password_confirmation) {
            step1Errors.password_confirmation = 'Passwords do not match';
        }
        if (!isAgreed) step1Errors.agreement = 'You must agree to the terms and conditions';

        if (Object.keys(step1Errors).length > 0) {
            setErrors(step1Errors);
            const firstError = Object.values(step1Errors)[0];
            showToast(firstError, 'error');
            return;
        }

        setCurrentStep(2);
    };

    // ✅ Final Submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.password_confirmation.trim()) newErrors.password_confirmation = 'Confirm Password is required';
        else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }
        if (!isAgreed) newErrors.agreement = 'You must agree to the terms and conditions';

        if (['general-contractor', 'subcontractor'].includes(accountType)) {
            if (!formData.category) newErrors.category = 'Please select a category';
            if (!formData.license_number.trim()) newErrors.license_number = 'License Number is required';
        }

        if (!formData.zip.trim()) newErrors.zip = 'Zip Code is required';
        if (formData.work_radius === 0) newErrors.work_radius = 'Work Radius is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstError = Object.values(newErrors)[0];
            showToast(firstError, 'error');
            setIsLoading(false);
            return;
        }

        // ✅ Build payload
        const role = localStorage.getItem('role') || accountType.replace('-', '_');
        const fcmToken = localStorage.getItem("fcmToken");
        localStorage.setItem('userZip', formData.zip);
        localStorage.setItem('userRadius', formData.work_radius.toString());

        const payload: Record<string, any> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company_name: formData.company_name,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            license_number: formData.license_number,
            zip: formData.zip,
            work_radius: formData.work_radius || 0,
            category: formData.category || '1',
            role: 'subcontractor',
            device_token: fcmToken,
            device_type: "website",
            device_info: {
                "os": "website",
                "app_version": "1.0.0",
                "manufacturer": "website"
            }
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
                const token = data.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('role', 'subcontractor');
                }

                // Delay for UX
                setTimeout(() => {
                    const paths: Record<string, string> = {
                        'general-contractor': '/subscription-list',
                        'subcontractor': '/subscription-list',
                        'affiliate': '/affiliate/dashboard',
                    };
                    router.push(paths[accountType] || '/');
                }, 1500);
            } else {
                const msg = Array.isArray(data.message)
                    ? data.message[0]
                    : data.message || 'Registration failed. Please try again.';
                setErrors({ api: msg });
                showToast(msg, 'error');
            }
        } catch (err) {
            console.error('Network error:', err);
            const errMsg = 'Network error. Please check your connection.';
            setErrors({ api: errMsg });
            showToast(errMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Role display config
    const accountTypeInfo = {
        'general-contractor': { title: 'General Contractor', icon: '/assets/img/icons/construction-worker.webp' },
        'sub-contractor': { title: 'Subcontractor', icon: '/assets/img/icons/settings.svg' },
        'affiliate': { title: 'Affiliate', icon: '/assets/img/icons/portfolio.webp' },
    };

    const displayInfo = accountTypeInfo[accountType as keyof typeof accountTypeInfo] || {
        title: 'Subcontractor',
        icon: '/assets/img/icons/settings.svg',
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
                                <div style={{ position: 'relative', overflow: 'hidden' }}>
                                    {/* STEP 1: Personal Info */}
                                    {currentStep === 1 && (
                                        <div className="step-one animate__animated animate__fadeIn">
                                            <div className="fw-semibold fs-2 mb-4 text-center">Register</div>

                                            <div className="register-topbar px-4 gap-3 mb-3">
                                                <Image
                                                    src={displayInfo.icon}
                                                    width={50}
                                                    height={50}
                                                    alt={displayInfo.title}
                                                />
                                                <div className="fw-semibold">{displayInfo.title}</div>
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="name" className="mb-1 fw-semibold">Full Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    disabled={isLoading}
                                                />
                                                {errors.name && <span className="text-danger animate-slide-up">{errors.name}</span>}
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
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="email" className="mb-1 fw-semibold">Email Address <span className="text-danger">*</span></label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    disabled={isLoading}
                                                />
                                                {errors.email && <span className="text-danger animate-slide-up">{errors.email}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="phone" className="mb-1 fw-semibold">Phone Number <span className="text-danger">*</span></label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    className="form-control"
                                                    placeholder="(555) 123-4567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    maxLength={14}
                                                    disabled={isLoading}
                                                />
                                                {errors.phone && <span className="text-danger animate-slide-up">{errors.phone}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column position-relative mb-3">
                                                <label htmlFor="password" className="mb-1 fw-semibold">Password <span className="text-danger">*</span></label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    className="form-control pe-5"
                                                    placeholder="Password123"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                                <span
                                                    className="toggle-password position-absolute"
                                                    style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <EyeIcon active={showPassword} />
                                                </span>
                                                {errors.password && <span className="text-danger animate-slide-up">{errors.password}</span>}
                                            </div>

                                            <div className="input-wrapper d-flex flex-column position-relative mb-3">
                                                <label htmlFor="password_confirmation" className="mb-1 fw-semibold">Confirm Password <span className="text-danger">*</span></label>
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    className="form-control pe-5"
                                                    placeholder="Password123"
                                                    value={formData.password_confirmation}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                                <span
                                                    className="toggle-password position-absolute"
                                                    style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    <EyeIcon active={showConfirmPassword} />
                                                </span>
                                                {errors.password_confirmation && <span className="text-danger animate-slide-up">{errors.password_confirmation}</span>}
                                            </div>

                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="agreement"
                                                    checked={isAgreed}
                                                    onChange={handleAgreementChange}
                                                    disabled={isLoading}
                                                />
                                                <label className="form-check-label fs-12" htmlFor="agreement">
                                                    By registering, you confirm that you have reviewed and accepted our{' '}
                                                    <Link href="/privacy-policy" style={{ color: '#8F9B1F' }}>Privacy Policy</Link> and{' '}
                                                    <Link href="/terms-and-conditions" style={{ color: '#8F9B1F' }}>Terms &amp; Conditions.</Link>
                                                </label>
                                                {errors.agreement && <span className="text-danger animate-slide-up d-block mt-1">{errors.agreement}</span>}
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

                                            <div className="text-center fw-medium text-gray-light mt-3">
                                                Already have an account?{' '}
                                                <Link href="/auth/login" className="fw-semibold text-black">
                                                    Login
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: Business Details (GC/Sub only) */}
                                    {currentStep === 2 && ['general-contractor', 'subcontractor'].includes(accountType) && (
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

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="category-select" className="mb-1 fw-semibold">
                                                    Category <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    id="category-select"
                                                    className="form-control"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        category: e.target.value
                                                    }))}
                                                    disabled={categoriesLoading}
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
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
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="zip" className="mb-1 fw-semibold">Zip Code</label>
                                                <input
                                                    type="text"
                                                    id="zip"
                                                    name="zip"
                                                    placeholder="12345"
                                                    value={formData.zip}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            zip: value
                                                        }));
                                                    }}
                                                    className="form-control"
                                                    disabled={isLoading}
                                                    inputMode="numeric"
                                                    maxLength={5}
                                                />
                                            </div>

                                            <div className="input-wrapper d-flex flex-column mb-3">
                                                <label htmlFor="work_radius" className="mb-1 fw-semibold">
                                                    Work Radius (miles) <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="work_radius"
                                                    name="work_radius"
                                                    placeholder="0"
                                                    min="0"
                                                    step="1"
                                                    value={formData.work_radius}
                                                    onChange={(e) => {
                                                        const value = Math.max(0, Number(e.target.value || 0));
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            work_radius: value
                                                        }));
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-' || e.key === '+') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="form-control"
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            {errors.api && <p className="text-danger animate-slide-up mb-3">{errors.api}</p>}

                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <button
                                                        onClick={() => setCurrentStep(1)}
                                                        type="button"
                                                        className="btn btn-outline-dark rounded-3 text-center d-block"
                                                        disabled={isLoading}
                                                    >
                                                        Back
                                                    </button>
                                                </div>
                                                <div className="col-lg-8">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary w-100 rounded-3 text-center d-block"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? 'Registering...' : 'Complete Registration'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Affiliate: single step */}
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