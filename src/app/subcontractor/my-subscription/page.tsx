'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SidebarSubcontractor from '../../components/SidebarSubcontractor';
import '../../../styles/profile.css';
import '../../../styles/pricing.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CancelSubscriptionModal from './components/cancel-subscription-modal';

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
}

interface Subscription {
    id: number;
    start_date: string;
    end_date: string;
    is_active: string;
    plan: Plan;
    status: string;
}

export default function SubscriptionPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription>(null);
    const [logoutLoading, setLogoutLoading] = useState(false);


    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Unauthorized');
            setLoading(false);
            return;
        }

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

    const cancelSubscription = async () => {
        if (!selectedSubscription) return;

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/cancel`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscription_id: selectedSubscription.id,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message?.[0] || 'Failed to cancel subscription');
            }

            // ✅ Modal close
            setShowCancelModal(false);
            setSelectedSubscription(null);

            // ✅ Subscriptions dubara load
            fetchSubscriptions();

        } catch (err: any) {
            alert(err.message || 'Cancel failed');
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/logout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text };
            }

            if (response.ok) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('token');
                router.push('/auth/login');
            } else {
                alert(data?.message || 'Logout failed');
            }
        } catch (err) {
            console.error('Logout Error:', err);
            alert('Network error. Please try again.');
        } finally {
            setLogoutLoading(false);
        }
    };


    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile pricing">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
                            </div>

                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div className="right-bar">

                                    {/* Loader */}
                                    {loading ? (
                                        <div className="d-flex justify-content-center align-items-center py-5"
                                            style={{ height: '80vh' }}>
                                            <div className="spinner-border text-primary" role="status" />
                                        </div>
                                    ) : error ? (
                                        /* Error */
                                        <div className="alert alert-danger"
                                            style={{ height: '80vh' }}>
                                            {error}
                                        </div>
                                    ) : (
                                        <>
                                            {/* Header */}
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
                                                {
                                                    subscriptions.length !== 0 ? (
                                                        <button
                                                            onClick={() => router.push('/subscription-list')}
                                                            className="btn btn-primary"
                                                        >
                                                            View Plans
                                                        </button>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                            </div>

                                            {/* No Subscription Found */}
                                            {subscriptions.length === 0 ? (
                                                <div
                                                    className="d-flex flex-column justify-content-center align-items-center text-center"
                                                    style={{ height: '70vh' }}
                                                >
                                                    <h5 className="fw-semibold">No Subscription Found</h5>
                                                    <p className="text-muted mb-4">
                                                        You don’t have any active or expired subscriptions yet.
                                                    </p>
                                                    <button
                                                        onClick={() => router.push('/subscription-list')}
                                                        className="btn btn-primary"
                                                    >
                                                        View Plans
                                                    </button>
                                                </div>
                                            ) : (
                                                /* Subscription Cards */
                                                <div className="pricing-sec p-0">
                                                    <div className="row g-3">
                                                        {subscriptions.map((sub) => (
                                                            <div
                                                                key={sub.id}
                                                                className="col-lg-4 col-md-6 col-12"
                                                            >
                                                                <div
                                                                    className="price-card"
                                                                >
                                                                    {/* Header */}
                                                                    <div className="pricing-header mb-3">
                                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                                            <span className="title1">
                                                                                {sub.plan.plan_name}
                                                                            </span>

                                                                            {sub.is_active === '1' && (
                                                                                <div className="custom-btn bg-white shadow p-2 rounded-pill fs-14">
                                                                                    ✅ Active
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <span className="price">
                                                                                ${sub.plan.price}
                                                                            </span>
                                                                            <span className="fs-14 text-muted">
                                                                                / {sub.plan.type}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Body */}
                                                                    <div className="pricing-body">
                                                                        <ul className="m-0 p-0 list-with-icon">
                                                                            {sub.plan.features.map((f, i) => (
                                                                                <li key={i}>
                                                                                    {f.feature}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    {/* Button */}
                                                                    <div className="pricing-button mt-3">
                                                                        <button
                                                                            className={`btn ${sub.status === 'active'
                                                                                ? 'btn-outline-danger'
                                                                                : 'btn-secondary'
                                                                                }`}
                                                                            disabled={sub.status !== 'active'}
                                                                            onClick={() => {
                                                                                if (sub.status === 'active') {
                                                                                    setSelectedSubscription(sub);
                                                                                    setShowCancelModal(true)
                                                                                }
                                                                            }}
                                                                        >
                                                                            {sub.status === 'active' ? 'Cancel Plan' : sub.status === 'cancelled' ? 'Cancelled' : 'Expired'}
                                                                        </button>
                                                                    </div>

                                                                    {/* Dates */}
                                                                    <div className="text-center fs-14 mt-3 mb-3 text-muted">
                                                                        {sub.start_date} → {sub.end_date}
                                                                    </div>
                                                                </div>
                                                                <CancelSubscriptionModal
                                                                    show={showCancelModal}
                                                                    planName={selectedSubscription?.plan?.plan_name}
                                                                    onClose={() => {
                                                                        setShowCancelModal(false);
                                                                        setSelectedSubscription(null);
                                                                    }}
                                                                    onConfirm={cancelSubscription}
                                                                />
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