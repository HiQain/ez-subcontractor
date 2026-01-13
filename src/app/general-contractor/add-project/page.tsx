'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/post-detail.css';
import 'react-quill/dist/quill.snow.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Category {
    id: string;
    name: string;
}

interface DocumentItem {
    id: string;
    name: string;
    description: string;
    file: File;
    url?: string;
}

export default function PostAd() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [description, setDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([]);
    const [estimateDueDate, setEstimateDueDate] = useState<Date | null>();
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [contactMethods, setContactMethods] = useState<{ [key: string]: boolean }>({
        email: false,
        phone: false,
        chat: false,
    });

    // 🔹 Handle checkbox toggle
    const handleCheckboxChange = (method: string) => {
        setContactMethods(prev => ({
            ...prev,
            [method]: !prev[method],
        }));
    };

    // 🔹 Clean up object URLs
    useEffect(() => {
        return () => {
            allDocuments.forEach(doc => {
                if (doc.url) URL.revokeObjectURL(doc.url);
            });
        };
    }, [allDocuments]);

    const clearError = (field: string) => {
        setErrors(prev => {
            const { [field]: _, ...rest } = prev;
            return rest;
        });
    };

    const handleInputChange =
        (setter: (v: string) => void, field: string) =>
            (value: string) => {
                setter(value);
                clearError(field);
            };

    const handleDocDescriptionChange = (id: string, desc: string) => {
        setAllDocuments(prev =>
            prev.map(doc => (doc.id === id ? { ...doc, description: desc } : doc))
        );
    };

    const showErrorToast = (message: string) => {
        const toast = document.createElement('div');
        toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 12px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        ">
            <span>${message}</span>
            <button type="button" class="btn-close" style="font-size: 14px; margin-left: auto;" data-bs-dismiss="toast"></button>
        </div>
    `;
        document.body.appendChild(toast);
        const timeoutId = setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 5000);
        const closeButton = toast.querySelector('.btn-close');
        closeButton?.addEventListener('click', () => {
            clearTimeout(timeoutId);
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    };

    // Fetch categories
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
                setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } catch (err) {
                console.error('Failed to load categories:', err);
                setCategories([
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 🎯 Initialize Select2 AFTER categories load
    useEffect(() => {
        if (typeof window === 'undefined' || categoriesLoading) return;

        // Dynamically import jQuery & Select2 (SSR-safe)
        const $ = require('jquery');
        require('select2');
        require('select2/dist/css/select2.min.css');

        $('#category-select2').select2({
            placeholder: 'Select category',
            allowClear: false,
            width: '100%',
            minimumInputLength: 0, // enable search immediately
        }).on('change', function () {
            const val = $(this).val() as string;
            setSelectedCategory(val || '');
            clearError('category');
        });

        return () => {
            $('#category-select2').select2('destroy');
        };
    }, [categoriesLoading, categories]);

    // 📁 File handling
    const makeDoc = (file: File, offset = 0): DocumentItem => {
        const doc: DocumentItem = {
            id: `${Date.now()}-${Math.floor(Math.random() * 100000)}-${offset}`,
            name: file.name,
            description: '',
            file: file,
        };
        if (file.type.startsWith('image/')) {
            doc.url = URL.createObjectURL(file);
        }
        return doc;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const newDocs = files.map((f, i) => makeDoc(f, i));
        setAllDocuments(prev => [...prev, ...newDocs]);
        e.target.value = '';
        clearError('attachments');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0) return;
        const newDocs = files.map((f, i) => makeDoc(f, i));
        setAllDocuments(prev => [...prev, ...newDocs]);
        clearError('attachments');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleRemoveFile = (id: string) => {
        setAllDocuments(prev => {
            const docToRemove = prev.find(doc => doc.id === id);
            if (docToRemove?.url) {
                URL.revokeObjectURL(docToRemove.url);
            }
            return prev.filter(doc => doc.id !== id);
        });
    };

    const handleChangeEstimateDueDate = (date: Date | null) => {
        setEstimateDueDate(date);
    };

    const handleChangeStartDate = (date: Date | null) => {
        setStartDate(date);
    };

    const handleChangeEndDate = (date: Date | null) => {
        setEndDate(date);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!selectedCategory) newErrors.category = 'Please select a category.';
        if (!city.trim()) newErrors.city = 'City is required.';
        if (!state.trim()) newErrors.state = 'State is required.';
        if (!zip.trim()) newErrors.zip = 'Zip Code is required.';
        if (!estimateDueDate) newErrors.estimateDueDate = 'Estimate Due Date is required.';
        if (!startDate) newErrors.startDate = 'Project Start Date is required.';
        if (!endDate) newErrors.endDate = 'Project End Date is required.';
        if (!description.trim()) newErrors.description = 'Description is required.';

        // ✅ Contact options validation
        const selectedMethods = Object.keys(contactMethods).filter(k => contactMethods[k]);
        if (selectedMethods.length === 0) newErrors.contact_options = 'Please select at least one contact method.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstError = Object.values(newErrors)[0];
            showErrorToast(`Form Error: ${firstError}`);
            setTimeout(() => {
                document.querySelector('.text-danger')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const token = localStorage.getItem('token');
            if (!token || token.trim() === '') {
                const errorMsg = 'Authentication required. Please log in.';
                setErrors({ api: errorMsg });
                showErrorToast(errorMsg);
                router.push('/auth/login');
                return;
            }

            const formData = new FormData();
            formData.append('title', 'New Project');
            formData.append('description', description);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('category_id', selectedCategory);
            formData.append('zip', zip);
            formData.append('estimate_due_date', estimateDueDate ? format(estimateDueDate, 'yyyy-MM-dd') : '');
            formData.append('start_date', startDate ? format(startDate, 'yyyy-MM-dd') : '');
            formData.append('end_date', endDate ? format(endDate, 'yyyy-MM-dd') : '');
            formData.append('status', 'active');
            selectedMethods.forEach((method, index) => {
                formData.append(`contact_options[${index}]`, method);
            });

            allDocuments.forEach((doc, index) => {
                formData.append(`attachments[${index}][file]`, doc.file, doc.name);
                formData.append(`attachments[${index}][description]`, doc.description);
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const result = await response.json();

            if (response.status === 401) {
                setErrors({ api: 'Session expired. Please log in again.' });
                localStorage.removeItem('token');
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                let errorMsg = 'Failed to create project.';
                if (typeof result.message === 'string') {
                    showErrorToast(`Submission Failed: ${errorMsg}`);
                } else if (Array.isArray(result.message)) {
                    errorMsg = result.message[0] || errorMsg;
                } else if (result.errors) {
                    const firstField = Object.keys(result.errors)[0];
                    errorMsg = result.errors[firstField]?.[0] || errorMsg;
                } else if (result.data?.status?.[0]) {
                    errorMsg = result.data.status[0];
                } else if (typeof result.error === 'string') {
                    errorMsg = result.error;
                }
                setErrors({ api: errorMsg });
                showErrorToast(`Submission Failed: ${errorMsg}`);
                return;
            }

            router.back();
            setSelectedCategory('');
            setCity('');
            setState('');
            setZip('');
            setEstimateDueDate(null);
            setStartDate(null);
            setEndDate(null);
            setDescription('');
            setAllDocuments([]);
            setContactMethods({ email: false, phone: false, chat: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Network error:', error);
            const errorMsg = 'Network error. Please check your connection.';
            setErrors({ api: errorMsg });
            showErrorToast(`Connection Error: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec post profile">
                    <div className="container">
                        <div className="right-bar">
                            <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                <div className="icon-wrapper d-flex align-items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="icon"
                                        aria-label="Go back"
                                    >
                                        <Image
                                            src="/assets/img/button-angle.svg"
                                            width={10}
                                            height={15}
                                            alt="Back"
                                        />
                                    </button>
                                    <span className="fs-4 fw-semibold">Add Project</span>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="row g-3">
                                {/* LEFT SIDE */}
                                <div className="col-lg-8">
                                    {/* 🎯 REPLACED: Custom Select → Select2 */}
                                    <div className="input-wrapper d-flex flex-column position-relative mb-4">
                                        <label htmlFor="category-select2" className="mb-1 fw-semibold">
                                            Category <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            id="category-select2"
                                            className="form-control"
                                            value={selectedCategory}
                                        // onChange handled by Select2
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <span className="text-danger animate-slide-up">{errors.category}</span>
                                        )}
                                    </div>

                                    {/* Input Fields */}
                                    <div className="row g-4">
                                        {[
                                            { label: 'City', value: city, setter: setCity, field: 'city', type: 'text', placeholder: 'Enter city' },
                                            { label: 'State', value: state, setter: setState, field: 'state', type: 'text', placeholder: 'Enter state' },
                                            { label: 'Zip Code', value: zip, setter: setZip, field: 'zip', type: 'text', placeholder: 'Enter ZIP' },
                                        ].map((field, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="input-wrapper">
                                                    <div className="label mb-1 fw-semibold">
                                                        {field.label}
                                                    </div>
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder || ''}
                                                        value={field.value}
                                                        onChange={(e) => handleInputChange(field.setter, field.field)(e.target.value)}
                                                    />
                                                    {errors[field.field] && (
                                                        <span className="text-danger animate-slide-up">{errors[field.field]}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="col-lg-4">
                                            <div className="input-wrapper">
                                                <div className="label mb-1 fw-semibold">Estimate Due Date <span className="text-danger">*</span></div>
                                                <DatePicker
                                                    selected={estimateDueDate}
                                                    onChange={handleChangeEstimateDueDate}
                                                    minDate={new Date()}
                                                />
                                                {errors.estimateDueDate && (
                                                    <span className="text-danger animate-slide-up">{errors.estimateDueDate}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div className="input-wrapper">
                                                <div className="label mb-1 fw-semibold">Project Start Date <span className="text-danger">*</span></div>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={handleChangeStartDate}
                                                    minDate={new Date()}
                                                />
                                                {errors.startDate && (
                                                    <span className="text-danger animate-slide-up">{errors.startDate}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div className="input-wrapper">
                                                <div className="label mb-1 fw-semibold">Project End Date <span className="text-danger">*</span></div>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={handleChangeEndDate}
                                                    minDate={new Date()}
                                                    disabled={!startDate}
                                                />
                                                {errors.endDate && (
                                                    <span className="text-danger animate-slide-up">{errors.endDate}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-12 mb-4">
                                            <div className="fw-semibold mb-2">Preferred Contact Method</div>
                                            <div className="d-flex gap-3 flex-wrap">
                                                {['email', 'phone', 'chat'].map(option => (
                                                    <div key={option} className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            checked={contactMethods[option]}
                                                            onChange={() => handleCheckboxChange(option)}
                                                            className="form-check-input"
                                                            id={`contact-${option}`}
                                                            value={option}
                                                        />
                                                        <label htmlFor={`contact-${option}`} className="form-check-label text-capitalize">
                                                            {option}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="col-12">
                                            <div className="label mb-1 fw-semibold">Description <span className="text-danger">*</span></div>
                                            <div className="input-wrapper mb-5 d-block">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={description}
                                                    onChange={(val) => {
                                                        setDescription(val);
                                                        clearError('description');
                                                    }}
                                                    placeholder="Write project description..."
                                                />
                                                {errors.description && (
                                                    <span className="text-danger animate-slide-up">
                                                        {errors.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents Description */}
                                    <div className="mb-2 fw-semibold fs-5">Documents Description</div>
                                    <div className="documents-wrapper mb-4">
                                        {allDocuments.length === 0 ? (
                                            <div className="text-center">
                                                <Image
                                                    src="/assets/img/post.webp"
                                                    className="d-block mx-auto mb-2"
                                                    width={166}
                                                    height={161}
                                                    alt="No Document"
                                                    loading="lazy"
                                                />
                                                <div className="fs-14 fw-medium">No Document added</div>
                                            </div>
                                        ) : (
                                            allDocuments.map((doc) => (
                                                <div key={doc.id}>
                                                    <div className="document-item mb-3 p-2 border rounded d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center gap-2">
                                                            {doc.name.endsWith('.pdf') ? (
                                                                <Image
                                                                    src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                                                                    width={24}
                                                                    height={24}
                                                                    alt="PDF"
                                                                    className="me-2"
                                                                />
                                                            ) : doc.name.endsWith('.doc') || doc.name.endsWith('.docx') ? (
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
                                                                    alt={doc.name}
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
                                                            <span className="d-block fs-14 fw-semibold">{doc.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger p-0 px-2 rounded-circle"
                                                            onClick={() => handleRemoveFile(doc.id)}
                                                            aria-label="Remove file"
                                                            style={{ width: 25, height: 25 }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                    <div className="input-wrapper w-100 mt-2 mb-4">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter description (e.g., 'Blueprint', 'Permit')"
                                                            value={doc.description}
                                                            onChange={(e) => handleDocDescriptionChange(doc.id, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {errors.api && (
                                        <div className="my-4">
                                            <p className="text-danger animate-slide-up">{errors.api}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-3 w-100 justify-content-center mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Add Project'}
                                    </button>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="col-lg-4">
                                    <div className="attachment-wrapper">
                                        <div className="fw-semibold mb-3">Attachment</div>
                                        <div
                                            className="attachment-box"
                                            id="dropZone"
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="upload-content">
                                                <div className="upload-icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        style={{ stroke: '#272727' }}
                                                        width="55"
                                                        height="55"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.8"
                                                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4"
                                                        />
                                                    </svg>
                                                </div>
                                                <p>
                                                    Drag and drop files here<br />
                                                    or click to upload
                                                </p>
                                                <small>Supported: .pdf, .doc, .xml, .jpeg (Max 10MB)</small>
                                            </div>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                hidden
                                                multiple
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                        <div className="uploaded-files-preview d-flex align-items-center gap-2 flex-wrap mt-4">
                                            {allDocuments.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="uploaded-file-card d-flex align-items-center justify-content-center gap-2"
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
                                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                                >
                                                    {doc.name.endsWith('.pdf') ? (
                                                        <Image
                                                            src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                                                            width={50}
                                                            height={50}
                                                            alt="PDF"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : doc.name.endsWith('.doc') || doc.name.endsWith('.docx') ? (
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
                                                            alt={doc.name}
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