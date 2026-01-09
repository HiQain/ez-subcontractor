// app/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { useRouter } from "next/navigation";

interface Contractor {
    id: number;
    name: string;
    company_name: string;
    city: string | null;
    state: string | null;
    profile_image_url: string;
    average_rating: string; // e.g., "4.50"
    ratings_count: string;  // e.g., "2"
    created_at: string;     // e.g., "2025-11-06T20:51:19.000000Z"
}

export default function ReviewsPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('All Ratings');
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Updated options - All Ratings followed by 5 Star to 1 Star
    const options = ['All Ratings', '5 Star', '4 Star', '3 Star', '2 Star', '1 Star'];

    // 🔹 Handle filter selection
    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);

        if (option === 'All Ratings') {
            setFilterRating(null);
        } else {
            const match = option.match(/^(\d+)/);
            const rating = match ? parseInt(match[1], 10) : null;
            setFilterRating(rating);
        }
    };

    // 🔹 Sort contractors by average_rating (highest to lowest)
    const sortContractorsByRating = (contractorsToSort: Contractor[]) => {
        return [...contractorsToSort].sort((a, b) => {
            const ratingA = parseFloat(a.average_rating) || 0;
            const ratingB = parseFloat(b.average_rating) || 0;
            return ratingB - ratingA; // descending order (highest first)
        });
    };

    // 🔹 Fetch contractors
    useEffect(() => {
        const fetchContractors = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required.');
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors/latest-rated`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    }
                );

                if (response.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    return;
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message?.[0] || 'Failed to load contractors');
                }

                if (data?.success) {
                    // ✅ Sort contractors by rating when initially loaded
                    setContractors(sortContractorsByRating(data.data));
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to load contractors.');
            } finally {
                setLoading(false);
            }
        };
        fetchContractors();
    }, []);

    // 🔹 Filter and sort contractors
    const filteredContractors = contractors.filter(contractor => {
        if (filterRating === null) return true;

        const avg = parseFloat(contractor.average_rating) || 0;
        return avg >= filterRating && avg < filterRating + 1;
    });

    // ✅ Always sort the filtered list by rating (highest to lowest)
    const sortedFilteredContractors = sortContractorsByRating(filteredContractors);

    // 🔹 Format date
    const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    return (
        <div className="sections overflow-hidden">
            <Header />

            <section className="banner-sec profile review">
                <div className="container">
                    <div className="review-wrapper p-0 shadow-none">
                        <div className="d-flex align-items-center gap-3 justify-content-between right-bar p-0 mb-5 flex-wrap">
                            <div className="icon-wrapper d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="icon"
                                    aria-label="Go back"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                    <Image
                                        src="/assets/img/button-angle.svg"
                                        width={10}
                                        height={15}
                                        alt="Back"
                                    />
                                </button>
                                <span className="fs-4 fw-semibold">Ratings</span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <div style={{ whiteSpace: 'nowrap' }} className="fw-medium">
                                    <span>Filter by:</span>
                                </div>
                                <div className="input-wrapper d-flex flex-column position-relative w-100">
                                    <div
                                        style={{ minWidth: '200px' }}
                                        className={`custom-select p-0 w-100 ${isOpen ? 'open' : ''}`}
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <div style={{ maxWidth: '200px' }} className="select-selected w-100">
                                            {selected}
                                        </div>
                                        <i className="bi bi-chevron-down select-arrow"></i>
                                        <ul className="select-options">
                                            {options.map((option, index) => (
                                                <li
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent parent click
                                                        handleSelect(option);
                                                    }}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Review Cards — now correctly filtered and sorted */}
                        <div className="review-card-s1 p-0 bg-transparent">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading contractors...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-warning d-flex align-items-center" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                    </svg>
                                    <div>{error}</div>
                                </div>
                            ) : (
                                <div className="row g-4 mb-5">
                                    {sortedFilteredContractors.length > 0 ? (
                                        sortedFilteredContractors.map((contractor) => (
                                            <div className="col-lg-4 col-md-6" key={contractor.id}>
                                                <div className="review-inner-card">
                                                    <div className="top d-flex align-items-center gap-2 justify-content-between flex-wrap mb-2">
                                                        <div className="icon-wrapper d-flex align-items-center gap-2">
                                                            {contractor.profile_image_url ? (
                                                                <Image
                                                                    className="avatar rounded-circle"
                                                                    src={contractor.profile_image_url}
                                                                    width={40}
                                                                    height={40}
                                                                    alt="Search Icon"
                                                                />
                                                            ) : (
                                                                <Image
                                                                    className="avatar rounded-circle"
                                                                    src="/assets/img/profile-placeholder.webp"
                                                                    width={40}
                                                                    height={40}
                                                                    alt="Search Icon"
                                                                />
                                                            )}
                                                            <div className="content">
                                                                <div className="fw-semibold fs-14 mb-1 text-capitalize">{contractor.name}</div>
                                                                <div style={{ color: '#8F9B1F' }} className="fw-semibold fs-14">
                                                                    {contractor.company_name || 'Unknown Company'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="date fs-12 text-gray-light">
                                                            {formatDate(contractor.created_at)}
                                                        </div>
                                                    </div>

                                                    <div className="bottom d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                                        <div className="fs-12 fw-medium">
                                                            {contractor.city && contractor.state
                                                                ? `${contractor.city}, ${contractor.state}`
                                                                : 'Location not available'}
                                                        </div>
                                                        <div className="right d-flex align-items-center gap-2 flex-wrap">
                                                            <div className="rating-icons d-flex align-items-center gap-1">
                                                                {Array(5)
                                                                    .fill(0)
                                                                    .map((_, j) => {
                                                                        const starValue = j + 1;
                                                                        const rating = parseFloat(contractor.average_rating) || 0;
                                                                        const isFull = starValue <= Math.floor(rating);
                                                                        const isHalf = !isFull && starValue <= rating + 0.5;

                                                                        return (
                                                                            <Image
                                                                                key={j}
                                                                                src={
                                                                                    isFull
                                                                                        ? '/assets/img/start1.svg'
                                                                                        : isHalf
                                                                                            ? '/assets/img/star2.svg'
                                                                                            : '/assets/img/star-empty.svg'
                                                                                }
                                                                                width={14}
                                                                                height={14}
                                                                                alt="Star Icon"
                                                                                loading="lazy"
                                                                            />
                                                                        );
                                                                    })}
                                                            </div>
                                                            <div className="content">
                                                                <div className="fs-12">{parseFloat(contractor.average_rating).toFixed(1)}/5</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <div className="text-center py-4">
                                                <Image
                                                    src="/assets/img/post.webp"
                                                    width={120}
                                                    height={120}
                                                    alt="No contractors"
                                                    className="mb-3"
                                                />
                                                <p className="text-muted">
                                                    {filterRating
                                                        ? `No subcontractors with ${filterRating}-star ratings found.`
                                                        : 'No subcontractors found.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}