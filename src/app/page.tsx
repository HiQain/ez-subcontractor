"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import React, { useRef, useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "../styles/home.css";
import "../styles/cards.css";
import "../styles/slick-slider.css";
import { useRouter } from "next/navigation";

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

const stripHtml = (html: string): string => {
    if (typeof window === 'undefined') {
        // Fallback for SSR: simple regex (less robust but safe)
        return html
            .replace(/<[^>]*>?/gm, '') // remove tags
            .replace(/&nbsp;/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Client-side: use DOM parser (more accurate)
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || '')
        .replace(/\s+/g, ' ')
        .trim();
};

export default function HomePage() {
    const router = useRouter();
    const sliderRef = useRef<Slider>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('');
    const [currentSlide, setCurrentSlide] = useState(0);

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const accountTypes = [
        {
            id: 'general-contractor',
            title: 'General Contractor',
            icon: '/assets/img/icons/construction-worker.webp',
        },
        {
            id: 'subcontractor',
            title: 'Subcontractor',
            icon: '/assets/img/icons/settings.svg',
        },
        {
            id: 'affiliate',
            title: 'Affiliate',
            icon: '/assets/img/icons/portfolio.webp',
        },
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
            switch (role) {
                case 'general-contractor':
                    router.replace('/general-contractor/dashboard');
                    return;

                case 'subcontractor':
                    router.replace('/subcontractor/dashboard');
                    return;

                case 'affiliate':
                    router.replace('/affiliate/dashboard');
                    return;

                default:
                    router.replace('/auth/login');
                    return;
            }
        }

        setCheckingAuth(false);
    }, [router]);

    // 🔹 Geolocation (optional — kept as requested)
    const [location, setLocation] = useState<{ lat: number; lng: number; error?: string } | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    setLocation({ lat: 0, lng: 0, error: error.message });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            setLocation({ lat: 0, lng: 0, error: 'Geolocation not supported' });
        }
    }, []);

    // 🔹 Page setup & Firebase init
    useEffect(() => {
        document.title = "Construction Projects & Sub-Contractors Network";
        const metaDescription = document.querySelector('meta[name="description"]');
        const content =
            'The trusted platform connecting General Contractors with verified Sub-Contractors. Post or find construction projects, bid on real work, and build your team for thank-you. Free Trial Available!';

        if (metaDescription) {
            metaDescription.setAttribute('content', content);
        } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'description';
            newMeta.content = content;
            document.head.appendChild(newMeta);
        }

        // Try to play video on first interaction
        const video = document.querySelector('.hero-video') as HTMLVideoElement;
        if (video) {
            const attemptPlay = () => {
                video.play().catch(() => { /* silent fail */ });
            };
            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('touchstart', attemptPlay, { once: true });
        }
    }, []);

    // 🔹 Fetch Projects
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/projects?limit=6`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    // Optional: prevent caching
                    // next: { revalidate: 300 },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error('API Error:', data);
                throw new Error(data.message || 'Failed to load projects');
            }

            let fetchedProjects: Project[] = data?.data?.data || [];

            // ✅ 1. Limit to 6 (client-side safety)
            fetchedProjects = fetchedProjects.reverse().slice(0, 6);

            // ✅ 2. Sort by newest first (created_at DESC)
            const sortedProjects = fetchedProjects.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setProjects(sortedProjects);
        } catch (err: any) {
            console.error('Fetch projects error:', err);
            // Optionally set error state
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Call fetch on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // 🔹 Format time ago
    const formatTimeAgo = (dateString: string): string => {
        const now = new Date();
        const past = new Date(dateString);
        const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} min${interval > 1 ? 's' : ''} ago`;

        return 'Just now';
    };

    // 🔹 Expand/Collapse by project id
    const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
    const toggleExpand = (id: number) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    // 🔹 Handle role selection
    const handleSelection = (typeId: string) => {
        setSelectedType(typeId);
        localStorage.setItem('role', typeId);
        if (typeId === 'general-contractor') {
            router.push('/home-general-contractor');
        } else if (typeId === 'subcontractor') {
            router.push('/home-subcontractor');
        } else if (typeId === 'affiliate') {
            router.push('/home-affiliate');
        }
    };

    // 🔹 Slider settings
    const bannerSettings = {
        infinite: true,
        fade: true,
        autoplay: false,
        autoplaySpeed: 4000,
        speed: 1500,
        arrows: false,
        pauseOnHover: false,
        dots: false,
        beforeChange: (_: number, next: number) => setCurrentSlide(next),
    };

    const sliderSettingsDesktop = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 600,
    };

    const sliderSettingsMobile = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 600,
    };

    // 🔹 Banners
    const banners = [
        {
            id: 1,
            image: "/assets/img/home-banner-img1.webp",
            title: "Real Leads, Good Subs and Excellent Results",
            btn1Text: "Post a Project",
            btn1Link: "/auth/login",
            btn2Text: "Search a Project",
            btn2Link: "/projects",
            notice: "No credit card required — enjoy a free 30-day trial.",
            video: "/assets/img/video.mp4",
            video_poster: "/assets/img/poster.webp",
        },
    ];

    if (checkingAuth) {
        return null;
    }

    return (
        <div>
            <Header />

            <div className="sections overflow-hidden">
                {/* 🔹 Home Banner Section */}
                <section className="home-banner-sec">
                    <Slider ref={sliderRef} {...bannerSettings}>
                        {banners.map((banner) => (
                            <div key={banner.id}>
                                <div className="banner-wrapper">
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster="/assets/img/poster.webp"
                                        className="hero-video"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            zIndex: -1,
                                        }}
                                    >
                                        <source src={banner.video} type="video/mp4" />
                                    </video>
                                    <div className="content-wrapper text-center text-white px-3">
                                        {banner.id === 1 ? (
                                            <h1 className="main-title mb-4 text-capitalize">{banner.title}</h1>
                                        ) : (
                                            <h2 className="main-title h1 mb-4 text-capitalize">{banner.title}</h2>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </section>

                {/* 🔹 Role Selection */}
                <section className="role-cards py-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 offset-xl-2">
                                <div className="row justify-content-center">
                                    {accountTypes.map((acc) => (
                                        <div className="col-lg-4 col-md-6 mb-4" key={acc.id}>
                                            <div
                                                className={`account-card shadow-sm p-4 text-center ${selectedType === acc.id ? 'active' : ''}`}
                                                onClick={() => handleSelection(acc.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Image
                                                    src={acc.icon}
                                                    width={50}
                                                    height={50}
                                                    alt={`${acc.title} Icon`}
                                                    className="mb-3"
                                                />
                                                <h5 className="title fw-semibold">{acc.title}</h5>
                                                <input
                                                    type="radio"
                                                    name="accountType"
                                                    className="account-radio visually-hidden"
                                                    value={acc.id}
                                                    checked={selectedType === acc.id}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🔹 Project Section */}
                <section className="project-sec py-5 mb-5">
                    <div className="container">
                        <div className="content-wrapper mb-4 text-center">
                            <h2 className="main-title">
                                Explore real projects posted by top general contractors
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading projects...</span>
                                </div>
                                <p className="mt-3 text-muted">Fetching latest projects</p>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No active projects at the moment.</p>
                                <Link href="/auth/login" className="btn btn-primary mt-2">
                                    Post Your First Project
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Slider */}
                                <div className="main-card-slide d-none d-lg-block">
                                    <Slider {...sliderSettingsDesktop}>
                                        {projects.map((project) => (
                                            <div key={project.id} className="px-2">
                                                <div className="custom-card p-4 h-100" style={{ minHeight: '244px' }}>
                                                    <div className="topbar d-flex align-items-center justify-content-between gap-1 mb-3">
                                                        <div
                                                            className="btn btn-primary btn-sm text-truncate fs-14"
                                                        >
                                                            {project.category.name}
                                                        </div>
                                                        <div className="date text-primary-gray-light fs-12 text-end" style={{ minWidth: '100px' }}>
                                                            {formatTimeAgo(project.created_at)}
                                                        </div>
                                                    </div>
                                                    <div className="title text-black fs-5 fw-semibold mb-3">
                                                        {project.city}, {project.state}
                                                    </div>
                                                    <div className="description mb-3 text-truncate3 fw-normal">
                                                        {stripHtml(project.description)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>

                                {/* Mobile Slider */}
                                <div className="main-card-slide d-block d-lg-none">
                                    <Slider {...sliderSettingsMobile}>
                                        {projects.map((project) => (
                                            <div key={project.id} className="px-2">
                                                <div className="custom-card p-4">
                                                    <div className="topbar mb-3">
                                                        <div className="date text-primary-gray-light fs-12 mb-3">
                                                            {formatTimeAgo(project.created_at)}
                                                        </div>
                                                        <div
                                                            className="btn btn-primary btn-sm px-3 py-1 text-start"
                                                        >
                                                            {project.category.name}
                                                        </div>
                                                    </div>
                                                    <div className="title text-black fs-5 fw-semibold mb-3">
                                                        {project.city}, {project.state}
                                                    </div>
                                                    <div className="description mb-3 text-truncate fw-normal">
                                                        {stripHtml(project.description)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}