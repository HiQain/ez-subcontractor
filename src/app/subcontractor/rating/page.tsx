'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import '../../../styles/reviews.css';

export default function ReviewsPage() {
    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec reviews position-static">
                    <div className="container">

                        {/* Filter Bar */}
                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-5">
                            <div className="rating fw-semibold fs-5">Rating</div>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ whiteSpace: "nowrap" }} className="fw-semibold fs-5">
                                    Filter by:
                                </div>
                                <div className="input-wrapper d-flex flex-column position-relative w-100">
                                    <div style={{ minWidth: "clamp(180px,28vw,288px)" }} className="custom-select w-100">
                                        <div className="select-selected">Select option</div>
                                        <i className="bi bi-chevron-down select-arrow"></i>
                                        <ul className="select-options">
                                            <li data-value="1">Select option 1</li>
                                            <li data-value="2">Select option 2</li>
                                            <li data-value="3">Select option 3</li>
                                            <li data-value="4">Select option 4</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Rating */}
                        <div className="d-flex flex-column gap-3 align-items-center justify-content-center mb-5">
                            <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                <img src="/assets/img/start1.svg" width="50" height="50" alt="Star Icon" loading="lazy" />
                                <img src="/assets/img/start1.svg" width="50" height="50" alt="Star Icon" loading="lazy" />
                                <img src="/assets/img/start1.svg" width="50" height="50" alt="Star Icon" loading="lazy" />
                                <img src="/assets/img/start1.svg" width="50" height="50" alt="Star Icon" loading="lazy" />
                                <img src="/assets/img/star2.svg" width="50" height="50" alt="Star Icon" loading="lazy" />
                            </div>
                            <div className="text-center fs-3 fw-bold">4.5/5</div>
                        </div>

                        {/* Review Cards */}
                        <div className="row g-4 mb-5">
                            {[1, 2, 3].map((i) => (
                                <div className="col-lg-4 col-md-6" key={i}>
                                    <div className="review-card">
                                        <div className="content d-flex align-items-center gap-1 justify-content-between flex-wrap mb-4">
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                                    <img src="/assets/img/start1.svg" width="20" height="20" alt="Star Icon" loading="lazy" />
                                                    <img src="/assets/img/start1.svg" width="20" height="20" alt="Star Icon" loading="lazy" />
                                                    <img src="/assets/img/start1.svg" width="20" height="20" alt="Star Icon" loading="lazy" />
                                                    <img src="/assets/img/start1.svg" width="20" height="20" alt="Star Icon" loading="lazy" />
                                                    <img src="/assets/img/star2.svg" width="20" height="20" alt="Star Icon" loading="lazy" />
                                                </div>
                                                <div className="content fw-medium">4.5/5</div>
                                            </div>
                                            <div className="time text-gray-light fs-14">23 mins ago</div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                            <div className="client-info d-flex align-items-center gap-2">
                                                <img
                                                    src="/assets/img/client-1.webp"
                                                    width="62"
                                                    height="62"
                                                    alt="Client Image"
                                                    loading="lazy"
                                                />
                                                <div className="content">
                                                    <div className="name fw-semibold text-black">Jonathan Louis</div>
                                                    <div className="passion fs-14">General Contractor</div>
                                                </div>
                                            </div>
                                            <img
                                                src="/assets/img/quote.webp"
                                                className="quote-icon"
                                                width="79"
                                                height="61"
                                                alt="Icon"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <Link href="#" className="btn bg-dark rounded-3 mx-auto d-flex justify-content-center align-items-center">
                            <span className="text-white">Load More</span>
                            <img src="/assets/img/load-btn.svg" className="d-block" width="15" height="15" alt="Arrow" />
                        </Link>

                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
