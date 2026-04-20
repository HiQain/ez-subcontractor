// app/my-ads/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import '../../../styles/profile.css';

export default function MyAdsPage() {
    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile position-static">
                    <div className="container">
                        <div className="title fs-4 fw-semibold">My Ads</div>
                        <div className="image-box h-100 d-flex flex-column align-items-center justify-content-center mt-4">
                            <Image
                                src="/assets/img/post.webp"
                                width={252}
                                height={247}
                                alt="No ads posted illustration"
                                className="mx-auto mb-3"
                                loading="lazy"
                            />
                            <div className="title fs-4 fw-semibold text-black text-center mb-3">
                                No Ad Posted
                            </div>
                            <p className="mb-3 text-gray-light fs-14 text-center">
                                Click the button below to post an ad with weekly charges of $50 per week{' '}
                                <Link href="/subscription" className="text-black fw-medium">
                                    free for the first 30 days!
                                </Link>
                            </p>
                            <Link
                                href="/affiliate/post-an-ad"
                                style={{ maxWidth: '242px' }}
                                className="btn btn-primary rounded-3 justify-content-center w-100 mx-auto d-flex align-items-center gap-2"
                            >
                                <Image
                                    src="/assets/img/icons/plus.svg"
                                    width={12}
                                    height={12}
                                    alt="Add icon"
                                    loading="lazy"
                                />
                                <span className="fs-18">Post an Ad</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}