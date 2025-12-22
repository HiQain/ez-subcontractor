'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import '../../../styles/pricing.css';
import '../../../styles/checkout.css';

const PLAN_RULES: any = {
    1: { free: 1, extraPrice: 0, max: 1 },
    2: { free: 1, extraPrice: 25 },
    3: { free: 1, extraPrice: 200 },
};

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
        if (plan) setSelectedPlan(JSON.parse(plan));
    }, []);

    // ✅ Load name & email from localStorage
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');

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

    const toggleCategory = (category: { id: number; name: string }) => {
        if (!selectedPlan) return;

        const rule = PLAN_RULES[selectedPlan.id];
        const alreadySelected = selectedCategories.some(c => c.id === category.id);

        // 🔹 If already selected → remove normally
        if (alreadySelected) {
            setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
            return;
        }

        // ✅ PLAN 1 SPECIAL BEHAVIOR
        // Only 1 allowed → replace existing with new one
        if (selectedPlan.id === 1) {
            setSelectedCategories([category]);
            return;
        }

        // 🔹 Other plans (2 & 3) → normal add
        setSelectedCategories([...selectedCategories, category]);
    };

    // ✅ Price summary
    const basePrice = selectedPlan ? parseFloat(selectedPlan.price) || 0 : 0;

    const rule = selectedPlan ? PLAN_RULES[selectedPlan.id] : null;
    const freeCategories = rule?.free || 0;
    const extraCategoryCount = Math.max(selectedCategories.length - freeCategories, 0);
    const extraCategoriesPrice = extraCategoryCount * (rule?.extraPrice || 0);

    const tax = Math.round((basePrice + extraCategoriesPrice) * 0.08);
    const total = basePrice + extraCategoriesPrice + tax;
    let finalTotal = basePrice + extraCategoriesPrice + tax;

    if (appliedPromo) {
        if (appliedPromo.type === 'fixed') {
            finalTotal = Math.max(finalTotal - parseFloat(appliedPromo.value), 0);
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

        // 🔹 Validate name & email
        if (!name.trim() || !email.trim()) {
            const msg = 'Please enter your name and email';
            setError(msg);
            showToast(msg, 'error'); // ✅ Toast added
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
            return;
        }

        if (!stripe || !elements) {
            const msg = 'Stripe not loaded yet';
            setError(msg);
            showToast(msg, 'error'); // ✅ Toast added
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            const msg = 'Card details missing';
            setError(msg);
            showToast(msg, 'error'); // ✅ Toast added
            return;
        }

        setLoading(true);

        try {
            // 🔹 1. Create Stripe Payment Method
            const { error: stripeError, paymentMethod } =
                await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: { name, email },
                });

            if (stripeError || !paymentMethod) {
                const msg = stripeError?.message || 'Payment method creation failed';
                setError(msg);
                showToast(msg, 'error'); // ✅ Toast added
                throw new Error(msg);
            }

            // 🔹 2. Call Backend Subscription API
            const token = localStorage.getItem('token');

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
                        category_ids: selectedCategories.map(c => c.id),
                        payment_method_id: paymentMethod.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                const msg = data.message?.[0] || 'Subscription creation failed';
                setError(msg);
                showToast(msg, 'error'); // ✅ Toast added
                throw new Error(msg);
            }

            // ✅ Success
            showToast('Subscription activated successfully!', 'success'); // ✅ Success toast
            router.push('/subcontractor/thank-you');
            console.log('ssss')

        } catch (err: any) {
            const msg = err.message || 'Something went wrong';
            setError(msg);
            showToast(msg, 'error'); // ✅ Final catch-all toast
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
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

                                    {/* Category Select */}
                                    <div className="input-wrapper d-flex flex-column position-relative">
                                        <label className="mb-1 fw-semibold">Select Specializations *</label>
                                        <div className={`custom-select ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                                            <div className="select-selected">
                                                {selectedCategories.length > 0 ?
                                                    selectedCategories.map(c => c.name).join(', ') :
                                                    'Select Specializations'}
                                            </div>
                                            <i className="bi bi-chevron-down select-arrow"></i>
                                            {isOpen && (
                                                <ul className="select-options">
                                                    {categories.map(cat => (
                                                        <li key={cat.id} onClick={() => toggleCategory(cat)}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedCategories.some(c => c.id === cat.id)}
                                                                readOnly
                                                            /> {cat.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selected Categories Buttons */}
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


                                    {/* STRIPE CARD FORM */}
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

                                    {selectedPlan.id !== 1 && (
                                        <div className="input-wrapper-s2 d-flex align-items-start gap-2">
                                            <div className="input-wrapper d-flex flex-column flex-grow-1">
                                                <label className="mb-1 fw-semibold">Promo Code</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter promo code"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    disabled={!!appliedPromo}
                                                />
                                            </div>
                                            {appliedPromo ? (
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ height: '38px', marginTop: '31px' }}
                                                    onClick={handleRemovePromo}
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ height: '38px', marginTop: '31px' }}
                                                    onClick={handleApplyPromo}
                                                    disabled={promoLoading}
                                                >
                                                    {promoLoading ? 'Applying...' : 'Apply'}
                                                </button>
                                            )}
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
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>{
                                                        selectedPlan.discount
                                                            ? selectedPlan.price - (selectedPlan.price / 100) * selectedPlan.discount
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

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>Tax (8%)</span>
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>${tax}</span>
                                                </div>

                                                {/* ✅ Promo Discount */}
                                                {appliedPromo && appliedPromo.type === 'fixed' && (
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <span style={{ fontSize: '14px', color: '#28a745' }}>
                                                            Promo ({appliedPromo.code})
                                                        </span>
                                                        <span className="fw-semibold" style={{ fontSize: '14px', color: '#28a745' }}>
                                                            -${parseFloat(appliedPromo.value)}
                                                        </span>
                                                    </div>
                                                )}

                                                <hr className="mt-2 mb-2" />

                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">Total</span>
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">${finalTotal}</span>
                                                </div>

                                                <p className="mb-0 mt-2" style={{ fontSize: '14px' }}>
                                                    You’ve selected {selectedCategories.length} category
                                                    {selectedCategories.length > 1 ? 'ies' : ''}
                                                </p>
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
                                        disabled={!stripe || loading}
                                    >
                                        {loading ? 'Processing...' : 'Confirm Payment'}
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
                                                                        ? selectedPlan.price - (selectedPlan.price / 100) * selectedPlan.discount
                                                                        : selectedPlan.price}
                                                                </span>
                                                            </span>
                                                            {selectedPlan.saveText && (
                                                                <div
                                                                    style={{ backgroundColor: selectedPlan.saveColor }}
                                                                    className="custom-btn text-white py-2 px-3 rounded-pill"
                                                                >
                                                                    {parseFloat(selectedPlan.discount)} % OFF
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