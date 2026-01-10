'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import '../../styles/pricing.css';
import '../../styles/checkout.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CheckoutPage() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getPlanRule = (plan: any) => {
        if (!plan) return { free: 0, extraPrice: 0 };

        const freeCategories = plan.type === 'free' ? 1 : 1;
        const extraPrice = plan.extra_category_price || 0;

        return { free: freeCategories, extraPrice };
    };

    // 🔹 Toast Utility — identical to your register page
    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        const existing = document.querySelector('.checkout-toast');
        if (existing) existing.remove();

        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const icon = type === 'success' ? '✅' : '❌';

        const toast = document.createElement('div');
        toast.className = 'checkout-toast';
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
<!--                <button type="button" class="btn-close" style="font-size: 12px; margin-left: auto; opacity: 0.7;" data-bs-dismiss="toast"></button>-->
            </div>
        `;
        document.body.appendChild(toast);

        const timeoutId = setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);

        // const closeButton = el.querySelector('.btn-close');
        // closeButton?.addEventListener('click', () => {
        //     clearTimeout(timeoutId);
        //     el.classList.remove('show');
        //     el.style.opacity = '0';
        //     setTimeout(() => toast.remove(), 300);
        // });
    };

    // ✅ Handle Apply Promo Code
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setPromoLoading(true);
        setPromoError(null);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/promo/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ code: promoCode.trim() }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message?.[0] || 'Invalid promo code');
            }

            setAppliedPromo(data.data);
        } catch (err: any) {
            setPromoError(err.message || 'Something went wrong');
            setAppliedPromo(null);
            showToast(err.message || 'Invalid promo code', 'error'); // ✅ Toast added
        } finally {
            setPromoLoading(false);
        }
    };

    // ✅ Handle Remove Promo
    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
    };

    // ✅ Load selected plan from localStorage
    useEffect(() => {
        const plan = localStorage.getItem('selectedPlan');
        const selectedCategory = localStorage.getItem('selectedCategory');
        if (plan) setSelectedPlan(JSON.parse(plan));
        if (selectedCategory) {
            const parsedCategory = JSON.parse(selectedCategory);
            setSelectedCategories([parsedCategory]);
        }
    }, []);

    // ✅ Load name & email from localStorage
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const role = localStorage.getItem('role');
        setRole(role);
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    // 🔹 Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/specializations`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data.specializations)) {
                    setCategories(data.data.specializations);
                } else {
                    console.error('Failed to fetch specializations', data.message);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleCategory = (category: { id: number; name: string }) => {
        if (!selectedPlan) return;

        const alreadySelected = selectedCategories.some(c => c.id === category.id);

        // 🔹 If already selected → remove normally
        if (alreadySelected) {
            setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
            return;
        }

        // ✅ PLAN 1 SPECIAL BEHAVIOR
        // Only 1 allowed → replace existing with new one
        if (selectedPlan.title === 'Free Registration') {
            setSelectedCategories([category]);
            return;
        }

        // 🔹 Other plans (2 & 3) → normal add
        setSelectedCategories([...selectedCategories, category]);
    };


    // Price summary calculation
    const rule = getPlanRule(selectedPlan);

    const freeCategories = rule.free;
    const extraCategoryCount = Math.max(selectedCategories.length - freeCategories, 0);
    const extraCategoriesPrice = extraCategoryCount * rule.extraPrice;

    // ✅ Safely handle null selectedPlan
    const planPrice = parseFloat(selectedPlan?.discount
        ? selectedPlan?.price - (selectedPlan?.price / 100) * selectedPlan?.discount
        : selectedPlan?.price || '0');

    const total = planPrice + extraCategoriesPrice;
    let finalTotal = total;

    // Promo logic
    if (appliedPromo) {
        const promoValue = parseFloat(appliedPromo.value);

        if (appliedPromo.type === 'fixed') {
            finalTotal = Math.max(finalTotal - promoValue, 0);
        }

        if (appliedPromo.type === 'percent') {
            const discountAmount = (finalTotal * promoValue) / 100;
            finalTotal = Math.max(finalTotal - discountAmount, 0);
        }
    }

    // ✅ Note card for Trial plan
    const renderNoteCard = () => (
        <div className="note-card d-flex align-items-start gap-1">
            <Image
                src="/assets/img/icons/note.webp"
                width={24}
                height={24}
                alt="Note"
                loading="lazy"
                className="d-block"
            />
            <div className="content">
                <span className="d-block fw-semibold mb-1" style={{ fontSize: '14px' }}>Note</span>
                <p className="mb-0" style={{ fontSize: '12px' }}>
                    After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.
                </p>
            </div>
        </div>
    );

    // ✅ Handle payment confirm
    const handleConfirmPayment = async () => {
        setError(null);

        if (!name.trim() || !email.trim()) {
            showToast('Please enter your name and email', 'error');
            return;
        }
        if (role === 'subcontractor') {
            if (selectedCategories.length === 0) {
                showToast('Please select at least one category', 'error');
                return;
            }
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // ===============================
            // ✅ FREE PLAN FLOW (NO STRIPE)
            // ===============================
            if (selectedPlan.id === 1) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/create-subscription`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        body: JSON.stringify({
                            plan_id: selectedPlan.id,
                            ...(role === 'subcontractor' && {
                                category_ids: selectedCategories.map(c => c.id),
                            }),
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message?.[0] || 'Free subscription failed');
                }

                router.push('/thank-you');
                return;
            }

            // ===============================
            // 🔹 PAID PLAN FLOW (STRIPE)
            // ===============================
            if (!stripe || !elements) {
                throw new Error('Stripe not loaded');
            }

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card details missing');
            }

            const { error: stripeError, paymentMethod } =
                await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: { name, email },
                });

            if (stripeError || !paymentMethod) {
                throw new Error(stripeError?.message || 'Payment failed');
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/create-subscription`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify({
                        plan_id: selectedPlan.id,
                        payment_method_id: paymentMethod.id,
                        ...(role === 'subcontractor' && {
                            category_ids: selectedCategories.map(c => c.id),
                        }),
                        ...(promoCode && { promo_code: promoCode }),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message?.[0] || 'Subscription failed');
            }

            router.push('/thank-you');

        } catch (err: any) {
            showToast(err.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPlan) return null;

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
                                    <div className="icon" onClick={() => router.back()}>
                                        <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Angle" />
                                    </div>
                                    <div className="login-title fw-semibold fs-2 text-center">
                                        Checkout
                                    </div>
                                </div>

                                <div className="form">
                                    {/* User Info */}
                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Full Name *</label>
                                            <input type="text" placeholder="Jason Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled
                                            />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Email Address *</label>
                                            <input type="email" placeholder="hello@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {role === 'subcontractor' && (
                                        <div ref={dropdownRef}>
                                            <label className="mb-1 fw-semibold">Select Specializations *</label>
                                            <div className={`custom-select ${isOpen ? 'open' : ''}`}
                                                onClick={() => setIsOpen(!isOpen)}>
                                                <div className="select-selected d-flex flex-wrap gap-1 align-items-center">
                                                    {selectedCategories.length > 0 ? (
                                                        selectedCategories.map(cat => (
                                                            <div
                                                                key={cat.id}
                                                                className="btn btn-primary p-1 px-2 fs-12 rounded-3 d-flex align-items-center gap-1"
                                                            >
                                                                <span>{cat.name}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        'Select Specializations'
                                                    )}
                                                    <i className="bi bi-chevron-down select-arrow" style={{ marginLeft: 'auto' }}></i>
                                                </div>
                                                <i className="bi bi-chevron-down select-arrow"></i>
                                                {isOpen && (
                                                    <ul className="select-options">
                                                        <li style={{ padding: '10px 10px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="Search categories..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '6px 8px',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #ccc',
                                                                    marginBottom: '6px',
                                                                }}
                                                            />
                                                        </li>

                                                        {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                                                            <li key={cat.id} onClick={() => {
                                                                toggleCategory(cat)
                                                                setSearchTerm('');
                                                            }}>
                                                                <div style={{ position: 'relative', }}>
                                                                    {cat.name}
                                                                    <input
                                                                        style={{ position: 'absolute', right: '0px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                                        type="checkbox"
                                                                        checked={selectedCategories.some(c => c.id === cat.id)}
                                                                    />
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )
                                    }

                                    {/* Selected Categories Buttons */}
                                    {role === 'subcontractor' && (
                                        <div className="buttons d-flex align-items-center gap-2 flex-wrap">
                                            {selectedCategories.map(cat => (
                                                <div
                                                    key={cat.id}
                                                    className="btn bg-dark p-2 fs-12 rounded-3 d-flex align-items-center gap-1"
                                                >
                                                    <span className="text-gray-light">{cat.name}</span>
                                                    <Image
                                                        src="/assets/img/cancel_svgrepo.com.svg"
                                                        width={16}
                                                        height={16}
                                                        alt="Cancel"
                                                        onClick={() => toggleCategory(cat)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* STRIPE CARD FORM */}
                                    {selectedPlan.id !== 1 && (
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Card Details *</label>

                                            <div
                                                style={{
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    background: '#fff',
                                                }}
                                            >
                                                <CardElement
                                                    options={{
                                                        style: {
                                                            base: {
                                                                fontSize: '16px',
                                                                color: '#000',
                                                                '::placeholder': { color: '#999' },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {selectedPlan.id !== 1 && (
                                        <div className="input-wrapper-s2 d-flex align-items-start gap-2">
                                            <div className="input-wrapper d-flex flex-column flex-grow-1">
                                                <label className="mb-1 fw-semibold">Promo Code</label>
                                                <div className="d-flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter promo code"
                                                        value={promoCode}
                                                        onChange={(e) => setPromoCode(e.target.value)}
                                                        disabled={!!appliedPromo}
                                                    />
                                                    {appliedPromo ? (
                                                        <button
                                                            className="btn btn-danger"
                                                            style={{ height: '45px', lineHeight: '18px' }}
                                                            onClick={handleRemovePromo}
                                                        >
                                                            Remove
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary rounded-3"
                                                            style={{ height: '45px', lineHeight: '18px' }}
                                                            onClick={handleApplyPromo}
                                                            disabled={promoLoading}
                                                        >
                                                            {promoLoading ? 'Applying...' : 'Apply'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    )}

                                    {promoError && <p className="text-danger mt-1">{promoError}</p>}
                                    {appliedPromo && (
                                        <p className="text-success mt-1">Promo "{appliedPromo.code}" applied successfully!</p>
                                    )}

                                    {/* ORDER SUMMARY */}
                                    <div className="summary-card mt-4">
                                        <div className="top d-flex align-items-start gap-2">
                                            <Image src="/assets/img/summary.svg" width={24} height={24} alt="Summary Icon" />
                                            <div className="content w-100">
                                                <span className="fw-semibold d-block" style={{ fontSize: '14px' }}>Order Summary</span>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>{selectedPlan.title}</span>
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>${
                                                        selectedPlan.discount
                                                            ? Math.trunc(selectedPlan.price - (selectedPlan.price / 100) * selectedPlan.discount)
                                                            : selectedPlan.price
                                                    }</span>
                                                </div>

                                                {extraCategoryCount > 0 && (
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <span style={{ fontSize: '14px' }}>
                                                            Extra Categories ({extraCategoryCount} × ${rule.extraPrice})
                                                        </span>
                                                        <span className="fw-semibold" style={{ fontSize: '14px' }}>
                                                            ${extraCategoriesPrice}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* ✅ Promo Discount */}
                                                {appliedPromo && (
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <span style={{ fontSize: '14px', color: '#28a745' }}>
                                                            Promo ({appliedPromo.code})
                                                        </span>
                                                        <span className="fw-semibold" style={{ fontSize: '14px', color: '#28a745' }}>
                                                            {appliedPromo.type === 'fixed'
                                                                ? `-$${parseFloat(appliedPromo.value)}`
                                                                : `-${parseFloat(appliedPromo.value)}%`}
                                                        </span>
                                                    </div>
                                                )}

                                                <hr className="mt-2 mb-2" />

                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">Total</span>
                                                    {/* <span style={{ fontSize: '14px' }} className="fw-semibold">${Math.trunc(finalTotal)}</span> */}
                                                    <span className="fw-semibold">${selectedPlan.id === 1 ? 0 : Math.trunc(finalTotal)}</span>
                                                </div>

                                                {role === 'subcontractor' && (
                                                    <p className="mb-0 mt-2" style={{ fontSize: '14px' }}>
                                                        You’ve selected {selectedCategories.length} {selectedCategories.length > 1 ? 'categories' : 'category'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONFIRM PAYMENT */}
                                    {error && (
                                        <p className="text-danger mb-3 animate-slide-up">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        className="btn btn-primary rounded-3 mt-4"
                                        onClick={handleConfirmPayment}
                                        disabled={(selectedPlan.id !== 1 && !stripe) || loading}
                                    >
                                        {loading
                                            ? 'Processing...'
                                            : selectedPlan.id === 1
                                                ? 'Activate Free Plan'
                                                : 'Confirm Payment'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Selected Plan Card */}
                        <div className="col-lg-4">
                            <div className="pricing-sec p-0">
                                <div className="fs-5 fw-semibold mb-3">Selected Plan</div>
                                <div className="pricing-wrapper">
                                    <div className={`price-card ${selectedPlan.isPopular ? 'popular' : ''} free`}>
                                        <div className="pricing-header">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <span className="title1 mb-0">{selectedPlan.title}</span>
                                                {selectedPlan.isPopular && (
                                                    <div className="custom-btn bg-white rounded-5 shadow p-2" style={{ fontSize: '14px' }}>🔥 Popular</div>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                {selectedPlan.showStrike ? (
                                                    <div className="d-flex flex-column gap-1">
                                                        <del className="fs-18 fw-medium text-black">$ {selectedPlan.price}</del>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="price">
                                                                $
                                                                <span className="fw-bold">
                                                                    {selectedPlan.discount
                                                                        ? Math.trunc(selectedPlan.price - (selectedPlan.price / 100) * selectedPlan.discount)
                                                                        : selectedPlan.price}
                                                                </span>
                                                            </span>
                                                            {selectedPlan.saveText && (
                                                                <div
                                                                    style={{ backgroundColor: selectedPlan.saveColor }}
                                                                    className="custom-btn text-white py-2 px-3 rounded-pill"
                                                                >
                                                                    {Math.trunc(selectedPlan.discount)} % OFF
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="price">
                                                            $<span className="fw-bold">{selectedPlan.price}</span>
                                                        </span>
                                                        {selectedPlan.saveText && (
                                                            <button
                                                                type="button"
                                                                style={{ backgroundColor: selectedPlan.saveColor }}
                                                                className="custom-btn text-white p-2 rounded-pill"
                                                            >
                                                                {selectedPlan.saveText}
                                                            </button>
                                                        )}
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

                                        {selectedPlan.id === 2 && renderNoteCard()}
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