// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../../styles/pricing.css';

// Pricing plan data
const pricingPlans = {
    'sub-contractor': [
        {
            id: 1,
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: false,
            isPopular: false,
            showStrike: false,
            saveText: null,
            saveColor: null,
        },
        {
            id: 2,
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: true,
            isPopular: false,
            showStrike: false,
            saveText: null,
            saveColor: null,
        },
        {
            id: 3,
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: true,
            isPopular: false,
            showStrike: false,
            saveText: null,
            saveColor: null,
        },
        {
            id: 4,
            title: 'Yearly',
            price: '400',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: true,
            isPopular: true,
            showStrike: true,
            saveText: 'Save $200',
            saveColor: '#DC2626',
        },
    ],
    affiliate: [
        {
            id: 1,
            title: '30-Days Free Trial 1',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: true,
            isPopular: false,
            showStrike: false,
            saveText: null,
            saveColor: null,
        },
        {
            id: 2,
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: true,
            isPopular: false,
            showStrike: false,
            saveText: null,
            saveColor: null,
        },
        {
            id: 3,
            title: '30-Days Free Trial',
            price: 'Free',
            features: Array(4).fill(
                'Registration with full company profile, license number, insurance, and workers’ comp details.'
            ),
            hasNote: true,
            isPopular: true,
            showStrike: false,
            saveText: 'Save $200',
            saveColor: '#10BC17',
        },
    ],
};

export default function PricingPage() {
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
        <span style={{ fontSize: '14px' }} className="d-block fw-semibold mb-1">
          Note
        </span>
                <p style={{ fontSize: '12px' }} className="mb-0">
                    After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with
                    contractors, and accessing premium tools.
                </p>
            </div>
        </div>
    );

    const renderPlanCard = (plan: (typeof pricingPlans)['sub-contractor'][0], index: number) => (
        <div
            key={plan.id}
            className={`col-lg-${index === 3 ? '3' : index >= 2 && plan.isPopular ? '4' : '3'} col-md-${plan.isPopular ? '12' : '6'}`}
        >
            <div className={`price-card ${plan.isPopular ? 'price-card1' : ''} free`}>
                <div>
                    <div className="pricing-header">
                        {plan.isPopular ? (
                            <div className="d-flex align-items-center gap-1 justify-content-between mb-3">
                                <span className="title1 mb-0">{plan.title}</span>
                                <div style={{ fontSize: '14px' }} className="custom-btn bg-white shadow p-2 rounded-pill">
                                    🔥 Popular
                                </div>
                            </div>
                        ) : (
                            <span className="title1">{plan.title}</span>
                        )}

                        {plan.showStrike ? (
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                <del className="fs-4 fw-medium text-black">$ 600</del>
                                <div className="d-flex align-items-center gap-2">
                <span className="price">
                  $<span className="fw-bold">{plan.price}</span>
                </span>
                                    {plan.saveText && (
                                        <button
                                            type="button"
                                            style={{ backgroundColor: plan.saveColor! }}
                                            className="custom-btn text-white p-2 rounded-pill"
                                        >
                                            {plan.saveText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
              <span className="price">
                $<span className="fw-bold">{plan.price}</span>
              </span>
                                {plan.saveText && (
                                    <button
                                        type="button"
                                        style={{ backgroundColor: plan.saveColor! }}
                                        className="custom-btn text-white p-2"
                                    >
                                        {plan.saveText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pricing-body">
                        <ul className="m-0 p-0 list-with-icon">
                            {plan.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {plan.hasNote && renderNoteCard()}

                <div className="pricing-button">
                    <button className="btn">Get Started</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Hero Section */}
                <section
                    style={{
                        background: `url('/assets/img/pricing-hero.webp') center /cover no-repeat`,
                    }}
                    className="hero-sec position-relative pricing"
                >
                    <div className="container">
                        <div className="content-wrapper">
                            <h1 className="text-primary text-center mb-3">
                                Choose Your Plan and Start Getting Project Leads Today
                            </h1>
                            <p className="mb-4 text-white text-center fs-5 fw-medium">
                                Unlock full access to jobs, messaging, and contractor tools no hidden fees.
                            </p>

                            <ul className="nav nav-tabs justify-content-center" id="pricingTab" role="tablist">
                                <li className="nav-item tabs" role="presentation">
                                    <button
                                        className="tab-btn active"
                                        id="sub-contractor-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#sub-contractor"
                                        type="button"
                                        role="tab"
                                    >
                                        Sub Contractor
                                    </button>
                                </li>
                                <li className="nav-item tabs" role="presentation">
                                    <button
                                        className="tab-btn"
                                        id="affiliate-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#affiliate"
                                        type="button"
                                        role="tab"
                                    >
                                        Affiliate
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="pricing-sec">
                    <div className="container-fluid">
                        <div className="tab-content pricing-wrapper" id="pricingTabContent">
                            {/* Sub Contractor Tab */}
                            <div
                                className="tab-pane fade show active pricing-content"
                                id="sub-contractor"
                                role="tabpanel"
                            >
                                <div className="row g-3">
                                    {pricingPlans['sub-contractor'].map((plan, index) =>
                                        renderPlanCard(plan, index)
                                    )}
                                </div>
                            </div>

                            {/* Affiliate Tab */}
                            <div className="tab-pane fade pricing-content" id="affiliate" role="tabpanel">
                                <div className="row g-3">
                                    {pricingPlans.affiliate.map((plan) => renderPlanCard(plan, -1))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
            <style jsx>{`
        .hero-sec {
          position: relative;
          z-index: 1;
        }

        .hero-sec::before {
          content: '';
          position: absolute;
          inset: 0; /* shorthand for top:0; left:0; right:0; bottom:0 */
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0.85;
          z-index: -1;
          display: block;
        }
      `}</style>
        </div>
    );
}