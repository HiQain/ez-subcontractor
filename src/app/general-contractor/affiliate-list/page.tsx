'use client';
import Header from "../../components/Header";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Affiliate {
    id: number;
    name: string;
    email: string;
    company_name: string | null;
    zip: string | null;
    city: string | null;
    state: string | null;
    created_at: string;
    profile_image_url: string | null;
}

export default function AffiliateList() {
    const router = useRouter();
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAffiliates = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required.');
                return;
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/affiliates`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message?.[0] || 'Failed to load affiliates');
            setAffiliates(json.data?.data || []);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    return (
        <div className="sections overflow-hidden">
            <Header />

            <section className="banner-sec profile review">
                <div className="container">
                    <div className="review-wrapper p-0 shadow-none">
                        <div className="d-flex align-items-center gap-3 justify-content-between right-bar p-0 mb-5 flex-wrap">
                            <div className="icon-wrapper d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="icon"
                                    aria-label="Go back"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                    <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Back" />
                                </button>
                                <span className="fs-4 fw-semibold">Affiliates</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading affiliates...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-warning">{error}</div>
                        ) : affiliates.length === 0 ? (
                            <div className="text-center py-5">
                                <Image src="/assets/img/post.webp" width={120} height={120} alt="No affiliates" />
                                <p className="text-muted mt-3">No affiliates found.</p>
                            </div>
                        ) : (
                            <div className="row g-4 mb-5">
                                {affiliates.map((affiliate) => {
                                    return (
                                        <div className="col-lg-4 col-md-6" key={affiliate.id}>
                                            <div className="review-inner-card p-3 border rounded-3 h-100">
                                                <div className="top d-flex align-items-center gap-2 justify-content-between flex-wrap mb-2">
                                                    <div className="icon-wrapper d-flex align-items-center gap-2">
                                                        <Image
                                                            className="avatar rounded-circle"
                                                            src={affiliate.profile_image_url || '/assets/img/profile-placeholder.webp'}
                                                            width={40}
                                                            height={40}
                                                            alt={affiliate.name}
                                                        />
                                                        <div className="content">
                                                            <div style={{ color: '#8F9B1F' }} className="fw-semibold fs-14">
                                                                {affiliate.company_name || 'Unknown Company'}
                                                            </div>
                                                            <div className="fw-semibold fs-14 mb-1 text-capitalize">{affiliate.name}</div>
                                                            {affiliate.zip && (
                                                                <div className="fs-12 fw-medium">{affiliate.zip}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="date fs-12 text-gray-light">
                                                        {formatDate(affiliate.created_at)}
                                                    </div>
                                                </div>

                                                <div className="bottom d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                                    <div className="fs-12 fw-medium">
                                                        {affiliate.city && affiliate.state
                                                            ? `${affiliate.city}, ${affiliate.state}`
                                                            : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
