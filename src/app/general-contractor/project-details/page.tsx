'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/job-single.css';
import { Modal } from 'bootstrap';

// 🔹 Helper: Extract file name from path
const getFileName = (filePath: string): string => {
    const name = filePath.split('/').pop() || 'unknown-file';
    return decodeURIComponent(name);
};

interface Attachment {
    id: number;
    file_name?: string;
    file: string;
    description?: string;
    mime_type?: string;
    created_at: string;
}

interface Project {
    id: number;
    city: string;
    state: string;
    street: string;
    description: string;
    start_date: string;
    end_date: string;
    estimate_due_date: string;
    status: string;
    category: { name: string };
    attachments: Attachment[];
    created_at: string;
}

export default function ProjectDetailsPage() {
    const [projectId, setProjectId] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // 🔹 Add delete state
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const router = useRouter();

    // 🔹 Show non-blocking toast notification
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

    const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    const timeAgo = (dateStr: string) => {
        const diffMs = Date.now() - new Date(dateStr).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getStatusConfig = (status: string | undefined) => {
        if (!status) {
            return { bg: '#8E8E9310', color: '#8E8E93', label: 'Unknown' };
        }

        const s = status.toLowerCase();
        if (s === 'active') return { bg: '#61BA4710', color: '#10BC17', label: 'Active' };
        if (s === 'hired') return { bg: '#007AFF10', color: '#007AFF', label: 'Hired' };
        if (s === 'pending') return { bg: '#FF950010', color: '#FF9500', label: 'Pending' };
        if (s === 'completed') return { bg: '#8E8E9310', color: '#8E8E93', label: 'Completed' };

        return {
            bg: '#8E8E9310',
            color: '#8E8E93',
            label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    };
    useEffect(() => {
        setProjectId(localStorage.getItem('project-id'));
    }, []);
    useEffect(() => {

        if (!projectId) {
            setError('Project ID is missing.');
            setLoading(false);
            return;
        }

        const fetchProject = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/${projectId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    }
                );

                if (response.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                console.log(data);

                if (!response.ok) {
                    throw new Error(data.message?.[0] || 'Failed to load project');
                }

                if (data?.data?.project) {
                    setProject(data.data.project);
                } else {
                    throw new Error('Invalid response format: missing project data');
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to load project details.');
                // 🔹 Show error toast
                showToast(err.message || 'Failed to load project details.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    // 🔹 Safely categorize attachments
    const pdfs = project?.attachments
        ? project.attachments.filter(a =>
            (a.mime_type || '').includes('pdf') ||
            /\.(pdf)$/i.test(a.file)
        )
        : [];

    const images = project?.attachments
        ? project.attachments.filter(a =>
            (a.mime_type || '').startsWith('image/') ||
            /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(a.file)
        )
        : [];

    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec job-single position-static">
                        <div className="container">
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading project details...</p>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !project) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec job-single position-static">
                        <div className="container">
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                                <div>{error || 'Project not found.'}</div>
                            </div>
                            <Link href="/general-contractor/my-projects" className="btn btn-outline-primary">
                                ← Back to Projects
                            </Link>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    const { bg, color, label } = getStatusConfig(project.status);

    // 🔹 Open modal programmatically (fallback if data-bs-* doesn't work)
    const openAttachmentsModal = () => {
        const modalEl = document.getElementById('attachmentsModal');
        if (!modalEl) return;

        const modal = Modal.getOrCreateInstance(modalEl);
        modal.show();
    };

    const openDeleteModal = () => {
        const modalEl = document.getElementById('deleteProjectModal');
        if (!modalEl) return;

        const modal = Modal.getOrCreateInstance(modalEl);
        modal.show();
    };

    const closeDeleteModal = () => {
        const modalEl = document.getElementById('deleteProjectModal');
        if (!modalEl) return;

        const modal = Modal.getInstance(modalEl);
        modal?.hide();
    };

    // 🔹 ✅ NEW: Delete project (matches dashboard logic)
    const handleDeleteProject = async () => {
        if (!project?.id) return;

        setDeleting(true);
        setDeleteError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const formData = new FormData();
            formData.append('project_id', project.id.toString());

            console.log('➡️ Deleting project:', project.id);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/delete/${project.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`, // ✅ Only this header
                    },
                    body: formData,
                }
            );

            console.log('⬅️ Response status:', response.status);
            const responseData = await response.json().catch(() => null);
            console.log('⬅️ Response body:', responseData);

            if (!response.ok) {
                throw new Error(responseData?.message || 'Failed to delete project');
            }

            // ✅ Success
            showToast('Project deleted successfully!');
            closeDeleteModal();
            router.back();

        } catch (err: any) {
            console.error('❌ Delete error:', err);
            const errorMsg = err.message || 'Failed to delete project. Please try again.';
            setDeleteError(errorMsg);
            // 🔹 Show error toast
            showToast(errorMsg, 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec job-single position-static">
                    <div className="container">
                        <div style={{ backgroundColor: 'transparent !important' }} className="topbar">
                            <div className="d-flex align-items-center flex-wrap justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="icon"
                                        aria-label="Go back"
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                    >
                                        <Image
                                            src="/assets/img/button-angle.svg"
                                            width={10}
                                            height={15}
                                            alt="Back"
                                        />
                                    </button>
                                    <div className="login-title fw-semibold fs-4 text-center">
                                        Project Details
                                    </div>
                                </div>
                                <div className="icon-wrapper d-flex align-items-center gap-3 flex-wrap">
                                    <button
                                        className="icon"
                                        onClick={() => {
                                            localStorage.setItem('project-id', `${project.id}`);
                                            router.push('/general-contractor/edit-project');
                                        }}
                                    >
                                        <Image
                                            src="/assets/img/icons/edit.svg"
                                            width={24}
                                            height={24}
                                            alt="Edit Icon"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className="icon delete"
                                        style={{ backgroundColor: '#DC2626 !important' }}
                                        onClick={openDeleteModal}
                                    >
                                        <Image
                                            src="/assets/img/icons/delete.svg"
                                            width={24}
                                            height={24}
                                            alt="Delete Icon"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-12">
                                <div className="custom-card mb-4">
                                    <div className="mb-4 d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                        <Link href="#" className="btn btn-primary">
                                            {project.category?.name || 'General'}
                                        </Link>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="date custom-text-gray-light fs-14">
                                                {timeAgo(project.created_at)}
                                            </div>
                                            <span
                                                style={{ backgroundColor: bg, color: color }}
                                                className="btn pt-2 pb-2 ps-3 pe-3"
                                            >
                                                {label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="title text-black fs-5 fw-semibold mb-3">
                                        {[
                                            project.city,
                                            project.state,
                                            project.street
                                        ].filter(Boolean).join(', ')}
                                    </div>

                                    <div
                                        className="mb-4"
                                        dangerouslySetInnerHTML={{ __html: project.description || '' }}
                                    />

                                    <div className="title text-black fs-5 fw-semibold mb-3">Project Details</div>
                                    <div className="estimated-wrapper">
                                        <div className="estimated-card">
                                            <div className="icon">
                                                <Image src="/assets/img/icons/calander.svg" width={24} height={24} alt="Calendar Icon" />
                                            </div>
                                            <div className="content">
                                                <div className="fs-12 mb-1">Estimate Due Date</div>
                                                <div className="fs-14 text-black fw-semibold">
                                                    {formatDate(project.estimate_due_date)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="estimated-card card-1">
                                            <div className="icon">
                                                <Image src="/assets/img/icons/calander.svg" width={24} height={24} alt="Calendar Icon" />
                                            </div>
                                            <div className="content">
                                                <div>
                                                    <div className="fs-12 mb-1">Project Start Date</div>
                                                    <div className="fs-14 text-black fw-semibold">
                                                        {formatDate(project.start_date)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="fs-12 mb-1">Project End Date</div>
                                                    <div className="fs-14 text-black fw-semibold">
                                                        {formatDate(project.end_date)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments Section */}
                                <div className="custom-card mb-4">
                                    <div className="title text-black fs-5 fw-semibold mb-3">Attachments</div>

                                    {/* ✅ Images: Click any → opens modal */}
                                    {images.length > 0 && (
                                        <>
                                            <div className="mb-2 fw-medium">Images</div>
                                            <div className="gallery-images mb-3">
                                                {images.map((img) => (
                                                    <div
                                                        key={img.id}
                                                        onClick={openAttachmentsModal}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Image
                                                            src={`${img.file.replace(/^\/+/, '')}`}
                                                            width={112}
                                                            height={112}
                                                            alt={img.file_name || getFileName(img.file)}
                                                            className="shadow-sm rounded-2"
                                                            loading="lazy"
                                                            unoptimized
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* ✅ Files: Also make them clickable to open modal */}
                                    {pdfs.length > 0 && (
                                        <>
                                            <div className="mb-2 fw-medium">Files</div>
                                            <div className="pdf-wrapper mb-3">
                                                {pdfs.map((file, i) => (
                                                    <div
                                                        key={file.id}
                                                        className={`pdf-card mb-2 ${i === pdfs.length - 1 ? 'card-1' : ''}`}
                                                        onClick={openAttachmentsModal}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Image
                                                            src="/assets/img/icons/pdf-img.svg"
                                                            width={27}
                                                            height={32}
                                                            alt="Pdf Icon"
                                                        />
                                                        <div className="content">
                                                            <div className="fw-semibold text-black mb-1">
                                                                {file.file_name || getFileName(file.file)}
                                                            </div>
                                                            <div className="fs-12">
                                                                {new Date(file.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: '2-digit',
                                                                })}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            href={`${file.file.replace(/^\/+/, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()} // Prevent modal on download
                                                        >
                                                            <Image
                                                                src="/assets/img/icons/download.svg"
                                                                width={18}
                                                                height={18}
                                                                alt="Download Icon"
                                                            />
                                                        </Link>
                                                        {file.description && (
                                                            <p className="mb-0">{file.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {pdfs.length === 0 && images.length === 0 && (
                                        <p className="text-muted fst-italic">No attachments uploaded.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 🖼️ Modal: All Attachments */}
            <div
                className="modal fade"
                id="attachmentsModal"
                tabIndex={-1}
                aria-labelledby="attachmentsModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="attachmentsModalLabel">
                                All Attachments ({images.length + pdfs.length})
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body p-0">
                            <ul className="nav nav-tabs nav-fill px-3 pt-3 border-bottom" id="attachmentTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link active"
                                        id="images-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#images"
                                        type="button"
                                        role="tab"
                                        aria-controls="images"
                                        aria-selected="true"
                                    >
                                        Images ({images.length})
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link"
                                        id="files-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#files"
                                        type="button"
                                        role="tab"
                                        aria-controls="files"
                                        aria-selected="false"
                                    >
                                        Files ({pdfs.length})
                                    </button>
                                </li>
                            </ul>

                            <div className="tab-content p-3">
                                {/* Images Tab */}
                                <div
                                    className="tab-pane fade show active"
                                    id="images"
                                    role="tabpanel"
                                    aria-labelledby="images-tab"
                                >
                                    {images.length > 0 ? (
                                        <div className="row g-3">
                                            {images.map((img) => (
                                                <div key={img.id} className="col-6 col-md-4 col-lg-3">
                                                    <div className="border rounded overflow-hidden shadow-sm">
                                                        <Image
                                                            src={`${img.file.replace(/^\/+/, '')}`}
                                                            width={200}
                                                            height={200}
                                                            alt={img.file_name || getFileName(img.file)}
                                                            className="img-fluid"
                                                            style={{ objectFit: 'cover', height: '150px' }}
                                                            loading="lazy"
                                                            unoptimized
                                                        />
                                                        <div className="p-2 bg-light">
                                                            <div className="fw-semibold text-truncate">
                                                                {img.file_name || getFileName(img.file)}
                                                            </div>
                                                            <small className="text-muted">
                                                                {new Date(img.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                })}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            No images found.
                                        </div>
                                    )}
                                </div>

                                {/* Files Tab */}
                                <div
                                    className="tab-pane fade"
                                    id="files"
                                    role="tabpanel"
                                    aria-labelledby="files-tab"
                                >
                                    {pdfs.length > 0 ? (
                                        <div className="list-group">
                                            {pdfs.map((file) => (
                                                <div key={file.id} className="list-group-item d-flex align-items-center gap-3">
                                                    <Image
                                                        src="/assets/img/icons/pdf-img.svg"
                                                        width={27}
                                                        height={32}
                                                        alt="Pdf Icon"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold text-black mb-1">
                                                            {file.file_name || getFileName(file.file)}
                                                        </div>
                                                        <div className="fs-12 text-muted">
                                                            {new Date(file.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                            })}
                                                        </div>
                                                        {file.description && (
                                                            <div className="mt-1 small">{file.description}</div>
                                                        )}
                                                    </div>
                                                    <Link
                                                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${file.file.replace(/^\/+/, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Download
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            No files found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                                onClick={handleDeleteProject}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}