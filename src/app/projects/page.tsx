// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../../styles/projects.css';
import '../../styles/cards.css';

export default function ProjectsPage() {
    const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

    const toggleExpand = (index: number) => {
        const newSet = new Set(expandedCards);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setExpandedCards(newSet);
    };

    // Project data (static for now)
    const projects = Array(6).fill({
        category: 'Framing',
        location: 'Whittier, CA',
        description: `Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish.`,
        timeAgo: '23 mins ago'
    });

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Banner */}
                <section
                    style={{
                        background: `url('/assets/img/regular-bg.webp') center / cover no-repeat`
                    }}
                    className="hero-sec projects position-static"
                >
                    <div className="container">
                        <div className="content-wrapper">
                            <h1 className="text-center mb-4">
                                Unlimited projects per year for one flat fee
                            </h1>
                            <div style={{ maxWidth: '876px' }} className="mx-auto">
                                <div className="form-wrapper mb-3">
                                    <div className="input-wrapper">
                                        <Image
                                            src="/assets/img/icons/search-gray.svg"
                                            width={20}
                                            height={20}
                                            alt="Search Icon"
                                        />
                                        <input
                                            type="search"
                                            className="input-control"
                                            placeholder="eg: Electrical"
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <Image
                                            src="/assets/img/icons/location-dark.svg"
                                            width={20}
                                            height={20}
                                            alt="Location Icon"
                                        />
                                        <input
                                            type="text"
                                            className="input-control"
                                            placeholder="42291"
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        className="btn btn-primary rounded-3"
                                        value="Search"
                                    />
                                </div>
                                <div className="buttons d-flex justify-content-center flex-wrap align-items-center gap-2">
                                    <Link href="#" className="btn btn-outline-dark">Electrical</Link>
                                    <Link href="#" className="btn btn-outline-dark">Plumbing</Link>
                                    <Link href="#" className="btn btn-outline-dark">HVAC</Link>
                                    <Link href="#" className="btn btn-outline-dark">Framing</Link>
                                    <Link href="#" className="btn btn-outline-dark">Roofing</Link>
                                    <Link href="#" className="btn btn-outline-dark">Painting</Link>
                                    <Link href="#" className="btn btn-outline-dark">Concrete</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="project-sec">
                    <div className="container">
                        <div className="row g-3 mb-5">
                            {projects.map((project, index) => (
                                <div key={index} className="col-lg-4 col-md-6">
                                    <div className="custom-card">
                                        <div className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
                                            <Link
                                                href={`/projects?category=${project.category.toLowerCase()}`}
                                                className="btn btn-primary"
                                            >
                                                {project.category}
                                            </Link>
                                            <div className="date text-primary-gray-light">
                                                {project.timeAgo}
                                            </div>
                                        </div>
                                        <div className="title text-black fs-5 fw-semibold mb-3">
                                            {project.location}
                                        </div>
                                        <div className="description">
                                            {expandedCards.has(index)
                                                ? project.description.repeat(5)
                                                : `${project.description.substring(0, 150)}...`}
                                        </div>
                                        <button
                                            className="see-more-btn btn btn-link p-0"
                                            onClick={() => toggleExpand(index)}
                                        >
                                            {expandedCards.has(index) ? 'See less' : 'See more'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/all-projects" className="btn bg-dark rounded-3 mx-auto d-flex w-fit-content">
                            <span className="text-white">Load More</span>
                            <Image
                                src="/assets/img/load-btn.svg"
                                className="d-block"
                                width={15}
                                height={15}
                                alt="Load More Arrow"
                            />
                        </Link>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}