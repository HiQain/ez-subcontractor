'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { useState, useEffect } from 'react';

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    role: string;
    city: string;
    state: string;
    zipCode: string;
    workRadius: number;
    categories: string[];
}

export default function ProfilePage() {
    const pathname = usePathname();
    const router = useRouter();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const links = [
        { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
    ];

    // 🔁 Fetch profile after confirming token on client
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            setLoading(false);
            router.push('/auth/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    setProfile({
                        fullName: data.data.name || 'N/A',
                        email: data.data.email || 'N/A',
                        phone: data.data.phone || 'N/A',
                        companyName: data.data.company_name || 'N/A',
                        role: data.data.role || 'N/A',
                        city: data.data.city || 'N/A',
                        state: data.data.state || 'N/A',
                        zipCode: data.data.zipCode || 'N/A',
                        workRadius: data.data.workRadius || 0,
                        categories: data.data.categories || [],
                    });
                } else {
                    setError(data.message || 'Failed to load profile');
                }
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        setLogoutLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/logout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text };
            }

            if (response.ok) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('token');
                router.push('/auth/login');
            } else {
                alert(data?.message || 'Logout failed');
            }
        } catch (err) {
            console.error('Logout Error:', err);
            alert('Network error. Please try again.');
        } finally {
            setLogoutLoading(false);
        }
    };

    // 🌀 Loading State
    if (loading) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile position-static">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="sections overflow-hidden">
                    <section className="banner-sec profile position-static">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <p className="text-danger">{error}</p>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }
    if (!profile) {
        return null;
    }

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile position-static">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark p-0">
                                        <div className="topbar mb-5 d-flex justify-content-between align-items-start">
                                            <div className="icon-wrapper d-flex align-items-start gap-3">
                                                <Image
                                                    src="/assets/img/profile-img.webp"
                                                    width={80}
                                                    height={80}
                                                    alt="Worker Icon"
                                                />
                                                <div className="content-wrapper">
                                                    <div className="title text-black fs-5 fw-medium mb-2">
                                                        {profile.fullName}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                        />
                                                        <Link
                                                            href={`mailto:${profile.email}`}
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            {profile.email}
                                                        </Link>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/call-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Call Icon"
                                                        />
                                                        <Link
                                                            href={`tel:${profile.phone}`}
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            {profile.phone}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <Image
                                                src="/assets/img/icons/arrow-dark.svg"
                                                width={16}
                                                height={10}
                                                alt="Arrow"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>

                                        {/* Sidebar Links */}
                                        <div className="buttons-wrapper">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`custom-btn ${pathname === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image
                                                            src={link.icon}
                                                            width={20}
                                                            height={20}
                                                            alt="Icon"
                                                        />
                                                        <span className="text-white">{link.label}</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        width={15}
                                                        height={9}
                                                        alt="Arrow"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Logout Button */}
                                    <div className="bottom-bar">
                                        <div className="buttons-wrapper">
                                            <button
                                                onClick={handleLogout}
                                                disabled={logoutLoading}
                                                className="custom-btn bg-danger w-100 border-0"
                                                style={{ borderColor: '#DC2626' }}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Logout Icon"
                                                    />
                                                    <span className="text-white">
                                                        {logoutLoading ? 'Logging out...' : 'Logout'}
                                                    </span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    width={15}
                                                    height={9}
                                                    alt="Arrow"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-2">
                                            <span className="fs-4 fw-semibold">Profile Details</span>
                                        </div>
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <Link href="/sub-contractor/edit-profile" className="icon">
                                                <Image
                                                    src="/assets/img/icons/edit.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="Edit Icon"
                                                />
                                            </Link>
                                            <Link
                                                href="#"
                                                className="icon"
                                                style={{ backgroundColor: '#DC2626 !important' }}
                                            >
                                                <Image
                                                    src="/assets/img/icons/delete.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="Delete Icon"
                                                />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="review-bar d-flex align-items-center justify-content-between gap-2 flex-wrap mb-5">
                                        <div className="image-box d-flex align-items-center gap-4">
                                            <Image
                                                src="/assets/img/profile-img.webp"
                                                className="worker-img"
                                                width={180}
                                                height={180}
                                                alt="Worker Image"
                                            />
                                            <div className="content">
                                                <div className="title fw-semibold fs-4 mb-2">{profile.fullName}</div>
                                                <p className="mb-1 text-gray-light">{profile.role}</p>
                                                <p className="mb-1 text-gray-light">
                                                    {profile.city}, {profile.state} {profile.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="right d-flex align-items-center gap-4 flex-wrap">
                                            <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                                {[1, 2, 3, 4].map((_, i) => (
                                                    <Image
                                                        key={i}
                                                        src="/assets/img/start1.svg"
                                                        width={50}
                                                        height={50}
                                                        alt="Star Icon"
                                                        style={{
                                                            width: 'clamp(20px,5vw,50px)',
                                                            height: 'clamp(20px,5vw,50px)',
                                                        }}
                                                    />
                                                ))}
                                                <Image
                                                    src="/assets/img/star2.svg"
                                                    width={50}
                                                    height={50}
                                                    alt="Star Icon"
                                                    style={{
                                                        width: 'clamp(20px,5vw,50px)',
                                                        height: 'clamp(20px,5vw,50px)',
                                                    }}
                                                />
                                            </div>
                                            <div className="content">
                                                <div className="text-black text-center fs-3 fw-bold">4.5/5</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="review-bar">
                                        <div className="row g-2 mb-4">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">Full Name</div>
                                                    <div className="fw-semibold fs-18">{profile.fullName}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Company Name
                                                    </div>
                                                    <div className="fw-semibold fs-18">{profile.companyName}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Email Address
                                                    </div>
                                                    <Link
                                                        href={`mailto:${profile.email}`}
                                                        className="fw-semibold fs-18 text-dark"
                                                    >
                                                        {profile.email}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Phone Number
                                                    </div>
                                                    <Link
                                                        href={`tel:${profile.phone}`}
                                                        className="fw-semibold fs-18 text-dark"
                                                    >
                                                        {profile.phone}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-gray-light fw-medium mb-2">Categories</div>
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
                                            {profile.categories.map((cat, i) => (
                                                <Link
                                                    href="#"
                                                    key={i}
                                                    className="btn bg-dark rounded-3 p-2 fs-18 fw-semibold"
                                                    style={{ color: 'white' }}
                                                >
                                                    {cat}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="row g-2">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">City</div>
                                                    <div className="fw-semibold fs-18">{profile.city}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">State</div>
                                                    <div className="fw-semibold fs-18">{profile.state}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">Zip Code</div>
                                                    <div className="fw-semibold fs-18">{profile.zipCode}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Work Radius
                                                    </div>
                                                    <div className="fw-semibold fs-18">{profile.workRadius} miles</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}