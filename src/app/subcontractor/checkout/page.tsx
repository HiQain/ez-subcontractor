'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/pricing.css';
import '../../../styles/checkout.css';

interface ProfileData {
    address: string;
    city: string;
    companyName: string;
    email: string;
    licenseNumber: string;
    fullName: string;
    phone: string;
    profile_image: string;
    role: string;
    categories: string[];
    state: string;
    workRadius: string;
    zipCode: string;
}

interface Category {
    id: string;
    name: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const handleConfirmPayment = () => {
        router.push('/subcontractor/thank-you');
    };

    // Load selected plan from localStorage
    useEffect(() => {
        const plan = localStorage.getItem('selectedPlan');
        if (plan) {
            setSelectedPlan(JSON.parse(plan));
        } else {
            router.push('/subcontractor/subscription');
        }
    }, [router]);

    // Fetch profile
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            setLoading(false);
            router.push('/auth/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok && data.data) {
                    setProfile({
                        address: data.data.address || null,
                        city: data.data.city || 'N/A',
                        companyName: data.data.company_name || 'N/A',
                        email: data.data.email || 'N/A',
                        licenseNumber: data.data.license_number || null,
                        fullName: data.data.name || 'N/A',
                        phone: data.data.phone || 'N/A',
                        profile_image: data.data.profile_image || null,
                        role: data.data.role || 'N/A',
                        categories: data.data.categories || [],
                        state: data.data.state || 'N/A',
                        workRadius: data.data.workRadius || '0',
                        zipCode: data.data.zipCode || 'N/A',
                    });
                } else {
                    setError(data.message || 'Failed to load profile');
                    router.push('/auth/login');
                }
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError('Network error. Please try again.');
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

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

    // Initialize Select2
    useEffect(() => {
        if (typeof window === 'undefined' || categoriesLoading) return;

        const $ = require('jquery');
        require('select2');
        require('select2/dist/css/select2.min.css');

        $('#category-select2').select2({
            placeholder: 'Select category',
            allowClear: true, // ✅ Allow clearing
            width: '100%',
            minimumInputLength: 0,
        })
            .on('change', function () {
                const val = $(this).val() as string;
                setSelectedCategory(val || '');
                // Clear error if needed (add your validation logic here)
                // clearError('category');
            })
            .on('select2:unselect', function () {
                setSelectedCategory('');
            });

        // Cleanup on unmount
        return () => {
            $('#category-select2').select2('destroy');
        };
    }, [categoriesLoading, categories]);

    // ✅ Don't render until plan is loaded
    if (!selectedPlan) return null;

