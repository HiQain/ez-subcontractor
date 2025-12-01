// app/dashboard/page.tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/free-trial.css';
import Slider from "react-slick";

export default function DashboardPage() {
    const router = useRouter();
    const [expandedCards, setExpandedCards] = useState<number[]>([]);

    const toggleCard = (index: number) => {
        setExpandedCards(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const projectData = [
        {
            id: 1,
            title: 'Whittier, CA',
            description:
                'Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.',
        },
        {
            id: 2,
            title: 'Whittier, CA',
            description:
                'Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.',
        },
        {
            id: 3,
            title: 'Whittier, CA',
            description:
                'Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.',
        },
        {
            id: 4,
            title: 'Whittier, CA',
            description:
                'Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.',
        },
    ];

    const sliderRef = useRef<Slider | null>(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <div className="sections overflow-hidden">
            <Header />

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
                                className="img-fluid w-100 h-100"
                                style={{
                                    borderRadius: '25px',
                                    boxShadow: '0 4px 35px 0 #00000025',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        <div className="col-lg-6">
                            <div
                                className="banner-wrapper"
                                style={{
                                    backgroundImage: "url('/assets/img/free-trial-img2.webp')",
                                }}
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
                                                    <div
                                                        style={{ fontSize: '14px' }}
                                                        className="content text-white fw-medium"
                                                    >
                                                        Online Webinar
                                                    </div>
                                                </div>
                                                <h2 className="main-title text-primary">
                                                    50% Increase Sales
                                                </h2>
                                                <div className="desc fw-medium text-white mb-3">
                                                    Present a professional estimate with your logo and
                                                    company name and colors. Present a professional
                                                    estimate with your logo and name and colors. Present
                                                    a professional estimate with your logo and company
                                                    name and colors. Present a professional estimate
                                                    with your logo and company name and colors. Present
                                                    a professional estimate with your logo and company
                                                    name and colors.
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
                                    <div className="icon">
                                        <Image
                                            src="/assets/img/icons/search-icon1.svg"
                                            alt="Search"
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

            {/* My Projects Section */}
            <section className="review mb-5">
                <div className="container">
                    {/* Rate a Subcontractor Section */}
                    <div className="review-wrapper mb-4">
                        <div className="d-flex align-items-center gap-2 justify-content-between filter-sec p-0 mb-3">
                            <div className="fs-3 fw-semibold">Rate a Subcontractor</div>
                            <div className="form-wrapper">
                                <Image
                                    src="/assets/img/icons/search-gray.svg"
                                    width={18}
                                    height={18}
                                    alt="Search Icon"
                                />
                                <input type="text" placeholder="Search here" />
                                <Image
                                    src="/assets/img/icons/voice.svg"
                                    width={18}
                                    height={18}
                                    alt="Voice Icon"
                                />
                            </div>
                        </div>

                        <div className="review-card-s1">
                            <div className="d-flex align-items-center gap-2 justify-content-between mb-2">
                                <div className="fs-14 fw-semibold">Recently rated contractors</div>
                                <Link
                                    href="#"
                                    className="fs-14 fw-medium text-decoration-underline text-gray-light"
                                >
                                    View More
                                </Link>
                            </div>

                            <div className="row g-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div className="col-lg-4 col-md-6" key={i}>
                                        <div className="review-inner-card">
                                            <div className="top d-flex align-items-center gap-2 justify-content-between flex-wrap mb-2">
                                                <div className="icon-wrapper d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/profile-img.webp"
                                                        width={40}
                                                        height={40}
                                                        alt="Card Image"
                                                    />
                                                    <div className="content">
                                                        <div className="fw-semibold fs-14 mb-1">Marlous</div>
                                                        <div
                                                            style={{ color: "#8F9B1F" }}
                                                            className="fw-semibold fs-14"
                                                        >
                                                            BrightSide Homes
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="date fs-12 text-gray-light">
                                                    Oct 12, 2025
                                                </div>
                                            </div>

                                            <div className="bottom d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                                <div className="fs-14">Whittier, CA, 23981</div>
                                                <div className="right d-flex align-items-center gap-2 flex-wrap">
                                                    <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                                        {[1, 2, 3, 4].map((star) => (
                                                            <Image
                                                                key={star}
                                                                src="/assets/img/start1.svg"
                                                                width={14}
                                                                height={14}
                                                                alt="Star Icon"
                                                            />
                                                        ))}
                                                        <Image
                                                            src="/assets/img/star2.svg"
                                                            width={14}
                                                            height={14}
                                                            alt="Star Icon"
                                                        />
                                                    </div>
                                                    <div className="content">
                                                        <div className="fs-12">4.5/5</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* My Projects Section */}
                    <div className="bar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-4">
                        <div className="fs-4 fw-semibold">My Projects</div>
                        <button
                            onClick={() => router.push('/general-contractor/ad-job-post')}
                            className="btn btn-primary rounded-3 d-flex align-items-center gap-2"
                        >
                            <Image
                                src="/assets/img/icons/plus.svg"
                                width={12}
                                height={12}
                                alt="Icon"
                            />
                            <span>Add Project</span>
                        </button>
                    </div>

                    <div className="row g-3 mb-4">
                        {projectData.map((project, index) => (
                            <div className="col-lg-6" key={project.id}>
                                <div className="project-card call-dark custom-card">
                                    <div className="bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
                                        <div className="fs-5 fw-semibold">{project.title}</div>
                                        <Link
                                            href="#"
                                            style={{ backgroundColor: "#007AFF10", color: "#007AFF" }}
                                            className="btn p-1 ps-3 pe-3"
                                        >
                                            Hired
                                        </Link>
                                    </div>

                                    <p className="description mb-0">
                                        {expandedCards.includes(index)
                                            ? project.description
                                            : project.description.slice(0, 150) + "..."}
                                    </p>

                                    <button
                                        className="see-more-btn mb-3 d-block"
                                        onClick={() => toggleCard(index)}
                                    >
                                        {expandedCards.includes(index) ? "See less" : "See more"}
                                    </button>

                                    <div className="buttons d-flex align-items-center gap-2 flex-wrap-md">
                                        <Link
                                            href="#"
                                            className="btn btn-primary rounded-3 w-100 justify-content-center"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href="#"
                                            className="btn bg-dark rounded-3 w-100 justify-content-center"
                                            style={{ color: "white" }}
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            href="#"
                                            className="btn bg-danger rounded-3 w-100 justify-content-center"
                                            style={{ color: "white" }}
                                        >
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="#" className="btn bg-dark rounded-3 mx-auto">
                        <span className="text-white">See All</span>
                        <Image
                            src="/assets/img/icons/arrow-white.svg"
                            width={12}
                            height={12}
                            alt="Icon"
                        />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
