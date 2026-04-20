// app/HomePageClient.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Slider from "react-slick";
import React, { useRef, useState, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ExpandableHtmlContent from "../components/ExpandableHtmlContent";

import "../../styles/home.css";
import "../../styles/cards.css";
import "../../styles/slick-slider.css";
import "../../styles/how-it-works.css";
import "../../styles/blog.css";
import "../../styles/about-us.css";
import "../../styles/testimonial.css";
import "../../styles/faqs.css";
import "../../styles/pricing.css";

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

const formatRouteLocation = (pathname: string): string | null => {
    const prefix = "/home-general-contractor2-";
    if (!pathname.startsWith(prefix)) {
        return null;
    }

    const locationSlug = pathname.slice(prefix.length).trim();
    if (!locationSlug) {
        return null;
    }

    return locationSlug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

export default function HomePage() {
    const pathname = usePathname();
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [howItWorks, setHowItWorks] = useState<any>(null);
    const [blogs, setBlogs] = useState([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [plans, setPlans] = useState<any[]>([]);
    const locationLabel = formatRouteLocation(pathname);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setBlogsLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/latest?type=general_contractor`,
                    {
                        method: 'GET',
                        headers: { Accept: 'application/json' },
                    }
                );

                const json = await res.json();

                if (json.success && Array.isArray(json.data)) {
                    setBlogs(json.data.slice(0, 6));
                } else {
                    setBlogs([]);
                }
            } catch (error) {
                console.error('Failed to load blogs:', error);
                setBlogs([]);
            } finally {
                setBlogsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatBlogDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    };

    const getExcerpt = (html, limit = 140) => {
        const text = stripHtml(html);
        return text.length > limit ? text.slice(0, limit) + '...' : text;
    };

    useEffect(() => {
        document.title = "Construction Projects & Sub-Contractors Network";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute(
                'content',
                'The trusted platform connecting General Contractors with verified Sub-Contractors. Post or find construction projects, bid on real work, and build your team for thank-you. Free Trial Available!'
            );
        } else {
            const newMetaDescription = document.createElement('meta');
            newMetaDescription.name = 'description';
            newMetaDescription.content =
                'The trusted platform connecting General Contractors with verified Sub-Contractors. Post or find construction projects, bid on real work, and build your team for thank-you. Free Trial Available!';
            document.head.appendChild(newMetaDescription);
        }


        const video = document.querySelector('.hero-video') as HTMLVideoElement;
        if (video) {
            // Try to play on user interaction (e.g., first click/tap)
            const attemptPlay = () => {
                video.play().catch(() => {
                    // Still blocked? Show a subtle "play" button over hero
                    // (optional UX enhancement)
                });
            };
            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('touchstart', attemptPlay, { once: true });
        }
    }, []);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}data/faqs?type=general_contractor`;
                const res = await fetch(url);
                const json = await res.json();
                console.log('faq', json);
                setFaqs(json.data || []);
            } catch (e) {
                setFaqs([]);
            }
        };
        loadFaqs();
    }, []);

    useEffect(() => {
        const loadHowItWorks = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}data/how-it-works?type=general_contractor`;
                const res = await fetch(url);
                const json = await res.json();
                console.log(json);
                if (json.success && json.data?.length > 0) {
                    setHowItWorks(json.data[0]); // Take first item (API returns array)
                } else {
                    setHowItWorks({
                        title: "How It Works",
                        description: "We help subcontractors find projects fast. No middlemen. Just real jobs."
                    });
                }
            } catch (e) {
                console.error('Failed to load How It Works:', e);
                setHowItWorks({
                    title: "How It Works",
                    description: "Unable to load content. Please try again later."
                });
            }
        };

        loadHowItWorks();
    }, []);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/public/plans?role=general_contractor`);
                const text = await res.text();

                if (!text.startsWith('{') && !text.startsWith('[')) {
                    throw new Error('Unauthorized or server returned HTML. Please log in.');
                }

                const data = JSON.parse(text);

                if (res.ok && data.success && Array.isArray(data.data?.plans)) {
                    const transformedPlans = data.data.plans.map((plan: any) => ({
                        id: plan.id,
                        title: plan.plan_name,
                        price: parseFloat(plan.price),
                        discount: plan.discount_price,
                        features: plan.features.map((f: any) => f.feature),
                        hasNote: plan.type === 'trial',
                        isPopular: plan.label === 'Popular',
                        showStrike: !!plan.discount_price,
                        saveText: plan.discount_price ? `${Math.round(100 - (parseFloat(plan.discount_price) / parseFloat(plan.price)) * 100)}% OFF` : '',
                        saveColor: '#DC2626',
                        duration_days: plan.duration_days,
                        type: plan.type,
                        stripe_price_id: plan.stripe_price_id,
                        extra_category_price: plan.extra_category_price,
                        is_subscribed: plan.is_subscribed,
                        is_cancelled: plan.is_cancelled,
                    }));

                    setPlans(transformedPlans);
                } else {
                    throw new Error(data.message?.[0] || 'Failed to load plans');
                }
            } catch (err: any) {
                console.error('Error fetching plans:', err);
            }
        };

        fetchPlans();
    },);

    const renderNoteCard = () => (
        <div className="note-card d-flex align-items-start gap-1">
            <Image
                src="/assets/img/icons/note.webp"
                width={24}
                height={24}
                alt="Note"
                loading="lazy"
                className="d-block"
            />
            <div className="content">
                <span style={{ fontSize: '14px' }} className="d-block fw-semibold mb-1">
                    Note
                </span>
                <p style={{ fontSize: '12px' }} className="mb-0">
                    After your trial ends, you’ll need to subscribe to keep bidding on projects, chatting with contractors, and accessing premium tools.
                </p>
            </div>
        </div>
    );

    const renderPlanCard = (plan: any) => (
        <div key={plan.id} className="col-lg-4 col-md-6">
            <div className={`price-card ${plan.isPopular ? 'popular' : ''} free`}>
                <div>
                    <div className="pricing-header">
                        {plan.isPopular ? (
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="title1 mb-0 text-truncate">{plan.title}</span>
                                <div
                                    style={{ fontSize: '14px' }}
                                    className="custom-btn bg-white shadow p-2 rounded-pill"
                                >
                                    🔥 Popular
                                </div>
                            </div>
                        ) : (
                            <span className="title1 text-truncate">{plan.title}</span>
                        )}



                        {plan.showStrike ? (
                            <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <del className="fs-18 fw-medium text-black">$ {Math.trunc(plan.price)}</del>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <span className="price">
                                            $
                                            <span className="fw-bold">
                                                {Math.trunc(plan.discount ? plan.price - plan.price / 100 * plan.discount : plan.price)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                {plan.saveText && (
                                    <div
                                        style={{ backgroundColor: plan.saveColor, maxWidth: '130px' }}
                                        className="custom-btn text-white py-2 px-3 rounded-pill"
                                    >
                                        {Math.trunc(plan.discount)} % OFF
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <span className="price">
                                    $<span className="fw-bold">{Math.trunc(plan.price)}</span>
                                </span>
                                {plan.saveText && (
                                    <button
                                        type="button"
                                        style={{ backgroundColor: plan.saveColor }}
                                        className="custom-btn text-white p-2 rounded-pill"
                                    >
                                        {plan.saveText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pricing-body mb-3">
                        <ul className="m-0 p-0 list-with-icon">
                            {plan.features.map((feature: string, i: number) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="d-flex align-items-center flex-column">
                    {plan.hasNote && renderNoteCard()}
                    <div className="pricing-button w-100 pt-0">
                        <a
                            href={'/auth/register/subcontractor'}
                            className={plan.is_subscribed ? 'btn btn-primary bg-primary' : 'btn'}
                        >
                            {plan.is_subscribed && plan.status !== 'cancelled'
                                ? 'Current Plan'
                                : 'Buy Now'}
                        </a>
                    </div >
                </div >
            </div >
        </div >
    );

    const banners = [
        {
            id: 1,
            image: "/assets/img/home-banner-img1.webp",
            title: "General Contractor",
            btn1Text: "Post a Project",
            btn1Link: "/auth/login",
            btn2Text: "Search a Project",
            btn2Link: "/projects",
            notice: "No credit card required — enjoy a free 30-day trial.",
            video: "/assets/img/video.mp4",
            video_poster: "/assets/img/poster.webp",
        },
    ];

    const bannerSettings = {
        infinite: true,
        fade: true,
        autoplay: false,
        autoplaySpeed: 4000,
        speed: 1500,
        arrows: false,
        pauseOnHover: false,
        dots: false,
        beforeChange: (_, next) => setCurrentSlide(next),
    };

    return (
        <div>
            <Header />

            <section className="home-banner-sec page-banner">
                <Slider ref={sliderRef} {...bannerSettings}>
                    {banners.map((banner) => (
                        <div key={banner.id}>
                            <div
                                className="banner-wrapper"
                            >
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
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
                                    {/* ✅ First slide <h1>, others <h2> */}
                                    {banner.id === 1 ? (
                                        <h1 className="main-title mb-0">{banner.title}</h1>
                                    ) : (
                                        <h2 className="main-title h1 mb-0">{banner.title}</h2>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            <section id="howsItsWorks" style={{
                background: `url('/assets/img/regular-bg.webp') center /cover no-repeat`,
            }} className="hero-sec about position-static">
                <div className="container">
                    {howItWorks ? (
                        <div className="row g-4">
                            <div className="col-lg-6 order-2 order-lg-2">
                                <Image
                                    src={howItWorks.image}
                                    width={708}
                                    height={448}
                                    alt="Section Image"
                                    className="img-fluid w-100 hero-img"
                                />
                            </div>
                            <div className="col-lg-6 order-1 order-lg-1">
                                <div className="content-wrapper d-flex flex-column h-100 justify-content-center">
                                    <Link href="#" className="btn btn-outline-dark mb-4">
                                        HOW IT WORKS
                                    </Link>
                                    <h1 className="mb-4">{howItWorks.title}</h1>
                                    <ExpandableHtmlContent
                                        className="mb-3 fw-medium"
                                        html={howItWorks.description.replace(/\n/g, '<br />')}
                                    />
                                    <Link href="/auth/register/general-contractor" className="btn btn-primary rounded-3 mt-3">
                                        Join as a General Contractor
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section id="plans" className="pricing-sec">
                <div className="container">
                    <h2 className="main-title text-center fw-bold mb-3">Our Plans</h2>
                    <p className="text-center mb-5">Choose Your Plan and Start Getting Project Leads Today</p>
                    <div className="tab-content pricing-wrapper">
                        <div className="tab-pane fade show active pricing-content">
                            <div className="row g-3 justify-content-center">
                                {plans.length > 0 ? (
                                    plans.map((plan) => renderPlanCard(plan))
                                ) : (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading projects...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Fetching plans</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ background: "#f4efe6" }}>
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="pe-lg-4">
                                <span className="btn btn-outline-dark mb-3">WHY EZ SUBCONTRACTOR</span>
                                <h2 className="fw-bold mb-3">
                                    {locationLabel
                                        ? `A smarter way to win and manage work in ${locationLabel}`
                                        : "A smarter way to win and manage more construction work"}
                                </h2>
                                <p className="text-muted mb-3">
                                    General contractors need more than leads. They need a reliable way to post projects,
                                    attract relevant subcontractors, and keep momentum moving from first interest to real job progress.
                                </p>
                                <p className="text-muted mb-0">
                                    This platform helps you reduce dead-end outreach, improve visibility, and stay focused on active opportunities that match your business goals.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                                        <h3 className="h5 fw-bold mb-2">Qualified Reach</h3>
                                        <p className="text-muted mb-0">
                                            Connect with subcontractors who are already looking for active project opportunities.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                                        <h3 className="h5 fw-bold mb-2">Faster Decisions</h3>
                                        <p className="text-muted mb-0">
                                            Keep your bidding and contractor discovery process simpler and more organized.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                                        <h3 className="h5 fw-bold mb-2">Local Advantage</h3>
                                        <p className="text-muted mb-0">
                                            Build visibility in the markets where you want to grow and stay competitive.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm">
                                        <h3 className="h5 fw-bold mb-2">Less Friction</h3>
                                        <p className="text-muted mb-0">
                                            Spend less time chasing scattered contacts and more time closing real work.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="blogs" className="blog-sec">
                <div className="container">
                    <h2 className="main-title text-center fw-bold mb-3">Our Blogs</h2>
                    <p className="text-center mb-5">
                        Insights, ideas, and updates to help you stay informed and inspired.
                    </p>

                    {blogsLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-3 text-muted">Loading blogs...</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <p className="text-center text-muted">No blogs available.</p>
                    ) : (
                        <div className="row g-4">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="col-lg-4 col-md-6">
                                    <Link
                                        href={{
                                            pathname: "/blog-detail",
                                            query: { slug: blog.slug, role: 'general_contractor' },
                                        }}
                                        className="text-decoration-none text-dark d-block h-100"
                                    >
                                        <div className="blog-card border rounded-4 overflow-hidden h-100 bg-white">

                                            {/* 🔹 Image */}
                                            <div
                                                className="blog-image"
                                                style={{
                                                    height: "260px",
                                                    position: "relative",
                                                    borderBottom: "1px solid #e9ecef",
                                                }}
                                            >
                                                <Image
                                                    src={blog.featured_image}
                                                    alt={blog.title}
                                                    fill
                                                    className="img-fluid"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>

                                            {/* 🔹 Content BELOW image */}
                                            <div className="p-3">

                                                {/* Author */}
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <Image
                                                        src={
                                                            blog.author?.profile_image ||
                                                            "/assets/img/profile-placeholder.webp"
                                                        }
                                                        width={36}
                                                        height={36}
                                                        className="rounded-circle"
                                                        alt={blog.author?.name}
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                    <div>
                                                        <p className="mb-0 fw-bold fs-14">
                                                            {blog.author?.name}
                                                        </p>
                                                        <p className="mb-0 text-muted fs-13">
                                                            {formatBlogDate(blog.created_at)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Blog Title */}
                                                <p className="fw-semibold fs-15 mb-0">
                                                    {getExcerpt(blog.title, 90)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="bg-primary py-5">
                <div className="container">
                    <div className="text-center">
                        <div className="text-center mb-4">
                            <h3 className={'fw-bold'}>Grow Your Business with Trusted Partnerships</h3>
                            <p className="mb-0">We connect skilled general contractors with high-quality projects, reliable support, and streamlined workflows — so you can focus on building excellence. If you’re licensed, insured, and ready to scale, apply today to become a preferred contractor in our growing network.</p>
                        </div>
                        <div className="text-center">
                            <Link href="/auth/register/general-contractor" className="btn btn-light bg-white text-center d-lg-block mx-auto rounded-3" style={{ width: '300px' }}>Join as General Contractor</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ background: "linear-gradient(180deg, #ffffff 0%, #eef4f7 100%)" }}>
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-5">
                            <div className="pe-lg-4">
                                <span className="btn btn-outline-dark mb-3">PROJECT MOMENTUM</span>
                                <h2 className="fw-bold mb-3">
                                    Keep every opportunity moving from inquiry to awarded work
                                </h2>
                                <p className="text-muted mb-4">
                                    A strong contractor network is not just about visibility. It is about responding faster,
                                    staying organized, and keeping qualified trade partners close when deadlines tighten.
                                </p>
                                <Link
                                    href="/auth/register/general-contractor"
                                    className="btn btn-primary rounded-3"
                                >
                                    Start Your Free Trial
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm text-center">
                                        <div className="fs-2 fw-bold text-primary mb-2">01</div>
                                        <h3 className="h6 fw-bold mb-2">Post Faster</h3>
                                        <p className="text-muted mb-0">
                                            Publish scopes quickly and get in front of the right subcontractors sooner.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm text-center">
                                        <div className="fs-2 fw-bold text-primary mb-2">02</div>
                                        <h3 className="h6 fw-bold mb-2">Compare Better</h3>
                                        <p className="text-muted mb-0">
                                            Review interest with more clarity and spend time on the most promising matches.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="bg-white rounded-4 p-4 h-100 shadow-sm text-center">
                                        <div className="fs-2 fw-bold text-primary mb-2">03</div>
                                        <h3 className="h6 fw-bold mb-2">Scale Smarter</h3>
                                        <p className="text-muted mb-0">
                                            Build a repeatable workflow that supports both urgent needs and long-term growth.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: "#f8f5ee" }}>
                <div className="container">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-7">
                            <div className="h-100 bg-white rounded-4 p-4 p-lg-5 shadow-sm">
                                <span className="btn btn-outline-dark mb-3">
                                    BUILT FOR REAL JOBS
                                </span>
                                <h2 className="fw-bold mb-3">
                                    {locationLabel
                                        ? `Build stronger contractor connections in ${locationLabel}`
                                        : "Keep your pipeline full with faster subcontractor coordination"}
                                </h2>
                                <p className="text-muted mb-3">
                                    EZ Subcontractor helps general contractors stay ahead with a cleaner bidding flow,
                                    faster trade outreach, and qualified subcontractor visibility in one place.
                                </p>
                                <p className="text-muted mb-0">
                                    From urgent scopes to long-term relationships, you can organize opportunities,
                                    reach dependable crews, and move projects forward without wasting time chasing the
                                    wrong contacts.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="h-100 rounded-4 p-4 p-lg-5 text-white" style={{ background: "linear-gradient(135deg, #1d3557 0%, #355c7d 100%)" }}>
                                <h3 className="fw-bold mb-4">Why contractors stay active here</h3>
                                <div className="d-flex flex-column gap-3">
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Faster bid coverage</h4>
                                        <p className="mb-0 opacity-75">Reach more relevant trades quickly when timelines are tight.</p>
                                    </div>
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Better local visibility</h4>
                                        <p className="mb-0 opacity-75">Show up where subcontractors are already looking for active work.</p>
                                    </div>
                                    <div>
                                        <h4 className="h6 fw-bold mb-1">Less admin friction</h4>
                                        <p className="mb-0 opacity-75">Keep lead generation and contractor discovery in one streamlined workflow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="hero-sec faqs position-static">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-lg-5">
                            <Image
                                src="/assets/img/about-section.webp"
                                style={{
                                    objectFit: 'cover', minHeight: '550px',
                                    borderRadius: '8px'
                                }}
                                className="img-fluid w-100"
                                alt="Section Image"
                                width={600}
                                height={400}
                                loading="lazy"
                            />
                        </div>
                        <div className="col-lg-7">
                            <h2 className="main-title mb-3 fw-bold mb-4">FAQs</h2>
                            <div className="accordion mb-3" id="accordionExample">
                                {faqs.map((faq, idx) => {
                                    const num = idx + 1;
                                    const collapseId = `collapse${num}`;
                                    const headingId = `heading${num}`;
                                    return (
                                        <div className="accordion-item" key={faq.id || num}>
                                            <h2 className="accordion-header" id={headingId}>
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#${collapseId}`}
                                                    aria-expanded="false"
                                                    aria-controls={collapseId}
                                                >
                                                    {faq.question}
                                                </button>
                                            </h2>
                                            <div
                                                id={collapseId}
                                                className="accordion-collapse collapse"
                                                aria-labelledby={headingId}
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
