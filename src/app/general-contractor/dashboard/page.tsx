'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/free-trial.css';
import Slider from 'react-slick';
import { showToast } from '../../../utils/appToast';

interface Project {
    id: number;
    city: string;
    street: string;
    state: string;
    description: string;
    status: string;
    created_at: string;
    category: {
        name: string;
    };
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

export default function DashboardPage() {
    const router = useRouter();
    const leftSliderRef = useRef<Slider | null>(null);
    const [expandedCards, setExpandedCards] = useState<number[]>([]);
    const [verticalAds, setVerticalAds] = useState<Ad[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // 🔹 Open delete modal
    const openDeleteModal = (id: number) => {
        setDeletingId(id);
        setDeleteError(null);

        import('bootstrap').then(({ Modal }) => {
            const modalEl = document.getElementById('deleteProjectModal');
            if (!modalEl) return;

            const modal = Modal.getOrCreateInstance(modalEl);
            modal.show();
        });
    };

    const closeDeleteModal = () => {
        import('bootstrap').then(({ Modal }) => {
            const modalEl = document.getElementById('deleteProjectModal');
            if (!modalEl) return;

            const modal = Modal.getInstance(modalEl);
            modal?.hide();
        });
    };

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required. Please log in.');
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/my-projects?perPage=1000000&page=1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('token');
                setError('Session expired. Please log in again.');
                router.push('/auth/login');
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message?.[0] || 'Failed to load projects');
            }

            let fetchedProjects: Project[] = [];
            if (data?.data?.projects?.data && Array.isArray(data.data.projects.data)) {
                fetchedProjects = data.data.projects.data;
            } else {
                console.warn('Unexpected API structure:', data);
            }

