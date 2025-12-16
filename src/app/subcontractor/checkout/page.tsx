'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import '../../../styles/pricing.css';
import '../../../styles/checkout.css';

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
        if (selectedCategories.some(c => c.id === category.id)) {
            setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    // ✅ Price summary
    const basePrice = selectedPlan ? parseFloat(selectedPlan.price) || 0 : 0;
    const extraCategories = 2 * 125;
    const tax = Math.round((basePrice + extraCategories) * 0.08);
    const total = basePrice + extraCategories + tax;

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
            setError('Please enter your name and email');
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
            return;
        }

        if (!stripe || !elements) {
            setError('Stripe not loaded yet');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card details missing');
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
                throw new Error(stripeError?.message || 'Payment method creation failed');
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
                throw new Error(data.message?.[0] || 'Subscription creation failed');
            }

            // ✅ Success
            router.push('/subcontractor/success');

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
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
                                    <div className="icon">
                                        <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Angle" />
                                    </div>
                                    <div className="login-title fw-semibold fs-2 text-center">
                                        Business Details
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

                                    <div className="input-wrapper-s2">
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
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>{selectedPlan.price === 'Free' ? 'Free' : `$${selectedPlan.price}`}</span>
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
                                                    Note: You’ve selected 3 categories
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
                                        className="btn btn-primary w-100 rounded-3 mt-4"
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
                                    <div className={`price-card ${selectedPlan.isPopular ? 'price-card1' : ''} free`}>
                                        <div className="pricing-header">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <span className="title1 mb-0">{selectedPlan.title}</span>
                                                {selectedPlan.isPopular && (
                                                    <div className="custom-btn bg-white rounded-5 shadow p-2" style={{ fontSize: '14px' }}>🔥 Popular</div>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">{selectedPlan.price === 'Free' ? 'Free' : `$${selectedPlan.price}`}</span>
                                                {selectedPlan.saveText && (
                                                    <Link
                                                        href="#"
                                                        className="btn btn-primary rounded-pill p-2 m-0"
                                                        style={{
                                                            backgroundColor: selectedPlan.saveColor,
                                                            color: 'white !important',
                                                            fontSize: '14px !important',
                                                            width: 'fit-content',
                                                        }}
                                                    >
                                                        {selectedPlan.saveText}
                                                    </Link>
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
