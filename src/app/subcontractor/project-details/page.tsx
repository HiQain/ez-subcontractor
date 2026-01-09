'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Slider from 'react-slick';

import '../../../styles/job-single.css';
import { useRouter } from "next/navigation";

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
    zip: string;
    description: string;
    start_date: string;
    end_date: string;
    estimate_due_date: string;
    status: string;
    category: { name: string };
    attachments: Attachment[];
    created_at: string;
    user: { // ✅ This is an object
        id: string;
        name: string;
        email: string;
        phone: string;
        company_name: string;
        profile_image_url: string | null;
    };
}

interface BannerImage {
    id: number;
    src: string;
    alt: string;
    // caption?: string; // optional: add later if needed
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

export default function ProjectSubcontractorDetailsPage() {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [verticalAds, setVerticalAds] = useState<Ad[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const leftSliderRef = useRef<Slider | null>(null);

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
        setProjectId(localStorage.getItem('project-id'));
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
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

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
        if (modalEl) {
            const modal = new (window as any).bootstrap.Modal(modalEl);
            modal.show();
        }
    };


    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec job-single position-static">
                    <div className="container">
                        <div style={{ backgroundColor: 'transparent !important' }} className="topbar">
                            <div className="d-flex align-items-center gap-2">
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
                                <div className="login-title fw-semibold fs-4 text-center">Project Details</div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Left Side */}
                            <div className="col-lg-9">
                                <div className="custom-card mb-4 mt-0 mx-0">
                                    <div
                                        className="mb-4 d-flex align-items-center justify-content-between gap-2 flex-wrap">
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
                                        {project.city}, {project.state}
                                    </div>

                                    <div
                                        className="mb-4"
                                        dangerouslySetInnerHTML={{ __html: project.description || '' }}
                                    />
                                    {project.state}

                                    <div className="title text-black fs-5 fw-semibold mb-3">Project Details</div>
                                    <div className="estimated-wrapper">
                                        <div className="estimated-card">
                                            <div className="icon">
                                                <Image src="/assets/img/icons/calander.svg" width={24} height={24}
                                                    alt="Calendar Icon" />
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
                                                <Image src="/assets/img/icons/calander.svg" width={24} height={24}
                                                    alt="Calendar Icon" />
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


                                {/* Attachments Section */}
                                <div className="custom-card mb-4 d-none">
                                    <div className="title text-black fs-5 fw-semibold mb-3">Attachments</div>

                                    <div className="mb-2 fw-medium">Links:</div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="link-wrapper mb-2">
                                            <div className="icon">
                                                <Image src="/assets/img/icons/link-blue.svg" width={16} height={16} alt="Link Icon" />
                                            </div>
                                            <Link
                                                href="https://unsplash.com/photos/a-couple-of-construction-workers-standing-next-to-each-other"
                                                className="fs-14 fw-medium text-black text-decoration-none"
                                            >
                                                https://unsplash.com/photos/a-couple-of-construction-workers-standing-next-to-each-other...
                                            </Link>
                                        </div>
                                    ))}

                                    <div className="mb-2 fw-medium">Files</div>
                                    <div className="pdf-wrapper mb-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={`pdf-card mb-2 ${i === 3 ? 'card-1' : ''}`}>
                                                <Image src="/assets/img/icons/pdf-img.svg" width={27} height={32} alt="Pdf Icon" />
                                                <div className="content">
                                                    <div className="fw-semibold text-black mb-1">master_craftsman.pdf</div>
                                                    <div className="fs-12">30 May 2024 at 4:36 pm</div>
                                                </div>
                                                {i === 2 && (
                                                    <Link href="#" style={{ marginLeft: 'auto' }}>
                                                        <Image src="/assets/img/icons/download.svg" width={18} height={18} alt="Download Icon" />
                                                    </Link>
                                                )}
                                                {i === 3 && (
                                                    <Link href="#" style={{ marginLeft: 'auto' }} className="icon">
                                                        <div className="percantage">50%</div>
                                                    </Link>
                                                )}
                                                <p className="mb-0">
                                                    Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit
                                                    interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia
                                                    nostra, per inceptos himenaeos.
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-2 fw-medium">Images</div>
                                    <div className="gallery-images">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <Image
                                                key={i}
                                                src={`/assets/img/gallery-img (${i}).webp`}
                                                width={112}
                                                height={117}
                                                alt={`Gallery Image ${i}`}
                                                className="img-fluid"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side */}
                            <div className="col-lg-3">
                                <div className="custom-card card-2">
                                    {project.user?.profile_image_url ? (
                                        <Image
                                            src={project.user?.profile_image_url}
                                            width={104}
                                            height={104}
                                            alt="P Icon"
                                            loading="lazy"
                                            className="d-block mx-auto mb-3"
                                        />
                                    ) : (
                                        <Image
                                            src="/assets/img/placeholder-round.png"
                                            width={104}
                                            height={104}
                                            alt="P Icon"
                                            loading="lazy"
                                            className="d-block mx-auto mb-3"
                                        />
                                    )}

                                    {project.user?.company_name && (
                                        <div className="title text-black fw-semibold text-center fs-5 mb-2">{project.user.company_name}</div>
                                    )}
                                    {project.user?.email && (
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2 flex-nowrap">
                                            <Image src="/assets/img/icons/message-dark.svg" width={20} height={20} alt="Message Icon" />
                                            <Link href={`mailto:${project.user.email}`} className="text-dark fw-medium text-truncate">
                                                {project.user.email}
                                            </Link>
                                        </div>
                                    )}

                                    {project.user?.phone && (
                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
                                            <Image src="/assets/img/icons/call-dark.svg" width={20} height={20} alt="Call Icon" />
                                            <Link href={`tel:${project.user.phone}`} className="text-dark fw-medium">
                                                {project.user.phone}
                                            </Link>
                                        </div>
                                    )}

                                    <Link
                                        href={{
                                            pathname: '/messages',
                                            query: {
                                                userId: project.user.id,
                                                name: project.user.name,
                                                email: project.user.email,
                                                phone: project.user.phone,
                                                companyName: project.user.company_name,
                                            },
                                        }}
                                        className="btn bg-dark w-100 justify-content-center rounded-3 mt-4 mb-3"
                                    >
                                        <Image src="/assets/img/Chat-light.svg" width={20} height={20} alt="Chat Icon" />
                                        <span className="p-1" style={{ color: 'white' }}>Chat Now</span>
                                    </Link>

                                    <div>
                                        {project.user?.email && (
                                            <Link href={`mailto:${project.user.email}`} className="btn btn-outline-dark rounded-3 w-100 justify-content-center mb-3">
                                                <Image src="/assets/img/icons/message-dark.svg" width={20} height={20} alt="Email Icon" />
                                                <span className='p-1'>Email</span>
                                            </Link>
                                        )}

                                        {project.user?.phone && (
                                            <Link href={`tel:${project.user.phone}`} className="btn btn-outline-dark rounded-3 w-100 justify-content-center">
                                                <Image src="/assets/img/icons/call-dark.svg" width={20} height={20} alt="Phone Icon" />
                                                <span className='p-1'>Phone</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>

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
            </div>

            <Footer />
        </>
    );
}
