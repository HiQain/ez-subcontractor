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
    category: number | null; // ← Now stores ID (e.g., 17), not name
    average_rating: string; // e.g., "4.67"
    total_ratings: number;  // e.g., 3
}

interface Category {
    id: string;
    name: string;
}

export default function ProfilePage() {
    const pathname = usePathname();
    const router = useRouter();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Categories state
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const links = [
        { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/lock.svg' },
    ];


    // 🔁 Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}data/specializations`, {
                    headers: { 'Accept': 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                let fetchedCategories: Category[] = [];

                if (Array.isArray(data)) {
                    fetchedCategories = data.map(item => ({ id: String(item.id), name: item.name }));
                } else if (data?.data?.specializations && Array.isArray(data.data.specializations)) {
                    fetchedCategories = data.data.specializations.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                } else if (data?.data && Array.isArray(data.data)) {
                    fetchedCategories = data.data.map((item: any) => ({
                        id: String(item.id),
                        name: item.name,
                    }));
                }

                setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } catch (err) {
                console.error('Failed to load categories:', err);
                setCategories([
                    { id: '1', name: 'Plumbing' },
                    { id: '2', name: 'Electric Work' },
                    { id: '3', name: 'Framing' },
                    { id: '4', name: 'Roofing' },
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 🔁 Fetch profile
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
                        zipCode: data.data.zip || 'N/A',
                        workRadius: data.data.work_radius || 0,
                        category: data.data.specialization ? Number(data.data.specialization) : null,
                        // ✅ Add rating fields
                        average_rating: data.data.average_rating || '0.00',
                        total_ratings: data.data.total_ratings || 0,
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
    if (loading || (profile && categoriesLoading)) {
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

    // ✅ Helper: Get category name from ID
    const getCategoryName = (categoryId: number | null): string => {
        if (categoryId === null) return 'Not Set';
        const cat = categories.find(c => c.id === String(categoryId));
        return cat ? cat.name : 'Unknown';
    };

    // ✅ Render stars based on average_rating
    const renderStars = (rating: string) => {
        const avg = parseFloat(rating) || 0;
        return [1, 2, 3, 4, 5].map((_, i) => {
            const starValue = i + 1;
            const isFull = starValue <= Math.floor(avg);
            const isHalf = !isFull && starValue <= avg + 0.5;

            return (
                <Image
                    key={i}
                    src={
                        isFull
                            ? '/assets/img/start1.svg'
                            : isHalf
                            ? '/assets/img/star2.svg'
                            : '/assets/img/star-empty.svg'
                    }
                    width={50}
                    height={50}
                    alt="Star Icon"
                    style={{
                        width: 'clamp(20px,5vw,50px)',
                        height: 'clamp(20px,5vw,50px)',
                    }}
                />
            );
        });
    };

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
                                            <Link href="/subcontractor/edit-profile" className="icon">
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
                                                <p className="mb-1 text-gray-light text-capitalize">{profile.role}</p>
                                                <p className="mb-1 text-gray-light">
                                                    {profile.city}, {profile.state} {profile.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="right d-flex align-items-center gap-4 flex-wrap">
                                            <div className="rating-icons d-flex align-items-center gap-1 flex-wrap">
                                                {renderStars(profile.average_rating)}
                                            </div>
                                            <div className="content">
                                                <div className="text-black text-center fs-3 fw-bold">
                                                    {parseFloat(profile.average_rating).toFixed(1)}/5
                                                    {/*<span className="fs-14 ms-1 text-gray-light">*/}
                                                    {/*    ({profile.total_ratings})*/}
                                                    {/*</span>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="review-bar">
                                        <div className="row g-2 mb-4">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">Full Name</div>
                                                    <div className="fw-semibold fs-18 text-truncate">{profile.fullName}</div>
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
                                                        Email Address
                                                    </div>
                                                    <Link
                                                        href={`mailto:${profile.email}`}
                                                        className="fw-semibold fs-18 text-dark text-truncate"
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
                                                        className="fw-semibold fs-18 text-dark text-truncate"
                                                    >
                                                        {profile.phone}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ✅ FIXED: Show category name instead of ID */}
                                        <div className="text-gray-light fw-medium mb-2">Category</div>
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
                                            <div className="fw-semibold  bg-dark text-white fs-14 px-2 py-1 rounded-1">{getCategoryName(profile.category)}</div>
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