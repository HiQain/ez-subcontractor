'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Category {
    id: string;
    name: string;
}

interface Attachment {
    id: number;
    file_name: string;
    file_path: string;
    description: string;
    mime_type: string;
    created_at: string;
}

interface Project {
    id: number;
    category_id: string;
    city: string;
    state: string;
    zip: string;
    description: string;
    start_date: string;
    end_date: string;
    estimate_due_date: string;
    status: string;
    attachments: Attachment[];
    category: Category;
}

interface DocumentItem {
    id?: number;
    name: string;
    file?: File;
    description: string;
    url?: string;
}

export default function EditProjectPage() {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string | null>(null);

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectOpen, setSelectOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [estimateDueDate, setEstimateDueDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [contactOptions, setContactOptions] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🔹 Toast notification helper
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

    useEffect(() => {
        setProjectId(localStorage.getItem('project-id'));
    }, []);

    // 🔹 Fetch categories
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
                }

                setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } catch {
                setCategories([
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            }
        };
        fetchCategories();
    }, []);

    // 🔹 Fetch project
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
                    router.push('/auth/login');
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
                    localStorage.removeItem('token');
                    setError('Session expired. Please log in again.');
                    router.push('/auth/login');
                    return;
                }

                const data = await response.json();

                // console.log(data);

                if (!response.ok) {
                    throw new Error(data.message?.[0] || 'Failed to load project');
                }

                if (data?.data?.project) {
                    const proj = data.data.project;
                    setProject(proj);
                    setStatus(proj.status);
                    setSelectedCategory(proj.category_id);
                    setCity(proj.city);
                    setState(proj.state);
                    setZip(proj.zip);
                    setEstimateDueDate(proj.estimate_due_date);
                    setStartDate(proj.start_date);
                    setEndDate(proj.end_date);
                    setDescription(proj.description);
                    setAllDocuments(
                        proj.attachments.map(att => ({
                            id: att.id,
                            name: att.file ? new URL(att.file).pathname.split('/').pop() || 'unknown-file' : att.file,
                            url: att.file,
                            description: att.description,
                        }))
                    );
                    setContactOptions(proj.contact_options || []);
                } else {
                    throw new Error('Project not found.');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load project.');
                // 🔹 Show error toast
                showToast(err.message || 'Failed to load project.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, router]);

    // 🔹 Cleanup object URLs
    useEffect(() => {
        return () => {
            allDocuments.forEach(doc => {
                if (doc.url) URL.revokeObjectURL(doc.url);
            });
        };
    }, [allDocuments]);

    // 🔹 Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // 🔹 File helpers
    const makeDoc = (file: File): DocumentItem => ({
        name: file.name,
        description: '',
        file,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newDocs = files.map(makeDoc);
            setAllDocuments(prev => [...prev, ...newDocs]);
            e.target.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const newDocs = files.map(makeDoc);
            setAllDocuments(prev => [...prev, ...newDocs]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleRemoveFile = (index: number) => {
        console.log(`[DEBUG] Removing document at index ${index}`);

        setAllDocuments(prev => {
            // 🔹 Validate index
            if (index < 0 || index >= prev.length) {
                console.warn(`[DEBUG] Invalid index ${index} — no document removed`);
                return prev;
            }

            const docToRemove = prev[index];
            console.log(`[DEBUG] Removing doc:`, docToRemove);

            // 🔹 Revoke object URL if created locally
            if (docToRemove.url && URL.revokeObjectURL) {
                URL.revokeObjectURL(docToRemove.url);
                console.log(`[DEBUG] Revoked object URL for:`, docToRemove.name);
            }

            // 🔹 Return new array without this doc
            const updated = prev.filter((_, i) => i !== index);
            console.log(`[DEBUG] Documents after removal:`, updated);
            return updated;
        });
    };

    const handleDocumentDescriptionChange = (index: number, value: string) => {
        setAllDocuments(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], description: value };
            return updated;
        });
    };

    // 🔹 Submit
    const handleSubmit = async (e: React.FormEvent) => {

        console.log(allDocuments);

        e.preventDefault();

        if (!project) return;

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required.');
                router.push('/auth/login');
                return;
            }
            const formData = new FormData();
            formData.append('title', 'Updated Project');
            formData.append('description', description);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('category_id', selectedCategory);
            formData.append('zip', zip);
            formData.append('estimate_due_date', estimateDueDate);
            formData.append('start_date', startDate);
            formData.append('end_date', endDate);
            formData.append('status', status || project.status);
            contactOptions.forEach((opt, index) => {
                formData.append(`contact_options[${index}]`, opt);
            });

            allDocuments.forEach((doc, index) => {
                if (doc.id && !doc.file) {
                    // ✅ Existing attachment → send id + description only
                    formData.append(`attachments[${index}][id]`, String(doc.id));
                    formData.append(`attachments[${index}][description]`, doc.description);
                } else if (doc.file instanceof File) {
                    // ✅ New upload → send file + name + description
                    // formData.append(`attachments[${index}][id]`, doc.id);
                    formData.append(`attachments[${index}][file]`, doc.file, doc.name);
                    formData.append(`attachments[${index}][description]`, doc.description);
                }
                // ❌ Skip if doc.id exists but doc.file is a string (URL)
            });

            console.log(allDocuments);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/${project.id}/update`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: formData,
                }
            );

            const result = await response.json();

            console.log(result);

            if (response.status === 401) {
                localStorage.removeItem('token');
                setError('Session expired. Please log in again.');
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                const msg = typeof result.message === 'string' ? result.message
                    : Array.isArray(result.message) ? result.message[0]
                        : 'Failed to update project.';
                // 🔹 Replaced alert with toast
                showToast(msg, 'error');
                return;
            }

            // 🔹 Replaced alert with toast
            showToast('Project updated successfully!');
            router.back();

        } catch (err) {
            // 🔹 Replaced alert with toast
            showToast('Network error. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec job-single post profile">
                        <div className="container">
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading project...</p>
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
                    <section className="banner-sec job-single post profile">
                        <div className="container">
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                                <div>{error || 'Project not found.'}</div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => router.back()}
                            >
                                ← Back
                            </button>
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
                <section className="banner-sec job-single position-static">
                    <div className="container">
                        <div className="right-bar mb-5 topbar">
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
                                        Edit Project
                                    </div>
                                </div>
                                <div className="icon-wrapper d-flex align-items-center gap-3 flex-wrap">
                                    <div className="row g-3 align-items-center">
                                        <div className="col-auto">
                                            <label className="col-form-label">Status:</label>
                                        </div>
                                        <div className="col-auto">
                                            <select
                                                className="form-control"
                                                style={{ minWidth: '200px' }}
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="hired">Hired</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="row g-3">
                                {/* LEFT SIDE */}
                                <div className="col-lg-8">
                                    {/* Category */}
                                    <div className="input-wrapper d-flex flex-column position-relative mb-4" ref={dropdownRef}>
                                        <label className="mb-1 fw-semibold">Category *</label>
                                        <div className="input-wrapper d-flex flex-column position-relative">
                                            <select
                                                id="category-select2"
                                                className="form-control"
                                                value={selectedCategory}
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="row g-4">
                                        {[
                                            { label: 'City *', value: city, setter: setCity, type: 'text' },
                                            { label: 'State *', value: state, setter: setState, type: 'text' },
                                            { label: 'Zip Code *', value: zip, setter: setZip, type: 'text' },
                                            { label: 'Estimate Due Date *', value: estimateDueDate, setter: setEstimateDueDate, type: 'date' },
                                            { label: 'Project Start Date *', value: startDate, setter: setStartDate, type: 'date' },
                                            { label: 'Project End Date *', value: endDate, setter: setEndDate, type: 'date' },
                                        ].map((field, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="input-wrapper">
                                                    <div className="label mb-1 fw-semibold">{field.label}</div>
                                                    <input
                                                        type={field.type}
                                                        value={field.value}
                                                        onChange={e => field.setter(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="col-12 mb-4">
                                            <div className="fw-semibold mb-2">Preferred Contact Method</div>
                                            <div className="d-flex gap-3 flex-wrap">
                                                {['email', 'phone', 'chat'].map(option => (
                                                    <div key={option} className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`contact-${option}`}
                                                            value={option}
                                                            checked={contactOptions.includes(option)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setContactOptions(prev =>
                                                                    prev.includes(value)
                                                                        ? prev.filter(v => v !== value)
                                                                        : [...prev, value]
                                                                );
                                                            }}
                                                        />
                                                        <label htmlFor={`contact-${option}`} className="form-check-label text-capitalize">
                                                            {option}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="label mb-1 fw-semibold">Description *</div>
                                            <div className="input-wrapper mb-5 d-block">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={description}
                                                    onChange={setDescription}
                                                    placeholder="Write project description..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="mb-2 fw-semibold fs-5">Documents Description</div>
                                    <div className="documents-wrapper mb-4">
                                        {allDocuments.length === 0 ? (
                                            <div className="text-center">
                                                <Image
                                                    src="/assets/img/post.webp"
                                                    width={166}
                                                    height={161}
                                                    alt="No Document"
                                                    className="d-block mx-auto mb-2"
                                                />
                                                <div className="fs-14 fw-medium">No documents added</div>
                                            </div>
                                        ) : allDocuments.map((doc, index) => (
                                            <div key={index} className="mb-3">
                                                <div className="document-item p-2 border rounded d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        {typeof doc.name === 'string' && doc.name.endsWith('.pdf') ? (
                                                            <Image
                                                                src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                                                                width={24}
                                                                height={24}
                                                                alt="PDF"
                                                                className="me-2"
                                                            />
                                                        ) : typeof doc.name === 'string' && (doc.name.endsWith('.doc') || doc.name.endsWith('.docx')) ? (
                                                            <Image
                                                                src="https://upload.wikimedia.org/wikipedia/commons/4/43/Microsoft_Word_2013_logo.svg"
                                                                width={24}
                                                                height={24}
                                                                alt="DOC"
                                                                className="me-2"
                                                            />
                                                        ) : doc.url ? (
                                                            <Image
                                                                src={doc.url}
                                                                width={24}
                                                                height={24}
                                                                alt={doc.name || 'File'}
                                                                className="me-2"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <Image
                                                                src="https://upload.wikimedia.org/wikipedia/commons/4/48/Image_file_icon.svg"
                                                                width={24}
                                                                height={24}
                                                                alt="File"
                                                                className="me-2"
                                                            />
                                                        )}
                                                        <span className="d-block fs-14 fw-semibold">
                                                            {doc.name || 'Untitled File'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger p-0 px-2 rounded-circle"
                                                        onClick={() => handleRemoveFile(index)}
                                                        aria-label="Remove file"
                                                        style={{ width: 25, height: 25 }}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                                <div className="input-wrapper w-100 mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Description (e.g., 'Blueprint')"
                                                        value={doc.description}
                                                        onChange={e => handleDocumentDescriptionChange(index, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-lg-flex g-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-3 m-3 ms-0"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Updating...' : 'Update Project'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary rounded-3 m-3"
                                            onClick={() => router.back()}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="col-lg-4">
                                    <div className="attachment-wrapper">
                                        <div className="fw-semibold mb-3">Attachment</div>
                                        <div
                                            className="attachment-box"
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="upload-content">
                                                <div className="upload-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" fill="none" stroke="#272727" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4" />
                                                    </svg>
                                                </div>
                                                <p>Drag and drop files here<br />or click to upload</p>
                                                <small>Supported: .pdf, .doc, .xml, .jpeg (Max 10MB)</small>
                                            </div>
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                        <div className="uploaded-files-preview d-flex align-items-center gap-2 flex-wrap mt-4">
                                            {allDocuments.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="uploaded-file-card d-flex align-items-center justify-content-center a gap-2"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        backgroundColor: 'transparent',
                                                        padding: '6px',
                                                        objectFit: 'contain',
                                                        border: '1px solid #B7C627',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    {typeof doc.name === 'string' && doc.name.endsWith('.pdf') ? (
                                                        <Image
                                                            src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                                                            width={50}
                                                            height={50}
                                                            alt="PDF"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : typeof doc.name === 'string' && (doc.name.endsWith('.doc') || doc.name.endsWith('.docx')) ? (
                                                        <Image
                                                            src="https://upload.wikimedia.org/wikipedia/commons/4/43/Microsoft_Word_2013_logo.svg"
                                                            width={50}
                                                            height={50}
                                                            alt="DOC"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : doc.url ? (
                                                        <Image
                                                            src={doc.url}
                                                            width={50}
                                                            height={50}
                                                            alt={doc.name || 'File'}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <Image
                                                            src="https://upload.wikimedia.org/wikipedia/commons/4/48/Image_file_icon.svg"
                                                            width={50}
                                                            height={50}
                                                            alt="File"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}