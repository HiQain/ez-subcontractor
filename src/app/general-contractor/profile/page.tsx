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
    profile_image: string,
    companyName: string;
    role: string;
    city: string;
    state: string;
    zipCode: string;
    workRadius: number;
    license_number: string;
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
        { href: '/general-contractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/user.svg' },
        { href: '/general-contractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
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
                        fullName: data.data.name || '',
                        email: data.data.email || '',
                        phone: data.data.phone || '',
                        profile_image: data.data.profile_image || '/assets/img/profile-placeholder.webp',
                        companyName: data.data.company_name || '',
                        role: data.data.role || '',
                        city: data.data.city || '',
                        state: data.data.state || '',
                        zipCode: data.data.zipCode || '',
                        license_number: data.data.license_number || '',
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
                            {/* SidebarSubcontractor */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark p-0">

                                        {/* SidebarSubcontractor Links */}
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
                                            <Link href="/general-contractor/edit-profile" className="icon">
                                                <Image
                                                    src="/assets/img/icons/edit.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="Edit Icon"
                                                />
                                            </Link>
                                            <Link
                                                href="#"
                                                className="icon delete"
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
                                                src={profile.profile_image}
                                                className="worker-img rounded-circle"
                                                width={180}
                                                height={180}
                                                alt="Worker Image"
                                            />
                                            <div className="content">
                                                <div className="title fw-semibold fs-4 mb-0">{profile.fullName}</div>
                                                <p className="mb-1 text-gray-light text-capitalize">{profile.role.replace(/[^a-zA-Z0-9]/g, ' ')}</p>
                                                {(profile.city || profile.state || profile.zipCode) && (
                                                    <p className="mb-1 text-gray-light">
                                                        {profile.city}, {profile.state} {profile.zipCode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="review-bar">
                                        <div className="row g-2 gy-4">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">Full Name</div>
                                                    <div className="fw-semibold fs-18  text-truncate">{profile.fullName}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Company Name
                                                    </div>
                                                    <div className="fw-semibold fs-18 text-truncate">{profile.companyName}</div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Phone Number
                                                    </div>
                                                    <Link
                                                        href={`tel:${profile.phone}`}
                                                        className="fw-semibold fs-18 text-dark text-truncate"
                                                    >
                                                        {profile.phone}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6 overflow-hidden">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Email Address
                                                    </div>
                                                    <Link
                                                        href={`mailto:${profile.email}`}
                                                        className="fw-semibold fs-18 text-dark  text-truncate"
                                                    >
                                                        {profile.email}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        License Number
                                                    </div>
                                                    <div
                                                        className="fw-semibold fs-18 text-dark text-truncate"
                                                    >
                                                        {profile.license_number}
                                                    </div>
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