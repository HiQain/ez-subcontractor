'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css'; // ya SCSS file ka import

export default function ProfilePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Select category');

    const options = ['Plumbing', 'Electric Work', 'Framing', 'Roofing'];

    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
    };

    return (
        <div className="sections overflow-hidden">
            <Header />

            <section className="banner-sec profile review">
                <div className="container">
                    <div className="review-wrapper p-0 shadow-none">
                        <div className="d-flex align-items-center gap-3 justify-content-between right-bar p-0 mb-5 flex-wrap">
                            <div className="icon-wrapper d-flex align-items-center gap-3">
                                <Link href="#" className="icon">
                                    <Image
                                        src="/assets/img/button-angle.svg"
                                        width={10}
                                        height={15}
                                        alt="Icon"
                                        loading="lazy"
                                    />
                                </Link>
                                <span className="fs-4 fw-semibold">Ratings</span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <div style={{ whiteSpace: 'nowrap' }} className="fw-medium">
                                    <span>Filter by:</span>
                                </div>
                                <div className="input-wrapper d-flex flex-column position-relative w-100">
                                    <div
                                        className={`custom-select p-0 w-100 ${isOpen ? 'open' : ''}`}
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <div style={{ maxWidth: '200px' }} className="select-selected w-100">
                                            {selected}
                                        </div>
                                        <i className="bi bi-chevron-down select-arrow"></i>
                                        <ul className="select-options">
                                            {options.map((option, index) => (
                                                <li key={index} data-value={index + 1} onClick={() => handleSelect(option)}>
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Review Cards Section */}
                        <div className="review-card-s1 p-0 bg-transparent">
                            <div className="row g-4 mb-5">
                                {Array(6)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div className="col-lg-4 col-md-6" key={i}>
                                            <div className="review-inner-card">
                                                <div className="top d-flex align-items-center gap-2 justify-content-between flex-wrap mb-2">
                                                    <div className="icon-wrapper d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/assets/img/profile-img.webp"
                                                            width={40}
                                                            height={40}
                                                            alt="Card Image"
                                                            loading="lazy"
                                                        />
                                                        <div className="content">
                                                            <div className="fw-semibold fs-14 mb-1">Marlous</div>
                                                            <div style={{ color: '#8F9B1F' }} className="fw-semibold fs-14">
                                                                BrightSide Homes
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="date fs-12 text-gray-light">Oct 12, 2025</div>
                                                </div>

                                                <div className="bottom d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                                    <div className="fs-14 fw-medium">Whittier, CA, 23981</div>
                                                    <div className="right d-flex align-items-center gap-2 flex-wrap">
                                                        <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                                            {Array(4)
                                                                .fill(0)
                                                                .map((_, j) => (
                                                                    <Image
                                                                        key={j}
                                                                        src="/assets/img/start1.svg"
                                                                        width={14}
                                                                        height={14}
                                                                        alt="Star Icon"
                                                                        loading="lazy"
                                                                    />
                                                                ))}
                                                            <Image
                                                                src="/assets/img/star2.svg"
                                                                width={14}
                                                                height={14}
                                                                alt="Star Icon"
                                                                loading="lazy"
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
                            <Link href="#" className="btn bg-dark rounded-3 mx-auto d-flex justify-content-center align-items-center">
                                <span className="text-white">Load More</span>
                                <img src="/assets/img/load-btn.svg" className="d-block" width="15" height="15" alt="Arrow" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