            setProjects(fetchedProjects);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message || 'Network error. Please try again.');
            showToast('Failed to load projects.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profileLoaded && subscriptionId) {
            fetchProjects();
        }
    }, [profileLoaded, subscriptionId]);

    // 🔹 Delete project
    const handleDelete = async () => {
        if (!deletingId) return;
        setDeleteError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/delete/${deletingId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            const responseData = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(responseData?.message || 'Failed to delete project');
            }

            setProjects(prev => prev.filter(p => p.id !== deletingId));

            // 🔹 Replaced alert with toast
            showToast('Project deleted successfully!');

            closeDeleteModal();

            fetchProjects();
        }
        catch (err: any) {
            console.error('Delete error:', err);
            setDeleteError(err.message || 'Failed to delete project.');

            // 🔹 Show error toast
            showToast(err.message || 'Failed to delete project.', 'error');
        } finally {
            setDeletingId(null);
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
        fetchVerticalAds();
    }, []);

    const getFilteredProjects = () => {
        if (activeTab === 'all') return projects;
        if (activeTab === 'hired')
            return projects.filter((p) => p.status.toLowerCase() === 'hired');
        if (activeTab === 'active')
            return projects.filter((p) => p.status.toLowerCase() === 'active');
        return [];
    };

    const groupProjectsByStreet = (projects: Project[]) => {
        return projects.reduce<Record<string, Project[]>>((acc, project) => {
            const street = project.street || 'Unknown Street';

            if (!acc[street]) {
                acc[street] = [];
            }

            acc[street].push(project);
            return acc;
        }, {});
    };

    const filteredProjects = getFilteredProjects().filter((project) => {
        if (!searchTerm.trim()) return true;

        const term = searchTerm.toLowerCase();

        return (
            project.description?.toLowerCase().includes(term) ||
            project.city?.toLowerCase().includes(term) ||
            project.street?.toLowerCase().includes(term) ||
            project.state?.toLowerCase().includes(term) ||
            project.category?.name?.toLowerCase().includes(term)
        );
    });

    const groupedProjects = groupProjectsByStreet(filteredProjects);

    const EyeIcon = ({ active }: { active: boolean }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`eye-icon ${active ? 'active' : ''}`}
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <line
                className="slash"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                style={{ stroke: active ? 'none' : 'currentColor' }}
            ></line>
        </svg>
    );

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

            {/* My Projects & Rate Subcontractor */}
            {
                profileLoaded ? (
                    subscriptionId ? (
                        <section className="banner-sec trial review mb-5">
                            <div className="container">
                                {/* ✅ My Projects */}
                                <div className="bar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-4">
                                    <div>
                                        <div className="fs-4 fw-semibold mb-4">My Projects</div>

                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 py-3">
                                            {/* Tabs */}
                                            <ul className="nav nav-tabs mb-0 w-auto" role="tablist">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                                        type="button"
                                                        onClick={() => setActiveTab('all')}
                                                    >
                                                        All ({projects.length})
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === 'hired' ? 'active' : ''}`}
                                                        type="button"
                                                        onClick={() => setActiveTab('hired')}
                                                    >
                                                        Hired ({projects.filter(p => p.status?.toLowerCase() === 'hired').length})
                                                    </button>
                                                </li>

                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                                                        type="button"
                                                        onClick={() => setActiveTab('active')}
                                                    >
                                                        Active ({projects.filter(p => p.status?.toLowerCase() === 'active').length})
                                                    </button>
                                                </li>

                                                <div className="slider"></div>
                                            </ul>

                                            {/* Search */}
                                            <div className="position-relative search-wrapper">
                                                <input
                                                    type="text"
                                                    className="form-control ps-5"
                                                    placeholder="Search projects..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                                                    🔍
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginRight: '10px' }}>
                                        <button
                                            onClick={() => router.push('/general-contractor/add-project')}
                                            className="btn btn-primary shadow-none rounded-3 d-flex align-items-center justify-content-center gap-2 px-4 py-2 fs-4 w-100 mb-2"
                                        >
                                            <Image src="/assets/img/icons/plus.svg" width={14} height={14} alt="Icon" />
                                            <span>Add Project</span>
                                        </button>
                                        <button
                                            onClick={() => router.push('/general-contractor/reviews')}
                                            className="btn btn-warning rounded-3 d-flex align-items-center gap-2 px-4 py-2 fs-4"
                                            style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
                                        >
                                            <span>Rate Subcontractor</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-9">
                                        {loading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-3">Loading your recent projects...</p>
                                            </div>
                                        ) : error ? (
                                            <div className="alert alert-warning d-flex align-items-center" role="alert">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                                </svg>
                                                <div>{error}</div>
                                            </div>
                                        ) : filteredProjects.length === 0 ? (
                                            <div className="text-center py-5">
                                                <Image
                                                    src="/assets/img/post.webp"
                                                    width={120}
                                                    height={120}
                                                    alt="No projects"
                                                    className="mb-3"
                                                />
                                                <p className="fs-5 text-muted">
                                                    {activeTab === 'all'
                                                        ? 'You don’t have any projects yet.'
                                                        : `No ${activeTab} projects found.`}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mb-4">
                                                {Object.entries(groupedProjects).map(([street, streetProjects]) => (
                                                    <div key={street} className="mb-4">

                                                        {/* 🔹 Street Heading */}
                                                        <h5 className="fw-semibold mb-3 text-custom-yellow">{street}</h5>

                                                        <div className="row">
                                                            {streetProjects.map((project, index) => (
                                                                <div className="col-12" key={project.id}>
                                                                    <div
                                                                        style={{
                                                                            borderBottom: '1px solid #dadada',
                                                                            marginBottom: '15px',
                                                                            padding: '10px 0',
                                                                        }}
                                                                    >
                                                                        {/* 🔹 Flex container: description + buttons */}
                                                                        <div className="d-flex flex-column flex-md-row align-items-start align-md-center justify-content-between gap-3">

                                                                            {/* 🔹 Description */}
                                                                            <p
                                                                                className="description mb-2 mb-md-0 text-start"
                                                                                style={{
                                                                                    flex: '1 1 70%',
                                                                                    wordBreak: 'break-word',
                                                                                    marginBottom: '0', // extra safeguard
                                                                                }}
                                                                            >
                                                                                {expandedCards.includes(index)
                                                                                    ? project.description
                                                                                    : project.description?.replace(/<[^>]*>/g, '').slice(0, 200) + '...'}
                                                                            </p>

                                                                            {/* 🔹 Buttons */}
                                                                            <div
                                                                                className="d-flex gap-2 flex-wrap justify-content-start justify-content-md-end mt-2 mt-md-0"
                                                                                style={{ flex: '1 1 30%', minWidth: '150px' }}
                                                                            >
                                                                                <button
                                                                                    className="btn btn-primary rounded-2 shadow-none"
                                                                                    onClick={() => {
                                                                                        localStorage.setItem('project-id', `${project.id}`);
                                                                                        router.push('/general-contractor/project-details');
                                                                                    }}
                                                                                    style={{ padding: '5px 12px' }}
                                                                                >
                                                                                    <EyeIcon active={true} />
                                                                                </button>

                                                                                <button
                                                                                    className="btn bg-dark rounded-2 text-white"
                                                                                    onClick={() => {
                                                                                        localStorage.setItem('project-id', `${project.id}`);
                                                                                        router.push('/general-contractor/edit-project');
                                                                                    }}
                                                                                    style={{ padding: '5px 12px' }}
                                                                                >
                                                                                    <Image
                                                                                        src="/assets/img/icons/edit.svg"
                                                                                        width={24}
                                                                                        height={24}
                                                                                        alt="Edit"
                                                                                    />
                                                                                </button>

                                                                                <button
                                                                                    className="btn bg-danger rounded-2 text-white"
                                                                                    onClick={() => openDeleteModal(project.id)}
                                                                                    style={{ padding: '5px 12px' }}
                                                                                >
                                                                                    <Image
                                                                                        src="/assets/img/icons/delete.svg"
                                                                                        width={24}
                                                                                        height={24}
                                                                                        alt="Delete"
                                                                                    />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-lg-3">
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
                                </div>
                            </div>
                        </section>
                    )
                        : (
                            /* ===== NO SUBSCRIPTION ===== */
                            <div className="text-center py-5">
                                <Image src="/assets/img/post.webp" width={120} height={120} alt="No subscription" />
                                <p className="text-muted mt-3">
                                    Please buy a subscription to view your projects.
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

            {/* Delete Modal */}
            <div
                className="modal fade"
                id="deleteProjectModal"
                tabIndex={-1}
                aria-labelledby="deleteProjectModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="deleteProjectModalLabel">
                                Delete Project
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this project? This action cannot be undone.
                            {deleteError && (
                                <div className="alert alert-danger mt-3 p-2 mb-0">
                                    {deleteError}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deletingId === null}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}