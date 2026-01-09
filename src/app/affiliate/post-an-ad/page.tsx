'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/post-detail.css';
import '../../../styles/profile.css';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export default function PostAnAd() {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    // Tabs state
    const [activeTab, setActiveTab] = useState('saved-cards');

    // Image upload states
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [smallImage, setSmallImage] = useState<string | null>(null);
    const mainFileRef = useRef<HTMLInputElement>(null);
    const smallFileRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<any[]>([]);
    const [cardsLoading, setCardsLoading] = useState(false);
    const [orientation, setOrientation] = useState<'Horizontal' | 'Vertical'>('Horizontal');
    const [adPlacements, setAdPlacements] = useState<any[]>([]);
    const [adLoading, setAdLoading] = useState(false);
    const [selectedAd, setSelectedAd] = useState<any | null>(null);
    const durationWeeks = 1;
    const [horizontalUrl, setHorizontalUrl] = useState('');
    const [verticalUrl, setVerticalUrl] = useState('');
    const [description, setDescription] = useState('');
    const [canPause, setCanPause] = useState<boolean>(false);
    const [adId, setAdId] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const isEditMode = !!adId;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        setAdId(params.get('ad_id'));
    }, []);

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
    };

    useEffect(() => {
        if (activeTab === 'saved-cards') {
            fetchSavedCards();
        }
    }, [activeTab]);

    useEffect(() => {
        fetchAdPlacements(orientation);
    }, []);

    // 🔹 Function to fetch ad placements based on orientation
    const fetchAdPlacements = async (selectedOrientation: string) => {
        setAdLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ad-placements?orientation=${selectedOrientation}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await res.json();
            if (data.success) {
                setAdPlacements(data.data);

                // 🔹 Set default selected ad based on orientation
                const defaultAd = data.data.find(ad => ad.name === orientation);
                if (defaultAd) setSelectedAd(defaultAd);
            } else {
                showToast('Failed to fetch ad placements', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Something went wrong', 'error');
        } finally {
            setAdLoading(false);
        }
    };

    const fetchSavedCards = async () => {
        setCardsLoading(true);
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/cards`,
                {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                setCards(data.data);
            }
        } catch (err) {
            console.error('Failed to load cards');
        } finally {
            setCardsLoading(false);
        }
    };

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImage(imgUrl);
        }
    };

    const normalizeUrl = (url: string) => {
        const trimmed = url.trim();
        if (!trimmed) return '';
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            return `https://${trimmed}`;
        }
        return trimmed;
    };

    // 🔹 Handle Post Ad button click
    const handlePostAd = async () => {
        if (!selectedAd) {
            showToast('Please select an ad', 'error');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            showToast('User not authenticated', 'error');
            return;
        }

        // ✅ Image validation (orientation based)
        if (orientation === 'Horizontal' && !mainFileRef.current?.files?.[0] && !mainImage) {
            showToast('Please upload horizontal image', 'error');
            return;
        }

        if (orientation === 'Vertical' && !smallFileRef.current?.files?.[0] && !smallImage) {
            showToast('Please upload vertical image', 'error');
            return;
        }

        if (!description.trim()) {
            showToast('Please enter description', 'error');
            return;
        }

        // 🔹 Default card check
        const defaultCardId = cards.find(c => c.is_default)?.id;
        if (!defaultCardId) {
            showToast('Please select a default card', 'error');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('ad_placement_id', selectedAd.id);
            formData.append('orientation', orientation.toLowerCase());
            formData.append('can_pause', '0');
            formData.append('card_id', defaultCardId);
            formData.append('description', description);

            // 🔹 Dates (7 weeks)
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + 7 * 7);
            formData.append('start_date', today.toISOString().split('T')[0]);
            formData.append('end_date', endDate.toISOString().split('T')[0]);

            // 🔹 Images + URLs based on orientation
            if (orientation === 'Horizontal') {
                if (mainFileRef.current?.files?.[0]) {
                    formData.append('horizontal_image', mainFileRef.current.files[0]);
                } else if (mainImage) {
                    formData.append('horizontal_image_url', mainImage);
                }

                if (horizontalUrl?.trim()) {
                    formData.append('horizontal_url', normalizeUrl(horizontalUrl));
                }
            }

            if (orientation === 'Vertical') {
                if (smallFileRef.current?.files?.[0]) {
                    formData.append('vertical_image', smallFileRef.current.files[0]);
                } else if (smallImage) {
                    formData.append('vertical_image_url', smallImage);
                }

                if (verticalUrl?.trim()) {
                    formData.append('vertical_url', normalizeUrl(verticalUrl));
                }
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads/create`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/affiliate/ad-posted');
            } else {
                const serverMessage = Array.isArray(data.message)
                    ? data.message.join(', ')
                    : data.message || 'Failed to post ad';
                showToast(serverMessage, 'error');
            }
        } catch (err: any) {
            console.error(err);
            showToast(err.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Load name & email from localStorage
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleAddCard = async () => {
        // 🔹 Validate name & email
        if (!name.trim() || !email.trim()) {
            const msg = 'Please enter your name and email';
            showToast(
                msg,
                'error'
            );
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
            return;
        }

        if (!stripe || !elements) {
            const msg = 'Stripe not loaded yet';
            showToast(msg, 'error'); // ✅ Toast added
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            const msg = 'Card details missing';
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
                showToast(msg, 'error'); // ✅ Toast added
                throw new Error(msg);
            }

            // 🔹 2. Call Backend Subscription API
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/cards/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify({
                        payment_method_id: paymentMethod.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                const msg = data.message?.[0] || 'Subscription creation failed';
                showToast(msg, 'error'); // ✅ Toast added
                throw new Error(msg);
            }

            // ✅ Success
            showToast('Card added successfully!', 'success');

            // 🔥 SWITCH TAB TO SAVED CARDS
            setActiveTab('saved-cards');

            // 🔥 REFRESH SAVED CARDS
            fetchSavedCards();
        } catch (err: any) {
            const msg = err.message || 'Something went wrong';
            showToast(msg, 'error'); // ✅ Final catch-all toast
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefaultCard = async (cardId: string) => {
        // 🔹 UI pehle update (optimistic)
        setCards(prev =>
            prev.map(card => ({
                ...card,
                is_default: card.id === cardId,
            }))
        );

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/cards/${cardId}/default`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message?.[0] || 'Failed to set default card');
            }

        } catch (err) {
            console.error(err);

            // ❌ rollback
            fetchSavedCards();
        }
    };

    const fetchAdFromMyAds = async () => {
        if (!adId) return;

        setEditLoading(true);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads/my-ads`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!data.success) {
                showToast('Failed to load ad', 'error');
                return;
            }

            const ad = data.data.find((item: any) => item.id === Number(adId));

            if (!ad) {
                showToast('Ad not found', 'error');
                return;
            }

            // 🔹 Orientation
            setOrientation(
                ad.orientation.charAt(0).toUpperCase() + ad.orientation.slice(1)
            );

            // 🔹 URLs
            setHorizontalUrl(ad.horizontal_url || '');
            setVerticalUrl(ad.vertical_url || '');

            // 🔹 Images preview
            if (ad.horizontal_image) {
                setMainImage(
                    ad.horizontal_image
                );
            }

            if (ad.vertical_image) {
                setSmallImage(
                    ad.vertical_image
                );
            }

            // 🔹 Placement
            setSelectedAd(ad.placement);
            setDescription(ad.description);
            setCanPause(ad.can_pause === 1);

        } catch (err) {
            console.error(err);
            showToast('Something went wrong', 'error');
        } finally {
            setEditLoading(false);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            fetchAdFromMyAds();
        }
    }, [adId]);

    const handleUpdateAd = async () => {
        if (!adId || !selectedAd) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('User not authenticated', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('ad_placement_id', selectedAd.id);
            formData.append('orientation', orientation.toLowerCase());
            formData.append('can_pause', canPause ? '1' : '0');
            formData.append('description', description);

            // 🔹 Images + URLs only for selected orientation
            // Horizontal
            if (orientation === 'Horizontal') {
                if (mainFileRef.current?.files?.[0]) {
                    formData.append('horizontal_image', mainFileRef.current.files[0]);
                } else if (mainImage) {
                    formData.append('horizontal_image_url', mainImage);
                }

                // URL key always bhejna, chahe empty ho
                formData.append('horizontal_url', horizontalUrl ? normalizeUrl(horizontalUrl) : '');
            }

            // Vertical
            if (orientation === 'Vertical') {
                if (smallFileRef.current?.files?.[0]) {
                    formData.append('vertical_image', smallFileRef.current.files[0]);
                } else if (smallImage) {
                    formData.append('vertical_image_url', smallImage);
                }

                // URL key always bhejna, chahe empty ho
                formData.append('vertical_url', verticalUrl ? normalizeUrl(verticalUrl) : '');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads/${adId}/update`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showToast('Ad updated successfully!', 'success');
                router.back();
            } else {
                showToast(
                    Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Update failed',
                    'error'
                );
            }
        } catch (err) {
            console.error(err);
            showToast('Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="banner-sec post profile">
                {isEditMode && editLoading ? (
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ minHeight: '400px' }}
                    >
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="container">
                        <div className="right-bar mb-5 d-flex justify-content-between">
                            <div className="icon-wrapper d-flex align-items-center gap-3">
                                <div className="icon" onClick={() => router.back()}>
                                    <Image
                                        src="/assets/img/button-angle.svg"
                                        width={10}
                                        height={15}
                                        alt="Icon"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="fs-4 fw-semibold">
                                    {isEditMode ? 'Edit Ad' : 'Post an Ad'}
                                </span>
                            </div>
                            {isEditMode && (
                                <button
                                    className={'btn btn-primary'}
                                    onClick={async () => {
                                        setCanPause(!canPause)
                                    }}
                                >
                                    {canPause ? 'Resume Ad' : 'Pause Ad'}
                                </button>
                            )}
                        </div>

                        <div className="form-section">
                            {/* Left Side */}
                            <div className="left-side">
                                {isEditMode ? (
                                    <div>
                                        <div className="fw-semibold fs-18 mb-2">Selected Orientation</div>
                                        <div className="radio-wrapper mb-4">
                                            <input
                                                type="radio"
                                                className="radio"
                                                name="orientation"
                                                checked={true}
                                            />
                                            <label className="fw-medium">
                                                {orientation}
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="fw-semibold fs-18 mb-3">Select Orientation</div>
                                        {adLoading && <p>Loading orientation...</p>}

                                        <div className="radio-group mb-4">
                                            {adPlacements.map((ad) => (
                                                <div key={ad.id} className="radio-wrapper mb-3">
                                                    <input
                                                        type="radio"
                                                        id={`radio-${ad.id}`}
                                                        className="radio"
                                                        name="orientation"
                                                        checked={orientation.toLowerCase() === ad.orientation_type}
                                                        onChange={() => {
                                                            setOrientation(ad.name as 'Horizontal' | 'Vertical');
                                                            setSelectedAd(ad);
                                                            if (ad.name === 'Horizontal') {
                                                                setVerticalUrl('');
                                                                setSmallImage(null);
                                                                if (smallFileRef.current) smallFileRef.current.value = '';
                                                            } else {
                                                                setHorizontalUrl('');
                                                                setMainImage(null);
                                                                if (mainFileRef.current) mainFileRef.current.value = '';
                                                            }
                                                        }}

                                                    />
                                                    <label htmlFor={`radio-${ad.id}`} className="fw-medium">
                                                        {ad.name} (${ad.price} / {ad.price_type})
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="input-wrapper mb-4">
                                    {(orientation === 'Horizontal') && (
                                        <div className="input-wrapper mb-4">
                                            <label className="fw-semibold mb-1">Horizontal URL</label>
                                            <input type="text" value={horizontalUrl} onChange={e => setHorizontalUrl(e.target.value)} placeholder="Enter Horizontal URL" />
                                        </div>
                                    )}

                                    {(orientation === 'Vertical') && (
                                        <div className="input-wrapper mb-4">
                                            <label className="fw-semibold mb-1">Vertical URL</label>
                                            <input type="text" value={verticalUrl} onChange={e => setVerticalUrl(e.target.value)} placeholder="Enter Vertical URL" />
                                        </div>
                                    )}
                                    <div className="input-wrapper mb-4">
                                        <label className="fw-semibold mb-1">Caption</label>
                                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter Caption" />
                                    </div>
                                </div>
                                {
                                    !isEditMode && (
                                        <div>
                                            <div className="fs-4 fw-semibold mb-3">Payment Details</div>

                                            {/* Tabs */}
                                            <div className="tab mb-4">
                                                <ul className="nav nav-tabs mb-5" role="tablist">
                                                    <li className="nav-item" role="presentation">
                                                        <button
                                                            className={`nav-link ${activeTab === 'saved-cards' ? 'active' : ''}`}
                                                            onClick={() => setActiveTab('saved-cards')}
                                                        >
                                                            Saved Cards
                                                        </button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button
                                                            className={`nav-link ${activeTab === 'add-card' ? 'active' : ''}`}
                                                            onClick={() => setActiveTab('add-card')}
                                                        >
                                                            Add a New Card
                                                        </button>
                                                    </li>
                                                </ul>

                                                <div className="tab-content">
                                                    {activeTab === 'saved-cards' && (
                                                        <div className="tab-pane fade show active">
                                                            <div className="cards-wrapper">
                                                                <div className="row g-3">
                                                                    {cardsLoading && <p>Loading cards...</p>}

                                                                    {!cardsLoading && cards.length === 0 && (
                                                                        <p>No saved cards found</p>
                                                                    )}

                                                                    {cards.map((card) => (
                                                                        <div key={card.id} className="col-xl-6">
                                                                            <div className="credit-card mb-2 position-relative">
                                                                                <div key={card.id} className="checkbox-wrapper">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="checkbox checkbox1"
                                                                                        checked={card.is_default === true}
                                                                                        onChange={() => handleSetDefaultCard(card.id)}
                                                                                    />
                                                                                </div>

                                                                                <div className="numbers fs-4 fw-semibold mb-4">
                                                                                    **** **** **** {card.card.last4}
                                                                                </div>

                                                                                <div className="content-wrapper d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                                                    <div className="left d-flex align-items-center gap-4 flex-wrap">
                                                                                        <div>
                                                                                            <div className="fs-12 mb-1">Card Holder Name</div>
                                                                                            <div className="fs-14 fw-semibold">{card.billing_details.name}</div>
                                                                                        </div>

                                                                                        <div>
                                                                                            <div className="fs-12 mb-1">Expiry Date</div>
                                                                                            <div className="fs-14 fw-semibold">
                                                                                                {card.card.exp_month}/{card.card.exp_year}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeTab === 'add-card' && (
                                                        <div className="tab-pane fade show active">
                                                            <div className="form">
                                                                <div className="input-wrapper">
                                                                    <label className="mb-1 fw-semibold">Full Name *</label>
                                                                    <input type="text" placeholder="Jason Doe"
                                                                        value={name}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="input-wrapper">
                                                                    <label className="mb-1 fw-semibold">Email Address *</label>
                                                                    <input type="email" placeholder="hello@example.com"
                                                                        value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                        disabled
                                                                    />
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
                                                            </div>
                                                            <button
                                                                style={{ marginTop: '20px' }}
                                                                className="btn btn-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                                                onClick={handleAddCard}
                                                                disabled={loading}
                                                            >
                                                                {loading && (
                                                                    <span
                                                                        className="spinner-border spinner-border-sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                )}

                                                                {loading ? 'Adding Card...' : 'Add Card'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Note + Summary */}
                                            <div className="summary-box mb-4">
                                                <div className="icon-box d-flex gap-2">
                                                    <Image src="/assets/img/summary.svg" width={24} height={24} alt="Icon" loading="lazy" />
                                                    <div className="content w-100">
                                                        <div className="fs-14 fw-semibold mb-2">Summary</div>

                                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100 mb-1">
                                                            <div className="fs-14 text-gray-light fw-medium">Orientation</div>
                                                            <div className="fs-14 fw-semibold">{selectedAd?.name || '-'}</div>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100 mb-1">
                                                            <div className="fs-14 text-gray-light fw-medium">
                                                                Duration ({durationWeeks} Week X ${selectedAd?.price || '0'})
                                                            </div>
                                                            <div className="fs-14 fw-semibold">
                                                                ${selectedAd ? (Number(selectedAd.price) * durationWeeks).toFixed(2) : '0.00'}
                                                            </div>
                                                        </div>

                                                        <hr className="mb-2 mt-2" />

                                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100">
                                                            <div className="fs-14 text-gray-light fw-medium">Total</div>
                                                            <div className="fs-14 fw-semibold">
                                                                ${selectedAd ? (Number(selectedAd.price) * durationWeeks).toFixed(2) : '0.00'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                <button
                                    className="btn btn-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={isEditMode ? handleUpdateAd : handlePostAd}
                                    disabled={loading}
                                >
                                    {loading && <span className="spinner-border spinner-border-sm" />}
                                    {loading
                                        ? isEditMode ? 'Updating...' : 'Posting...'
                                        : isEditMode ? 'Update Ad' : 'Post an Ad'}
                                </button>
                            </div>

                            {/* Right Side Upload Boxes */}
                            <div className="right-side align-lg-end">
                                {(orientation === 'Horizontal') && (
                                    <div
                                        className="image-box"
                                        onClick={() => mainFileRef.current?.click()}
                                        style={{
                                            cursor: 'pointer',
                                            width: '650px',
                                            height: '426px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            border: '1px dashed #ccc',
                                        }}
                                    >
                                        {mainImage ? (
                                            <Image src={mainImage} alt="Upload"
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                                </svg>
                                                <p>Drag and drop image here<br />or click to upload</p>
                                                <small>Resolution: 760x246 | 200 MB Max</small>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            ref={mainFileRef}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(e, setMainImage)}
                                        />
                                    </div>
                                )}

                                {(orientation === 'Vertical') && (
                                    <div
                                        className="image-box small margin-right"
                                        style={{
                                            maxWidth: '371px',
                                            height: '426px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            border: '1px dashed #ccc',
                                        }}
                                        onClick={() => smallFileRef.current?.click()}
                                    >
                                        {smallImage ? (
                                            <Image src={smallImage}
                                                alt="Upload"
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                                </svg>
                                                <p>Drag and drop image here<br />or click to upload</p>
                                                <small>Resolution: 571x426 | 200 MB Max</small>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            ref={smallFileRef}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(e, setSmallImage)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
