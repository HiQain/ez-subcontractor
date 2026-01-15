'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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

// interface Ad {
//     id: number;
//     orientation: 'horizontal' | 'vertical';
//     description: string;
//     image: string;
//     redirect_url: string;
//     advertiser: {
//         name: string;
//         company_name: string;
//         profile_image_url: string;
//     };
// }

export default function DashboardPage() {
    const router = useRouter();
    const [expandedCards, setExpandedCards] = useState<number[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // const [adsLoading, setAdsLoading] = useState(true);
    // const [adsError, setAdsError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    // const [horizontalAds, setHorizontalAds] = useState<Ad[]>([]);

    // const leftSliderRef = useRef<Slider | null>(null);

    // const sliderSettings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 600,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     autoplay: true,
    //     autoplaySpeed: 4000,
    //     pauseOnHover: true,
    // };
    // const sliderSettingsRight = {
    //     dots: false,
    //     infinite: true,
    //     speed: 600,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     autoplay: true,
    //     autoplaySpeed: 4000,
    //     pauseOnHover: true,
    // };

    // 🔹 Show non-blocking thank-you toast
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

    // const fetchHorizontalAds = async () => {
    //     setAdsLoading(true);
    //     setAdsError(null);

    //     try {
    //         const res = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads?type=horizontal`,
    //             { headers: { Accept: 'application/json' } }
    //         );

    //         const json = await res.json();
    //         if (!res.ok) throw new Error('Failed to load ads');

    //         setHorizontalAds(json.data || []);
    //     } catch (err) {
    //         setAdsError('Failed to load ads');
    //     } finally {
    //         setAdsLoading(false);
    //     }
    // };

    // 🔹 Toggle card expansion

    const toggleCard = (index: number) => {
        setExpandedCards(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

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
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/my-projects?perPage=100&page=1`,
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
        fetchProjects();
    }, [router]);

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

    // useEffect(() => {
    //     fetchHorizontalAds();
    // }, []);

    // const leftAds = horizontalAds.slice(0, Math.ceil(horizontalAds.length / 2));

    // const rightAds = horizontalAds.filter(ad => !leftAds.includes(ad));

    const getFilteredProjects = () => {
        if (activeTab === 'all') return projects;
        if (activeTab === 'hired')
            return projects.filter((p) => p.status.toLowerCase() === 'hired');
        if (activeTab === 'active')
            return projects.filter((p) => p.status.toLowerCase() === 'active');
        return [];
    };

    const filteredProjects = getFilteredProjects();

    return (
        <div className="sections overflow-hidden">
            <Header />

            {/* <section className="banner-sec trial position-static">
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

                                                <div style={{ height: '326px', position: 'relative', borderBottom: '1px solid #e9ecef' }}>
                                                    <Image
                                                        src={ad.image}
                                                        alt="Ad"
                                                        fill
                                                        className="img-fluid"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>

                                                <div className="p-3">

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

                                                <div style={{ height: '326px', position: 'relative', borderBottom: '1px solid #e9ecef' }}>
                                                    <Image
                                                        src={ad.image}
                                                        alt="Ad"
                                                        fill
                                                        className="img-fluid"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>

                                                <div className="p-3">

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
            </section> */}

            {/* My Projects & Rate Subcontractor */}
            <section className="banner-sec trial review mb-5">
                <div className="container">
                    {/* ✅ My Projects */}
                    <div className="bar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-4">
                        <div className="fs-4 fw-semibold">My Projects</div>
                        <button
                            onClick={() => router.push('/general-contractor/add-project')}
                            className="btn btn-primary rounded-3 d-flex align-items-center gap-2"
                        >
                            <Image src="/assets/img/icons/plus.svg" width={12} height={12} alt="Icon" />
                            <span>Add Project</span>
                        </button>
                    </div>

                    <ul className="nav nav-tabs mb-4" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveTab('all')}
                            >
                                All ({projects.length})
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'hired' ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveTab('hired')}
                            >
                                Hired (
                                {
                                    projects.filter((p) => p.status.toLowerCase() === 'hired')
                                        .length
                                }
                                )
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveTab('active')}
                            >
                                Active (
                                {
                                    projects.filter((p) => p.status.toLowerCase() === 'active')
                                        .length
                                }
                                )
                            </button>
                        </li>
                        <div className="slider"></div>
                    </ul>

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
                        <div className="row g-3 mb-4">
                            {filteredProjects.map((project, index) => (
                                <div className="col-lg-6" key={project.id}>
                                    <div className="project-card call-dark custom-card">
                                        <div className="bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                                            <div className="fs-5 fw-semibold">
                                                {project.category?.name || `${project.city}, ${project.state}`}
                                            </div>
                                            <span
                                                className="btn p-1 ps-3 pe-3"
                                                style={{
                                                    backgroundColor: getStatusBg(project.status),
                                                    color: getStatusColor(project.status),
                                                }}
                                            >
                                                {getStatusLabel(project.status)}
                                            </span>
                                        </div>
                                        <p className="description mb-3">
                                            {expandedCards.includes(index)
                                                ? project.description
                                                : project.description?.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
                                        </p>
                                        <button
                                            className="see-more-btn mb-3 d-block d-none"
                                            onClick={() => toggleCard(index)}
                                        >
                                            {expandedCards.includes(index) ? 'See less' : 'See more'}
                                        </button>
                                        <div className="buttons d-flex align-items-center gap-2 flex-wrap-md">
                                            <button
                                                className="btn btn-primary rounded-3 w-100 justify-content-center"
                                                onClick={() => {
                                                    localStorage.setItem(
                                                        'project-id',
                                                        `${project.id}`
                                                    );
                                                    router.push(
                                                        '/general-contractor/project-details'
                                                    );
                                                }}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                className="btn bg-dark rounded-3 w-100 justify-content-center text-white"
                                                onClick={() => {
                                                    localStorage.setItem(
                                                        'project-id',
                                                        `${project.id}`
                                                    );
                                                    router.push('/general-contractor/edit-project');
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn bg-danger rounded-3 w-100 justify-content-center text-white"
                                                style={{ backgroundColor: '#DC2626 !important' }}
                                                onClick={() => openDeleteModal(project.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
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

// 🔹 Status helpers
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'hired': return '#007AFF';
        case 'active': return '#61BA47';
        case 'pending': return '#FF9500';
        case 'completed': return '#8E8E93';
        case 'cancelled': return '#FF3B30';
        default: return '#8E8E93';
    }
};

const getStatusBg = (status: string) => `${getStatusColor(status)}10`;

const getStatusLabel = (status: string) => {
    const s = status.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
};