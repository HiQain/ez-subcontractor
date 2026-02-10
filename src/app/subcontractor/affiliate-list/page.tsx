'use client';
import Header from "../../components/Header";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/navigation";
import '../../../styles/free-trial.css';
import '../../../styles/profile.css';
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";

interface Affiliate {
    id: number;
    name: string;
    email: string;
    company_name: string | null;
    zip: string | null;
    city: string | null;
    state: string | null;
    created_at: string;
    role: string;
    phone: string;
    profile_image_url: string | null;
}

export default function AffiliateList() {
    const router = useRouter();
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

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

    const filteredAffiliates = affiliates.filter((affiliate) => {
        const query = search.toLowerCase();
        return (
            affiliate.name?.toLowerCase().includes(query) ||
            affiliate.company_name?.toLowerCase().includes(query) ||
            affiliate.email?.toLowerCase().includes(query) ||
            affiliate.phone?.toLowerCase().includes(query)
        );
    });

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="filter-sec pt-5">
                    <div className="container">
                        <div className="d-flex align-items-center gap-3 justify-content-between right-bar p-0 mb-2 flex-wrap">
                            <div className="icon-wrapper d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="icon cus-bt"
                                    aria-label="Go back"
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Back" />
                                </button>
                                <span className="fs-4 fw-semibold">Affiliates</span>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search affiliates..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        minWidth: '350px',
                                        borderRadius: '10px',
                                        padding: '12px 15px'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row g-4">
                            <div>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading affiliates...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            className="bi bi-exclamation-triangle-fill me-2"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                        <div>{error}</div>
                                    </div>
                                ) : filteredAffiliates.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Image
                                            src="/assets/img/post.webp"
                                            width={120}
                                            height={120}
                                            alt="No contractors"
                                            className="mb-3"
                                        />
                                        <p className="text-muted">No affiliates found.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="row g-3">
                                            {filteredAffiliates.map((affiliate) => (
                                                <div key={affiliate.id} className="col-lg-4 col-md-6">
                                                    <div className="filter-card" style={{
                                                        margin: '20px'
                                                    }}>

                                                        <Image
                                                            src={affiliate.profile_image_url || '/assets/img/profile-placeholder.webp'}
                                                            width={104}
                                                            height={104}
                                                            className="d-block mx-auto mb-3 rounded-circle"
                                                            alt={`${affiliate.name}'s Profile`}
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                        <div
                                                            style={{ color: '#333342' }}
                                                            className="title text-black fw-semibold text-center fs-5 mb-2 text-capitalize"
                                                        >
                                                            {affiliate.company_name || affiliate.name}
                                                        </div>

                                                        <div className="text-center">
                                                            <button
                                                                // onClick={(e) => {
                                                                //     e.preventDefault();
                                                                //     localStorage.setItem('selectedContractor', JSON.stringify(contractor));
                                                                //     router.push('/affiliate/contractor-details');
                                                                // }}
                                                                className="btn btn-primary py-2 px-4 mx-auto mb-3 shadow-none text-capitalize"
                                                            >
                                                                {affiliate.role === 'general_contractor' ? 'General Contractor' : affiliate.role}
                                                            </button>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2 flex-nowrap">
                                                            <Image
                                                                src="/assets/img/icons/message-dark.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Message Icon"
                                                            />
                                                            <a
                                                                href={`mailto:${affiliate.email}`}
                                                                className="text-dark fw-medium text-truncate"
                                                            >
                                                                {affiliate.email}
                                                            </a>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
                                                            <Image
                                                                src="/assets/img/icons/call-dark.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Call Icon"
                                                            />
                                                            <a
                                                                href={`tel:${affiliate.phone}`}
                                                                className="text-dark fw-medium"
                                                            >
                                                                {affiliate.phone}
                                                            </a>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                                            <Link href={`mailto:${affiliate.email}`} className="icon">
                                                                <Image
                                                                    src="/assets/img/icons/message-white.svg"
                                                                    width={20}
                                                                    height={20}
                                                                    alt="Icon"
                                                                />
                                                            </Link>
                                                            <Link href={`tel:${affiliate.phone}`} className="icon">
                                                                <Image
                                                                    src="/assets/img/icons/call-white.svg"
                                                                    width={20}
                                                                    height={20}
                                                                    alt="Icon"
                                                                />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section >
            </div >
            <Footer />
        </>
    )
}
