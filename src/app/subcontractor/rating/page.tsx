'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import '../../../styles/reviews.css';

// ✅ Updated interface to match API response
interface Review {
    id: number;
    user_id: string;
    contractor_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    rated_given_by_user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profile_image_url: string | null;
    };
}

export default function ReviewsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);

    // 🔁 Fetch ratings on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found. User may not be logged in.');
            setLoading(false);
            return;
        }

        const fetchRatings = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/rating/my-ratings`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login';
                    return;
                }

                const data = await response.json();
                console.log(data)
                if (!response.ok) {
                    throw new Error(data.message?.[0] || 'Failed to load ratings');
                }

                // ✅ Parse reviews array — convert rating to number
                const fetchedReviews = data.data?.map((item: any) => ({
                    id: item.id,
                    user_id: item.user_id,
                    contractor_id: item.rated_user_id, // assuming this is you
                    rating: parseFloat(item.rating), // ✅ Convert string to number
                    comment: item.comment || '',
                    created_at: item.created_at,
                    rated_given_by_user: {
                        id: item.rated_given_by_user?.id || '',
                        name: item.rated_given_by_user?.name || 'Anonymous',
                        email: item.rated_given_by_user?.email || '',
                        phone: item.rated_given_by_user?.phone || '',
                        profile_image_url: item.rated_given_by_user?.profile_image_url || '/assets/img/client-1.webp',
                    },
                })) || [];

                setReviews(fetchedReviews);

                // ✅ Calculate average rating
                if (fetchedReviews.length > 0) {
                    const avg = fetchedReviews.reduce((sum, r) => sum + r.rating, 0) / fetchedReviews.length;
                    setAverageRating(parseFloat(avg.toFixed(1)));
                } else {
                    setAverageRating(0);
                }

            } catch (err: any) {
                console.error('Fetch ratings error:', err);
                setError(err.message || 'Failed to load ratings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    // 🔁 Format date to "X mins/hours/days ago"
    const timeAgo = (dateString: string): string => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000); // minutes
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    // 🌀 Loading State
    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec reviews position-static">
                        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Loading ratings...</p>
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
                    <section className="banner-sec reviews position-static">
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
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec reviews position-static">
                    <div className="container">

                        {/* Filter Bar */}
                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-5">
                            <div className="rating fw-semibold fs-5">Rating</div>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ whiteSpace: "nowrap" }} className="fw-semibold fs-5">
                                    Filter by:
                                </div>
                                <div className="input-wrapper d-flex flex-column position-relative w-100">
                                    <div style={{ minWidth: "clamp(180px,28vw,288px)" }} className="custom-select w-100">
                                        <div className="select-selected">Select option</div>
                                        <i className="bi bi-chevron-down select-arrow"></i>
                                        <ul className="select-options">
                                            <li data-value="1">Select option 1</li>
                                            <li data-value="2">Select option 2</li>
                                            <li data-value="3">Select option 3</li>
                                            <li data-value="4">Select option 4</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Rating */}
                        <div className="d-flex flex-column gap-3 align-items-center justify-content-center mb-5">
                            <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <img
                                        key={i}
                                        src="/assets/img/start1.svg"
                                        width="50"
                                        height="50"
                                        alt="Star Icon"
                                        loading="lazy"
                                    />
                                ))}
                                <img
                                    src="/assets/img/star2.svg"
                                    width="50"
                                    height="50"
                                    alt="Star Icon"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-center fs-3 fw-bold">{averageRating}/5</div>
                        </div>

                        {/* Review Cards */}
                        <div className="row g-4 mb-5">
                            {reviews.length === 0 ? (
                                <div className="col-12 text-center py-5">
                                    <p className="text-gray-light">You haven't received any ratings yet.</p>
                                </div>
                            ) : (
                                reviews.map((review, index) => (
                                    <div className="col-lg-4 col-md-6" key={review.id}>
                                        <div className="review-card">
                                            <div className="content d-flex align-items-center gap-1 justify-content-between flex-wrap mb-4">
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                                        {[1, 2, 3, 4].map((_, i) => (
                                                            <img
                                                                key={i}
                                                                src="/assets/img/start1.svg"
                                                                width="20"
                                                                height="20"
                                                                alt="Star Icon"
                                                                loading="lazy"
                                                            />
                                                        ))}
                                                        {review.rating >= 4.5 ? (
                                                            <img
                                                                src="/assets/img/star2.svg"
                                                                width="20"
                                                                height="20"
                                                                alt="Star Icon"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <img
                                                                src="/assets/img/start1.svg"
                                                                width="20"
                                                                height="20"
                                                                alt="Star Icon"
                                                                loading="lazy"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="content fw-medium">{review.rating}/5</div>
                                                </div>
                                                <div className="time text-gray-light fs-14">{timeAgo(review.created_at)}</div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                <div className="client-info d-flex align-items-center gap-2">
                                                    <img
                                                        src={review.rated_given_by_user.profile_image_url || '/assets/img/client-1.webp'}
                                                        width="62"
                                                        height="62"
                                                        alt="Client Image"
                                                        loading="lazy"
                                                        className="rounded-circle"
                                                    />
                                                    <div className="content">
                                                        <div className="passion fs-14">General Contractor</div>
                                                        <div className="name fw-semibold text-black">{review.rated_given_by_user.name}</div>
                                                    </div>
                                                </div>
                                                <img
                                                    src="/assets/img/quote.webp"
                                                    className="quote-icon"
                                                    width="79"
                                                    height="61"
                                                    alt="Quote Icon"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Load More Button */}
                        <Link href="#" className="btn bg-dark rounded-3 mx-auto d-flex justify-content-center align-items-center d-none">
                            <span className="text-white">Load More</span>
                            <img src="/assets/img/load-btn.svg" className="d-block" width="15" height="15" alt="Arrow" />
                        </Link>

                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}