// app/reviews/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { useRouter } from "next/navigation";
import { showToast } from '../../../utils/appToast';

interface Contractor {
    id: number;
    name: string;
    company_name: string;
    city: string | null;
    state: string | null;
    profile_image_url: string;
    average_rating: string; // e.g., "4.50"
    rating_count: number;  // e.g., "2"
    created_at: string;     // e.g., "2025-11-06T20:51:19.000000Z"
    zip: string;     // e.g., "2025-11-06T20:51:19.000000Z"
}

export default function ReviewsPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('All Ratings');
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Contractor[]>([]);
    const [showList, setShowList] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [currentContractor, setCurrentContractor] = useState<Contractor | null>(null);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingError, setRatingError] = useState<string | null>(null);
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [profileLoaded, setProfileLoaded] = useState(false);

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

    // 🔹 Fetch contractors
    useEffect(() => {
        if (profileLoaded && subscriptionId) {
            fetchContractors();
        }
    }, [profileLoaded, subscriptionId]);

    // 🔹 Filter and sort contractors
    const filteredContractors = contractors.filter(contractor => {
        // hide contractors with zero ratings
        if (contractor.rating_count === 0) return false;

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

    const debouncedFetch = useCallback(
        debounce(async (searchTerm: string) => {
            if (!searchTerm.trim()) {
                setResults([]);
                setShowList(false);
                return;
            }

            setSearchLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors?role=subcontractor&page=1&perPage=20&search=${encodeURIComponent(searchTerm)}`,
                    {
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Accept': 'application/json',
                        },
                    }
                );

                const data = await res.json();
                // ✅ Extract contractors from nested data.data
                const contractors = data?.data?.data || [];
                console.log(contractors);
                setResults(contractors);
                setShowList(true);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);

                // 🔹 Show error toast
                showToast('Search failed. Please try again.', 'error');
            } finally {
                setSearchLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedFetch(query);
    }, [query, debouncedFetch]);

    // 🔹 Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                listRef.current &&
                !listRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setShowList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRateSubcontractor = async () => {
        if (!currentContractor || selectedRating === 0) return;
        setRatingLoading(true);
        setRatingError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const formData = new FormData();
            formData.append('rated_user_id', currentContractor.id.toString());
            formData.append('rating', selectedRating.toString());
            formData.append('comment', comment.trim());

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/rating/add`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message?.[0] || 'Failed to submit rating');
            }

            // ✅ Success!
            // 🔹 Replaced alert with toast
            showToast('Rating submitted successfully!');

            setIsRatingModalOpen(false);
            setCurrentContractor(null);
            setSelectedRating(0);
            setComment('');

            setQuery('');
            setResults([]);
            setShowList(false);
            inputRef.current?.blur();

            fetchContractors();

            // Optional: Refresh contractor list or update average_rating locally
            // You could refetch contractors here if needed
        } catch (err: any) {
            console.error('Rating error:', err);
            setRatingError(err.message || 'Failed to submit rating. Please try again.');

            // 🔹 Show error toast
            showToast(err.message || 'Failed to submit rating. Please try again.', 'error');
        } finally {
            setRatingLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch profile');

                const data = await response.json();
                const subId = data?.data?.subscription_id || null;

                if (subId) {
                    localStorage.setItem('subscription', subId);
                    setSubscriptionId(subId);
                }

            } catch (err) {
                console.error('Profile fetch error:', err);
            } finally {
                setProfileLoaded(true);
            }
        };

        if (token) fetchProfile();
        else setProfileLoaded(true);
    }, []);

    return (
        <div className="sections overflow-hidden">
            <Header />

            {
                profileLoaded ? (
                    subscriptionId ? (
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

                                    {/* 🔍 Rate a Subcontractor with Search */}
                                    <div className="review-wrapper mb-4">
                                        <div className="d-flex align-items-center text-center text-md-start flex-column flex-md-row gap-3 justify-content-between filter-sec p-0">
                                            <div>
                                                <div className="fs-3 fw-semibold">Rate a Subcontractor</div>
                                            </div>
                                            <div className="search-wrapper position-relative w-100" style={{ maxWidth: '400px' }}>
                                                <div className="form-wrapper mb-0 d-flex align-items-center py-0 me-0">
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={query}
                                                        onChange={(e) => setQuery(e.target.value)}
                                                        onFocus={() => query.trim() && setShowList(true)}
                                                        placeholder="Search subcontractor by name or company"
                                                        className="form-control pe-5 shadow-none"
                                                        style={{ paddingRight: '32px', height: '40px' }}
                                                    />
                                                    <div style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }}>
                                                        {searchLoading ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                        ) : (
                                                            <Image
                                                                src="/assets/img/icons/search-gray.svg"
                                                                width={18}
                                                                height={18}
                                                                alt="Search Icon"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                {(showList || searchLoading) && results.length > 0 && (
                                                    <ul
                                                        ref={listRef}
                                                        className="list bg-white shadow-sm px-2 py-1 rounded-4 position-absolute w-100 z-1"
                                                        style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '4px', top: '40px' }}
                                                    >
                                                        {results.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="d-flex justify-content-between align-items-center bg-gray p-2 my-1 rounded-3 gap-2"
                                                            >
                                                                <span className="d-flex align-items-center gap-2">
                                                                    {item.profile_image_url ? (
                                                                        <Image
                                                                            className="avatar rounded-circle"
                                                                            src={item.profile_image_url}
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
                                                                    <span>
                                                                        <span className="name d-block fw-medium text-truncate">{item.name}</span>
                                                                        <span
                                                                            className="company d-block fs-12 fw-bold text-truncate"
                                                                            style={{ color: '#8F9B1F' }}
                                                                        >
                                                                            {item.company_name || '—'}
                                                                        </span>
                                                                        <span className="address d-block fs-12">
                                                                            {item.city && item.state
                                                                                ? `${item.city}, ${item.state}`
                                                                                : ''}
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-dark btn-sm fs-12 py-1 px-3"
                                                                    onClick={() => {
                                                                        setCurrentContractor(item);
                                                                        setIsRatingModalOpen(true);
                                                                        setSelectedRating(0);
                                                                        setComment('');
                                                                        setRatingError(null);
                                                                    }}
                                                                >
                                                                    Rate
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {showList && !searchLoading && results.length === 0 && query.trim() && (
                                                    <ul
                                                        ref={listRef}
                                                        className="list bg-white shadow-sm px-2 py-1 rounded-4 position-absolute w-100 z-1"
                                                        style={{ marginTop: '4px' }}
                                                    >
                                                        <li className="p-2 text-center text-muted">No subcontractors found</li>
                                                    </ul>
                                                )}
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
                                                                            <div style={{ color: '#8F9B1F' }} className="fw-semibold fs-14">
                                                                                {contractor.company_name || 'Unknown Company'}
                                                                            </div>
                                                                            <div className="fw-semibold fs-14 mb-1 text-capitalize">{contractor.name}</div>
                                                                            <div className="fs-12 fw-medium">
                                                                                {contractor.zip}
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
                                                                            : ''}
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
                                                                            <div className="fs-12">{parseFloat(contractor.average_rating).toFixed(1)}/5 ({contractor.rating_count})</div>
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
                    )
                        : (
                            /* ===== NO SUBSCRIPTION ===== */
                            <div className="text-center py-5">
                                <Image src="/assets/img/post.webp" width={120} height={120} alt="No subscription" />
                                <p className="text-muted mt-3">
                                    You need a subscription to rate and view contractor reviews.
                                </p>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => router.push('/subscription-list')}
                                >
                                    View Plans
                                </button>
                            </div>
                        )
                ) : (
                    /* ===== PROFILE LOADING ===== */
                    <div className="d-flex justify-content-center py-5 align-items-center" style={{ height: '300px' }}>
                        <div className="spinner-border text-primary" />
                    </div>
                )
            }

            {/* Rating Modal */}
            {isRatingModalOpen && currentContractor && (
                <div className="modal-backdrop show" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}></div>
            )}
            {isRatingModalOpen && currentContractor && (
                <div
                    className="modal show d-block"
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1060,
                        maxWidth: '400px',
                        width: '90%',
                        height: '330px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                >
                    <div className="modal-header border-0 mb-0 py-0 px-0">
                        <h5 className="modal-title text-center w-100 mb-0 py-0 px-0">Rate Now</h5>
                        <button
                            type="button"
                            className="btn-close shadow-none"
                            onClick={() => {
                                setIsRatingModalOpen(false);
                                setCurrentContractor(null);
                                setSelectedRating(0);
                                setComment('');
                                setRatingError(null);
                            }}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-center">
                        {/* Avatar */}
                        <img
                            src="/assets/img/placeholder-round.png"
                            alt="Contractor"
                            className="rounded-circle mb-1"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <h6 className="mb-1 text-capitalize">{currentContractor.name}</h6>
                        <h6 className="mb-1 text-capitalize text-primary">{currentContractor.company_name}</h6>
                        <h6 className="mb-1 text-capitalize">{currentContractor.zip}</h6>
                        {/* Star Rating */}
                        <div className="d-flex justify-content-center align-items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="border-0 bg-transparent p-0"
                                    onClick={() => setSelectedRating(star)}
                                    onMouseEnter={() => { }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Image
                                        src={
                                            star <= selectedRating
                                                ? '/assets/img/start1.svg'
                                                : star <= selectedRating + 0.5
                                                    ? '/assets/img/star2.svg'
                                                    : '/assets/img/star-empty.svg'
                                        }
                                        width={32}
                                        height={32}
                                        alt={`Star ${star}`}
                                        className="mx-1"
                                    />
                                </button>
                            ))}
                        </div>
                        {ratingError && (
                            <div className="alert alert-danger mt-2 p-2 mb-3 text-start">
                                {ratingError}
                            </div>
                        )}
                        {/* Buttons */}
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-dark justify-content-center w-50 rounded-2"
                                onClick={() => {
                                    setIsRatingModalOpen(false);
                                    setCurrentContractor(null);
                                    setSelectedRating(0);
                                    setComment('');
                                    setRatingError(null);
                                }}
                                disabled={ratingLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary w-50 justify-content-center rounded-2"
                                style={{ height: 50 }}
                                onClick={handleRateSubcontractor}
                                disabled={ratingLoading || selectedRating === 0}
                            >
                                {ratingLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Done'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): Promise<ReturnType<F>> => {
        clearTimeout(timeout);
        return new Promise((resolve) => {
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
    };
}