    if (loading) {
        return (
            <div className="sections overflow-hidden">
                <Header />
                <section className="hero-sec pricing no-before overflow-hidden">
                    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading...</p>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    if (!profile) return null;

    // Price summary
    const basePrice = selectedPlan ? parseFloat(selectedPlan.price) || 0 : 0;
    const extraCategories = 2 * 125;
    const tax = Math.round((basePrice + extraCategories) * 0.08);
    const total = basePrice + extraCategories + tax;

    return (
        <div className="sections overflow-hidden">
            <Header />

            <section className="hero-sec pricing no-before overflow-hidden">
                <div className="container">
                    <div className="row g-4">
                        {/* LEFT COLUMN */}
                        <div className="col-lg-8">
                            <div className="d-flex flex-column justify-content-center w-100 h-100">
                                <div className="d-flex align-items-center gap-2 mb-4">
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
                                    <div className="login-title fw-semibold fs-2 text-center">
                                        Checkout
                                    </div>
                                </div>

                                <div className="form">
                                    {/* Full Name & Email */}
                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Full Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Jason Doe"
                                                defaultValue={profile.fullName}
                                                readOnly
                                            />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Email Address *</label>
                                            <input
                                                type="email"
                                                placeholder="hello@example.com"
                                                defaultValue={profile.email}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* Category Select */}
                                    <div className="input-wrapper d-flex flex-column position-relative">
                                        <label className="mb-1 fw-semibold">Category *</label>
                                        <select
                                            id="category-select2"
                                            className="form-control"
                                            value={selectedCategory}
                                            // Controlled by Select2; value ignored but kept for SSR compatibility
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 👇 Single Selected Category Chip */}
                                    {selectedCategory && (
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="btn bg-dark p-2 fs-12 rounded-3 d-flex align-items-center gap-1">
                                                <span className="text-gray-light">
                                                    {categories.find(cat => cat.id === selectedCategory)?.name || 'Unknown'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory('');
                                                        // Reset Select2
                                                        if (typeof window !== 'undefined') {
                                                            const $ = require('jquery');
                                                            $('#category-select2').val(null).trigger('change');
                                                        }
                                                    }}
                                                    className="bg-transparent border-0 p-0 m-0"
                                                    aria-label="Remove category"
                                                >
                                                    <Image
                                                        src="/assets/img/cancel_svgrepo.com.svg"
                                                        width={16}
                                                        height={16}
                                                        alt="Remove"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Info */}
                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Card Holder Name *</label>
                                            <input type="text" placeholder="Enter card holder name" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Card Number *</label>
                                            <input type="number" placeholder="4242 4242 4242 4242" />
                                        </div>
                                    </div>

                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">CVV *</label>
                                            <input type="number" placeholder="Enter CVV" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Expiry Date *</label>
                                            <input type="date" placeholder="12/25" />
                                        </div>
                                    </div>

                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Zip Code *</label>
                                            <input
                                                type="number"
                                                placeholder="Enter zip code"
                                                defaultValue={profile.zipCode !== 'N/A' ? profile.zipCode : ''}
                                            />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Promo Code</label>
                                            <input type="text" placeholder="Enter promo code" />
                                        </div>
                                    </div>

                                    {/* ORDER SUMMARY */}
                                    <div className="summary-card mt-4">
                                        <div className="top d-flex align-items-start gap-2">
                                            <Image src="/assets/img/summary.svg" width={24} height={24} alt="Summary Icon" />
                                            <div className="content w-100">
                                                <span className="fw-semibold d-block" style={{ fontSize: '14px' }}>Order Summary</span>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>{selectedPlan.title} Plan</span>
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>
                                                        {selectedPlan.price === 'Free' ? 'Free' : `$${selectedPlan.price}`}
                                                    </span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>Extra Categories (2 X $125)</span>
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>${extraCategories}</span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>Tax (8%)</span>
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>${tax}</span>
                                                </div>

                                                <hr className="mt-2 mb-2" />

                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">Total</span>
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">${total}</span>
                                                </div>

                                                <p className="mb-0 mt-2" style={{ fontSize: '14px' }}>
                                                    Note: You’ve selected 1 category (others are pre-selected from profile)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONFIRM PAYMENT */}
                                    <input
                                        type="button"
                                        value="Confirm Payment"
                                        className="btn btn-primary w-100 rounded-3 mt-4"
                                        onClick={handleConfirmPayment}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Selected Plan Card */}
                        <div className="col-lg-4">
                            <div className="pricing-sec p-0">
                                <div className="fs-5 fw-semibold mb-3">Selected Plan</div>
                                <div className="pricing-wrapper">
                                    <div className={`price-card ${selectedPlan.isPopular ? 'price-card1' : ''} free`}>
                                        <div className="pricing-header">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <span className="title1 mb-0">{selectedPlan.title}</span>
                                                {selectedPlan.isPopular && (
                                                    <div className="custom-btn bg-white rounded-5 shadow p-2" style={{ fontSize: '14px' }}>🔥 Popular</div>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                {selectedPlan.discount && (
                                                    <del className="fs-18">${selectedPlan.price}</del>
                                                )}
                                                {selectedPlan.discount ? (
                                                    <span className="price">
                                                        ${selectedPlan.price - selectedPlan.price / 100 * selectedPlan.discount}
                                                    </span>
                                                ) : (
                                                    <span className="price">${selectedPlan.price}</span>
                                                )}
                                                {selectedPlan.saveText && (
                                                    <div className="btn btn-primary rounded-pill p-2 m-0 bg-primary">
                                                        {parseFloat(selectedPlan.discount)}% OFF
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pricing-body mb-4">
                                            <ul className="m-0 p-0 list-with-icon">
                                                {selectedPlan.features.map((feature: string, i: number) => (
                                                    <li key={i}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}