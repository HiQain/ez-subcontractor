'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/free-trial.css';

interface Project {
    id: number;
    user_id: string;
    category_id: string;
    city: string;
    state: string;
    zip: string;
    description: string;
    start_date: string;
    end_date: string;
    estimate_due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    attachments: any[];
    category: {
        id: number;
        name: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("all");
    const [expandedCards, setExpandedCards] = useState<number[]>([]);

    // 🔹 API state
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // 🔹 Open delete modal for a specific project
    const openDeleteModal = (id: number) => {
        setDeletingId(id);
        setDeleteError(null);
        const modalEl = document.getElementById('deleteProjectModal');
        if (modalEl && (window as any).bootstrap) {
            const modal = new (window as any).bootstrap.Modal(modalEl);
            modal.show();
        }
    };

    const toggleCard = (index: number) => {
        setExpandedCards((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    useEffect(() => {
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
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
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
                    fetchedProjects = [...data.data.projects.data].reverse();
                } else {
                    console.warn('Unexpected API structure:', data);
                }

                setProjects(fetchedProjects);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || 'Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [router]);

    // 🔹 ✅ FIXED: Delete project using FormData (matches your Postman)
    const handleDelete = async () => {
        if (!deletingId) return;

        console.log(deletingId);

        setDeleteError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            // 👇 Create FormData & append project_id (as per your API)
            const formData = new FormData();
            formData.append('project_id', deletingId.toString());

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/delete/${deletingId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: formData,
                }
            );

            console.log(response);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to delete project');
            }

            console.log(deletingId);

            // ✅ Success: remove from UI
            setProjects(prev => prev.filter(p => p.id !== deletingId));
            alert('Project deleted successfully.');

            // Close modal
            const modalEl = document.getElementById('deleteProjectModal');
            if (modalEl && (window as any).bootstrap) {
                const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
                modal?.hide();
            }

        } catch (err: any) {
            console.error('Delete error:', err);
            setDeleteError(err.message || 'Failed to delete project. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

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

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hired': return 'Hired';
            case 'active': return 'Active';
            case 'pending': return 'Pending';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getFilteredProjects = () => {
        if (activeTab === "all") return projects;
        if (activeTab === "hired") return projects.filter(p => p.status.toLowerCase() === "hired");
        if (activeTab === "active") return projects.filter(p => p.status.toLowerCase() === "active");
        return [];
    };

    const filteredProjects = getFilteredProjects();

    return (
        <>
            <Header />
            <section className="banner-sec trial review">
                <div className="container">
                    <div className="right-bar">
                        <div className="bar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-4">
                            <div className="fs-4 fw-semibold">My Projects</div>
                            <button
                                onClick={() => router.push('/general-contractor/add-project')}
                                className="btn btn-primary rounded-3 d-flex align-items-center gap-2"
                            >
                                <Image
                                    src="/assets/img/icons/plus.svg"
                                    width={12}
                                    height={12}
                                    alt="Icon"
                                />
                                <span>Add Project</span>
                            </button>
                        </div>

                        <ul className="nav nav-tabs mb-4" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("all")}
                                >
                                    All ({projects.length})
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "hired" ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("hired")}
                                >
                                    Hired ({projects.filter(p => p.status.toLowerCase() === 'hired').length})
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "active" ? "active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("active")}
                                >
                                    Active ({projects.filter(p => p.status.toLowerCase() === 'active').length})
                                </button>
                            </li>
                            <div className="slider"></div>
                        </ul>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading your projects...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
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
                                        ? "You don't have any projects yet."
                                        : `No ${activeTab} projects found.`}
                                </p>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredProjects.map((project, index) => (
                                    <div className="col-lg-6" key={project.id}>
                                        <div className="project-card call-dark custom-card p-4">
                                            <div className="bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                                                <div className="fs-5 fw-semibold">
                                                    {project.category?.name || `${project.city}, ${project.state}`}
                                                </div>
                                                <div
                                                    className="btn p-1 ps-3 pe-3 fs-12"
                                                    style={{
                                                        backgroundColor: `${getStatusColor(project.status)}10`,
                                                        color: getStatusColor(project.status),
                                                    }}
                                                >
                                                    {getStatusLabel(project.status)}
                                                </div>
                                            </div>

                                            <p
                                                className="description mb-4"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        expandedCards.includes(index)
                                                            ? project.description /* full html */
                                                            : (() => {
                                                                const tmp = document.createElement('div');
                                                                tmp.innerHTML = project.description || '';
                                                                const text = tmp.textContent || tmp.innerText || '';
                                                                return text.length > 120
                                                                    ? text.slice(0, 120) + '…'
                                                                    : text;
                                                            })(),
                                                }}
                                            />
                                            {/* “see more / see less” still relies on character count of the *text* version */}
                                            {/*{project.description &&*/}
                                            {/*(() => {*/}
                                            {/*    const tmp = document.createElement('div');*/}
                                            {/*    tmp.innerHTML = project.description;*/}
                                            {/*    return (tmp.textContent || tmp.innerText || '').length > 120;*/}
                                            {/*})() && (*/}
                                            {/*    <button*/}
                                            {/*        className="see-more-btn mb-3 d-block"*/}
                                            {/*        onClick={() => toggleCard(index)}*/}
                                            {/*    >*/}
                                            {/*        {expandedCards.includes(index) ? 'See less' : 'See more'}*/}
                                            {/*    </button>*/}
                                            {/*)}*/}

                                            <div className="buttons d-flex align-items-center gap-2 flex-wrap-md">
                                                <button
                                                    className="btn btn-primary rounded-3 w-100 justify-content-center"
                                                    onClick={() => {
                                                        localStorage.setItem('project-id', `${project.id}`);
                                                        router.push('/general-contractor/project-details');
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    className="btn bg-dark rounded-3 w-100 justify-content-center text-white"
                                                    onClick={() => {
                                                        localStorage.setItem('project-id', `${project.id}`);
                                                        router.push('/general-contractor/edit-project');
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn bg-danger text-white rounded-3 w-100 justify-content-center"
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
                </div>
            </section>

            {/* 🚫 Bootstrap Delete Confirmation Modal */}
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
        </>
    );
}