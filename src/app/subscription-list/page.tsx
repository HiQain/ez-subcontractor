'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../../styles/pricing.css';
import { useState, useEffect } from 'react';

export default function PricingPage() {
    const router = useRouter();

    // State
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch plans from API
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/plans?role=${localStorage.getItem('role')}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();

                console.log(data)

                if (res.ok && data.success && Array.isArray(data.data?.plans)) {
                    // Transform API response into your UI structure
                    const transformedPlans = data.data.plans.map((plan: any) => ({
                        id: plan.id,
                        title: plan.plan_name,
                        price: parseFloat(plan.price), // Use discount if available
                        discount: plan.discount_price, // Use discount if available
                        features: plan.features.map((f: any) => f.feature),
                        hasNote: plan.type === 'trial',
                        isPopular: plan.label === 'Popular',
                        showStrike: !!plan.discount_price,
                        saveText: plan.discount_price ? `${Math.round(100 - (parseFloat(plan.discount_price) / parseFloat(plan.price)) * 100)}% OFF` : '',
                        saveColor: '#DC2626',
                        duration_days: plan.duration_days,
                        type: plan.type,
                        stripe_price_id: plan.stripe_price_id,
                        extra_category_price: plan.extra_category_price,
                        is_subscribed: plan.is_subscribed,
                        is_cancelled: plan.is_cancelled,
                    }));

                    setPlans(transformedPlans);
                } else {
                    throw new Error(data.message?.[0] || 'Failed to load plans');
                }
            } catch (err: any) {
                console.error('Error fetching plans:', err);
                setError(err.message || 'Failed to load subscription plans. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelectPlan = (plan: any) => {
        localStorage.setItem('selectedPlan', JSON.stringify({ ...plan, type: localStorage.getItem('role') }));
        router.push('/checkout');
    };

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
                    After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.
                </p>
            </div>
        </div>
    );

    const hasAnyActiveSubscription = plans.some(
        (p) =>
            p.is_subscribed === true &&
            p.status !== 'cancelled' &&
            p.is_cancelled !== true
    );

    const renderPlanCard = (plan: any) => (
        <div key={plan.id} className="col-lg-3 col-md-6">
            <div className={`price-card ${plan.isPopular ? 'popular' : ''} free`}>
                <div>
                    <div className="pricing-header">
                        {plan.isPopular ? (
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="title1 mb-0 text-truncate">{plan.title}</span>
                                <div
                                    style={{ fontSize: '14px' }}
                                    className="custom-btn bg-white shadow p-2 rounded-pill"
                                >
                                    🔥 Popular
                                </div>
                            </div>
                        ) : (
                            <span className="title1 text-truncate">{plan.title}</span>
                        )}

                        {plan.showStrike ? (
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                <del className="fs-18 fw-medium text-black">$ {plan.price}</del>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <span className="price">
                                        $
                                        <span className="fw-bold">
                                            {plan.discount ? plan.price - plan.price / 100 * plan.discount : plan.price}
                                        </span>
                                    </span>
                                    {plan.saveText && (
                                        <div
                                            style={{ backgroundColor: plan.saveColor }}
                                            className="custom-btn text-white py-2 px-3 rounded-pill"
                                        >
                                            {parseFloat(plan.discount)} % OFF
                                        </div>
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
                                        style={{ backgroundColor: plan.saveColor }}
                                        className="custom-btn text-white p-2 rounded-pill"
                                    >
                                        {plan.saveText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pricing-body mb-3">
                        <ul className="m-0 p-0 list-with-icon">
                            {plan.features.map((feature: string, i: number) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="d-flex align-items-center flex-column">
                    {plan.hasNote && renderNoteCard()}
                    <div className="pricing-button w-100 pt-0">
                        <div className="pricing-button w-100 pt-0">
                            <button
                                className={plan.is_subscribed ? 'active-btn' : 'btn'}
                                disabled={hasAnyActiveSubscription && !plan.is_subscribed}
                                onClick={() => {
                                    if (!hasAnyActiveSubscription && !plan.is_subscribed) {
                                        handleSelectPlan(plan);
                                    }
                                }}
                            >
                                {plan.is_subscribed && plan.status !== 'cancelled'
                                    ? 'Current Plan'
                                    : 'Buy Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 🌀 Loading State — same as Profile Page
    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden pt-5 mt-5">
                    <section className="banner-sec profile position-static">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile position-static">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <p className="text-danger">{error}</p>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
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
                                Unlock full access to jobs, messaging, and contractor tools — no hidden fees.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="pricing-sec">
                    <div className="container-fluid">
                        <div className="tab-content pricing-wrapper">
                            <div className="tab-pane fade show active pricing-content">
                                <div className="row g-3 justify-content-center">
                                    {plans.length > 0 ? (
                                        plans.map((plan) => renderPlanCard(plan))
                                    ) : (
                                        <div className="col-12 text-center py-5">
                                            <p>No plans available at this time.</p>
                                        </div>
                                    )}
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
                    inset: 0;
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