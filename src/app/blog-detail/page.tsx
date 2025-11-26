'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/blog.css';

export default function BlogSinglePage() {
    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                {/* Banner */}
                <section
                    style={{ background: "url('/assets/img/blog-sinlge-hero.webp')" }}
                    className="blog-single-hero position-static"
                ></section>

                {/* Blog Section */}
                <section className="blog-sec">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-9">
                                <div className="d-flex align-items-center gap-1 justify-content-between mb-5">
                                    <div className="blog-icon d-flex align-items-center gap-2">
                                        <Image
                                            src="/assets/img/blog-icon1.svg"
                                            width={40}
                                            height={40}
                                            alt="Blog Icon"
                                            loading="lazy"
                                        />
                                        <span className="d-block fw-semibold">Jonathan Louis</span>
                                    </div>
                                    <div style={{ fontSize: "14px" }} className="date">
                                        Aug 02, 2025
                                    </div>
                                </div>

                                <div className="content">
                                    <div className="blog-single-title">
                                        1. Sustainable Building Materials Take Center Stage
                                    </div>
                                    <div className="blog-single-description">
                                        Homeowners are increasingly prioritizing sustainability, and builders are
                                        responding by choosing eco-friendly materials that reduce environmental impact.
                                        In 2025, recycled steel, bamboo flooring, reclaimed wood, and low-VOC paints are
                                        among the most sought-after materials. These not only lower carbon footprints
                                        but also improve indoor air quality and long-term energy performance.
                                        Sustainable construction is no longer a niche it’s becoming the standard
                                        expectation in residential projects.
                                    </div>

                                    <div className="blog-single-title">
                                        1. Sustainable Building Materials Take Center Stage
                                    </div>
                                    <div className="blog-single-description">
                                        Homeowners are increasingly prioritizing sustainability, and builders are
                                        responding by choosing eco-friendly materials that reduce environmental impact.
                                        In 2025, recycled steel, bamboo flooring, reclaimed wood, and low-VOC paints are
                                        among the most sought-after materials. These not only lower carbon footprints
                                        but also improve indoor air quality and long-term energy performance.
                                        Sustainable construction is no longer a niche it’s becoming the standard
                                        expectation in residential projects.
                                    </div>

                                    <div className="blog-single-title">
                                        1. Sustainable Building Materials Take Center Stage
                                    </div>
                                    <div className="blog-single-description">
                                        Homeowners are increasingly prioritizing sustainability, and builders are
                                        responding by choosing eco-friendly materials that reduce environmental impact.
                                        In 2025, recycled steel, bamboo flooring, reclaimed wood, and low-VOC paints are
                                        among the most sought-after materials. These not only lower carbon footprints
                                        but also improve indoor air quality and long-term energy performance.
                                        Sustainable construction is no longer a niche it’s becoming the standard
                                        expectation in residential projects.
                                    </div>

                                    <div className="blog-single-title">
                                        1. Sustainable Building Materials Take Center Stage
                                    </div>
                                    <div className="blog-single-description">
                                        Homeowners are increasingly prioritizing sustainability, and builders are
                                        responding by choosing eco-friendly materials that reduce environmental impact.
                                        In 2025, recycled steel, bamboo flooring, reclaimed wood, and low-VOC paints are
                                        among the most sought-after materials. These not only lower carbon footprints
                                        but also improve indoor air quality and long-term energy performance.
                                        Sustainable construction is no longer a niche it’s becoming the standard
                                        expectation in residential projects.
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="featured-post mb-5">
                                    <div className="feature-title">Featured</div>

                                    {[1, 2, 3].map((_, i) => (
                                        <div className="feature-post" key={`featured-${i}`}>
                                            <Link href="#">
                                                <Image
                                                    src="/assets/img/feature-img1.webp"
                                                    width={124}
                                                    height={107}
                                                    alt="Featured Image"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <div className="content">
                                                <div className="date">Jan 12, 2025</div>
                                                <Link href="#" className="description">
                                                    From supply chain issues to labor shortages, residential contractors face
                                                    unique challenges every day.
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="latest-post">
                                    <div className="feature-title">Latest</div>

                                    {[1, 2, 3].map((_, i) => (
                                        <div className="feature-post" key={`latest-${i}`}>
                                            <Link href="#">
                                                <Image
                                                    src="/assets/img/feature-img1.webp"
                                                    width={124}
                                                    height={107}
                                                    alt="Featured Image"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <div className="content">
                                                <div className="date">Jan 12, 2025</div>
                                                <Link href="#" className="description">
                                                    From supply chain issues to labor shortages, residential contractors face
                                                    unique challenges every day.
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
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
