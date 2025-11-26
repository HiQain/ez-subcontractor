'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Added for redirect
import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/pricing.css';
import '../../../styles/checkout.css';

export default function CheckoutPage() {
    const router = useRouter(); // ✅ Router hook for redirect
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

    useEffect(() => {
        const planData = localStorage.getItem('selectedPlan');
        if (planData) {
            setSelectedPlan(JSON.parse(planData));
        }
    }, []);

    // ✅ Price summary
    const basePrice = selectedPlan ? parseFloat(selectedPlan.price) : 0;
    const extraCategories = 2 * 125;
    const tax = Math.round((basePrice + extraCategories) * 0.08);
    const total = basePrice + extraCategories + tax;

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
                <span style={{ fontSize: '14px' }} className="d-block fw-semibold mb-1">Note</span>
                <p style={{ fontSize: '12px' }} className="mb-0">
                    After your trial ends, you’ll need to subscribe to keep bidding on
                    projects, chatting with contractors, and accessing premium tools.
                </p>
            </div>
        </div>
    );

    // ✅ Payment confirm handler
    const handleConfirmPayment = () => {
        router.push('/affiliate/success'); // redirect to success page
    };

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
                                    {/* Form Inputs */}
                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="name" className="mb-1 fw-semibold">Full Name *</label>
                                            <input type="text" id="name" placeholder="Jason Doe" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="email" className="mb-1 fw-semibold">Email Address *</label>
                                            <input type="email" id="email" placeholder="hello@example.com" />
                                        </div>
                                    </div>

                                    {/* Custom Select */}
                                    <div className="input-wrapper d-flex flex-column position-relative">
                                        <label htmlFor="category" className="mb-1 fw-semibold">Category *</label>
                                        <div className={`custom-select ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                                            <div className="select-selected">{selectedCategory}</div>
                                            <i className="bi bi-chevron-down select-arrow"></i>
                                            {isOpen && (
                                                <ul className="select-options">
                                                    {categories.map((cat) => (
                                                        <li key={cat.id} onClick={() => handleSelect(cat.name)} data-value={cat.id}>
                                                            {cat.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="buttons d-flex align-items-center gap-2 flex-wrap">
                                        <Link href="#" className="btn bg-dark p-2 fs-12 rounded-3">
                                            <span className="text-gray-light">Framing</span>
                                            <Image src="/assets/img/cancel_svgrepo.com.svg" width={16} height={16} alt="Cancel" loading="lazy" />
                                        </Link>
                                        <Link href="#" className="btn bg-dark p-2 fs-12 rounded-3">
                                            <span className="text-gray-light">Electrical</span>
                                            <Image src="/assets/img/cancel_svgrepo.com.svg" width={16} height={16} alt="Cancel" loading="lazy" />
                                        </Link>
                                        <Link href="#" className="btn bg-dark p-2 fs-12 rounded-3">
                                            <span className="text-gray-light">Plumbing</span>
                                            <Image src="/assets/img/cancel_svgrepo.com.svg" width={16} height={16} alt="Cancel" loading="lazy" />
                                        </Link>
                                    </div>

                                    {/* Card Details */}
                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="name1" className="mb-1 fw-semibold">Card Holder Name *</label>
                                            <input type="text" id="name1" placeholder="Enter card holder name" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="card" className="mb-1 fw-semibold">Card Number *</label>
                                            <input type="number" id="card" placeholder="4242 4242 4242 4242" />
                                        </div>
                                    </div>

                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="cvv" className="mb-1 fw-semibold">Cvv *</label>
                                            <input type="number" id="cvv" placeholder="Enter CVV" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="expiry" className="mb-1 fw-semibold">Expiry Date *</label>
                                            <input type="date" id="expiry" placeholder="12/25" />
                                        </div>
                                    </div>

                                    <div className="input-wrapper-s2">
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="zip" className="mb-1 fw-semibold">Zip Code *</label>
                                            <input type="number" id="zip" placeholder="Enter zip code" />
                                        </div>
                                        <div className="input-wrapper d-flex flex-column">
                                            <label htmlFor="promo" className="mb-1 fw-semibold">Promo Code</label>
                                            <input type="number" id="promo" placeholder="Enter promo code" />
                                        </div>
                                    </div>

                                    {/* ORDER SUMMARY */}
                                    <div className="summary-card">
                                        <div className="top d-flex align-items-start gap-2">
                                            <Image src="/assets/img/summary.svg" width={24} height={24} alt="Summary Icon" loading="lazy" />
                                            <div className="content w-100">
                                                <span style={{ fontSize: '14px' }} className="fw-semibold d-block">Order Summary</span>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>{selectedPlan ? selectedPlan.title + ' Plan' : 'Yearly Plan'}</span>
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">${basePrice}</span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>Extra Categories (2 X $125)</span>
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">${extraCategories}</span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mt-2">
                                                    <span style={{ fontSize: '14px' }}>Tax (8%)</span>
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">${tax}</span>
                                                </div>

                                                <hr className="mt-2 mb-2" />

                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">Total</span>
                                                    <span style={{ fontSize: '14px' }} className="fw-semibold">${total}</span>
                                                </div>

                                                <p style={{ fontSize: '14px' }} className="mb-0 mt-2">
                                                    Note: You’ve selected 3 categories
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ✅ Redirect Button */}
                                    <input
                                        value="Confirm Payment"
                                        className="btn btn-primary w-100 rounded-3 d-block"
                                        type="button"
                                        onClick={handleConfirmPayment}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Dynamic Pricing Card */}
                        <div className="col-lg-4">
                            <div className="pricing-sec p-0">
                                <div className="fs-5 fw-semibold mb-3">Selected Plan</div>
                                <div className="pricing-wrapper">
                                    {selectedPlan ? (
                                        <div className={`price-card ${selectedPlan.isPopular ? 'price-card1' : ''} free`}>
                                            <div className="pricing-header">
                                                {selectedPlan.isPopular ? (
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <span className="title1 mb-0">{selectedPlan.title}</span>
                                                        <div
                                                            style={{ fontSize: '14px' }}
                                                            className="custom-btn bg-white shadow p-2 rounded-pill"
                                                        >
                                                            🔥 Popular
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="title1 mb-0">{selectedPlan.title}</span>
                                                )}
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="price">
                                                        ${selectedPlan.price}
                                                    </span>
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
                                                    {selectedPlan.features.map((f: string, i: number) => (
                                                        <li key={i}>{f}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {selectedPlan.id === 2 && renderNoteCard()}
                                        </div>
                                    ) : (
                                        <p className="text-muted">No plan selected. Please go back to pricing page.</p>
                                    )}
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
