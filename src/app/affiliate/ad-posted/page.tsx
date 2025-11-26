'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/post-detail.css';

export default function MyAds() {
    const router = useRouter();

    // Dummy ads list
    const [ads, setAds] = useState([
        { id: 1, image: '/assets/img/ad-posting1.webp', size: 'large' },
        { id: 2, image: '/assets/img/filter-img.webp', size: 'small' },
        { id: 3, image: '/assets/img/filter-img.webp', size: 'small' },
    ]);

    // Edit ad
    const handleEdit = (id: number) => {
        // Navigate to affiliate/edit-ad page
        router.push('/affiliate/edit-ad');
    };

    // Delete ad
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this ad?')) {
            setAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
        }
    };

    return (
        <>
            <Header />

            <section className="banner-sec post">
                <div className="container">
                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                        <div className="title fs-4 fw-semibold">My Ads</div>

                        <Link
                            href="post-an-ad"
                            style={{ maxWidth: '242px', backgroundColor: '#9a9a9a' }}
                            className="btn bg-gray-light rounded-3 justify-content-center w-100 d-flex align-items-center gap-2"
                        >
                            <Image src="/assets/img/icons/plus.svg" width={12} height={12} alt="Icon" loading="lazy" />
                            <span className="fs-18">Post an Ad</span>
                        </Link>
                    </div>

                    <div className="row g-3">
                        {ads.map((ad) => (
                            <div key={ad.id} className={ad.size === 'large' ? 'col-xl-6' : 'col-xl-3'}>
                                <div className="image-wrapper position-relative">
                                    <Image
                                        src={ad.image}
                                        width={ad.size === 'large' ? 769 : 370}
                                        height={426}
                                        className="img-fluid w-100 h-100 post-img"
                                        alt="Ad"
                                        loading="lazy"
                                    />
                                    <div className="icon-wrapper d-flex gap-2 position-absolute top-0 end-0 p-2">
                                        <button
                                            onClick={() => handleEdit(ad.id)}
                                            className="icon bg-transparent border-0 p-0"
                                            title="Edit"
                                        >
                                            <Image
                                                src="/assets/img/icons/edit-dark.svg"
                                                width={24}
                                                height={24}
                                                alt="Edit"
                                                loading="lazy"
                                            />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(ad.id)}
                                            className="icon bg-transparent border-0 p-0"
                                            title="Delete"
                                        >
                                            <Image
                                                src="/assets/img/icons/delete-dark.svg"
                                                width={24}
                                                height={24}
                                                alt="Delete"
                                                loading="lazy"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* No ads message */}
                        {ads.length === 0 && (
                            <div className="text-center py-5 text-muted fs-5">No ads available.</div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
