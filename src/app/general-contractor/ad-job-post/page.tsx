'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/post-detail.css';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Category {
    id: string;
    name: string;
}

export default function PostAd() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectOpen, setSelectOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [description, setDescription] = useState('Test');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🆕 Error state — matching RegisterPage behavior
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form fields
    const [city, setCity] = useState('Santa Fe');
    const [state, setState] = useState('TX');
    const [zip, setZip] = useState('77510');
    const [estimateDueDate, setEstimateDueDate] = useState('2025-12-20'); // 3 weeks out
    const [startDate, setStartDate] = useState('2026-01-15');
    const [endDate, setEndDate] = useState('2026-04-30');

    // 🔹 NEW: API submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // 🔹 Helper: Clear specific field error
    const clearError = (field: string) => {
        setErrors(prev => {
            const { [field]: _, ...rest } = prev;
            return rest;
        });
    };

    // 🔹 Helper: Input change with auto-clear
    const handleInputChange =
        (setter: (v: string) => void, field: string) =>
            (value: string) => {
                setter(value);
                clearError(field);
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


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadedFiles((prev) => [...prev, ...files]);
        clearError('attachments');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles((prev) => [...prev, ...files]);
        clearError('attachments');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
    

        if (!city.trim()) newErrors.city = 'City is required.';
        if (!state.trim()) newErrors.state = 'State is required.';
        if (!zip.trim()) newErrors.zip = 'Zip Code is required.';
        if (!estimateDueDate) newErrors.estimateDueDate = 'Estimate Due Date is required.';
        if (!startDate) newErrors.startDate = 'Project Start Date is required.';
        if (!endDate) newErrors.endDate = 'Project End Date is required.';
        if (!description.trim()) newErrors.description = 'Description is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => {
                const firstError = document.querySelector('.text-danger');
                firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }

        // 🚀 Start submission
        setIsSubmitting(true);
        setErrors({});

       try {
    const token = localStorage.getItem('token');
    if (!token || token.trim() === '') {
        setErrors({ api: 'Authentication required. Please log in.' });
        router.push('/auth/login');
        return;
    }

    const formData = new FormData();
    formData.append("title", "New Project");
    formData.append("description", "Project description");
    formData.append("category_id", "1");
    formData.append("city", "New York");
    formData.append("state", "NY");
    formData.append("zip", "10001");
    formData.append("estimate_due_date", "2025-12-31");
    formData.append("start_date", "2025-11-26");
    formData.append("end_date", "2025-12-31");
    formData.append("status", "pending");

 

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: formData,
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
        const errorMsg = result?.message || 'Failed to create project.';
        setErrors({ api: errorMsg });
        return;
    }

    console.log('✅ Project created:', result);
    // router.push('/general_contractor/add-attachment');

} catch (error) {
    console.error('Network error:', error);
    setErrors({ api: 'Network error. Please check your connection.' });
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
                                    <Link href="#" className="icon">
                                        <Image
                                            src="/assets/img/button-angle.svg"
                                            width={10}
                                            height={15}
                                            alt="Icon"
                                            loading="lazy"
                                        />
                                    </Link>
                                    <span className="fs-4 fw-semibold">Post an Ad</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="row g-3">
                                {/* LEFT SIDE */}
                                <div className="col-lg-8">
                                    {/* Category Dropdown */}
                                    {/*<div*/}
                                    {/*    className="input-wrapper d-flex flex-column position-relative mb-4"*/}
                                    {/*    ref={dropdownRef}*/}
                                    {/*>*/}
                                    {/*    <label htmlFor="category" className="mb-1 fw-semibold">Category *</label>*/}
                                    {/*    <div className={`custom-select position-relative ${selectOpen ? 'open' : ''}`}>*/}
                                    {/*        <div*/}
                                    {/*            className="select-selected"*/}
                                    {/*            onClick={() => setSelectOpen(!selectOpen)}*/}
                                    {/*        >*/}
                                    {/*            {selectedCategory*/}
                                    {/*                ? categories.find((c) => c.id === selectedCategory)?.name || 'Select category'*/}
                                    {/*                : 'Select category'}*/}
                                    {/*        </div>*/}
                                    {/*        <svg*/}
                                    {/*            xmlns="http://www.w3.org/2000/svg"*/}
                                    {/*            width="16"*/}
                                    {/*            height="16"*/}
                                    {/*            fill="currentColor"*/}
                                    {/*            className="select-arrow"*/}
                                    {/*            viewBox="0 0 16 16"*/}
                                    {/*            style={{*/}
                                    {/*                position: 'absolute',*/}
                                    {/*                right: '10px',*/}
                                    {/*                top: '50%',*/}
                                    {/*                transform: 'translateY(-50%)',*/}
                                    {/*            }}*/}
                                    {/*        >*/}
                                    {/*            <path*/}
                                    {/*                fillRule="evenodd"*/}
                                    {/*                d="M1.646 5.646a.5.5 0 0 1 .708 0L8 11.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"*/}
                                    {/*            />*/}
                                    {/*        </svg>*/}
                                    {/*        <ul className="select-options">*/}
                                    {/*            {categories.map((cat) => (*/}
                                    {/*                <li*/}
                                    {/*                    key={cat.id}*/}
                                    {/*                    data-value={cat.id}*/}
                                    {/*                    onClick={() => {*/}
                                    {/*                        setSelectedCategory(cat.id);*/}
                                    {/*                        // setSelectOpen(false);*/}
                                    {/*                        // clearError('category');*/}
                                    {/*                    }}*/}
                                    {/*                >*/}
                                    {/*                    {cat.name}*/}
                                    {/*                </li>*/}
                                    {/*            ))}*/}
                                    {/*        </ul>*/}
                                    {/*    </div>*/}
                                    {/*    {errors.category && (*/}
                                    {/*        <span className="text-danger animate-slide-up">{errors.category}</span>*/}
                                    {/*    )}*/}
                                    {/*</div>*/}

                                    {/* Input Fields */}
                                    <div className="row g-4">
                                        {[
                                            {
                                                label: 'City *',
                                                value: city,
                                                setter: setCity,
                                                field: 'city',
                                                type: 'text',
                                                placeholder: 'New York',
                                            },
                                            {
                                                label: 'State *',
                                                value: state,
                                                setter: setState,
                                                field: 'state',
                                                type: 'text',
                                                placeholder: 'NY',
                                            },
                                            {
                                                label: 'Zip Code *',
                                                value: zip,
                                                setter: setZip,
                                                field: 'zip',
                                                type: 'text',
                                                placeholder: '12345',
                                            },
                                            {
                                                label: 'Estimate Due Date *',
                                                value: estimateDueDate,
                                                setter: setEstimateDueDate,
                                                field: 'estimateDueDate',
                                                type: 'date',
                                            },
                                            {
                                                label: 'Project Start Date *',
                                                value: startDate,
                                                setter: setStartDate,
                                                field: 'startDate',
                                                type: 'date',
                                            },
                                            {
                                                label: 'Project End Date *',
                                                value: endDate,
                                                setter: setEndDate,
                                                field: 'endDate',
                                                type: 'date',
                                            },
                                        ].map((field, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="input-wrapper">
                                                    <div className="label mb-1 fw-semibold">{field.label}</div>
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder || ''}
                                                        value={field.value}
                                                        onChange={(e) => handleInputChange(field.setter, field.field)(e.target.value)}
                                                        required
                                                    />
                                                    {errors[field.field] && (
                                                        <span className="text-danger animate-slide-up">
                                                            {errors[field.field]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Description */}
                                        <div className="col-12">
                                            <div className="label mb-1 fw-semibold">Description *</div>
                                            <div className="input-wrapper mb-5 d-block">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={description}
                                                    onChange={(val) => {
                                                        setDescription(val);
                                                        clearError('description');
                                                    }}
                                                    placeholder="Message"
                                                />
                                                {errors.description && (
                                                    <span className="text-danger animate-slide-up">
                                                        {errors.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents Section */}
                                    <div className="mb-2 fw-semibold fs-5">Documents Description</div>
                                    <div className="image-box d-block mb-5 text-center">
                                        {uploadedFiles.length === 0 ? (
                                            <>
                                                <Image
                                                    src="/assets/img/post.webp"
                                                    className="d-block mx-auto mb-2"
                                                    width={166}
                                                    height={161}
                                                    alt="Post Image"
                                                    loading="lazy"
                                                />
                                                <div className="fs-14 fw-medium">No Document added</div>
                                            </>
                                        ) : (
                                            uploadedFiles.map((file, index) => (
                                                <div key={index} className="mb-2">
                                                    <p className="fw-medium">{file.name}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* 🔴 API-level error */}
                                    {errors.api && (
                                        <div className="my-4">
                                            <p className="text-danger animate-slide-up">{errors.api}</p>
                                        </div>
                                    )}

                                    {/* Submit Button — ✅ Disabled during API call */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-3 w-100 justify-content-center mt-4"
                                        disabled={isSubmitting} // ✅ disables on submit
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