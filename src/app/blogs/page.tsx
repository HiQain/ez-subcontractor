// app/pricing/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from 'react';
import '../../styles/blog.css';

const stripHtml = (html: string): string => {
    if (typeof window === 'undefined') {
        return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
    }
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || '').replace(/\s+/g, ' ').trim();
};

const getExcerpt = (html: string, limit = 140) => {
    const text = stripHtml(html);
    return text.length > limit ? text.slice(0, limit) + '...' : text;
};

const formatBlogDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

export default function PricingPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);

                const [latestRes, featuredRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/latest`),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/featured`)
                ]);

                const latestJson = await latestRes.json();
                const featuredJson = await featuredRes.json();

                if (latestJson.success) {
                    setBlogs(latestJson.data || []);
                }

                if (featuredJson.success) {
                    setFeaturedBlogs(featuredJson.data || []);
                }
            } catch (err) {
                console.error('Blogs fetch error:', err);
                setBlogs([]);
                setFeaturedBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

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
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" />
                                        <p className="mt-3 text-muted">Loading blogs...</p>
                                    </div>
                                ) : blogs.length === 0 ? (
                                    <p className="text-muted text-center">No blogs found.</p>
                                ) : (
                                    <div className="row g-4">
                                        {blogs.map((blog) => (
                                            <div key={blog.id} className="col-lg-4 col-md-6">
                                                <Link
                                                    href={{
                                                        pathname: "/blog-detail",
                                                        query: { slug: blog.slug },
                                                    }}
                                                    className="text-decoration-none text-dark d-block h-100"
                                                >
                                                    <div className="blog-card border rounded-4 overflow-hidden h-100 bg-white">

                                                        {/* 🔹 Image */}
                                                        <div
                                                            className="blog-image"
                                                            style={{
                                                                height: "260px",
                                                                position: "relative",
                                                                borderBottom: "1px solid #e9ecef",
                                                            }}
                                                        >
                                                            <Image
                                                                src={blog.featured_image}
                                                                alt={blog.title}
                                                                fill
                                                                className="img-fluid"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </div>

                                                        {/* 🔹 Content BELOW image */}
                                                        <div className="p-3">

                                                            {/* Author */}
                                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                                <Image
                                                                    src={
                                                                        blog.author?.profile_image ||
                                                                        "/assets/img/profile-placeholder.webp"
                                                                    }
                                                                    width={36}
                                                                    height={36}
                                                                    className="rounded-circle"
                                                                    alt={blog.author?.name}
                                                                    style={{ objectFit: "cover" }}
                                                                />
                                                                <div>
                                                                    <p className="mb-0 fw-bold fs-14">
                                                                        {blog.author?.name}
                                                                    </p>
                                                                    <p className="mb-0 text-muted fs-13">
                                                                        {formatBlogDate(blog.created_at)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Blog Title */}
                                                            <p className="fw-semibold fs-15 mb-0">
                                                                {getExcerpt(blog.title, 90)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="col-lg-3">
                                <div className="featured-post mb-5">
                                    <div className="feature-title">Featured</div>

                                    {featuredBlogs.length === 0 ? (
                                        <p className="text-muted mt-3">No featured blogs</p>
                                    ) : (
                                        featuredBlogs.map((blog) => (
                                            <div key={blog.id} className="feature-post">
                                                <Link href={{
                                                    pathname: '/blog-detail',
                                                    query: {
                                                        slug: blog.slug,
                                                    },
                                                }}>
                                                    <Image
                                                        style={{ borderRadius: '10px' }}
                                                        src={blog.featured_image}
                                                        width={124}
                                                        height={107}
                                                        alt={blog.title}
                                                    />
                                                </Link>

                                                <div className="content">
                                                    <div className="date">
                                                        {formatBlogDate(blog.created_at)}
                                                    </div>
                                                    <Link href={`/blogs/${blog.slug}`} className="description">
                                                        {getExcerpt(blog.content, 80)}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
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