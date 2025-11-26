// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from 'react-slick';

import '../../styles/about-us.css';
import '../../styles/testimonial.css';


export default function AboutUsPage() {
    // Slick settings (converted from your jQuery)
    const sliderSettings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
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

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Banner */}
                <section
                    style={{
                        background: `url('/assets/img/regular-bg.webp') center /cover no-repeat`,
                    }}
                    className="hero-sec about position-static"
                >
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
                                    <h1 className="mb-4">About Us</h1>
                                    <p className="mb-3 fw-medium fs-5">
                                        Welcome to EZ Subcontractor the ultimate online hub built to empower subcontractors and construction
                                        professionals.
                                    </p>
                                    <p className="mb-0 fw-medium fs-5">
                                        We simplify how the construction industry connects, helping subcontractors find reliable projects,
                                        build long-term relationships with verified general contractors, and grow their businesses with ease.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service */}
                <section className="service-sec">
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

                {/* Half Section */}
                <section className="half-sec">
                    <div className="container">
                        <div className="sec-card">
                            <div className="row">
                                <div className="col-lg-6 order-lg-2">
                                    <Image
                                        src="/assets/img/about-section.webp"
                                        style={{ objectFit: 'cover' }}
                                        className="img-fluid w-100 h-100"
                                        alt="Section Image"
                                        width={600}
                                        height={400}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="col-lg-6 order-lg-1">
                                    <div className="content-wrapper">
                                        <Link href="#" className="btn btn-outline-dark mb-4">
                                            OUR STORY
                                        </Link>
                                        <h2 className="main-title mb-4">
                                            Redefining How Contractors, Subcontractors, and Affiliates Work Together
                                        </h2>
                                        <p className="mb-4 fw-medium">
                                            - EZ Subcontractor was created to simplify how subcontractors connect with real construction
                                            opportunities.
                                        </p>
                                        <p className="mb-4 fw-medium">
                                            - We saw how skilled tradespeople often struggle to find reliable projects, while contractors face
                                            challenges finding qualified and licensed subs.
                                        </p>
                                        <p className="mb-4 fw-medium">
                                            - Our mission was clear — build a platform that bridges that gap with trust, technology, and
                                            transparency.
                                        </p>
                                        <p className="mb-4 fw-medium">
                                            - Today, EZ Subcontractor is a growing digital network where subcontractors find projects,
                                            contractors find talent, and affiliates support the process with professional services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial */}
                <section style={{ backgroundColor: '#fafbea' }} className="testimonial-sec">
                    <div className="container">
                        <div className="content-wrappper mb-5 text-center">
                            <Link href="#" className="btn btn-outline-dark mx-auto mb-4">
                                TESTIMONIALS
                            </Link>
                            <h2 className="main-title">Trusted by Thousands of People</h2>
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

                        <Link href="#" className="btn bg-dark rounded-3 mx-auto d-flex align-items-center w-fit-content">
                            <span className="text-white">See All</span>
                            <Image
                                src="/assets/img/btn-arrow.svg"
                                width={12}
                                height={10}
                                alt="Arrow"
                                className="d-block mx-auto"
                            />
                        </Link>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}