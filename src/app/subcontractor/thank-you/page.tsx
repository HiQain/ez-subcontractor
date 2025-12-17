// app/thank-you/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";

export default function SuccessPage() {
    return (
        <div className="sections overflow-hidden">
            <Header />
            <div
                className="sections overflow-hidden py-5"
                style={{
                    backgroundImage: 'url(/assets/img/success-img.webp)',
                }}
            >
                <section className="hero-sec h-100">
                    <div className="container">
                        <div
                            className="form main-wrapper w-100 d-flex align-items-center justify-content-center mx-auto flex-column"
                            style={{ maxWidth: '550px', height: '100vh' }}
                        >
                            <Image
                                src="/assets/img/check-img.webp"
                                width={130}
                                height={130}
                                alt="Check Image"
                                loading="lazy"
                                className="d-block mx-auto mb-4"
                            />
                            <h3 className="main-title text-center fw-bold mb-0 pb-0 lh-1">
                                Subscription Activated Successfully
                            </h3>
                            <p className="mt-0 mb-3 text-center">
                                Your subscription is now active. You have full access to all premium features.
                            </p>
                            <Link
                                href="/subcontractor/dashboard" // ✅ Updated href
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
