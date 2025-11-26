'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/free-trial.css';

export default function FreeTrialPage() {
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
        <>
            <Header />

            <div className="sections overflow-hidden">
                {/* ===================== Banner Section ===================== */}
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

                {/* ===================== Filter Section ===================== */}
                <section className="filter-sec">
                    <div className="container">
                        <div className="row g-4">
                            {/* Left Filter Sidebar */}
                            <div className="col-xl-3">
                                <span className="d-block mb-3 fw-semibold fs-4">Filters</span>
                                <span className="d-block mb-2 fw-medium">
                                    Browse or Search Directory
                                </span>

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

                                <span className="d-block mb-2 fw-medium">Type</span>
                                <div className="radio-group d-flex align-items-center gap-2 flex-wrap mb-3">
                                    {['Yearly', 'Monthly', 'Weekly'].map((label, i) => (
                                        <label
                                            key={i}
                                            className="radio-option d-flex align-items-center gap-2"
                                        >
                                            <input
                                                type="radio"
                                                style={{ width: '24px', height: '24px' }}
                                                className="mb-0"
                                                name="subscription"
                                                value={label.toLowerCase()}
                                                defaultChecked={label === 'Yearly'}
                                            />
                                            <span className="fs-14 fw-medium">{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <span className="d-block mb-2 fw-medium">City</span>
                                <input type="text" placeholder="Whittier, CA" />

                                <span className="d-block mb-2 fw-medium">Zip Code</span>
                                <input type="text" placeholder="29391" />

                                <div className="range-wrapper mb-5">
                                    <div className="range-container">
                                        <div className="slider-wrap">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                defaultValue="2"
                                                id="milesRange"
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
                                    style={{
                                        borderRadius: '25px',
                                        boxShadow: '0 4px 85px 0px #00000025',
                                    }}
                                />
                            </div>

                            {/* Right Filter Cards */}
                            <div className="col-xl-9">
                                <div className="row g-3">
                                    {Array(6)
                                        .fill(null)
                                        .map((_, i) => (
                                            <div key={i} className="col-lg-4 col-md-6">
                                                <div className="filter-card">
                                                    <Image
                                                        src="/assets/img/icons/p-icon.svg"
                                                        width={104}
                                                        height={104}
                                                        className="d-block mx-auto mb-3"
                                                        alt="P Icon"
                                                    />
                                                    <div
                                                        style={{ color: '#333342' }}
                                                        className="title text-black fw-semibold text-center fs-5 mb-3"
                                                    >
                                                        ProBuilds Express
                                                    </div>
                                                    <Link
                                                        href="/affiliate/contractor-details"
                                                        className="btn btn-primary p-2 mx-auto mb-3"
                                                    >
                                                        General Contractor
                                                    </Link>

                                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Message Icon"
                                                        />
                                                        <a
                                                            href="mailto:hello@example.com"
                                                            className="text-dark fw-medium"
                                                        >
                                                            hello@example.com
                                                        </a>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
                                                        <Image
                                                            src="/assets/img/icons/call-dark.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Call Icon"
                                                        />
                                                        <a
                                                            href="tel:+000000000"
                                                            className="text-dark fw-medium"
                                                        >
                                                            (000) 000-000
                                                        </a>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                                        <a href="#" className="icon">
                                                            <Image
                                                                src="/assets/img/icons/Chat.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Icon"
                                                            />
                                                        </a>
                                                        <a href="#" className="icon">
                                                            <Image
                                                                src="/assets/img/icons/message-white.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Icon"
                                                            />
                                                        </a>
                                                        <a href="#" className="icon">
                                                            <Image
                                                                src="/assets/img/icons/call-white.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Icon"
                                                            />
                                                        </a>
                                                    </div>
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
