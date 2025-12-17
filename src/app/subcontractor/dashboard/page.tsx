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
}

interface Category {
    id: string;
    name: string;
}

export default function DashboardSubContractor() {
    const router = useRouter();
    const sliderRef = useRef<Slider | null>(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    // 🔹 State
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<number[]>([]);
    const [savedproject, setSavedproject] = useState<Set<number>>(new Set());

    // 🔹 Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [workRadius, setWorkRadius] = useState(2); // default 2 miles
    const [categoryId, setCategoryId] = useState<string>(''); // empty = all categories
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // 🔹 Refs
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // 🔹 Toast
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

    // 🔹 Format time ago
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

    // 🔁 Fetch categories
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

    // 🔁 Fetch saved projects
    const fetchSavedproject = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/my-saved`,
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
            if (!response.ok) {
                throw new Error(data.message?.[0] || 'Failed to load saved projects');
            }

            let savedIds: number[] = [];
            if (data?.data?.projects && Array.isArray(data.data.projects)) {
                savedIds = data.data.projects.map((item: any) => Number(item.id));
            } else if (Array.isArray(data?.data)) {
                savedIds = data.data.map((item: any) => Number(item.id));
            } else if (Array.isArray(data)) {
                savedIds = data.map(id => Number(id));
            }

            setSavedproject(new Set(savedIds));
        } catch (err: any) {
            console.error('Fetch saved projects error:', err);
        }
    };

    // 🔁 Fetch projects with filters
    const fetchprojects = async (resetPage = false) => {
        const currentPage = resetPage ? 1 : page;
        if (resetPage) setPage(1);

        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (zipCode) params.append('zip', zipCode);
        params.append('radius', String(workRadius)); // ✅ Matches Postman
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
            if (!response.ok) {
                throw new Error(data.message?.[0] || 'Failed to load projects');
            }

            const fetchedProjects = data?.data?.data || [];
            const total = data?.data?.total || 0;

            setProjects(prev => resetPage ? fetchedProjects : [...prev, ...fetchedProjects]);
            setHasMore(currentPage * perPage < total);
        } catch (err: any) {
            console.error('Fetch projects error:', err);
            setError(err.message || 'Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Toggle save/unsave
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

    // 🔹 Search debounce
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            fetchprojects(true); // reset to page 1 on new search
        }, 500);
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchTerm, zipCode, workRadius, categoryId]);

    // 🔹 Initial load: categories + saved + projects
    useEffect(() => {
        Promise.all([
            fetchSavedproject(),
            fetchprojects(true), // initial load with page=1
        ]);
    }, []);

    // 🔹 Toggle description
    const toggleExpand = (index: number) => {
        setExpanded(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    // 🔹 Load more
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
            fetchprojects(); // appends next page
        }
    };

    // 🔹 Reset filters
    const handleResetFilters = () => {
        setSearchTerm('');
        setZipCode('');
        setWorkRadius(2);
        setCategoryId('');
        setPage(1);
        // Triggers fetch via useEffect (debounce)
    };

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                {/* Banner Section */}
                <section className="banner-sec trial position-static">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="slider">
                                    <Image
                                        src="/assets/img/dashboard-free-trial-img.webp"
                                        width={800}
                                        height={600}
                                        alt="Section Image"
                                        className="img-fluid w-100 h-100"
                                        style={{
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 35px 0 #00000025',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div
                                    className="banner-wrapper"
                                    style={{ backgroundImage: "url('/assets/img/free-trial-img2.webp')" }}
                                >
                                    <div className="main-slider">
                                        <Slider ref={sliderRef} {...settings}>
                                            {[1, 2].map((_, i) => (
                                                <div key={i} className="slider-item">
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <div className="icon bg-primary">
                                                            <Image
                                                                src="/assets/img/icons/camera.svg"
                                                                width={14}
                                                                height={10}
                                                                alt="icon"
                                                            />
                                                        </div>
                                                        <div style={{ fontSize: '14px' }} className="content text-white fw-medium">
                                                            Online Webinar
                                                        </div>
                                                    </div>
                                                    <h2 className="main-title text-primary">50% Increase Sales</h2>
                                                    <div className="desc fw-medium text-white mb-3">
                                                        Present a professional estimate with your logo and company name and
                                                        colors.
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                    <div className="slider-controls d-flex align-items-center justify-content-between">
                                        <div className="custom-arrows d-flex align-items-center gap-2">
                                            <button
                                                className="custom-prev"
                                                onClick={() => sliderRef.current?.slickPrev()}
                                            >
                                                <Image
                                                    src="/assets/img/dashboard-arrow.svg"
                                                    alt="Prev"
                                                    width={8}
                                                    height={16}
                                                />
                                            </button>
                                            <button
                                                className="custom-next"
                                                onClick={() => sliderRef.current?.slickNext()}
                                            >
                                                <Image
                                                    src="/assets/img/dashboard-arrow1.svg"
                                                    alt="Next"
                                                    width={8}
                                                    height={16}
                                                />
                                            </button>
                                        </div>
                                        <div className="icon">
                                            <Image
                                                src="/assets/img/icons/search-icon1.svg"
                                                alt="Search"
                                                width={14}
                                                height={14}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter + Projects Section */}
                <section className="filter-sec">
                    <div className="container">
                        <div className="row g-4">
                            {/* Filter Column */}
                            <div className="col-xl-3">
                                <span className="d-block mb-3 fw-semibold fs-4">Filters</span>

                                {/* Search */}
                                <div className="input-wrapper mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Zip Code */}
                                <span className="d-block mb-2 fw-medium">Zip Code</span>
                                <input
                                    type="text"
                                    placeholder="29391"
                                    className="form-control mb-3"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />

                                {/* Category */}
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

                                {/* Work Radius */}
                                <span className="d-block mb-2 fw-medium">Work Radius</span>
                                <div className="range-wrapper mb-5">
                                    <div className="range-container">
                                        <div className="slider-wrap">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={workRadius}
                                                onChange={(e) => setWorkRadius(Number(e.target.value))}
                                                className="range-slider"
                                            />
                                            <div className="range-value">{workRadius} miles</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="min">0 miles</span>
                                        <span className="max">100 miles</span>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100 mb-3"
                                    onClick={handleResetFilters}
                                >
                                    Reset Filters
                                </button>

                                <Image
                                    src="/assets/img/filter-img.webp"
                                    width={400}
                                    height={400}
                                    alt="Filter Image"
                                    className="img-fluid w-100"
                                    style={{ borderRadius: '25px', boxShadow: '0 4px 85px 0px #00000025' }}
                                />
                            </div>

                            {/* Projects Column */}
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
                                        <button
                                            className="btn btn-outline-primary mt-2"
                                            onClick={handleResetFilters}
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {projects.map((project, index) => (
                                            <div key={project.id} className="posted-card posted-card-1 custom-card mb-3">
                                                <div className="topbar mb-2 d-flex justify-content-between">
                                                    <button
                                                        className="title p-0 border-0 bg-transparent text-start"
                                                        onClick={() => {
                                                            localStorage.setItem('project-id', String(project.id));
                                                            router.push('/subcontractor/project-details');
                                                        }}
                                                    >
                                                        {project.city}, {project.state}
                                                    </button>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="date">{formatTimeAgo(project.created_at)}</div>
                                                        <button
                                                            className={`icon bg-white ${savedproject.has(project.id) ? 'Saved' : 'Save'}`}
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

                                                <p
                                                    className={`description mb-0 ${
                                                        expanded.includes(index) ? 'expanded' : ''
                                                    }`}
                                                >
                                                    {project.description.replace(/<[^>]*>/g, '').slice(0, 150) || 'No description provided.'}
                                                    {!expanded.includes(index) && project.description.length > 150 && '...'}
                                                </p>

                                                <button
                                                    className="see-more-btn d-block"
                                                    onClick={() => toggleExpand(index)}
                                                >
                                                    {expanded.includes(index) ? 'See less' : 'See more'}
                                                </button>
                                            </div>
                                        ))}

                                        {hasMore && (
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100 mt-4"
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