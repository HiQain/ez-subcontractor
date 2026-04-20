'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from 'next/navigation';

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

export default function BlogSinglePage() {
    const router = useRouter();
    const [slug, setSlug] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [blog, setBlog] = useState<any>(null);
    const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
    const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
    const [forPage, setForPage] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Get slug from URL
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const slugParam = params.get('slug');
        const roleParam = params.get('role');

        setSlug(slugParam);
        setRole(roleParam);
    }, []);

    // 🔹 Fetch blog detail via API
    useEffect(() => {
        if (!slug) return;

        const fetchBlog = async () => {
            try {
                setLoading(true);

                const [latestRes, featuredRes, newRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/detail/${slug}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/featured`),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/blogs/latest?type=${role}`)
                ]);

                const latestJson = await latestRes.json();
                const featuredJson = await featuredRes.json();
                const newJson = await newRes.json();

                if (latestJson.success) {
                    setBlog(latestJson.data || []);
                }

                if (featuredJson.success) {
                    setFeaturedBlogs((featuredJson.data || []).slice(0, 3));
                }

                if (newJson.success) {
                    setLatestBlogs((newJson.data || []).slice(0, 3));
                    setForPage(newJson.data || []);
                }

            } catch (error) {
                console.error('Blogs fetch error:', error);
                setBlog([]);
                setFeaturedBlogs([]);
                setLatestBlogs([]);
                setForPage([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const getPrevNextBlogs = () => {
        if (!forPage.length || !blog) return { prev: null, next: null };

        const sortedBlogs = [...forPage].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const currentIndex = sortedBlogs.findIndex((b) => b.slug === blog.slug);

        const prev = currentIndex > 0 ? sortedBlogs[currentIndex - 1] : null;
        const next = currentIndex < sortedBlogs.length - 1 ? sortedBlogs[currentIndex + 1] : null;

        return { prev, next };
    };

    const { prev, next } = getPrevNextBlogs();

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
                            <div className="col-lg-9">

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
                            <div className="col-lg-3">
                                <div className="featured-post mb-5">
                                    <div className="feature-title">Featured</div>

                                    {featuredBlogs.length === 0 ? (
                                        <p className="text-muted mt-3">No featured blogs</p>
                                    ) : (
                                        featuredBlogs.map((blog) => (
                                            <div key={blog.id} className="feature-post d-flex gap-3 align-items-start">
                                                <a style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        if (slug === blog.slug) return;
                                                        router.back()
                                                        setTimeout(() => {
                                                            router.push(`/blog-detail?slug=${blog.slug}`)
                                                        }, 50);
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '124px',
                                                            height: '107px',
                                                            position: 'relative',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <Image
                                                            src={blog.featured_image}
                                                            alt={blog.title}
                                                            fill
                                                            style={{ objectFit: 'cover', borderRadius: '10px' }}
                                                        />
                                                    </div>
                                                </a>

                                                <div className="content">
                                                    <div className="date mb-1">
                                                        {formatBlogDate(blog.created_at)}
                                                    </div>
                                                    <div
                                                        className="description text-decoration-none"
                                                    >
                                                        {getExcerpt(blog.content, 80)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="latest-post">
                                    <div className="feature-title">Latest</div>

                                    {latestBlogs.length === 0 ? (
                                        <p className="text-muted mt-3">No featured blogs</p>
                                    ) : (
                                        latestBlogs.map((blog) => (
                                            <div key={blog.id} className="feature-post d-flex gap-3 align-items-start">
                                                <a style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        if (slug === blog.slug) return;
                                                        router.back()
                                                        setTimeout(() => {
                                                            router.push(`/blog-detail?slug=${blog.slug}`)
                                                        }, 50);
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '124px',
                                                            height: '107px',
                                                            position: 'relative',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <Image
                                                            src={blog.featured_image}
                                                            alt={blog.title}
                                                            fill
                                                            style={{ objectFit: 'cover', borderRadius: '10px' }}
                                                        />
                                                    </div>
                                                </a>

                                                <div className="content">
                                                    <div className="date mb-1">
                                                        {formatBlogDate(blog.created_at)}
                                                    </div>
                                                    <div
                                                        className="description text-decoration-none"
                                                    >
                                                        {getExcerpt(blog.content, 80)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-5 w-100">
                                {/* Previous */}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (prev) {
                                            router.back()
                                            setTimeout(() => {
                                                router.push(`/blog-detail?slug=${prev.slug}&role=${role}`);
                                            }, 5);
                                        }
                                    }}
                                    disabled={!prev}
                                    style={{
                                        opacity: !prev ? 0.5 : 1,
                                        cursor: !prev ? 'not-allowed' : 'pointer',
                                        marginLeft: '10px',
                                    }}
                                >
                                    &larr; Previous
                                </button>

                                {/* Next */}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (next) {
                                            router.back()
                                            setTimeout(() => {
                                                router.push(`/blog-detail?slug=${next.slug}&role=${role}`);
                                            }, 5);
                                        }
                                    }}
                                    disabled={!next}
                                    style={{
                                        opacity: !next ? 0.5 : 1,
                                        cursor: !next ? 'not-allowed' : 'pointer',
                                        marginLeft: '10px',
                                    }}
                                >
                                    Next &rarr;
                                </button>
                            </div>

                        </div>
                    </div>
                </section >
            </div >

            <Footer />
        </>
    );
}
