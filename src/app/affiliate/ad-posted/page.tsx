'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/post-detail.css';

export default function MyAds() {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // 🔹 Toast Utility — identical to your register page
    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        const existing = document.querySelector('.checkout-toast');
        if (existing) existing.remove();

        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
        const icon = type === 'success' ? '✅' : '❌';

        const toast = document.createElement('div');
        toast.className = 'checkout-toast';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                max-width: 400px;
                background-color: ${bgColor};
                color: ${textColor};
                border: 1px solid ${borderColor};
                border-radius: 8px;
                padding: 12px 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
                font-size: 14px;
            ">
                <span>${icon} ${message}</span>
<!--                <button type="button" class="btn-close" style="font-size: 12px; margin-left: auto; opacity: 0.7;" data-bs-dismiss="toast"></button>-->
            </div>
        `;
        document.body.appendChild(toast);

        const timeoutId = setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 4000);
    };

    // 🔹 Get My Ads API
    const getMyAds = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads/my-ads`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // token
                },
            });

            const result = await res.json();

            if (result.success) {
                setAds(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch ads', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyAds();
    }, []);

    // Edit ad
    const handleEdit = (id: number) => {
        router.push(`/affiliate/post-an-ad?ad_id=${id}`);
    };

    // Delete ad
    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ads/${id}/delete`, {
                method: 'DELETE', // DELETE method
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // 🔹 Remove ad from state
                setAds(prev => prev.filter(ad => ad.id !== id));
                // 🔹 Success toast
                showToast('Ad deleted successfully!', 'success');
            } else {
                // 🔹 Error toast
                showToast(data.message?.[0] || 'Failed to delete ad', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Something went wrong while deleting ad', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Header />

            <section className="banner-sec post">
                <div className="container">
                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                        <div className="title fs-4 fw-semibold">My Ads</div>

                        {ads.length !== 0 && (
                            <Link
                                href="post-an-ad"
                                style={{ maxWidth: '242px', backgroundColor: '#C9DA2B' }}
                                className="btn bg-gray-light rounded-3 justify-content-center w-100 d-flex align-items-center gap-2"
                            >
                                <Image src="/assets/img/icons/plus.svg" width={12} height={12} alt="Icon" loading="lazy" />
                                <span className="fs-18">Post an Ad</span>
                            </Link>
                        )}
                    </div>

                    <div className="row g-3">
                        {!loading &&
                            ads.map((ad) => {
                                const isHorizontal = ad.orientation === 'horizontal';
                                const imagePath = isHorizontal
                                    ? ad.horizontal_image
                                    : ad.vertical_image;

                                return (
                                    <div
                                        key={ad.id}
                                        className={isHorizontal ? 'col-xl-6' : 'col-xl-3'}
                                    >
                                        <div className="image-wrapper position-relative">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePath}`}
                                                width={isHorizontal ? 769 : 370}
                                                height={426}
                                                className="img-fluid w-100 h-100 post-img"
                                                alt="Ad"
                                            />

                                            <div className="icon-wrapper d-flex gap-2 position-absolute top-0 end-0 p-2">
                                                <button
                                                    onClick={() => handleEdit(ad.id)}
                                                    className="icon bg-transparent border-0 p-0"
                                                >
                                                    <Image
                                                        src="/assets/img/icons/edit-dark.svg"
                                                        width={24}
                                                        height={24}
                                                        alt="Edit"
                                                    />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="icon bg-transparent border-0 p-0"
                                                    disabled={deletingId === ad.id}
                                                >
                                                    {deletingId === ad.id ? (
                                                        <span className="spinner-border spinner-border-sm" />
                                                    ) : (
                                                        <Image src="/assets/img/icons/delete-dark.svg" width={24} height={24} alt="Delete" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {loading && (
                            <center>
                                <span className="spinner-border"></span>
                            </center>
                        )}

                        {/* No ads message */}
                        {!loading && ads.length === 0 && (
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
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
