// app/HomePageClient.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import React, {useRef, useState, useEffect} from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../../styles/home.css";
import "../../styles/cards.css";
import "../../styles/slick-slider.css";
import '../../styles/how-it-works.css';
import '../../styles/blog.css';
import '../../styles/about-us.css';
import '../../styles/testimonial.css';
import '../../styles/faqs.css';
import '../../styles/pricing.css';

import {generateToken, messaging} from "../notification/firebase";
import {onMessage} from "firebase/messaging";
import {showNotificationToast} from "../notification/toast";
import {useRouter} from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const sliderRef = useRef(null);
    const [selectedType, setSelectedType] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [faqs, setFaqs] = useState<any[]>([]);

    const sliderSettings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 600,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
    };
    const testimonials = Array(4).fill({
        rating: 4.5,
        date: 'Oct 12, 2025',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.`,
        author: 'Jonathan Louis',
    });

    const accountTypes = [
        {
            id: 'general_contractor',
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
            document.addEventListener('click', attemptPlay, {once: true});
            document.addEventListener('touchstart', attemptPlay, {once: true});
        }

        generateToken();
        onMessage(messaging, (payload) => {
            if (payload.notification) {
                showNotificationToast(
                    payload.notification.title || 'New Notification',
                    payload.notification.body || '',
                    'info'
                );
            }
        })
    }, []);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}data/faqs?type=subcontractor`;
                const res = await fetch(url);
                const json = await res.json();
                console.log(json);
                setFaqs(json.data || []);
            } catch (e) {
                setFaqs([]);
            }
        };
        loadFaqs();
    }, []);


    const banners = [
        {
            id: 1,
            image: "/assets/img/home-banner-img1.webp",
            title: "Subcontractor",
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

    const projects = Array(6).fill({
        category: "Framing",
        location: "Whittier, CA",
        description: `Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish.`,
        timeAgo: "23 mins ago",
    });

    const [expandedCards, setExpandedCards] = useState(new Set());
    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedCards);
        newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
        setExpandedCards(newExpanded);
    };

    const handleSelection = (typeId) => {
        setSelectedType(typeId);
        localStorage.setItem('role', typeId);
        if (typeId == 'general_contractor') {
            router.push('/auth/register/general_contractor');
        } else if (typeId == 'subcontractor') {
            router.push('/auth/register/subcontractor');
        } else if (typeId == 'affiliate') {
            router.push('/auth/register/affiliate');
        }
        console.log(typeId);
    };

    const sliderSettingsDesktop = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 600,
    };

    const sliderSettingsMobile = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 600,
    };

    return (
        <div>
            <Header/>

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
                                    <source src={banner.video} type="video/mp4"/>
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

            <section style={{
                background: `url('/assets/img/regular-bg.webp') center /cover no-repeat`,
            }} className="hero-sec about position-static">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-6 order-lg-2">
                            <Image
                                src="/assets/img/about-hero.webp"
                                width={708}
                                height={448}
                                alt="Section Image"
                                className="img-fluid w-100 hero-img"
                            />
                        </div>
                        <div className="col-lg-6 order-lg-1">
                            <div className="content-wrapper d-flex flex-column h-100 justify-content-center">
                                <Link href="#" className="btn btn-outline-dark mb-4">
                                    HOW IT WORKS
                                </Link>
                                <h1 className="mb-4">Connect with Subcontractors and get more Jobs</h1>
                                <p className="mb-3 fw-medium fs-5">
                                    We simplify how the construction industry connects, helping subcontractors find
                                    reliable projects,
                                    build long-term relationships with verified general contractors, and grow their
                                    businesses with ease.
                                </p>
                                <Link href="/auth/register/subcontractor" className="btn btn-primary rounded-3 mt-3">
                                    Join as a Subcontractor
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="project-sec pb-0">
                <div className="container">
                    <div className="content-wrapper mb-4 text-center">
                        <h2 className="main-title text-capitalize">
                            Explore real projects <br/>posted by top general contractors
                        </h2>
                    </div>

                    {/* Desktop Slider */}
                    <div className="main-card-slide d-none d-lg-block">
                        <Slider {...sliderSettingsDesktop}>
                            {projects.map((project, index) => (
                                <div key={index} className="px-2">
                                    <div className="custom-card">
                                        <div
                                            className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
                                            <Link
                                                href={`/projects?category=${project.category.toLowerCase()}`}
                                                className="btn btn-primary"
                                            >
                                                {project.category}
                                            </Link>
                                            <div className="date text-primary-gray-light">{project.timeAgo}</div>
                                        </div>
                                        <div className="title text-black fs-5 fw-semibold mb-3">
                                            {project.location}
                                        </div>
                                        <div className="description">
                                            {expandedCards.has(index)
                                                ? project.description.repeat(2)
                                                : `${project.description.substring(0, 150)}...`}
                                        </div>
                                        <button
                                            onClick={() => toggleExpand(index)}
                                            className="see-more-btn d-block btn btn-link p-0 text-primary d-none"
                                        >
                                            {expandedCards.has(index) ? "See less" : "See more"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    {/* Mobile Slider */}
                    <div className="main-card-slide d-block d-lg-none">
                        <Slider {...sliderSettingsMobile}>
                            {projects.map((project, index) => (
                                <div key={index} className="px-2">
                                    <div className="custom-card">
                                        <div
                                            className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
                                            <Link
                                                href={`/projects?category=${project.category.toLowerCase()}`}
                                                className="btn btn-primary"
                                            >
                                                {project.category}
                                            </Link>
                                            <div className="date text-primary-gray-light">{project.timeAgo}</div>
                                        </div>
                                        <div className="title text-black fs-5 fw-semibold mb-3">
                                            {project.location}
                                        </div>
                                        <div className="description">
                                            {expandedCards.has(index)
                                                ? project.description.repeat(2)
                                                : `${project.description.substring(0, 150)}...`}
                                        </div>
                                        <button
                                            onClick={() => toggleExpand(index)}
                                            className="see-more-btn d-block btn btn-link p-0 text-primary"
                                        >
                                            {expandedCards.has(index) ? "See less" : "See more"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

            <section className="pricing-sec">
                <div className="container">
                    <h2 className="main-title text-center fw-bold mb-3">Our Plans</h2>
                    <p className="text-center mb-5">Choose Your Plan and Start Getting Project Leads Today</p>
                    <div className="tab-content pricing-wrapper">
                        <div className="tab-pane fade show active pricing-content">
                            <div className="row g-3 justify-content-center">
                                <div className="col-lg-4 col-md-6">
                                    <div className="price-card  free">
                                        <div>
                                            <div className="pricing-header"><span className="title1 text-truncate">Free Registration</span>
                                                <div className="d-flex align-items-center gap-2"><span className="price">$<span
                                                    className="fw-bold">0</span></span></div>
                                            </div>
                                            <div className="pricing-body mb-3">
                                                <ul className="m-0 p-0 list-with-icon">
                                                    <li>See unlimited projects</li>
                                                    <li>No credit card required</li>
                                                    <li>Receive project notifications</li>
                                                    <li>Set radius to receive projects</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center flex-column">
                                            <div className="pricing-button w-100 p-0">
                                                <div className="pricing-button w-100 pt-0">
                                                    <Link href={'/auth/register/subcontractor'} className="btn">Buy Now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="price-card  free">
                                        <div>
                                            <div className="pricing-header"><span
                                                className="title1 text-truncate">Monthly Plan</span>
                                                <div className="d-flex align-items-center gap-2"><span className="price">$<span
                                                    className="fw-bold">50</span></span></div>
                                            </div>
                                            <div className="pricing-body mb-3">
                                                <ul className="m-0 p-0 list-with-icon">
                                                    <li>Full access to all job postings</li>
                                                    <li>Live chat + file exchange</li>
                                                    <li>View contractor contact info</li>
                                                    <li>Project timelines, budgets, requirements</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center flex-column">
                                            <div className="pricing-button w-100 p-0">
                                                <div className="pricing-button w-100 pt-0">
                                                    <Link href={'/auth/register/subcontractor'} className="btn">Buy Now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="price-card popular free">
                                        <div>
                                            <div className="pricing-header">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <span className="title1 mb-0 text-truncate">Yearly Plan</span>
                                                    <div className="custom-btn bg-white shadow p-2 rounded-pill"
                                                         style={{fontSize: '14px'}}>🔥 Popular
                                                    </div>
                                                </div>
                                                <div
                                                    className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <del className="fs-18 fw-medium text-black">$ 600</del>
                                                        <div
                                                            className="d-flex align-items-center gap-2 justify-content-between">
                                                            <span className="price">$<span className="fw-bold">400</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="custom-btn text-white py-2 px-3 rounded-pill"
                                                         style={{backgroundColor: 'rgb(220, 38, 38)', maxWidth: '130px'}}>33
                                                        % OFF
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pricing-body mb-3">
                                                <ul className="m-0 p-0 list-with-icon">
                                                    <li>Full access to all job postings</li>
                                                    <li>Live chat + file exchange</li>
                                                    <li>View contractor contact info</li>
                                                    <li>Full project details</li>
                                                    <li>Discounted extra category fee</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center flex-column">
                                            <div className="pricing-button w-100 p-0">
                                                <div className="pricing-button w-100 pt-0">
                                                    <Link href={'/auth/register/subcontractor'} className="btn">Buy Now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="blog-sec">
                <div className="container">
                    <h2 className="main-title text-center fw-bold mb-3">Our Blogs</h2>
                    <p className="text-center mb-5">Insights, ideas, and updates to help you stay informed and
                        inspired.</p>
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="row g-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="col-lg-4 col-md-6">
                                        <Link
                                            href="#"
                                            style={{
                                                background: `url('/assets/img/blog-img1.webp')`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                display: 'block',
                                            }}
                                            className="blog-wrapper"
                                        >
                                            <div className="blog-content d-flex h-100 justify-content-end flex-column">
                                                <div className="description text-white fw-medium mb-2">
                                                    The residential construction industry is evolving fast, with
                                                    homeowners demanding smarter,
                                                    greener, and more efficient spaces
                                                </div>
                                                <div
                                                    className="d-flex align-items-center gap-1 justify-content-between">
                                                    <div className="blog-icon d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/assets/img/blog-icon1.svg"
                                                            width={40}
                                                            height={40}
                                                            alt="Blog Icon"
                                                            loading="lazy"
                                                        />
                                                        <span
                                                            className="d-block fw-semibold text-white">Jonathan Louis</span>
                                                    </div>
                                                    <div style={{fontSize: '14px'}} className="date text-white">
                                                        Aug 02, 2025
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-primary py-5">
                <div className="container">
                    <div className="text-center">
                        <div className="text-center mb-4">
                            <h3 className={'fw-bold'}>Grow Your Business with Trusted Partnerships</h3>
                            <p className="mb-0">We connect skilled general contractors with high-quality projects,
                                reliable support, and streamlined workflows — so you can focus on building excellence.
                                If you’re licensed, insured, and ready to scale, apply today to become a preferred
                                contractor in our growing network.</p>
                        </div>
                        <div className="text-center">
                            <Link href="/auth/register/subcontractor"
                                  className="btn btn-light bg-white text-center d-lg-block mx-auto rounded-3"
                                  style={{width: '300px'}}>Join as Subcontractor</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="hero-sec faqs position-static">
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

            <Footer/>
        </div>
    );
}
