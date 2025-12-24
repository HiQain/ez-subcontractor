// app/HomePageClient.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import React, { useRef, useState, useEffect } from "react";

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
import { generateToken, messaging } from "../notification/firebase";
import { onMessage } from "firebase/messaging";
import { showNotificationToast } from "../notification/toast";
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
            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('touchstart', attemptPlay, { once: true });
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
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}data/faqs`;
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
            title: "Real Leads, Good subs and excellent results",
            btn1Text: "Post a Project",
            btn1Link: "/auth/login",
            btn2Text: "Search a Project",
            btn2Link: "/projects",
            notice: "No credit card required — enjoy a free 30-day trial.",
            video: "/assets/img/video.mp4",
            video_poster: "/assets/img/poster.webp",
        },
        // {
        //     id: 2,
        //     image: "/assets/img/home-banner-img2.webp",
        //     title: "Connects Contractors with Trusted, Licensed Subs.",
        //     btn1Text: "Post a Project",
        //     btn1Link: "/auth/login",
        //     btn2Text: "Search a Project",
        //     btn2Link: "/projects",
        //     notice: "No credit card required — enjoy a free to subscribe",
        // },
        // {
        //     id: 3,
        //     image: "/assets/img/home-banner-img3.webp",
        //     title: "Find Trusted Subs quickly, Post Your Project Free",
        //     btn1Text: "Post a Project",
        //     btn1Link: "/auth/login",
        //     btn2Text: "Search a Project",
        //     btn2Link: "/projects",
        //     notice: "No credit card required — enjoy a free to subscribe",
        // },
        // {
        //     id: 4,
        //     image: "/assets/img/home-banner-img4.webp",
        //     title:
        //         "Access Verified Contractor Projects — No Brokers, No Middlemen, Just Real Jobs Daily.",
        //     btn1Text: "Post a Project",
        //     btn1Link: "/auth/login",
        //     btn2Text: "Search a Project",
        //     btn2Link: "/projects",
        //     notice: "No credit card required — enjoy a free to subscribe",
        // },
        // {
        //     id: 5,
        //     image: "/assets/img/home-banner-img5.webp",
        //     title: "Stop Chasing Leads. Start Bidding Jobs.",
        //     btn1Text: "Post a Project",
        //     btn1Link: "/auth/login",
        //     btn2Text: "Search a Project",
        //     btn2Link: "/projects",
        //     notice: "No credit card required — enjoy a free to subscribe",
        // },
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
            <Header />

            <div className="sections overflow-hidden">

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
                                    <h1 className="mb-4">Connect with General contractors and get more Jobs</h1>
                                    <p className="mb-3 fw-medium fs-5">
                                        We simplify how the construction industry connects, helping subcontractors find reliable projects,
                                        build long-term relationships with verified general contractors, and grow their businesses with ease.
                                    </p>
                                    <Link href="/auth/register/general_contractor" className="btn btn-primary rounded-3 mt-3">
                                        Join as a General Contractor
                                    </Link>
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
                                <p className="mb-0">We connect skilled general contractors with high-quality projects, reliable support, and streamlined workflows — so you can focus on building excellence. If you’re licensed, insured, and ready to scale, apply today to become a preferred contractor in our growing network.</p>
                            </div>
                            <div className="text-center">
                                <Link href="#" className="btn btn-light bg-white text-center d-lg-block mx-auto" style={{width: '300px'}}>Join as General Contractor</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="project-sec py-5 border-bottom">
                    <div className="container">
                        <div className="content-wrapper mb-4 text-center">
                            <h2 className="main-title fw-bold" >
                                Explore Real Projects <br/>Posted by Top General Contractors
                            </h2>
                        </div>

                        {/* Desktop Slider */}
                        <div className="main-card-slide d-none d-lg-block">
                            <Slider {...sliderSettingsDesktop}>
                                {projects.map((project, index) => (
                                    <div key={index} className="px-2">
                                        <div className="custom-card">
                                            <div className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
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
                                            <div className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
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

                        <section className="service-sec pt-0">
                            <div className="container">
                                <div className="row g-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="col-lg-3 col-md-6">
                                            <div className="service-card">
                                                <div className="content-wrapper">
                                                    <div className="title">500+</div>
                                                    <div className="description">Verified Subcontractors</div>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/service-about-icon1.webp"
                                                    width={60}
                                                    height={60}
                                                    alt="Service Icon"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </section>


                <section className="blog-sec">
                    <div className="container">
                        <h2 className="main-title text-center fw-bold mb-3">Our Blogs</h2>
                        <p className="text-center mb-5">Insights, ideas, and updates to help you stay informed and inspired.</p>
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
                                                        The residential construction industry is evolving fast, with homeowners demanding smarter,
                                                        greener, and more efficient spaces
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1 justify-content-between">
                                                        <div className="blog-icon d-flex align-items-center gap-2">
                                                            <Image
                                                                src="/assets/img/blog-icon1.svg"
                                                                width={40}
                                                                height={40}
                                                                alt="Blog Icon"
                                                                loading="lazy"
                                                            />
                                                            <span className="d-block fw-semibold text-white">Jonathan Louis</span>
                                                        </div>
                                                        <div style={{ fontSize: '14px' }} className="date text-white">
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



                <section style={{ backgroundColor: '#fafbea' }} className="testimonial-sec">
                    <div className="container">
                        <div className="content-wrappper mb-5 text-center">
                            <Link href="#" className="btn btn-outline-dark mx-auto mb-4">
                                TESTIMONIALS
                            </Link>
                            <h2 className="main-title fw-bold">Trusted by Thousands of People</h2>
                        </div>

                        {/* ✅ Slick Slider */}
                        <div className="review-slider mb-5">
                            <Slider {...sliderSettings}>
                                {testimonials.map((_, index) => (
                                    <div key={index} className="review-item px-2">
                                        <div className="review-card">
                                            <div className="rating d-flex align-items-center justify-content-between gap-1 mb-3">
                                                <div className="d-flex align-items-center gap-1">
                                                    <div className="review d-flex align-items-center gap-1">
                                                        <Image
                                                            src="/assets/img/icons/review.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Review"
                                                            loading="lazy"
                                                        />
                                                        <Image
                                                            src="/assets/img/icons/review.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Review"
                                                            loading="lazy"
                                                        />
                                                        <Image
                                                            src="/assets/img/icons/review.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Review"
                                                            loading="lazy"
                                                        />
                                                        <Image
                                                            src="/assets/img/icons/review.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Review"
                                                            loading="lazy"
                                                        />
                                                        <Image
                                                            src="/assets/img/icons/review-1.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Review"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <span className="fw-medium">4.5/5</span>
                                                </div>
                                                <div className="fs-12 text-gray-light fw-medium">Oct 12, 2025</div>
                                            </div>
                                            <p className="fw-medium mb-3">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci
                                                lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                                                Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna
                                                pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
                                            </p>
                                            <div className="author d-flex align-items-center gap-1 justify-content-between">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/client-1.webp"
                                                        width={62}
                                                        height={62}
                                                        alt="Client"
                                                        loading="lazy"
                                                    />
                                                    <div className="fw-semibold">Jonathan Louis</div>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/truspoilt.webp"
                                                    width={120}
                                                    height={60}
                                                    alt="Trustpoilt"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </section>

                {/* Faqs */}
                <section className="hero-sec faqs position-static">
                    <div className="container py-5">
                        <div className="row g-4">
                            <div className="col-lg-5">
                                <Image
                                    src="/assets/img/about-section.webp"
                                    style={{ objectFit: 'cover', minHeight: '550px',
                                        borderRadius: '8px'}}
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
                                    {faqs.slice(0, 4).map((faq, idx) => {
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
                                <Link href="/faq" className="btn btn-primary rounded-3 mt-5">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <Footer />
        </div>
    );
}
