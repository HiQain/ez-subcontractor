'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/free-trial.css';

interface Project {
    id: number;
    city: string;
    state: string;
    description: string;
    status: string;
    created_at: string;
    category: {
        name: string;
    };
    contact_options: ('email' | 'phone' | 'chat')[];
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        company_name: string;
        profile_image_url: string;
        zip: string;
    };
}

interface Category {
    id: string;
    name: string;
}

interface Ad {
    id: number;
    orientation: 'horizontal' | 'vertical';
    description: string;
    image: string;
    redirect_url: string;
    advertiser: {
        name: string;
        company_name: string;
        profile_image_url: string;
    };
}

export default function DashboardSubContractor() {
    const router = useRouter();
    const leftSliderRef = useRef<Slider | null>(null);

    // 🔹 Slider settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
    };
    const sliderSettingsRight = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
    };

    // 🔹 NEW: Banner images state (API-ready)
    const [horizontalAds, setHorizontalAds] = useState<Ad[]>([]);
    const [verticalAds, setVerticalAds] = useState<Ad[]>([]);
    const [adsLoading, setAdsLoading] = useState(true);
    const [adsError, setAdsError] = useState<string | null>(null);
    const [profileLoaded, setProfileLoaded] = useState(false);

    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

    // 🔹 Rest of your existing state
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<number[]>([]);
    const [savedproject, setSavedproject] = useState<Set<number>>(new Set());
    const [shouldShowSeeMore, setShouldShowSeeMore] = useState<boolean[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [workRadius, setWorkRadius] = useState(2);
    const [categoryId, setCategoryId] = useState<string>('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

    // 🔹 Toast (unchanged)
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const icon = type === 'success' ? '✅' : '❌';

        toast.innerHTML = `
            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="
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
                <button type="button" className="btn-close" style="font-size: 14px; margin-left: auto;" data-bs-dismiss="toast"></button>
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

    const fetchHorizontalAds = async () => {
        setAdsLoading(true);
        setAdsError(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads?type=horizontal`,
                { headers: { Accept: 'application/json' } }
            );

            const json = await res.json();
            if (!res.ok) throw new Error('Failed to load ads');

            setHorizontalAds(json.data || []);
        } catch (err) {
            setAdsError('Failed to load ads');
        } finally {
            setAdsLoading(false);
        }
    };

    const fetchVerticalAds = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads?type=vertical`,
                { headers: { Accept: 'application/json' } }
            );

            const json = await res.json();
            if (!res.ok) throw new Error('Failed');

            setVerticalAds(json.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const zip = localStorage.getItem('userZip');
        const radius = localStorage.getItem('userRadius');

        setWorkRadius(radius && radius !== 'null' ? parseInt(radius) : 2);

        if (zip && zip !== 'null' && zip !== 'undefined') {
            setZipCode(zip);
        } else {
            setZipCode('');
        }
    }, []);

    // 🔹 Format time ago (unchanged)
    const formatTimeAgo = (dateString: string): string => {
        const now = new Date();
        const past = new Date(dateString);
        const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `${interval} years ago`;
        if (interval === 1) return '1 year ago';

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} months ago`;
        if (interval === 1) return '1 month ago';

        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} days ago`;
        if (interval === 1) return '1 day ago';

        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} hours ago`;
        if (interval === 1) return '1 hour ago';

        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} mins ago`;
        return 'Just now';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        // 🚫 Don't await directly in useEffect — define inner async function
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                const subscriptionId = data?.data?.subscription_id;

                if (subscriptionId) {
                    localStorage.setItem('subscription', subscriptionId);
                    // ✅ Now update state or do whatever you need
                    setSubscriptionId(subscriptionId); // assuming you have useState
                }

                setProfileLoaded(true);

            } catch (error) {
                console.error('Profile fetch error:', error);
                // handle error (e.g., redirect to login, clear storage)
                setProfileLoaded(true);
            }
        };

        if (token) {
            fetchProfile(); // ✅ Call the async function
        }
    }, []); // empty dep array = runs once on mount

    // 🔹 Fetch categories (unchanged)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/specializations`, {
                    headers: { 'Accept': 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                let fetchedCategories: Category[] = [];
                if (Array.isArray(data)) {
                    fetchedCategories = data.map(item => ({ id: String(item.id), name: item.name }));
                } else if (data?.data?.specializations && Array.isArray(data.data.specializations)) {
                    fetchedCategories = data.data.specializations.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                } else if (data?.data && Array.isArray(data.data)) {
                    fetchedCategories = data.data.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                }
                setCategories(fetchedCategories);
            } catch (err) {
                console.error('Failed to load categories:', err);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 🔹 Fetch projects (unchanged)
    const fetchprojects = async (resetPage = false) => {
        const currentPage = resetPage ? 1 : page;
        if (resetPage) setPage(1);

        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (zipCode) params.append('zip', zipCode);
        params.append('radius', String(workRadius));
        if (categoryId) params.append('category_id', categoryId);
        params.append('page', String(currentPage));
        params.append('perPage', String(perPage));

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects?${params.toString()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('token');
                router.push('/auth/login');
                return;
            }

            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(data.message?.[0] || 'Failed to load projects');
            }

            const fetchedProjects = data?.data?.data || [];
            const total = data?.data?.total || 0;

            setProjects(prev => resetPage ? fetchedProjects : [...prev, ...fetchedProjects]);
            setShouldShowSeeMore(Array(fetchedProjects.length).fill(false));
            setHasMore(currentPage * perPage < total);
        } catch (err: any) {
            console.error('Fetch projects error:', err);
            setError(err.message || 'Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Toggle save/unsave (unchanged)
    const toggleSaveproject = async (projectId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const isCurrentlySaved = savedproject.has(projectId);
            const endpoint = isCurrentlySaved ? 'common/projects/unsave' : 'common/projects/save';

            const formData = new FormData();
            formData.append('project_id', projectId.toString());

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: formData,
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('token');
                router.push('/auth/login');
                return;
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message?.[0] || `Failed to ${isCurrentlySaved ? 'unsave' : 'save'} project`);
            }

            setSavedproject(prev => {
                const newSet = new Set(prev);
                if (isCurrentlySaved) {
                    newSet.delete(projectId);
                    showToast('Project removed from saved list', 'success');
                } else {
                    newSet.add(projectId);
                    showToast('Project saved successfully!', 'success');
                }
                return newSet;
            });
        } catch (err: any) {
            console.error(`${savedproject.has(projectId) ? 'Unsave' : 'Save'} project error:`, err);
            showToast(err.message || `Failed to ${savedproject.has(projectId) ? 'unsave' : 'save'} project.`, 'error');
        }
    };

    // 🔹 Search debounce (unchanged)
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            fetchprojects(true);
        }, 500);
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchTerm, zipCode, workRadius, categoryId]);

    // 🔹 Initial load: Banner images + saved + projects
    useEffect(() => {
        if (!profileLoaded) return;
        fetchHorizontalAds();
        fetchVerticalAds();
    }, [profileLoaded]);

    // 🔹 Truncation check (unchanged)
    useEffect(() => {
        const checkTruncation = () => {
            if (projects.length === 0) return;

            const updated = [...shouldShowSeeMore];
            let changed = false;

            descriptionRefs.current.forEach((el, index) => {
                if (el) {
                    const style = window.getComputedStyle(el);
                    const lineHeight = parseFloat(style.lineHeight) || 20;
                    const maxHeight = lineHeight * 3;
                    const isTruncated = el.scrollHeight > maxHeight + 2;

                    if (isTruncated !== updated[index]) {
                        updated[index] = isTruncated;
                        changed = true;
                    }
                }
            });

            if (changed) {
                setShouldShowSeeMore(updated);
            }
        };

        const timer = setTimeout(checkTruncation, 0);
        return () => clearTimeout(timer);
    }, [projects, expanded]);

    // 🔹 Toggle description (unchanged)
    const toggleExpand = (index: number) => {
        setExpanded(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    // 🔹 Load more (unchanged)
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
            fetchprojects();
        }
    };

    // 🔹 Reset filters (unchanged)
    const handleResetFilters = () => {
        setSearchTerm('');
        setZipCode('');
        setWorkRadius(2);
        setCategoryId('');
        setPage(1);
    };

    const leftAds = horizontalAds.slice(0, Math.ceil(horizontalAds.length / 2));

    const rightAds = horizontalAds.filter(ad => !leftAds.includes(ad));

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec trial position-static">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                {adsLoading ? (
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-light rounded-4"
                                        style={{ height: '352px' }}
                                    >
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading banner...</span>
                                        </div>
                                    </div>
                                ) : adsError ? (
                                    <div className="alert alert-warning">{adsError}</div>
                                ) : (
                                    <Slider {...sliderSettingsRight}>
                                        {leftAds.map(ad => (
                                            <a
                                                key={ad.id}
                                                href={ad.redirect_url}
                                                target="_blank"
                                                className="d-block text-decoration-none text-dark"
                                            >
                                                <div className="bg-white rounded-4 overflow-hidden border">

                                                    {/* Image */}
                                                    <div style={{ height: '326px', position: 'relative', borderBottom: '1px solid #e9ecef' }}>
                                                        <Image
                                                            src={ad.image}
                                                            alt="Ad"
                                                            fill
                                                            className="img-fluid"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>

                                                    {/* Content below image */}
                                                    <div className="p-3">

                                                        {/* Profile + Company */}
                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                            <Image
                                                                src={
                                                                    ad.advertiser.profile_image_url ||
                                                                    '/assets/img/profile-placeholder.webp'
                                                                }
                                                                width={40}
                                                                height={40}
                                                                className="rounded-circle"
                                                                alt=""
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                            <div>
                                                                <p className="mb-0 fw-bold">
                                                                    {ad.advertiser.company_name}
                                                                </p>
                                                                <p className="mb-0 text-muted fs-13">
                                                                    {ad.advertiser.name}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Caption */}
                                                        {ad.description && (
                                                            <p className="mb-0 text-muted fs-14">
                                                                {ad.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </Slider>
                                )}
                            </div>
                            <div className="col-lg-6">
                                {adsLoading ? (
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-light rounded-4"
                                        style={{ height: '352px' }}
                                    >
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading banner...</span>
                                        </div>
                                    </div>
                                ) : adsError ? (
                                    <div className="alert alert-warning">{adsError}</div>
                                ) : (
                                    <Slider {...sliderSettingsRight}>
                                        {rightAds.map(ad => (
                                            <a
                                                key={ad.id}
                                                href={ad.redirect_url}
                                                target="_blank"
                                                className="d-block text-decoration-none text-dark"
                                            >
                                                <div className="bg-white rounded-4 overflow-hidden border">

                                                    {/* Image */}
                                                    <div style={{ height: '326px', position: 'relative', borderBottom: '1px solid #e9ecef' }}>
                                                        <Image
                                                            src={ad.image}
                                                            alt="Ad"
                                                            fill
                                                            className="img-fluid"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>

                                                    {/* Content below image */}
                                                    <div className="p-3">

                                                        {/* Profile + Company */}
                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                            <Image
                                                                src={
                                                                    ad.advertiser.profile_image_url ||
                                                                    '/assets/img/profile-placeholder.webp'
                                                                }
                                                                width={40}
                                                                height={40}
                                                                className="rounded-circle"
                                                                alt=""
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                            <div>
                                                                <p className="mb-0 fw-bold">
                                                                    {ad.advertiser.company_name}
                                                                </p>
                                                                <p className="mb-0 text-muted fs-13">
                                                                    {ad.advertiser.name}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Caption */}
                                                        {ad.description && (
                                                            <p className="mb-0 text-muted fs-14">
                                                                {ad.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </Slider>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="filter-sec">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-xl-3">
                                <span className="d-block mb-3 fw-semibold fs-4">Filters</span>

                                <div className="input-wrapper mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <span className="d-block mb-2 fw-medium">Zip Code</span>
                                <input
                                    type="text"
                                    placeholder="29391"
                                    className="form-control mb-3"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />

                                <div className="d-none">
                                    <span className="d-block mb-2 fw-medium">Category</span>
                                    <div className="input-wrapper d-flex flex-column position-relative w-100 mb-3">
                                        <select
                                            className="form-control"
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            disabled={categoriesLoading}
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <span className="d-block mb-2 fw-medium">Work Radius</span>
                                <div className="range-wrapper mb-5">
                                    <div className="range-container">
                                        <div className="slider-wrap">
                                            <input
                                                type="range"
                                                min="0"
                                                max="500"
                                                value={workRadius}
                                                onChange={(e) => setWorkRadius(Number(e.target.value))}
                                                className="range-slider"
                                            />
                                            <div
                                                className="range-value"
                                                style={{
                                                    left: `${(workRadius / 500) * 100}%`,
                                                }}
                                            >
                                                {workRadius} miles
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="min">0 miles</span>
                                        <span className="max">500 miles</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-dark text-center justify-content-center btn-sm w-100 mb-4"
                                    onClick={handleResetFilters}
                                >
                                    Clear
                                </button>

                                <div className="slider overflow-hidden rounded-4">
                                    <Slider ref={leftSliderRef} {...sliderSettings}>
                                        {verticalAds.map(ad => (
                                            <a
                                                key={ad.id}
                                                href={ad.redirect_url}
                                                target="_blank"
                                                className="d-block px-1 text-decoration-none text-dark"
                                            >
                                                <div className="bg-white rounded-4 overflow-hidden border h-100">

                                                    {/* Image */}
                                                    <div
                                                        style={{
                                                            height: '326px',
                                                            position: 'relative',
                                                            borderBottom: '1px solid #e9ecef'
                                                        }}
                                                    >
                                                        <Image
                                                            src={ad.image}
                                                            alt="Ad"
                                                            fill
                                                            className="img-fluid"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>

                                                    {/* Content BELOW image (vertical style preserved) */}
                                                    <div className="p-3">

                                                        {/* Profile + Company */}
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <Image
                                                                src={
                                                                    ad.advertiser.profile_image_url ||
                                                                    '/assets/img/profile-placeholder.webp'
                                                                }
                                                                width={35}
                                                                height={35}
                                                                className="rounded-circle"
                                                                alt=""
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                            <div>
                                                                <p className="mb-0 fw-bold fs-14">
                                                                    {ad.advertiser.company_name}
                                                                </p>
                                                                <p className="mb-0 text-muted fs-13">
                                                                    {ad.advertiser.name}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Caption (separate, niche) */}
                                                        {ad.description && (
                                                            <p className="mb-0 text-muted fs-14">
                                                                {ad.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </Slider>
                                </div>
                            </div>

                            {/* Projects Column (unchanged) */}
                            <div className="col-xl-9">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="d-block fw-semibold fs-4 text-dark">Projects</span>
                                    <small className="text-muted">
                                        {projects.length} of {loading ? '...' : 'many'} projects
                                    </small>
                                </div>

                                {loading && page === 1 ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading projects...</p>
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
                                ) : projects.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Image
                                            src="/assets/img/post.webp"
                                            width={120}
                                            height={120}
                                            alt="No projects"
                                            className="mb-3"
                                        />
                                        <p className="text-muted">No projects match your filters.</p>
                                    </div>
                                ) : (
                                    <>
                                        {projects.map((project, index) => (
                                            <div key={project.id} className="posted-card posted-card-1 custom-card mb-3">
                                                <div className="topbar mb-2 d-flex justify-content-between">
                                                    {subscriptionId ? (
                                                        <button
                                                            className="title p-0 border-0 bg-transparent text-start text-capitalize"
                                                            onClick={() => {
                                                                localStorage.setItem('project-id', String(project.id));
                                                                router.push('/subcontractor/project-details');
                                                            }}
                                                        >
                                                            {project.city}, {project.state}
                                                        </button>
                                                    ) : (
                                                        <div className="title text-capitalize">{project.city}, {project.state}</div>
                                                    )}
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="date">{formatTimeAgo(project.created_at)}</div>
                                                        <button
                                                            className={`icon bg-white ${savedproject.has(project.id) ? 'Saved bg-primary' : 'Save'}`}
                                                            onClick={() => toggleSaveproject(project.id)}
                                                            aria-label={savedproject.has(project.id) ? 'Remove from saved' : 'Save project'}
                                                        >
                                                            <Image
                                                                src={
                                                                    savedproject.has(project.id)
                                                                        ? '/assets/img/bookmark-filled.svg'
                                                                        : '/assets/img/bookmark-outline.svg'
                                                                }
                                                                width={16}
                                                                height={16}
                                                                alt="save"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="description-wrapper mb-2 position-relative">
                                                    <p
                                                        className={`description mb-0 ${expanded.includes(index) ? 'expanded' : 'collapsed'
                                                            }`}
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: expanded.includes(index) ? 'unset' : 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxHeight: expanded.includes(index) ? 'none' : 'calc(1.5em * 3)',
                                                            transition: 'max-height 0.2s ease',
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: project.description.replace(/<[^>]*>/g, '').trim() || 'No description provided.'
                                                        }}
                                                    />
                                                </div>

                                                {shouldShowSeeMore[index] && (
                                                    <button
                                                        className="see-more-btn d-block"
                                                        onClick={() => toggleExpand(index)}
                                                    >
                                                        {expanded.includes(index) ? 'See less' : 'See more'}
                                                    </button>
                                                )}
                                                {subscriptionId &&
                                                    (
                                                        <div className="bottom-bar">
                                                            <div className="left">
                                                                {project.user?.profile_image_url ? (
                                                                    <Image
                                                                        src={project.user?.profile_image_url}
                                                                        width={40}
                                                                        height={40}
                                                                        alt="P Icon"
                                                                        loading="lazy"
                                                                        className="rounded-circle"
                                                                    />
                                                                ) : (
                                                                    <Image
                                                                        src="/assets/img/placeholder-round.png"
                                                                        width={40}
                                                                        height={40}
                                                                        alt="P Icon"
                                                                        loading="lazy"
                                                                        className="rounded-circle"
                                                                    />
                                                                )}
                                                                <p className="mb-0 fw-semibold">{project.user?.company_name || ''}</p>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <button onClick={() => {
                                                                    localStorage.setItem('project-id', String(project.id));
                                                                    router.push('/subcontractor/project-details');
                                                                }} className="btn btn-primary me-2 btn-sm py-1 px-4">
                                                                    View More
                                                                </button>
                                                                {
                                                                    project.user && (
                                                                        <div className="social-icons">
                                                                            {project.contact_options?.includes('email') && project.user?.email && (
                                                                                <Link href={'mailto:' + project.user?.email} className="icon">
                                                                                    <Image
                                                                                        src={`/assets/img/icons/message-white.svg`}
                                                                                        width={20}
                                                                                        height={20}
                                                                                        alt="Social Icon"
                                                                                        loading="lazy"
                                                                                    />
                                                                                </Link>
                                                                            )}

                                                                            {
                                                                                project.contact_options?.includes('chat') && (
                                                                                    <Link href={{
                                                                                        pathname: '/messages',
                                                                                        query: {
                                                                                            userId: project.user.id,
                                                                                            name: project.user.name,
                                                                                            email: project.user.email,
                                                                                            phone: project.user.phone,
                                                                                            companyName: project.user.company_name,
                                                                                        },
                                                                                    }} className="icon">
                                                                                        <Image
                                                                                            src="/assets/img/icons/Chat.svg"
                                                                                            width={20}
                                                                                            height={20}
                                                                                            alt="Social Icon"
                                                                                            loading="lazy"
                                                                                        />
                                                                                    </Link>
                                                                                )
                                                                            }

                                                                            {project.contact_options?.includes('phone') && project.user?.phone && (
                                                                                <Link href={'mailto:' + project.user?.phone} className="icon">
                                                                                    <Image
                                                                                        src={`/assets/img/icons/call-white.svg`}
                                                                                        width={20}
                                                                                        height={20}
                                                                                        alt="Social Icon"
                                                                                        loading="lazy"
                                                                                    />
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ))}

                                        {hasMore && (
                                            <button
                                                type="button"
                                                className="btn btn-primary mx-auto mt-4"
                                                onClick={handleLoadMore}
                                                disabled={loading}
                                            >
                                                {loading ? 'Loading...' : 'Load More'}
                                            </button>
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