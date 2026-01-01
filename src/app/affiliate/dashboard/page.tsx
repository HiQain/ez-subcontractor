'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/free-trial.css';

interface BannerImage {
    id: number;
    src: string;
    alt: string;
}

interface Contractor {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    company_name: string;
    zip: string;
    city: string;
    state: string;
    specialization: string;
    license_number: string;
    work_radius: string;
    profile_image_url: string | null;
    average_rating: string;
    ratings_count: string;
    role: string;
}

export default function AffiliateDashboard() {
    const router = useRouter();
    const sliderRef = useRef<Slider | null>(null);
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 9;
    const [hasMore, setHasMore] = useState(true);

    // 🔹 Saved state
    const [savedContractors, setSavedContractors] = useState<Set<number>>(new Set());


    // 🔹 Toast notification — identical to LoginPage
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const icon = type === 'success' ? '✅' : '❌';

        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
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
            ">
                <span>${icon} ${message}</span>
                <button type="button" class="btn-close" style="font-size: 14px; margin-left: auto;" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast);

        const timeoutId = setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);

        const closeButton = toast.querySelector('.btn-close');
        closeButton?.addEventListener('click', () => {
            clearTimeout(timeoutId);
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    };

    // 🔹 Fetch contractors from API
    const fetchContractors = async (resetPage = false, specificPage?: number) => {
        const targetPage = resetPage ? 1 : specificPage ?? page;

        if (resetPage) {
            setPage(1);
            setContractors([]);
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            // 🔴 Use `targetPage`, **not** `page`
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors?page=${targetPage}&perPage=${perPage}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.data?.data)) {
                const newData = data.data.data;

                let updatedContractors = resetPage ? newData : [...contractors, ...newData];

                // 🟢 Deduplication still applies (optional but safe)
                if (!resetPage) {
                    const existingIds = new Set(contractors.map(c => c.id));
                    const uniqueNewData = newData.filter(c => !existingIds.has(c.id));
                    updatedContractors = [...contractors, ...uniqueNewData];
                }

                setContractors(updatedContractors);

                const total = data.data.total || 0;
                const totalPages = Math.ceil(total / perPage);
                setHasMore(targetPage < totalPages); // 🔵 Use targetPage

            } else {
                throw new Error(data.message?.[0] || 'Failed to load contractors');
            }
        } catch (err: any) {
            console.error('Fetch contractors error:', err);
            setError(err.message || 'Failed to load contractors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Load initial data
    useEffect(() => {
        fetchContractors(true);
    }, []);

    // 🔹 Handle "Load More" click
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage); // update state
            fetchContractors(false, nextPage); // pass explicit page
        }
    };

    // 🔹 NEW: Fetch saved contractors on mount
    const fetchSavedContractors = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors/my-saved`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data?.data)) {
                    const savedIds = data.data.map((item: any) => Number(item.id));
                    setSavedContractors(new Set(savedIds));
                }
            }
        } catch (err) {
            console.warn('Failed to load saved contractors', err);
        }
    };

    useEffect(() => {
        fetchSavedContractors();
    }, []);

    // 🔹 NEW: Toggle Save/Unsave with Toast
    const toggleSave = async (contractorId: number) => {
        const isCurrentlySaved = savedContractors.has(contractorId);
        const endpoint = isCurrentlySaved ? 'common/contractors/unsave' : 'common/contractors/save';
        const formData = new FormData();
        formData.append('contractor_id', contractorId.toString());

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isCurrentlySaved ? 'unsave' : 'save'} contractor`);
            }

            // ✅ Optimistic UI + Toast
            const newSaved = new Set(savedContractors);
            if (isCurrentlySaved) {
                newSaved.delete(contractorId);
                showToast('Contractor removed from saved list', 'success');
            } else {
                newSaved.add(contractorId);
                showToast('Contractor saved successfully!', 'success');
            }
            setSavedContractors(newSaved);

        } catch (err) {
            console.error('Toggle save error:', err);
            showToast(
                `Failed to ${isCurrentlySaved ? 'unsave' : 'save'} contractor.`,
                'error'
            );
        }
    };

    // 🔹 Render stars based on average_rating
    const renderStars = (rating: string) => {
        const avg = parseFloat(rating) || 0;
        return [1, 2, 3, 4, 5].map((_, i) => {
            const starValue = i + 1;
            const isFull = starValue <= Math.floor(avg);
            const isHalf = !isFull && starValue <= avg + 0.5;

            return (
                <Image
                    key={i}
                    src={
                        isFull
                            ? '/assets/img/start1.svg'
                            : isHalf
                            ? '/assets/img/star2.svg'
                            : '/assets/img/star-empty.svg'
                    }
                    width={16}
                    height={16}
                    alt="Star Icon"
                    style={{
                        width: 'clamp(12px, 4vw, 16px)',
                        height: 'clamp(12px, 4vw, 16px)',
                    }}
                />
            );
        });
    };

    // 🔹 Format rating display
    const formatRating = (rating: string) => {
        const num = parseFloat(rating);
        return isNaN(num) ? 'N/A' : num.toFixed(1);
    };

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">

                {/* ===================== Filter Section ===================== */}
                <section className="filter-sec pt-5">
                    <div className="container">
                        <div className="row g-4">
                            {/* Left Filter SidebarSubcontractor */}
                            <div className="col-xl-3">
                                <span className="d-block mb-3 fw-semibold fs-4">Filters</span>
                                <span className="d-block mb-2 fw-medium">
                                    Browse or Search Directory
                                </span>

                                <div className="form-wrapper mx-0 flex-nowrap">
                                    <Image
                                        src="/assets/img/icons/search-gray.svg"
                                        width={18}
                                        height={18}
                                        alt="Search Icon"
                                    />
                                    <input type="text" placeholder="Search here" />
                                </div>

                                <span className="d-block mb-2 fw-medium">Type</span>
                                <div className="radio-group d-flex align-items-center gap-2 flex-wrap mb-3">
                                    {['All', 'Subcontractor', 'General Contractor'].map((label, i) => (
                                        <label
                                            key={i}
                                            className="radio-option d-flex align-items-center gap-2"
                                        >
                                            <input
                                                type="radio"
                                                style={{ width: '24px', height: '24px' }}
                                                className="mb-0"
                                                name="subscription"
                                                value={label.toLowerCase()}
                                                defaultChecked={label === 'Yearly'}
                                            />
                                            <span className="fs-14 fw-medium">{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <span className="d-block mb-2 fw-medium">City</span>
                                <input type="text" placeholder="Whittier, CA" />

                                <span className="d-block mb-2 fw-medium">Zip Code</span>
                                <input type="text" placeholder="29391" />

                                <div className="range-wrapper mb-5">
                                    <div className="range-container">
                                        <div className="slider-wrap">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                defaultValue="2"
                                                id="milesRange"
                                                className="range-slider"
                                            />
                                            <div className="range-value">2 miles</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="min">0 miles</span>
                                        <span className="max">100 miles</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Filter Cards */}
                            <div className="col-xl-9">
                                {loading && page === 1 ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading contractors...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            className="bi bi-exclamation-triangle-fill me-2"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                        <div>{error}</div>
                                    </div>
                                ) : contractors.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Image
                                            src="/assets/img/post.webp"
                                            width={120}
                                            height={120}
                                            alt="No contractors"
                                            className="mb-3"
                                        />
                                        <p className="text-muted">No contractors found.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="row g-3">
                                            {contractors.map((contractor) => (
                                                <div key={contractor.id} className="col-lg-4 col-md-6">
                                                    <div className="filter-card">
                                                        {/* 👇 Save Button - matches your design */}
                                                        <button
                                                            className={`icon bg-white ${savedContractors.has(contractor.id) ? 'saved' : 'save'}`}
                                                            aria-label={savedContractors.has(contractor.id) ? 'Remove from saved' : 'Save contractor'}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleSave(contractor.id);
                                                            }}
                                                        >
                                                            <Image
                                                                src={
                                                                    savedContractors.has(contractor.id)
                                                                        ? '/assets/img/bookmark-filled.svg'
                                                                        : '/assets/img/bookmark-outline.svg'
                                                                }
                                                                width={16}
                                                                height={16}
                                                                alt="save"
                                                            />
                                                        </button>

                                                        <button className="btn border-0 mx-auto d-block" onClick={(e) => {
                                                            e.preventDefault();
                                                            localStorage.setItem('selectedContractor', JSON.stringify(contractor));
                                                            router.push('/affiliate/contractor-details');
                                                        }}>
                                                            <Image
                                                                src={contractor.profile_image_url || '/assets/img/profile-placeholder.webp'}
                                                                width={104}
                                                                height={104}
                                                                className="d-block mx-auto mb-3 rounded-circle"
                                                                alt={`${contractor.name}'s Profile`}
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                            <div
                                                                style={{ color: '#333342' }}
                                                                className="title text-black fw-semibold text-center fs-5 mb-2 text-capitalize"
                                                            >
                                                                {contractor.company_name || contractor.name}
                                                            </div>
                                                        </button>


                                                        <div className="text-center">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    localStorage.setItem('selectedContractor', JSON.stringify(contractor));
                                                                    router.push('/affiliate/contractor-details');
                                                                }}
                                                                className="btn btn-primary py-2 px-4 mx-auto mb-3 shadow-none text-capitalize"
                                                            >
                                                                {contractor.role}
                                                            </button>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2 flex-nowrap">
                                                            <Image
                                                                src="/assets/img/icons/message-dark.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Message Icon"
                                                            />
                                                            <a
                                                                href={`mailto:${contractor.email}`}
                                                                className="text-dark fw-medium text-truncate"
                                                            >
                                                                {contractor.email}
                                                            </a>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
                                                            <Image
                                                                src="/assets/img/icons/call-dark.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Call Icon"
                                                            />
                                                            <a
                                                                href={`tel:${contractor.phone}`}
                                                                className="text-dark fw-medium"
                                                            >
                                                                {contractor.phone}
                                                            </a>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                                            <Link href="#" className="icon">
                                                                <Image
                                                                    src="/assets/img/icons/Chat.svg"
                                                                    width={20}
                                                                    height={20}
                                                                    alt="Icon"
                                                                />
                                                            </Link>
                                                            <Link href={`mailto:${contractor.email}`} className="icon">
                                                                <Image
                                                                    src="/assets/img/icons/message-white.svg"
                                                                    width={20}
                                                                    height={20}
                                                                    alt="Icon"
                                                                />
                                                            </Link>
                                                            <Link href={`tel:${contractor.phone}`} className="icon">
                                                                <Image
                                                                    src="/assets/img/icons/call-white.svg"
                                                                    width={20}
                                                                    height={20}
                                                                    alt="Icon"
                                                                />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ✅ Load More Button */}
                                        {hasMore && (
                                            <div className="text-center my-5">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleLoadMore}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Loading...' : 'Load More'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}