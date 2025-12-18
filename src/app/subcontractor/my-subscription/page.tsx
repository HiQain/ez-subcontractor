'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/pricing.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Feature {
    feature: string;
}

interface Plan {
    id: number;
    plan_name: string;
    price: string;
    duration_days: string;
    type: string;
    features: Feature[];
    discount_price?: string;
    label?: string;
}

interface Subscription {
    id: number;
    start_date: string;
    end_date: string;
    is_active: string;
    plan: Plan;
}

export default function SubscriptionPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [plans, setPlans] = useState<any[]>([]); // ✅ For pricing cards
    const [loading, setLoading] = useState(true);
    const [loadingPlans, setLoadingPlans] = useState(true); // ✅ Separate loader
    const [error, setError] = useState<string | null>(null);

    // Sidebar links
    const links = [
        { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/lock.svg' },
    ];

    // 🔁 Fetch subscriptions
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized');
            setLoading(false);
            return;
        }

        const fetchSubscriptions = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/my-subscriptions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.message?.[0] || 'Failed to fetch subscriptions');
                }
                setSubscriptions(data.data.subscriptions || []);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    // 🔁 Fetch pricing plans for subcontractor (even if no subs)
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/plans?role=subcontractor`,
                    {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }
                );
                const data = await res.json();

                if (res.ok && data.success && Array.isArray(data.data?.plans)) {
                    const transformed = data.data.plans.map((plan: any) => ({
                        id: plan.id,
                        title: plan.plan_name,
                        price: parseFloat(plan.price),
                        discount: plan.discount_price ? parseFloat(plan.discount_price) : null,
                        features: plan.features.map((f: any) => f.feature),
                        hasNote: plan.type === 'trial',
                        isPopular: plan.label === 'Popular',
                        showStrike: !!plan.discount_price,
                        saveText: plan.discount_price
                            ? `${Math.round(100 - (parseFloat(plan.discount_price) / parseFloat(plan.price)) * 100)}% OFF`
                            : '',
                        saveColor: '#DC2626',
                        type: plan.type,
                    }));
                    setPlans(transformed);
                }
            } catch (err) {
                console.warn('Failed to load plans:', err);
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    // ✅ Handle plan selection
    const handleSelectPlan = (plan: any) => {
        localStorage.setItem('selectedPlan', JSON.stringify({ ...plan, type: 'sub-contractor' }));
        router.push('/subcontractor/checkout');
    };

    // ✅ Render note card (same as PricingPage)
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

    // ✅ Render plan card (same logic as PricingPage)
    const renderPlanCard = (plan: any) => (
        <div key={plan.id} className="col-lg-4 col-md-6 col-12">
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
                                <div className="d-flex align-items-center gap-2">
                                    <span className="price">
                                        $<span className="fw-bold">{plan.discount}</span>
                                    </span>
                                    {plan.saveText && (
                                        <div
                                            style={{ backgroundColor: plan.saveColor }}
                                            className="custom-btn text-white py-2 px-3 rounded-pill"
                                        >
                                            {plan.saveText}
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
                        <button className="btn" onClick={() => handleSelectPlan(plan)}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // 🌀 Combined loading
    const isLoading = loading || loadingPlans;

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile pricing">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar d-flex flex-column">
                                    <div className="main-wrapper bg-dark m-0">
                                        <div className="buttons-wrapper">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`custom-btn ${pathname === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image src={link.icon} width={20} height={20} alt="Icon" loading="lazy" />
                                                        <span className="text-white">{link.label}</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        width={15}
                                                        height={9}
                                                        alt="Arrow"
                                                        style={{ objectFit: 'contain' }}
                                                        loading="lazy"
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bottom-bar mt-auto">
                                        <div className="buttons-wrapper">
                                            <Link
                                                href="#"
                                                className="custom-btn s1 bg-danger"
                                                style={{ borderColor: '#DC2626' }}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Logout Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Logout</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    style={{ objectFit: 'contain' }}
                                                    width={15}
                                                    height={9}
                                                    alt="Arrow"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    {isLoading ? (
                                        <div className="d-flex justify-content-center align-items-center py-5" style={{ height: '80vh' }}>
                                            <div className="spinner-border text-primary" role="status" />
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger" style={{ height: '80vh' }}>
                                            {error}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
                                                <div className="icon-wrapper d-flex align-items-center gap-3">
                                                    <button
                                                        onClick={() => router.back()}
                                                        className="icon btn btn-link p-0"
                                                    >
                                                        <Image
                                                            src="/assets/img/button-angle.svg"
                                                            width={10}
                                                            height={15}
                                                            alt="Back"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                    <span className="fs-4 fw-semibold">Subscription</span>
                                                </div>
                                                {subscriptions.length !== 0 && (
                                                    <button
                                                        onClick={() => router.push('/subcontractor/subscription')}
                                                        className="btn btn-primary"
                                                    >
                                                        View Plans
                                                    </button>
                                                )}
                                            </div>

                                            {subscriptions.length === 0 ? (
                                                <>
                                                    <div className="text-center mb-5">
                                                        <h5 className="fw-semibold">No Active Subscription</h5>
                                                        <p className="text-muted">
                                                            Choose a plan to get started and unlock full access.
                                                        </p>
                                                    </div>

                                                    {/* ✅ Pricing Cards for Subcontractor */}
                                                    <div className="pricing-sec p-0">
                                                        <div className="row g-3 justify-content-center">
                                                            {loadingPlans ? (
                                                                <div className="col-12 text-center py-3">
                                                                    <div className="spinner-border spinner-border-sm text-primary" />
                                                                </div>
                                                            ) : plans.length > 0 ? (
                                                                plans.map(renderPlanCard)
                                                            ) : (
                                                                <div className="col-12 text-center py-3 text-muted">
                                                                    No plans available at this time.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="pricing-sec p-0">
                                                    <div className="row g-3">
                                                        {subscriptions.map((sub) => (
                                                            <div key={sub.id} className="col-lg-4 col-md-6 col-12">
                                                                <div className="price-card">
                                                                    <div className="pricing-header mb-3">
                                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                                            <span className="title1">{sub.plan.plan_name}</span>
                                                                            {sub.is_active === '1' && (
                                                                                <div className="custom-btn bg-white shadow p-2 rounded-pill fs-14">
                                                                                    ✅ Active
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <span className="price">${sub.plan.price}</span>
                                                                            <span className="fs-14 text-muted">/ {sub.plan.type}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="pricing-body">
                                                                        <ul className="m-0 p-0 list-with-icon">
                                                                            {sub.plan.features.map((f, i) => (
                                                                                <li key={i}>{f.feature}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="pricing-button mt-3">
                                                                        <button
                                                                            className={`btn ${sub.is_active === '1' ? 'btn-outline-danger' : 'btn-secondary'}`}
                                                                            disabled={sub.is_active !== '1'}
                                                                        >
                                                                            {sub.is_active === '1' ? 'Cancel Plan' : 'Expired'}
                                                                        </button>
                                                                    </div>
                                                                    <div className="text-center fs-14 mt-3 mb-3 text-muted">
                                                                        {sub.start_date} → {sub.end_date}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
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