// app/success/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SuccessPage() {
    return (
        <div>
            <div
                className="sections overflow-hidden"
                style={{
                    background: "url('/assets/img/success-img.webp') center / cover no-repeat",
                }}
            >
                <section className="hero-sec h-100">
                    <div className="container">
                        <div
                            className="form main-wrapper w-100 d-flex align-items-center justify-content-center mx-auto flex-column"
                            style={{ maxWidth: '474px', height: '100vh' }}
                        >
                            <Image
                                src="/assets/img/check-img.webp"
                                width={180}
                                height={180}
                                alt="Check Image"
                                loading="lazy"
                                className="d-block mx-auto mb-4"
                            />
                            <h2 className="main-title text-center fw-bold mb-2">
                                Subscription Activated
                            </h2>
                            <p className="mb-3 fs-5 text-center fw-semibold">
                                Your subscription is active. You now have full access to all contractor tools and features.
                            </p>
                            <Link
                                href="/affiliate/dashboard"
                                className="btn btn-primary rounded-3 w-100 justify-content-center"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
