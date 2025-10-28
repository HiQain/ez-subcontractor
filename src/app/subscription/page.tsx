// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/subscription.css';
import '../../styles/main-page.css';

// Pricing plan data
const pricingData = {
    'sub-contractor': [
        {
            id: 'free-trial',
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            note: 'After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.',
            cta: 'Buy Now',
            isPopular: false,
        },
        {
            id: 'monthly',
            title: 'Monthly',
            price: '50',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            note: 'After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.',
            cta: 'Buy Now',
            isPopular: false,
        },
        {
            id: 'yearly',
            title: 'Yearly',
            price: '400',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            note: 'After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.',
            cta: 'Buy Now',
            isPopular: true,
            saveAmount: '200',
        },
    ],
    affiliate: [
        {
            id: 'affiliate-free-1',
            title: '30-Days Free Trial 1',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            note: 'After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.',
            cta: 'Get Started',
            isPopular: false,
        },
        {
            id: 'affiliate-free-2',
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            note: 'After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.',
            cta: 'Get Started',
            isPopular: false,
        },
        {
            id: 'affiliate-popular',
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            note: 'After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.',
            cta: 'Get Started',
            isPopular: true,
            saveAmount: '200',
        },
    ],
};

export default function PricingPage() {
    const [activeTab, setActiveTab] = useState<'sub-contractor' | 'affiliate'>('sub-contractor');

    const plans = pricingData[activeTab];

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Hero Section */}
                <section
                    className="hero-sec"
                    style={{
                        backgroundImage: `url('/assets/img/subscription-hero.webp')`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="container">
                        <div className="content-wrapper">
                            <h1 className="text-center mb-3 custom-text">
                                Choose Your Plan and Start Getting Project Leads Today
                            </h1>
                            <p className="mb-4 text-white text-center fs-5 fw-medium">
                                Unlock full access to jobs, messaging, and contractor tools — no hidden fees.
                            </p>
                            <div className="pricing-tabs d-flex justify-content-center gap-1 mb-5">
                                <button
                                    className={`tab-btn ${activeTab === 'sub-contractor' ? 'active' : ''}`}
                                    onclick={() => setActiveTab('sub-contractor')}
                                >
                                    Sub Contractor
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'affiliate' ? 'active' : ''}`}
                                    onclick={() => setActiveTab('affiliate')}
                                >
                                    Affiliate
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="pricing-sec">
                    <div className="container">
                        <div className="pricing-wrapper">
                            <div className="row g-3">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`col-lg-4 ${plan.isPopular ? 'col-md-12' : 'col-md-6'}`}
                                    >
                                        <div className="price-card free">
                                            <div className="pricing-header">
                                                {plan.isPopular ? (
                                                    <div
                                                        className="d-flex align-items-center gap-1 justify-content-between mb-3">
                                                        <span className="title1 mb-0">{plan.title}</span>
                                                        <div className="custom-btn bg-white shadow p-2">🔥 Popular</div>
                                                    </div>
                                                ) : (
                                                    <span className="title1">{plan.title}</span>
                                                )}

                                                <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ${plan.price === 'Free' ? (
                            <span className="fw-bold">Free</span>
                        ) : (
                            <span className="fw-bold">{plan.price}</span>
                        )}
                        </span>
                                                    {plan.saveAmount && (
                                                        <Link
                                                            href="#"
                                                            className="custom-btn text-white p-2"
                                                            style={{backgroundColor: '#10BC17'}}
                                                        >
                                                            Save ${plan.saveAmount}
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pricing-body">
                                                <ul className="m-0 p-0 list-with-icon">
                                                    {plan.features.map((feature, idx) => (
                                                        <li key={idx}>{feature}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="note-card d-flex align-items-start gap-1">
                                                <Image
                                                    src="/assets/img/note.webp"
                                                    width={24}
                                                    height={24}
                                                    alt="Note"
                                                    className="d-block"
                                                />
                                                <div className="content">
                        <span className="d-block fw-semibold mb-1" style={{fontSize: '14px'}}>
                          Note
                        </span>
                                                    <p className="mb-0" style={{fontSize: '12px'}}>
                                                        {plan.note}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pricing-button">
                                                <button className="btn">{plan.cta}</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}