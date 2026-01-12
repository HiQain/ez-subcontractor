'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/blog.css';

export default function BlogSinglePage() {
    const [slug, setSlug] = useState<string | null>(null);
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Get slug from URL
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get('slug');

        setSlug(slugParam);
    }, []);

    // 🔹 Fetch blog detail via API
    useEffect(() => {
        if (!slug) return;

        const fetchBlog = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/detail/${slug}`
                );

                const json = await res.json();

                if (json.success) {
                    setBlog(json.data);
                }
            } catch (error) {
                console.error('Blog detail fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <>
                <Header />
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: '60vh' }}
                >
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading blogs...</span>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <Header />
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: '60vh' }}
                >
                    <div className="text-center py-5">Blog not found</div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                {/* Banner */}
                <section
                    style={{
                        background: `url('${blog.featured_image}') center / cover no-repeat`,
                    }}
                    className="blog-single-hero position-static"
                ></section>

                {/* Blog Section */}
                <section className="blog-sec">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-12">

                                {/* Author + Date */}
                                <div className="d-flex align-items-center justify-content-between mb-5">
                                    <div className="blog-icon d-flex align-items-center gap-2">
                                        <Image
                                            src={blog.author.profile_image}
                                            width={40}
                                            height={40}
                                            alt={blog.author.name}
                                            style={{ borderRadius: '100px' }}
                                        />
                                        <span className="fw-semibold">
                                            {blog.author.name}
                                        </span>
                                    </div>

                                    <div className="date" style={{ fontSize: "14px" }}>
                                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="blog-single-title mb-4">
                                    {blog.title}
                                </h1>

                                {/* Content from API */}
                                <div
                                    className="blog-single-description"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
