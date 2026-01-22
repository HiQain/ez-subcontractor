'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { showToast } from '../../../utils/appToast';

interface Contractor {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    zip: string;
    role: string;
    profile_image_url: string | null;
    average_rating: string;
    ratings_count: number;
    categories: string[];
    has_liability_insurance: boolean;
    work_radius?: string;
    city?: string;
    state?: string;
    address?: string;
    specialization: string;
    license_number: string;
}

export default function ContractorDetails() {
    const router = useRouter();
    const [contractor, setContractor] = useState<Contractor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Save state (for toggle)
    const [isSaved, setIsSaved] = useState(false);

    // 🔹 Fetch from API (fallback)
    // const fetchContractorFromAPI = async (id: number) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors/${id}`, {
    //             headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    //         });
    //
    //         if (!response.ok) throw new Error('Not found');
    //
    //         const data = await response.json();
    //         if (data.success && data.data) {
    //             const apiContractor = data.data as Contractor;
    //             setIsSaved(apiContractor.is_saved || false);
    //             // ✅ Sync localStorage with fresh data (optional)
    //             localStorage.setItem('selectedContractor', JSON.stringify(apiContractor));
    //             setContractor(apiContractor);
    //         }
    //     } catch (err) {
    //         setError('Contractor details unavailable.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // 🔹 Try localStorage first, fallback to API
    useEffect(() => {
        const saved = localStorage.getItem('selectedContractor');
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as any;
                setContractor(parsed);
                setLoading(false);

                setIsSaved(Boolean(parsed.is_saved));
            } catch (e) {
                console.warn('Invalid contractor in localStorage', e);
                localStorage.removeItem('selectedContractor');
                setError('Invalid saved data. Redirecting...');
                setTimeout(() => router.push('/affiliate/dashboard'), 2000);
            }
        } else {
            // ❌ No localStorage → must have come via direct URL or stale cache
            setError('No contractor selected. Redirecting to dashboard...');
            setTimeout(() => router.push('/affiliate/dashboard'), 2000);
        }
    }, [router]);

    // 🔹 Toggle Save (same logic — updates both UI + API + localStorage)
    const toggleSave = async () => {
        if (!contractor) return;

        const token = localStorage.getItem('token');
        const endpoint = isSaved ? 'common/contractors/unsave' : 'common/contractors/save';
        const formData = new FormData();
        formData.append('contractor_id', contractor.id.toString());

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error();

            // ✅ Update UI
            const newSaved = !isSaved;
            setIsSaved(newSaved);

            // ✅ Update localStorage
            const updatedContractor = { ...contractor, is_saved: newSaved };
            localStorage.setItem('selectedContractor', JSON.stringify(updatedContractor));
            setContractor(updatedContractor);

            // ✅ Toast
            showToast(
                newSaved ? 'Contractor saved successfully!' : 'Contractor removed from saved list',
                'success'
            );
        } catch (err) {
            console.error('Toggle save error:', err);
            showToast(`Failed to ${isSaved ? 'unsave' : 'save'} contractor.`, 'error');
        }
    };

    // 🔹 Render stars
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
                    width={50}
                    height={50}
                    alt="Star Icon"
                    style={{
                        width: 'clamp(20px,5vw,50px)',
                        height: 'clamp(20px,5vw,50px)',
                    }}
                />
            );
        });
    };

    // 🌀 Loading / Error
    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile">
                        <div className="container">
                            <div className="right-bar d-flex align-items-center justify-content-center" style={{ height: '600px' }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
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
                    <section className="banner-sec profile">
                        <div className="container">
                            <div className="right-bar text-center py-5">
                                <div className="alert alert-warning" role="alert">
                                    {error}
                                </div>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => router.push('/affiliate/dashboard')}
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    if (!contractor) return null;

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="right-bar">
                            {/* Top Bar */}
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
                                        />
                                    </button>
                                    <span className="fs-4 fw-semibold">Contractor Details</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleSave}
                                    aria-label={isSaved ? 'Unsave' : 'Save'}
                                    style={{
                                        border: 'none',
                                        backgroundColor: isSaved ? '#C9DA2B' : '#EFEFEF',
                                        borderRadius: '100px',
                                        width: '40px',
                                        height: '40px',
                                    }}
                                >
                                    <Image
                                        src={
                                            isSaved
                                                ? '/assets/img/bookmark-filled.svg'
                                                : '/assets/img/bookmark-outline.svg'
                                        }
                                        width={20}
                                        height={20}
                                        alt="Save"
                                    />
                                </button>
                            </div>

                            {/* Review Bar */}
                            <div className="review-bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-5">
                                <div className="image-box d-flex align-items-center gap-4">
                                    <Image
                                        src={contractor.profile_image_url || '/assets/img/profile-placeholder.webp'}
                                        className="worker-img rounded-circle"
                                        width={180}
                                        height={180}
                                        alt={`${contractor.name}'s Profile`}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div className="content">
                                        <div className="title fw-semibold fs-4 mb-2">{contractor.name}</div>
                                        <span className="btn btn-primary p-1 ps-3 pe-3 mb-3 text-capitalize">
                                            {contractor.role === 'general_contractor' ? 'General Contractor' : contractor.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="right d-flex align-items-center gap-4 flex-wrap">
                                    <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                        {renderStars(contractor.average_rating)}
                                    </div>
                                    <div className="content">
                                        <div className="text-black text-center fs-3 fw-bold mb-1">
                                            {parseFloat(contractor.average_rating).toFixed(1)}/5
                                        </div>
                                        <span className="text-gray-light">
                                            {contractor.ratings_count} Reviews
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="review-bar mb-5">
                                <div className="icon-wrapper d-flex flex-column gap-4">
                                    <div className="icon-box">
                                        <div className="icon1">
                                            <Image
                                                src="/assets/img/icons/office-dark.svg"
                                                width={24}
                                                height={24}
                                                alt="Icon"
                                            />
                                        </div>
                                        <div className="content">
                                            <div className="fs-14 text-gray-light mb-1 fw-medium">
                                                Company Name
                                            </div>
                                            <div className="fw-semibold">
                                                {contractor.company_name || '—'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="icon-box">
                                        <div className="icon1">
                                            <Image
                                                src="/assets/img/icons/message-dark.svg"
                                                width={24}
                                                height={24}
                                                alt="Icon"
                                            />
                                        </div>
                                        <div className="content">
                                            <div className="fs-14 text-gray-light mb-1 fw-medium">
                                                Email
                                            </div>
                                            <a href={`mailto:${contractor.email}`} className="fw-semibold text-dark">
                                                {contractor.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="icon-box">
                                        <div className="icon1">
                                            <Image
                                                src="/assets/img/icons/call-dark.svg"
                                                width={24}
                                                height={24}
                                                alt="Icon"
                                            />
                                        </div>
                                        <div className="content">
                                            <div className="fs-14 text-gray-light mb-1 fw-medium">
                                                Phone
                                            </div>
                                            <a href={`tel:${contractor.phone}`} className="fw-semibold text-dark">
                                                {contractor.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="buttons d-flex align-items-center gap-3 flex-wrap">
                                <Link
                                    href={{
                                        pathname: '/messages',
                                        query: {
                                            userId: contractor.id,
                                            name: contractor.name,
                                            email: contractor.email,
                                            phone: contractor.phone,
                                            companyName: contractor.company_name,
                                            average_rating: contractor.average_rating,
                                            rating_count: contractor.ratings_count,
                                        },
                                    }}
                                    className="btn btn-primary rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                >
                                    <Image src="/assets/img/icons/chat-dark.svg" width={24} height={24} alt="Chat" />
                                    <span className="fs-18">Chat Now</span>
                                </Link>
                                <a
                                    href={`mailto:${contractor.email}`}
                                    className="btn btn-primary rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                >
                                    <Image src="/assets/img/icons/message-dark.svg" width={24} height={24} alt="Email" />
                                    <span className="fs-18">Email</span>
                                </a>
                                <a
                                    href={`tel:${contractor.phone}`}
                                    className="btn btn-primary rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                >
                                    <Image src="/assets/img/icons/call-dark.svg" width={24} height={24} alt="Call" />
                                    <span className="fs-18">Phone</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}