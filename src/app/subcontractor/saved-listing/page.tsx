'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import SidebarSubcontractor from "../../components/SidebarSubcontractor";
import { showToast } from '../../../utils/appToast';

interface Project {
    id: number;
    city: string;
    state: string;
    street: string;
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

export default function SavedListingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [expanded, setExpanded] = useState<number[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [savedproject, setSavedproject] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shouldShowSeeMore, setShouldShowSeeMore] = useState<boolean[]>([]);
    const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW
    const [logoutLoading, setLogoutLoading] = useState(false);

    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

    const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);


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

            } catch (error) {
                console.error('Profile fetch error:', error);
                // handle error (e.g., redirect to login, clear storage)
            }
        };

        if (token) {
            fetchProfile(); // ✅ Call the async function
        }
    }, []); // empty dep array = runs once on mount

    // 🔁 Fetch saved projects
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const fetchSavedProjects = async () => {
            try {
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

                interface SavedProject {
                    id: number | string;
                    city: string;
                    state: string;
                    description: string;
                    status: string;
                    created_at: string;
                    category: {
                        name: string;
                    };
                }

                const fetchedProjects: SavedProject[] = data.data?.projects || [];

                setProjects(fetchedProjects as Project[]);
                setShouldShowSeeMore(Array(fetchedProjects.length).fill(false));

                const savedIds = new Set(
                    fetchedProjects.map(p => typeof p.id === 'string' ? parseInt(p.id) : Number(p.id))
                );
                setSavedproject(savedIds);

            } catch (err: any) {
                console.error('Fetch saved projects error:', err);
                setError(err.message || 'Failed to load saved projects. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchSavedProjects();
    }, [router]);

    // 🔹 Filter projects based on search
    const filteredProjects = projects.filter(project => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const matchesCity = project.city.toLowerCase().includes(query);
        const matchesState = project.state.toLowerCase().includes(query);
        const matchesCategory = project.category.name.toLowerCase().includes(query);
        const matchesDescription = project.description.toLowerCase().includes(query);

        return matchesCity || matchesState || matchesCategory || matchesDescription;
    });

    // 🔁 Re-check truncation when filtered list changes
    useEffect(() => {
        const checkTruncation = () => {
            if (filteredProjects.length === 0) return;

            const updated = [...shouldShowSeeMore];
            let changed = false;

            descriptionRefs.current.forEach((el, index) => {
                if (el && index < filteredProjects.length) {
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
    }, [filteredProjects, expanded]);

    const toggleExpand = (index: number) => {
        setExpanded(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const timeAgo = (dateString: string): string => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

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
                } else {
                    newSet.add(projectId);
                }
                return newSet;
            });

            if (isCurrentlySaved) {
                // 🔥 REMOVE project from list
                setProjects(prev => prev.filter(p => p.id !== projectId));
                showToast('Project removed from saved list', 'success');
            } else {
                showToast('Project saved successfully!', 'success');
            }

        } catch (err: any) {
            console.error(`${savedproject.has(projectId) ? 'Unsave' : 'Save'} project error:`, err);
            showToast(err.message || `Failed to ${savedproject.has(projectId) ? 'unsave' : 'save'} project.`, 'error');
        }
    };

    // 🔹 Reset search
    const handleResetSearch = () => {
        setSearchQuery('');
    };

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

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">
                            {/* SidebarSubcontractor — always visible */}
                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
                            </div>

                            {/* Right Bar — loading or content */}
                            <div className="col-xl-9">
                                {loading ? (
                                    <div className="right-bar d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="right-bar">
                                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-5">
                                            <div className="change fw-semibold fs-4">Saved Listing</div>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="form-wrapper mt-0 mb-0 d-flex flex-nowrap"
                                                    style={{ minWidth: 'clamp(200px,34vw,335px)' }}
                                                >
                                                    <Image
                                                        src="/assets/img/icons/search-gray.svg"
                                                        width={18}
                                                        height={18}
                                                        alt="Search Icon"
                                                        loading="lazy"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Search city, state, category..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="form-control shadow-none"
                                                    />
                                                </div>
                                                {searchQuery && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={handleResetSearch}
                                                        aria-label="Clear search"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="alert alert-danger mb-4" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {filteredProjects.length === 0 ? (
                                            <div className="text-center py-5">
                                                <p>
                                                    {searchQuery
                                                        ? `No projects match "${searchQuery}".`
                                                        : 'You haven’t saved any projects yet.'}
                                                </p>
                                                {searchQuery && (
                                                    <button
                                                        className="btn btn-outline-primary mt-2"
                                                        onClick={handleResetSearch}
                                                    >
                                                        Clear Search
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            filteredProjects.map((project, index) => (
                                                <div key={project.id} className="posted-card posted-card-1 custom-card mb-3">
                                                    <div className="topbar mb-2">
                                                        {subscriptionId ? (
                                                            <button
                                                                className="title p-0 border-0 bg-transparent text-start text-capitalize"
                                                                onClick={() => {
                                                                    localStorage.setItem('project-id', String(project.id));
                                                                    router.push('/subcontractor/project-details');
                                                                }}
                                                            >
                                                                {[
                                                                    project.street,
                                                                    project.city,
                                                                    project.state
                                                                ].filter(Boolean).join(', ')}
                                                            </button>
                                                        ) : (
                                                            <div className="title text-capitalize">{[
                                                                project.street,
                                                                project.city,
                                                                project.state
                                                            ].filter(Boolean).join(', ')}</div>
                                                        )}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="date">{timeAgo(project.created_at)}</div>
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
                                                                                                zip: project.user.zip,
                                                                                            },
                                                                                        }} className="icon">
                                                                                            <Image
                                                                                                src={`/assets/img/icons/chat.svg`}
                                                                                                width={20}
                                                                                                height={20}
                                                                                                alt="Social Icon"
                                                                                                loading="lazy"
                                                                                            />
                                                                                        </Link>
                                                                                    )
                                                                                }

                                                                                {project.contact_options?.includes('phone') && project.user?.phone && (
                                                                                    <Link href={`tel:${project.user.phone}`} className="icon">
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
                                            ))
                                        )}
                                    </div>
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