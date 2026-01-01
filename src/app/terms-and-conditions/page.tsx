'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/about-us.css';

export default function TermsPage() {
    const [pageData, setPageData] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}data/pages/terms-conditions`;
                const res = await fetch(url);
                const json = await res.json();

                if (json.success && json.data) {
                    setPageData(json.data);
                } else {
                    setPageData({
                        title: "Privacy Policy",
                        content: "<p><strong>What we Agree</strong></p><p>1. In respect to Registered user of our website...</p>",
                    });
                }
            } catch (e) {
                console.error('Failed to load privacy policy:', e);
                setPageData({
                    title: "Privacy Policy",
                    content: "<p>Error loading content. Please try again later.</p>",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, []);

    return (
        <div>
            <Header />

            <div className="sections overflow-hidden">
                <div className="hero-sec about position-static">
                    <div className="container">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : pageData ? (
                            <>
                                <h1 className="main-title text-center mb-4">{pageData.title}</h1>
                                <div className="content-wrapper" style={{ maxWidth: '100%' }}>
                                    {/* ✅ Render HTML safely */}
                                    <div
                                        dangerouslySetInnerHTML={{ __html: pageData.content }}
                                        className="fs-4 fw-semibold"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">Content not available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}