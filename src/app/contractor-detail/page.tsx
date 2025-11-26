'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/profile.css';

export default function ContractorDetails() {
    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile position-static">
                    <div className="container">
                        <div className="right-bar">

                            {/* Top Bar */}
                            <div className="topbar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
                                <div className="icon-wrapper d-flex align-items-center gap-3">
                                    <Link href="#" className="icon">
                                        <img
                                            src="/assets/img/button-angle.svg"
                                            width="10"
                                            height="15"
                                            alt="Icon"
                                            loading="lazy"
                                        />
                                    </Link>
                                    <span className="fs-4 fw-semibold">Contractor Details</span>
                                </div>
                                <Link href="#" className="icon1">
                                    <img
                                        src="/assets/img/copy-icon.svg"
                                        width="24"
                                        height="24"
                                        alt="Icon"
                                    />
                                </Link>
                            </div>

                            {/* Review Bar */}
                            <div className="review-bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-5">
                                <div className="image-box d-flex align-items-center gap-4">
                                    <img
                                        src="/assets/img/construction-worker-big.webp"
                                        className="worker-img"
                                        width="180"
                                        height="180"
                                        alt="Worker Image"
                                        loading="lazy"
                                    />
                                    <div className="content">
                                        <div className="title fw-semibold fs-4 mb-2">Jason Doe</div>
                                        <Link href="#" className="btn btn-primary p-1 ps-3 pe-3 mb-3">
                                            Subcontractor
                                        </Link>
                                        <p className="text-gray-light fw-medium">30201</p>
                                    </div>
                                </div>

                                <div className="right d-flex align-items-center gap-4 flex-wrap">
                                    <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                        <img
                                            src="/assets/img/start1.svg"
                                            style={{
                                                width: "clamp(20px,5vw,50px)",
                                                height: "clamp(20px,5vw,50px)",
                                            }}
                                            width="50"
                                            height="50"
                                            alt="Star Icon"
                                            loading="lazy"
                                        />
                                        <img
                                            src="/assets/img/start1.svg"
                                            style={{
                                                width: "clamp(20px,5vw,50px)",
                                                height: "clamp(20px,5vw,50px)",
                                            }}
                                            width="50"
                                            height="50"
                                            alt="Star Icon"
                                            loading="lazy"
                                        />
                                        <img
                                            src="/assets/img/start1.svg"
                                            style={{
                                                width: "clamp(20px,5vw,50px)",
                                                height: "clamp(20px,5vw,50px)",
                                            }}
                                            width="50"
                                            height="50"
                                            alt="Star Icon"
                                            loading="lazy"
                                        />
                                        <img
                                            src="/assets/img/start1.svg"
                                            style={{
                                                width: "clamp(20px,5vw,50px)",
                                                height: "clamp(20px,5vw,50px)",
                                            }}
                                            width="50"
                                            height="50"
                                            alt="Star Icon"
                                            loading="lazy"
                                        />
                                        <img
                                            src="/assets/img/star2.svg"
                                            style={{
                                                width: "clamp(20px,5vw,50px)",
                                                height: "clamp(20px,5vw,50px)",
                                            }}
                                            width="50"
                                            height="50"
                                            alt="Star Icon"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="content">
                                        <div className="text-black text-center fs-3 fw-bold">
                                            4.5/5
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Boxes */}
                            <div className="review-bar mb-5">
                                <div className="icon-wrapper d-flex flex-column gap-4 mb-4">
                                    {[1, 2, 3].map((i) => (
                                        <div className="icon-box" key={i}>
                                            <div className="icon1">
                                                <img
                                                    src="/assets/img/icons/office-dark.svg"
                                                    width="24"
                                                    height="24"
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="content">
                                                <div className="fs-14 text-gray-light mb-1 fw-medium">
                                                    Company Name
                                                </div>
                                                <div className="fw-semibold">Jason Tiles Limited</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-gray-light fw-medium mb-2">Categories</div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    {["Framing", "Electrical", "Plumbing"].map((cat, index) => (
                                        <Link
                                            key={index}
                                            href="#"
                                            style={{ color: "white" }}
                                            className="btn bg-dark rounded-3 p-2 fs-14 fw-semibold"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="buttons d-flex align-items-center gap-3 md-flex-wrap">
                                {[1, 2, 3].map((i) => (
                                    <Link
                                        key={i}
                                        href="#"
                                        className="btn btn-primary rounded-3 w-100 justify-content-center"
                                    >
                                        <img
                                            src="/assets/img/icons/chat-dark.svg"
                                            width="24"
                                            height="24"
                                            alt="Icon"
                                            loading="lazy"
                                        />
                                        <span className="fs-18">Chat Now</span>
                                    </Link>
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
