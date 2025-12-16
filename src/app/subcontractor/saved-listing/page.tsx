'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';

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

export default function SavedListingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [expanded, setExpanded] = useState<number[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [savedproject, setSavedproject] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sidebar links
    const links = [
        { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
    ];

    // 🔹 Toast notification
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
                console.log(data);
                if (!response.ok) {
                    throw new Error(data.message?.[0] || 'Failed to load saved projects');
                }

                // ✅ Explicitly type fetched projects
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

                // ✅ Convert IDs to numbers safely
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

    const toggleExpand = (index: number) => {
        setExpanded(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

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

            // Update local state
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

    // 🌀 Loading State
    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
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

    if (error) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile">
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
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark m-0">

                                        {/* Sidebar Links */}
                                        <div className="buttons-wrapper">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`custom-btn ${pathname === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image src={link.icon} width={20} height={20} alt="Icon" loading="lazy" />
                                                        <span className="text-white">{link.label}</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        width={15}
                                                        height={9}
                                                        alt="Arrow"
                                                        style={{ objectFit: 'contain' }}
                                                        loading="lazy"
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <div className="bottom-bar">
                                        <div className="buttons-wrapper">
                                            <Link href="#" className="custom-btn bg-danger" style={{ borderColor: '#DC2626' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Logout Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Logout</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    width={15}
                                                    height={9}
                                                    alt="Arrow"
                                                    style={{ objectFit: 'contain' }}
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Bar */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-5">
                                        <div className="change fw-semibold fs-4">Saved Listing</div>
                                        <div
                                            className="form-wrapper mb-0"
                                            style={{ minWidth: 'clamp(200px,34vw,335px)' }}
                                        >
                                            <Image
                                                src="/assets/img/icons/search-gray.svg"
                                                width={18}
                                                height={18}
                                                alt="Search Icon"
                                                loading="lazy"
                                            />
                                            <input type="text" placeholder="Search here" />
                                            <Image
                                                src="/assets/img/icons/voice.svg"
                                                width={18}
                                                height={18}
                                                alt="Voice Icon"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>

                                    {projects.length === 0 ? (
                                        <div className="text-center py-5">
                                            <Image
                                                src="/assets/img/no-data.svg"
                                                width={100}
                                                height={100}
                                                alt="No saved projects"
                                                className="mb-3"
                                            />
                                            <p className="text-gray-light">You haven't saved any projects yet.</p>
                                        </div>
                                    ) : (
                                        projects.map((job, index) => (
                                            <div key={job.id} className="posted-card posted-card-1 custom-card mb-3">
                                                <div className="topbar mb-2">
                                                    <div className="title">{job.city}, {job.state}</div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="date">{timeAgo(job.created_at)} {job.id}</div>
                                                        <button
                                                            className={`icon bg-white ${savedproject.has(job.id) ? 'Saved' : 'Save'}`}
                                                            onClick={() => toggleSaveproject(job.id)}
                                                            aria-label={savedproject.has(job.id) ? 'Remove from saved' : 'Save project'}
                                                        >
                                                            <Image
                                                                src={
                                                                    savedproject.has(job.id)
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

                                                {/* ✅ Render description as plain text for safety */}
                                                <p
                                                    className={`description mb-0 ${
                                                        expanded.includes(index) ? 'expanded' : ''
                                                    }`}
                                                >
                                                    {job.description.replace(/<[^>]*>/g, '').trim().substring(0, 300)}...
                                                </p>

                                                <button
                                                    className="see-more-btn d-block"
                                                    onClick={() => toggleExpand(index)}
                                                >
                                                    {expanded.includes(index) ? 'See less' : 'See more'}
                                                </button>

                                                <div className="bottom-bar">
                                                    <div className="left">
                                                        <Image
                                                            src="/assets/img/icons/p-icon.svg"
                                                            width={50}
                                                            height={50}
                                                            alt="P Icon"
                                                            loading="lazy"
                                                        />
                                                        <p className="mb-0 fs-5 fw-semibold">ProBuilds Express</p>
                                                    </div>
                                                    <div className="social-icons">
                                                        {['message-white.svg', 'chat.svg', 'call-white.svg'].map(
                                                            (icon, i) => (
                                                                <Link href="#" key={i} className="icon">
                                                                    <Image
                                                                        src={`/assets/img/icons/${icon}`}
                                                                        width={20}
                                                                        height={20}
                                                                        alt="Social Icon"
                                                                        loading="lazy"
                                                                    />
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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