// app/pricing/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/blog.css';



export default function PricingPage() {
    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Banner */}
                <section
                    style={{
                        background: `url('/assets/img/regular-bg.webp') center /cover no-repeat`,
                    }}
                    className="hero-sec blog position-static"
                >
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-6 order-lg-2">
                                <Image
                                    src="/assets/img/blog-hero-img.webp"
                                    width={708}
                                    height={448}
                                    alt="Section Image"
                                    className="img-fluid w-100 hero-img"
                                />
                            </div>
                            <div className="col-lg-6 order-lg-1">
                                <div className="content-wrapper d-flex flex-column h-100 justify-content-center">
                                    <h1 className="mb-4">Blogs</h1>
                                    <p className="mb-3 fw-medium fs-5">Explore What’s New at EZSubcontractor</p>
                                    <p className="mb-0 fw-medium fs-5">
                                        From innovative projects to expert tips and success stories discover what’s happening in the
                                        construction world.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <section className="blog-sec">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-9">
                                <div className="row g-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="col-md-6">
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

                            <div className="col-lg-3">
                                {/* Featured Posts */}
                                <div className="featured-post mb-5">
                                    <div className="feature-title">Featured</div>
                                    {[1, 2, 3].map((item) => (
                                        <div key={`feat-${item}`} className="feature-post">
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
                                                    From supply chain issues to labor shortages, residential contractors face unique challenges every
                                                    day.
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Latest Posts */}
                                <div className="latest-post">
                                    <div className="feature-title">Latest</div>
                                    {[1, 2, 3].map((item) => (
                                        <div key={`latest-${item}`} className="feature-post">
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
                                                    From supply chain issues to labor shortages, residential contractors face unique challenges every
                                                    day.
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
        </div>
    );
}