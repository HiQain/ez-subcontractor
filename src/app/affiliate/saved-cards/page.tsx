'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 🔹 Added
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SidebarSubcontractor from '../../components/SidebarAffiliate';
import '../../../styles/profile.css';
import { useState, useEffect } from 'react';

// 🔹 Define card type for safety
interface Card {
    id: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    brand: string; // e.g., 'visa', 'mastercard'
    name: string; // cardholder name
    is_default: boolean;
    // Add more if your API returns them (e.g., fingerprint, created)
}

export default function ProfilePage() {
    const router = useRouter(); // 🔹 Now defined
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [cardsLoading, setCardsLoading] = useState(true); // true → show loader initially
    const [cards, setCards] = useState<Card[]>([]);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Fetch saved cards
    const fetchSavedCards = async () => {
        setCardsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/cards`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (res.status === 401) {
                localStorage.removeItem('token');
                router.push('/auth/login');
                return;
            }

            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                // 🔹 Normalize card data (adjust based on your API)
                const normalizedCards: Card[] = data.data.map((item: any) => ({
                    id: item.id || item.payment_method_id,
                    last4: item.card?.last4 || item.last4 || '****',
                    exp_month: item.card?.exp_month || item.exp_month || 1,
                    exp_year: item.card?.exp_year || item.exp_year || 2025,
                    brand: (item.card?.brand || item.brand || 'unknown').toLowerCase(),
                    name: item.billing_details?.name || item.name || '—',
                    is_default: item.is_default || item.default || false,
                }));

                setCards(normalizedCards);
            } else {
                throw new Error(data.message || 'Failed to load cards');
            }
        } catch (err: any) {
            console.error('Fetch cards error:', err);
            setError(err.message || 'Failed to load saved cards. Please try again.');
        } finally {
            setCardsLoading(false);
        }
    };

    // 🔹 Set default card
    const handleSetDefaultCard = async (cardId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/cards/set-default`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ card_id: cardId }),
                }
            );

            const data = await res.json();

            if (res.ok && data.success) {
                // ✅ Optimistic update
                setCards(prev =>
                    prev.map(card =>
                        card.id === cardId
                            ? { ...card, is_default: true }
                            : { ...card, is_default: false }
                    )
                );
            } else {
                throw new Error(data.message || 'Failed to set default card');
            }
        } catch (err: any) {
            console.error('Set default card error:', err);
            alert(err.message || 'Failed to set default card.');
            // Revert checkbox (optional)
            fetchSavedCards(); // refresh
        }
    };

    // 🔹 Logout
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
                localStorage.removeItem('subscription');
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

    // 🔹 Fetch on mount
    useEffect(() => {
        fetchSavedCards();
    }, []);

    // 🔹 Get card icon by brand
    const getCardIcon = (brand: string) => {
        switch (brand) {
            case 'visa': return '/assets/img/icons/visa-icon.svg';
            case 'mastercard': return '/assets/img/icons/mastercard-icon.svg';
            case 'amex': return '/assets/img/icons/amex-icon.svg';
            case 'discover': return '/assets/img/icons/discover-icon.svg';
            default: return '/assets/img/icons/card-generic.svg'; // add generic fallback
        }
    };

    return (
        <div className="sections overflow-hidden">
            <Header />
            <section className="banner-sec profile">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-xl-3">
                            <SidebarSubcontractor onLogout={handleLogout} />
                        </div>

                        <div className="col-xl-9">
                            <div className="right-bar">
                                <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                    <div className="icon-wrapper d-flex align-items-center gap-3">
                                        <button
                                            type="button"
                                            className="icon"
                                            onClick={() => router.back()}
                                            aria-label="Go back"
                                        >
                                            <Image
                                                src="/assets/img/button-angle.svg"
                                                width={10}
                                                height={15}
                                                alt="Back"
                                                loading="lazy"
                                            />
                                        </button>
                                        <span className="fs-4 fw-semibold">Saved Cards</span>
                                    </div>
                                    {/* 🔹 Optional: Save Changes button (disabled if none changed) */}
                                    <button className="btn btn-primary rounded-3" disabled>
                                        Save Changes
                                    </button>
                                </div>

                                {cardsLoading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading saved cards...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                ) : cards.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Image
                                            src="/assets/img/post.webp"
                                            width={120}
                                            height={120}
                                            alt="No cards"
                                            className="mb-3"
                                        />
                                        <p className="text-muted">No saved cards found.</p>
                                        <Link href="/affiliate/add-card" className="btn btn-primary mt-3">
                                            Add a Card
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {cards.map((card) => (
                                            <div key={card.id} className="col-xl-6">
                                                <div className="credit-card mb-2 position-relative px-4">
                                                    <div className="checkbox-wrapper">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox1"
                                                            checked={card.is_default}
                                                            onChange={() => handleSetDefaultCard(card.id)}
                                                            aria-label={`Set ${card.last4} as default`}
                                                        />
                                                    </div>

                                                    <div className="numbers fs-4 fw-semibold mb-4">
                                                        **** **** **** {card.last4}
                                                    </div>

                                                    <div className="content-wrapper d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                        <div className="left d-flex align-items-center gap-4 flex-wrap">
                                                            <div>
                                                                <div className="fs-12 mb-1">Card Holder Name</div>
                                                                <div className="fs-14 fw-semibold">{card.name}</div>
                                                            </div>
                                                            <div>
                                                                <div className="fs-12 mb-1">Expiry Date</div>
                                                                <div className="fs-14 fw-semibold">
                                                                    {String(card.exp_month).padStart(2, '0')}/{card.exp_year}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="icon">
                                                            <Image
                                                                src={getCardIcon(card.brand)}
                                                                width={28}
                                                                height={9}
                                                                alt={`${card.brand} icon`}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}