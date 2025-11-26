'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/pricing.css';
import '../../../styles/checkout.css';

export default function CheckoutPage() {
    const router = useRouter(); // ✅ Router for redirect
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select category");
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    const categories = [
        { id: 1, name: "Plumbing" },
        { id: 2, name: "Electric Work" },
        { id: 3, name: "Framing" },
        { id: 4, name: "Roofing" },
    ];

    const handleSelect = (category: string) => {
        setSelectedCategory(category);
        setIsOpen(false);
    };

    // ✅ Load selected plan from localStorage
    useEffect(() => {
        const plan = localStorage.getItem('selectedPlan');
        if (plan) setSelectedPlan(JSON.parse(plan));
    }, []);

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
    const handleConfirmPayment = () => {
        router.push('/subcontractor/success');
    };

    if (!selectedPlan) return null; // loading state if plan not yet loaded

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
                                            <input type="text" placeholder="Jason Doe" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label className="mb-1 fw-semibold">Email Address *</label>
                                            <input type="email" placeholder="hello@example.com" />
                                        </div>
                                    </div>

                                    {/* Category Select */}
                                    <div className="input-wrapper d-flex flex-column position-relative">
                                        <label className="mb-1 fw-semibold">Category *</label>
                                        <div className={`custom-select ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                                            <div className="select-selected">{selectedCategory}</div>
                                            <i className="bi bi-chevron-down select-arrow"></i>
                                            {isOpen && (
                                                <ul className="select-options">
                                                    {categories.map((cat) => (
                                                        <li key={cat.id} onClick={() => handleSelect(cat.name)}>
                                                            {cat.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {/* Extra Selected Categories (Buttons) */}
                                    <div className="buttons d-flex align-items-center gap-2 flex-wrap">
                                        {categories.map((cat) => (
                                            <Link key={cat.id} href="#" className="btn bg-dark p-2 fs-12 rounded-3">
                                                <span className="text-gray-light">{cat.name}</span>
                                                <Image src="/assets/img/cancel_svgrepo.com.svg" width={16} height={16} alt="Cancel" />
                                            </Link>
                                        ))}
                                    </div>

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
                                            <input type="number" placeholder="Enter zip code" />
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
