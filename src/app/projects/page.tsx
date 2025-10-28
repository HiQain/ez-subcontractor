// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/projects.css';
import '../../styles/main-page.css';

// Mock project data
const mockProjects = Array(6).fill({
    id: 0,
    category: 'Framing',
    location: 'Whittier, CA',
    description:
        'Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish.',
});

// Popular categories
const popularCategories = [
    'Electrical',
    'Landscaping',
    'Pipeline',
    'Solar',
    'Roofing',
    'Welding',
    'Glazing',
];

export default function ProjectsPage() {
    const [searchService, setSearchService] = useState('');
    const [searchZip, setSearchZip] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search:', { service: searchService, zip: searchZip });
        // TODO: Connect to API or router.push with query params
    };

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Hero Section */}
                <section
                    className="hero-sec"
                    style={{
                        backgroundImage: `url('/assets/img/regular-bg.webp')`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="container">
                        <div className="content-wrapper">
                            <h1 className="text-center mb-4">
                                Unlimited projects per year for one flat fee
                            </h1>
                            <div className="row">
                                <div className="col-lg-10 offset-lg-1">
                                    <form onsubmit={handleSearch} className="form-wrapper mb-3">
                                        <div className="input-wrapper">
                                            <Image
                                                src="/assets/img/search-icon.svg"
                                                width={20}
                                                height={20}
                                                alt="Search Icon"
                                            />
                                            <input
                                                type="search"
                                                className="input-control"
                                                placeholder="eg: Electrical"
                                                value={searchService}
                                                onchange={(e) => setSearchService(e.target.value)}
                                            />
                                        </div>
                                        <div className="input-wrapper">
                                            <Image
                                                src="/assets/img/Location.svg"
                                                width={20}
                                                height={20}
                                                alt="Location Icon"
                                            />
                                            <input
                                                type="text"
                                                className="input-control"
                                                placeholder="42291"
                                                value={searchZip}
                                                onchange={(e) => setSearchZip(e.target.value)}
                                            />
                                        </div>
                                        <input type="submit" className="submit-btn" value="Search"/>
                                    </form>

                                    <div className="buttons d-flex justify-content-center flex-wrap align-items-center gap-2">
                                        {popularCategories.map((category) => (
                                            <Link
                                                key={category}
                                                href={`/projects?category=${category.toLowerCase()}`}
                                                className="custom-btn-s1"
                                            >
                                                {category}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="project-sec">
                    <div className="container">
                        <div className="row g-3 mb-5">
                            {mockProjects.map((project, idx) => (
                                <div key={idx} className="col-lg-4 col-md-6">
                                    <div className="custom-card">
                                        <div
                                            className="topbar d-flex align-items-center justify-content-between gap-1 flex-wrap mb-3">
                                            <Link href={`/projects?category=${project.category.toLowerCase()}`}
                                                  className="custom-btn custom-primary-btn">
                                                {project.category}
                                            </Link>
                                            <div className="date custom-text-gray-light">23 mins ago</div>
                                        </div>
                                        <div className="title text-black fs-5 fw-semibold mb-3">
                                            {project.location}
                                        </div>
                                        <div className="description">{project.description}</div>
                                        <button className="see-more-btn">See more</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <Link
                            href="/projects?page=2"
                            className="custom-btn custom-bg-dark text-white rounded-3 mx-auto d-flex align-items-center"
                        >
                            <span>Load More</span>
                            <Image
                                src="/assets/img/load-btn.svg"
                                width={15}
                                height={15}
                                alt="Arrow"
                                className="d-block"
                            />
                        </Link>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}