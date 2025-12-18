// app/HomePageClient.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import { useRef, useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "../styles/home.css";
import "../styles/cards.css";
import "../styles/slick-slider.css";

export default function HomePage() {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const banners = [
        {
            id: 1,
            image: "/assets/img/home-banner-img1.webp",
            title: "Real Subs. Real Work. Real Results.",
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

    return (
        <div>
            <Header />

            <div className="sections overflow-hidden">
                {/* 🔹 Home Banner Section */}
                <section className="home-banner-sec">
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
                                        poster={banner.video_poster}
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
                                            <h1 className="main-title mb-4">{banner.title}</h1>
                                        ) : (
                                            <h2 className="main-title h1 mb-4">{banner.title}</h2>
                                        )}

                                        <div className="main-wrapper mx-auto" style={{ maxWidth: "876px" }}>
                                            <div className="buttons d-flex flex-wrap justify-content-center gap-3 mb-4">
                                                <Link
                                                    href={banner.btn1Link}
                                                    className="btn btn-primary home-hero-btn rounded-3 d-flex align-items-center gap-2"
                                                >
                                                    <span>{banner.btn1Text}</span>
                                                    <Image
                                                        src="/assets/img/icons/arrow-white.svg"
                                                        width={12}
                                                        height={14}
                                                        alt="Arrow"
                                                        style={{ filter: "invert(1)" }}
                                                    />
                                                </Link>
                                                <Link
                                                    href={banner.btn2Link}
                                                    className="btn bg-dark home-hero-btn rounded-3 d-flex align-items-center gap-2"
                                                >
                                                    <span className="text-white">{banner.btn2Text}</span>
                                                    <Image
                                                        src="/assets/img/icons/arrow-white.svg"
                                                        width={12}
                                                        height={14}
                                                        alt="Arrow"
                                                    />
                                                </Link>
                                            </div>
                                            <Link
                                                href="/subscription"
                                                className="notice-button d-flex justify-content-center text-white"
                                            >
                                                {banner.notice}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {/* 🔹 Custom Pagination */}
                    {/*<div className="custom-pagination d-flex align-items-center justify-content-center gap-2 mt-3">*/}
                    {/*    {banners.map((_, index) => (*/}
                    {/*        <button*/}
                    {/*            key={index}*/}
                    {/*            onClick={() => sliderRef.current?.slickGoTo(index)}*/}
                    {/*            className={`custom-dot ${currentSlide === index ? "active" : ""}`}*/}
                    {/*            aria-label={`Go to slide ${index + 1}`}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </section>

                {/* 🔹 Project Section */}
                <section className="project-sec py-5">
                    <div className="container">
                        <div className="content-wrapper mb-4 text-center">
                            <h2 className="main-title">
                                Explore real projects posted by top general contractors
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
                                                className="see-more-btn d-block btn btn-link p-0 text-primary"
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

                        <div className="buttons d-flex align-items-center justify-content-between gap-2 flex-wrap mt-5">
                            <div className="custom-pagination d-flex align-items-center justify-content-center gap-2" />
                            <Link href="/" className="btn bg-dark rounded-3">
                                <span className="text-white">See All</span>
                                <Image
                                    src="/assets/img/icons/arrow-white.svg"
                                    width={12}
                                    height={14}
                                    alt="Arrow"
                                    className="d-block"
                                />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
