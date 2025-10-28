'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';

// ✅ Import Slider from react-slick
import Slider from 'react-slick';

// ✅ CSS is already imported globally in layout.tsx (recommended)
// But if you prefer here, it's okay too:
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../styles/main-page.css';

export default function Home() {
    const [searchService, setSearchService] = useState('');
    const [searchZip, setSearchZip] = useState('');

    // Sample services (not used in render below, but kept for reference)
    const services = [
        { name: 'Landscaping', icon: '/assets/img/service/main-service-icon (3).webp' },
        { name: 'Plumbing', icon: '/assets/img/service/main-service-icon (4).webp' },
        { name: 'Remodeling', icon: '/assets/img/service/main-service-icon (1).webp' },
        { name: 'Painting', icon: '/assets/img/service/main-service-icon (5).webp' },
        { name: 'Roofing', icon: '/assets/img/service/main-service-icon (2).webp' },
        { name: 'Concrete', icon: '/assets/img/service/main-service-icon (6).webp' },
        { name: 'Windows', icon: '/assets/img/service/main-service-icon (7).webp' },
        { name: 'Welding', icon: '/assets/img/service/main-service-icon (8).webp' },
        { name: 'Masonary', icon: '/assets/img/service/main-service-icon (9).webp' },
    ];

    const projects = Array(4).fill({
        category: 'Framing',
        location: 'Whittier, CA',
        description:
            'Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish.',
    });

    // ✅ Slick settings
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
        ],
    };

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Banner Section */}
                <section
                    className="banner-sec"
                    style={{
                        backgroundImage: `url('/assets/img/banner-img.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="container">
                        <div className="content-wrapper">
                            <h1 className="main-title text-white text-center mb-4">
                                Find subcontractors you can trust for free
                            </h1>
                            <div className="main-wrapper mx-auto" style={{ maxWidth: '876px' }}>
                                <form
                                    className="form-wrapper"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log('Search:', { searchService, searchZip });
                                    }}
                                >
                                    <div className="input-wrapper">
                                        <Image
                                            src="/assets/img/search-icon.svg"
                                            width={20}
                                            height={20}
                                            alt="Search Icon"
                                        />
                                        <input
                                            type="search"
                                            className="input-control"
                                            placeholder="eg: Electrical"
                                            value={searchService}
                                            onChange={(e) => setSearchService(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <Image
                                            src="/assets/img/Location.svg"
                                            width={20}
                                            height={20}
                                            alt="Location Icon"
                                        />
                                        <input
                                            type="text"
                                            className="input-control"
                                            placeholder="42291"
                                            value={searchZip}
                                            onChange={(e) => setSearchZip(e.target.value)}
                                        />
                                    </div>
                                    <input type="submit" className="submit-btn" value="Search" />
                                </form>

                                <div className="buttons">
                                    <Link href="/post-project" className="custom-form-btn btn-s1">
                                        <span>Post a Project</span>
                                        <Image
                                            src="/assets/img/form-arrow.svg"
                                            width={16}
                                            height={18}
                                            alt="Arrow"
                                        />
                                    </Link>
                                    <Link href="/join-subcontractor" className="custom-form-btn btn-s2">
                                        <span>Join as Subcontractor</span>
                                        <Image
                                            src="/assets/img/form-arrow.svg"
                                            width={16}
                                            height={18}
                                            alt="Arrow"
                                        />
                                    </Link>
                                    <Link href="/affiliate" className="custom-form-btn btn-s3">
                                        <span>Be an Affiliate</span>
                                        <Image
                                            src="/assets/img/form-arrow.svg"
                                            width={16}
                                            height={18}
                                            alt="Arrow"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section with Slick */}
                <section className="project-sec">
                    <div className="container">
                        <div className="content-wrappper mb-5 text-center">
                            <Link href="/projects" className="custom-btn custom-outline-btn mx-auto mb-4">
                                PROJECTS
                            </Link>
                            <h2 className="main-title">Explore real projects posted by top general contractors</h2>
                        </div>

                        {/* ✅ Wrap Slider around slides */}
                        <Slider {...sliderSettings} className="main-card-slide">
                            {projects.map((project, idx) => (
                                <div key={idx} className="p-2"> {/* ✅ Slick requires direct child wrapper */}
                                    <div className="custom-card">
                                        <div className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
                                            <Link
                                                href={`/projects?category=${project.category.toLowerCase()}`}
                                                className="custom-btn custom-primary-btn"
                                            >
                                                {project.category}
                                            </Link>
                                            <div className="date custom-text-gray-light">23 mins ago</div>
                                        </div>
                                        <div className="title text-black fs-5 fw-semibold mb-3">{project.location}</div>
                                        <div className="description">{project.description}</div>
                                        <button className="see-more-btn">See more</button>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                        <div className="buttons d-flex align-items-center justify-content-between gap-2 flex-wrap mt-4">
                            <div className="custom-pagination d-flex align-items-center justify-content-center gap-2">
                                {/* Optional: leave empty or enable `dots: true` in settings */}
                            </div>
                            <Link href="/projects" className="custom-btn custom-bg-dark text-white rounded-3">
                                <span>See All</span>
                                <Image
                                    src="/assets/img/btn-arrow.svg"
                                    width={12}
                                    height={10}
                                    alt="Arrow"
                                    className="d-block mt-1"
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