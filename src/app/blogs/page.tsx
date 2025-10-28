// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/blogs.css';

// Mock blog data
const blogs = [
    {
        id: 1,
        title: "The residential construction industry is evolving fast",
        excerpt: "With homeowners demanding smarter, greener, and more efficient spaces",
        author: "Jonathan Louis",
        date: "Aug 02, 2025",
        image: "/assets/img/blog-img1.webp",
    },
    {
        id: 2,
        title: "The residential construction industry is evolving fast",
        excerpt: "With homeowners demanding smarter, greener, and more efficient spaces",
        author: "Jonathan Louis",
        date: "Aug 02, 2025",
        image: "/assets/img/blog-img1.webp",
    },
    {
        id: 3,
        title: "The residential construction industry is evolving fast",
        excerpt: "With homeowners demanding smarter, greener, and more efficient spaces",
        author: "Jonathan Louis",
        date: "Aug 02, 2025",
        image: "/assets/img/blog-img1.webp",
    },
    {
        id: 4,
        title: "The residential construction industry is evolving fast",
        excerpt: "With homeowners demanding smarter, greener, and more efficient spaces",
        author: "Jonathan Louis",
        date: "Aug 02, 2025",
        image: "/assets/img/blog-img1.webp",
    },
];

// Mock featured & latest posts
const featuredPosts = Array(3).fill({
    title: "From supply chain issues to labor shortages, residential contractors face unique challenges every day.",
    date: "Jan 12, 2025",
    image: "/assets/img/feature-img1.webp",
});

const latestPosts = Array(3).fill({
    title: "From supply chain issues to labor shortages, residential contractors face unique challenges every day.",
    date: "Jan 12, 2025",
    image: "/assets/img/feature-img1.webp",
});

export default function PricingPage() {
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
                                    <p className="mb-3 fw-medium fs-5">
                                        Explore What’s New at EZSubcontractor
                                    </p>
                                    <p className="mb-0 fw-medium fs-5">
                                        From innovative projects to expert tips and success stories — discover what’s happening in the construction world.
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
                            {/* Main Blog Grid */}
                            <div className="col-lg-9">
                                <div className="row g-4">
                                    {blogs.map((blog) => (
                                        <div key={blog.id} className="col-md-6">
                                            <Link href={`/blogs/${blog.id}`} className="blog-wrapper">
                                                <div
                                                    className="blog-content d-flex h-100 justify-content-end flex-column"
                                                    style={{
                                                        backgroundImage: `url('${blog.image}')`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    <div className="description text-white fw-medium mb-2">
                                                        {blog.excerpt}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1 justify-content-between">
                                                        <div className="blog-icon d-flex align-items-center gap-2">
                                                            <Image
                                                                src="/assets/img/blog-icon1.svg"
                                                                width={40}
                                                                height={40}
                                                                alt="Blog Icon"
                                                            />
                                                            <span className="d-block fw-semibold text-white">{blog.author}</span>
                                                        </div>
                                                        <div style={{ fontSize: '14px' }} className="date text-white">
                                                            {blog.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar: Featured & Latest Posts */}
                            <div className="col-lg-3">
                                {/* Featured Posts */}
                                <div className="featured-post mb-5">
                                    <div className="feature-title">Featured</div>
                                    {featuredPosts.map((post, idx) => (
                                        <div key={`featured-${idx}`} className="feature-post">
                                            <Link href="#">
                                                <Image
                                                    src={post.image}
                                                    width={124}
                                                    height={107}
                                                    alt="Featured Image"
                                                    className="d-block"
                                                />
                                            </Link>
                                            <div className="content">
                                                <div className="date">{post.date}</div>
                                                <Link href="#" className="description">
                                                    {post.title}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Latest Posts */}
                                <div className="latest-post">
                                    <div className="feature-title">Latest</div>
                                    {latestPosts.map((post, idx) => (
                                        <div key={`latest-${idx}`} className="feature-post">
                                            <Link href="#">
                                                <Image
                                                    src={post.image}
                                                    width={124}
                                                    height={107}
                                                    alt="Featured Image"
                                                    className="d-block"
                                                />
                                            </Link>
                                            <div className="content">
                                                <div className="date">{post.date}</div>
                                                <Link href="#" className="description">
                                                    {post.title}
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