'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SidebarSubcontractor from '../../components/SidebarAffiliate';
import '../../../styles/profile.css';
import '../../../styles/free-trial.css';

interface Contractor {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    zip: string;
    work_radius: string;
    profile_image_url: string | null;
    average_rating: string;
    ratings_count: string;
    role: string;
}

export default function SavedContractors() {
    const router = useRouter();
    const [savedContractors, setSavedContractors] = useState<Contractor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

    // 🔹 Toast (same as AffiliateDashboard)
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

    // 🔹 Fetch saved contractors
    const fetchSavedContractors = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors/my-saved`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                router.push('/auth/login');
                return;
            }

            const data = await response.json();

            if (response.ok && Array.isArray(data?.data)) {
                // Assume API returns full contractor objects in `data`
                const contractors = data.data.map((item: any) => ({
                    id: item.id,
                    name: item.name || item.user?.name || '',
                    email: item.email || item.user?.email || '',
                    phone: item.phone || item.user?.phone || '',
                    company_name: item.company_name || item.user?.company_name || '',
                    zip: item.zip || '',
                    work_radius: item.work_radius || '0',
                    profile_image_url: item.profile_image_url || item.user?.profile_image_url || null,
                    average_rating: item.average_rating || '0',
                    ratings_count: item.ratings_count || '0',
                    role: item.role || 'Contractor',
                }));

                setSavedContractors(contractors);
                setSavedIds(new Set(contractors.map((c: Contractor) => c.id)));
            } else {
                throw new Error(data.message?.[0] || 'No saved contractors found.');
            }
        } catch (err: any) {
            console.error('Fetch saved contractors error:', err);
            setError(err.message || 'Failed to load saved contractors.');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Toggle Save/Unsave (same as dashboard)
    const toggleSave = async (contractorId: number) => {
        const isCurrentlySaved = savedIds.has(contractorId);
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

            if (!response.ok) throw new Error();

            // ✅ Optimistic update
            const newSavedIds = new Set(savedIds);
            if (isCurrentlySaved) {
                newSavedIds.delete(contractorId);
                setSavedContractors(prev => prev.filter(c => c.id !== contractorId));
                showToast('Contractor removed from saved list', 'success');
            } else {
                newSavedIds.add(contractorId);
                // Optionally refetch or add — we’ll re-fetch for consistency
                await fetchSavedContractors();
                return; // avoid UI race
            }
            setSavedIds(newSavedIds);

        } catch (err) {
            console.error('Toggle save error:', err);
            showToast(`Failed to ${isCurrentlySaved ? 'unsave' : 'save'} contractor.`, 'error');
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

    const formatRating = (rating: string) => {
        const num = parseFloat(rating);
        return isNaN(num) ? 'N/A' : num.toFixed(1);
    };

    useEffect(() => {
        fetchSavedContractors();
    }, []);

    // 🔹 Logout (unchanged)
    const [logoutLoading, setLogoutLoading] = useState(false);
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

    const sidebarLinks = [
        { name: 'Change Password', href: '/affiliate/change-password', icon: '/assets/img/icons/saved.svg' },
        { name: 'Saved Contractors', href: '/affiliate/saved-contractors', icon: '/assets/img/icons/saved.svg' },
        { name: 'My Subscription', href: '/affiliate/my-subscription-old', icon: '/assets/img/icons/saved.svg' },
        { name: 'Transaction History', href: '/affiliate/transaction-history-old', icon: '/assets/img/icons/saved.svg' },
        { name: 'Saved Cards', href: '/affiliate/saved-cards', icon: '/assets/img/icons/saved.svg' },
    ];

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile filter-sec">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
                            </div>

                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="topbar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
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
                                            <span className="fs-4 fw-semibold">Saved Contractors</span>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2">Loading saved contractors...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-warning d-flex align-items-center" role="alert">
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
                                    ) : savedContractors.length === 0 ? (
                                        <div className="text-center py-5">
                                            <Image
                                                src="/assets/img/post.webp"
                                                width={120}
                                                height={120}
                                                alt="No saved contractors"
                                                className="mb-3"
                                            />
                                            <p className="text-muted">You haven’t saved any contractors yet.</p>
                                            <Link href="/affiliate/dashboard" className="btn btn-primary mt-3">
                                                Browse Contractors
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="row g-3">
                                            {savedContractors.map((contractor) => (
                                                <div key={contractor.id} className="col-lg-4 col-md-6">
                                                    <div className="filter-card">
                                                        <button
                                                            className={`icon bg-white ${savedIds.has(contractor.id) ? 'saved' : 'save'}`}
                                                            aria-label={savedIds.has(contractor.id) ? 'Remove from saved' : 'Save contractor'}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleSave(contractor.id);
                                                            }}
                                                        >
                                                            <Image
                                                                src={
                                                                    savedIds.has(contractor.id)
                                                                        ? '/assets/img/bookmark-filled.svg'
                                                                        : '/assets/img/bookmark-outline.svg'
                                                                }
                                                                width={16}
                                                                height={16}
                                                                alt="save"
                                                            />
                                                        </button>

                                                        <button className="btn border-0 mx-auto d-block"
                                                                onClick={(e) => {
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
                                                                style={{objectFit: 'cover'}}
                                                            />
                                                            <div
                                                                style={{color: '#333342'}}
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