'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/free-trial.css';

export default function FreeTrialPage() {
    const router = useRouter();
    const sliderRef = useRef<Slider | null>(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const jobs = Array(4).fill({
        location: 'Whittier, CA',
        timeAgo: '23 mins ago',
        description: `Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.`,
    });

    const [expanded, setExpanded] = useState<number[]>([]);

    const toggleExpand = (index: number) => {
        setExpanded(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                {/* Banner Section */}
                <section className="banner-sec trial position-static">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <Image
                                    src="/assets/img/dashboard-free-trial-img.webp"
                                    width={800}
                                    height={600}
                                    alt="Section Image"
                                    className="img-fluid w-100 h-100 object-fit-cover"
                                    style={{ borderRadius: '25px', boxShadow: '0 4px 35px 0 #00000025' }}
                                />
                            </div>

                            <div className="col-lg-6">
                                <div
                                    className="banner-wrapper"
                                    style={{ backgroundImage: "url('/assets/img/free-trial-img2.webp')" }}
                                >
                                    <div className="main-slider">
                                        <Slider ref={sliderRef} {...settings}>
                                            {[1, 2].map((_, i) => (
                                                <div key={i} className="slider-item">
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <div className="icon bg-primary">
                                                            <Image
                                                                src="/assets/img/icons/camera.svg"
                                                                width={14}
                                                                height={10}
                                                                alt="icon"
                                                            />
                                                        </div>
                                                        <div style={{ fontSize: '14px' }} className="content text-white fw-medium">
                                                            Online Webinar
                                                        </div>
                                                    </div>
                                                    <h2 className="main-title text-primary">
                                                        50% Increase Sales
                                                    </h2>
                                                    <div className="desc fw-medium text-white mb-3">
                                                        Present a professional estimate with your logo and company name and colors. Present a professional estimate with your logo and company name and colors. Present a professional estimate with your logo and company name and colors.
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>

                                    <div className="slider-controls d-flex align-items-center justify-content-between">
                                        <div className="custom-arrows d-flex align-items-center gap-2">
                                            <button
                                                className="custom-prev"
                                                onClick={() => sliderRef.current?.slickPrev()}
                                            >
                                                <Image
                                                    src="/assets/img/dashboard-arrow.svg"
                                                    alt="Prev"
                                                    width={8}
                                                    height={16}
                                                />
                                            </button>
                                            <button
                                                className="custom-next"
                                                onClick={() => sliderRef.current?.slickNext()}
                                            >
                                                <Image
                                                    src="/assets/img/dashboard-arrow1.svg"
                                                    alt="Next"
                                                    width={8}
                                                    height={16}
                                                />
                                            </button>
                                        </div>
                                        {/* Icon redirect to dashboard-subscribed */}
                                        <div
                                            className="icon"
                                            onClick={() => router.push('/subcontractor/dashboard-subscribed')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Image
                                                src="/assets/img/icons/search-icon1.svg"
                                                alt="Go to Dashboard"
                                                width={14}
                                                height={14}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter + Jobs Section */}
                <section className="filter-sec">
                    <div className="container">
                        <div className="row g-4">
                            {/* Filter Column */}
                            <div className="col-xl-3">
                                <span className="d-block mb-3 fw-semibold fs-4">Filters</span>
                                <span className="d-block mb-2 fw-medium">Zip Code</span>
                                <input type="text" placeholder="29391" />
                                <span className="d-block mb-2 fw-medium">Work Radius</span>
                                <div className="range-wrapper mb-5">
                                    <div className="range-container">
                                        <div className="slider-wrap">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                defaultValue="2"
                                                className="range-slider"
                                            />
                                            <div className="range-value">2 miles</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="min">0 miles</span>
                                        <span className="max">100 miles</span>
                                    </div>
                                </div>

                                <Image
                                    src="/assets/img/filter-img.webp"
                                    width={400}
                                    height={400}
                                    alt="Filter Image"
                                    className="img-fluid w-100"
                                    style={{ borderRadius: '25px', boxShadow: '0 4px 85px 0px #00000025' }}
                                />
                            </div>

                            {/* Jobs Column */}
                            <div className="col-xl-9">
                                <span className="d-block mb-4 fw-semibold fs-4 text-dark">Posted Jobs</span>
                                {jobs.map((job, index) => (
                                    <div key={index} className="posted-card posted-card-1 custom-card mb-3">
                                        <div className="topbar mb-2 d-flex justify-content-between">
                                            <div className="title">{job.location}</div>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="date">{job.timeAgo}</div>
                                                <div className="icon">
                                                    <Image
                                                        src="/assets/img/copy-icon.svg"
                                                        width={16}
                                                        height={16}
                                                        alt="Icon"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <p className={`description mb-0 ${expanded.includes(index) ? 'expanded' : ''}`}>
                                            {job.description}
                                        </p>

                                        <button
                                            className="see-more-btn d-block"
                                            onClick={() => toggleExpand(index)}
                                        >
                                            {expanded.includes(index) ? 'See less' : 'See more'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
