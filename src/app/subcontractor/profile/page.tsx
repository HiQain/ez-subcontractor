'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { useState, useEffect } from 'react';
import SidebarSubcontractor from "../../components/SidebarSubcontractor";

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
                if (response.ok) {
                    setProfile({
                        fullName: data.data.name || '',
                        email: data.data.email || '',
                        phone: data.data.phone || '',
                        companyName: data.data.company_name || '',
                        profile_image: data.data.profile_image || '/assets/img/profile-placeholder.webp',
                        role: data.data.role || '',
                        city: data.data.city || '',
                        state: data.data.state || '',
                        zipCode: data.data.zip || '',
                        workRadius: data.data.work_radius || 0,
                        category: data.data.specialization ? Number(data.data.specialization) : null,
                        average_rating: (parseFloat(data.data.average_rating) || 0).toString(),
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
                            {/* ✅ Sidebar always visible */}
                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
                            </div>

                            {/* ✅ Right Side — loading or content */}
                            <div className="col-xl-9">
                                {loading || (categoriesLoading && !profile) ? (
                                    <div className="right-bar d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="right-bar">
                                        <div className="alert alert-danger mb-4" role="alert">
                                            {error}
                                        </div>
                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={() => window.location.reload()}
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : !profile ? (
                                    <div className="right-bar text-center py-5">
                                        <p>Profile not found.</p>
                                    </div>
                                ) : (
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
                                                    src={profile.profile_image}
                                                    className="worker-img rounded-circle"
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
                                                    <div className="content text-truncate">
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
                                                <div className="col-xl-3 col-sm-6">
                                                    <div className="content text-truncate">
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
                                            </div>

                                            <div className="text-gray-light fw-medium mb-2">Category</div>
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
                                                <div className="fw-semibold bg-dark text-white fs-14 px-2 py-1 rounded-1">
                                                    {getCategoryName(profile.category)}
                                                </div>
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
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}