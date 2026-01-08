// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import '../../styles/header.css';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    // ✅ Start as null — no assumption
    const [authState, setAuthState] = useState<{ role: string | null; resolved: boolean }>({
        role: null,
        resolved: false,
    });

    // 🔥 Critical: Use layout effect for synchronous update (no flash)
    useEffect(() => {
        // Run only on client
        if (typeof window === 'undefined') return;

        // Read auth immediately
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        console.log(role);
        // Update state *once*
        setAuthState({
            role: token && role ? role : null,
            resolved: true,
        });
    }, []);

    // 🔁 Fetch profile
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
                localStorage.setItem('userName', data.data.name);
                localStorage.setItem('userEmail', data.data.email);
            } catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            }
        };

        fetchProfile();
    }, [router]);

    const { role, resolved } = authState;
    const isLoggedIn = !!role;

    const [notifications, setNotifications] = useState<any[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setNotifications(data.data);
                } else {
                    setNotifications([]);
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setNotifications([]);
            } finally {
                setLoadingNotifications(false);
            }
        };

        if (isLoggedIn) fetchNotifications();
    }, [isLoggedIn]);

    // 🛑 During SSR or before client JS: show only static, non-auth parts
    if (!resolved) {
        return (
            <nav className="navbar navbar-expand-lg shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" href="/">
                        <Image
                            src="/assets/img/icons/logo.webp"
                            width={234}
                            height={67}
                            alt="Logo"
                            priority
                        />
                    </Link>
                    {/* 👇 Show ONLY the toggler — no buttons, no icons */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
        );
    }

    // ✅ Now safely render full header
    return (
        <nav className="navbar navbar-expand-lg shadow-sm">
            <div className="container">
                <Link className="navbar-brand" href="/">
                    <Image
                        src="/assets/img/icons/logo.webp"
                        width={234}
                        height={67}
                        alt="Logo"
                        priority
                    />
                </Link>

                <div className="d-flex gap-1">
                    {/* 👇 Mobile login icon only if logged out */}
                    {!isLoggedIn && (
                        <Link href="/auth/login" className="btn btn-outline-dark px-3 rounded-3 border-0 d-lg-none">
                            <Image src="/assets/img/user.svg" width={20} height={20} alt="Login" />
                        </Link>
                    )}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* 👇 Menu logic — same as before */}
                    {(
                        pathname.startsWith('/general-contractor') ||
                        (pathname === '/messages' && role === 'general_contractor')
                    ) && (
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                <li className="nav-item">
                                    <Link className="nav-link" href="/general-contractor/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/messages">
                                        Messages
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/general-contractor/my-projects">
                                        My Projects
                                    </Link>
                                </li>
                            </ul>
                        )}

                    {(
                        pathname.startsWith('/subcontractor') ||
                        (pathname === '/messages' && role === 'subcontractor') ||
                        (pathname === '/subscription-list' && role === 'subcontractor')
                    ) && (
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                <li className="nav-item">
                                    <Link className="nav-link" href="/subcontractor/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/messages">
                                        Messages
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/subcontractor/rating">
                                        Ratings
                                    </Link>
                                </li>
                            </ul>
                        )}

                    {(
                        pathname.startsWith('/affiliate') ||
                        (pathname === '/messages' && role === 'affiliate') ||
                        (pathname === '/subscription-list' && role === 'affiliate')
                    ) && (
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                <li className="nav-item">
                                    <Link className="nav-link" href="/affiliate/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/messages">
                                        Messages
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/affiliate/ad-posted">
                                        My Ads
                                    </Link>
                                </li>
                            </ul>
                        )}

                    {[
                        '/', '/home-general-contractor', '/home-subcontractor', '/home-affiliate'
                    ].includes(pathname) && (
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                <li className="nav-item">
                                    <Link className="nav-link" href="/">Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle" role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false" href={'#'}>Free Trial</Link>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link
                                                href={'/home-general-contractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Affiliate
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false" href={'#'}>How It Works</Link>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link
                                                href={'/home-general-contractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Affiliate
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false" href={'#'}>Blogs</Link>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link
                                                href={'/home-general-contractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate'}
                                                className={`dropdown-item d-flex align-items-center `}>
                                                Affiliate
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Contractor
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link
                                                href={'/home-general-contractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate'}
                                                className={`dropdown-item d-flex align-items-center `}>
                                                Affiliate
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        )}
                </div>

                {/* ✅ Auth UI — no flicker because `resolved === true` */}
                {isLoggedIn ? (
                    <div className="icon-buttons d-flex align-items-center gap-2">
                        <div className="dropdown hide-arrow">
                            <Link
                                href="#"
                                className="nav-link icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <Image
                                    src="/assets/img/icons/notification-dark.svg"
                                    width={24}
                                    height={24}
                                    alt="Notifications"
                                />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '300px' }}>
                                <li>
                                    <span className="fw-bold px-3 border-bottom d-block py-2">Notifications</span>
                                </li>
                                {loadingNotifications ? (
                                    <li className="dropdown-item py-2 text-center">Loading...</li>
                                ) : notifications.length === 0 ? (
                                    <li className="dropdown-item py-2 text-center">No notifications</li>
                                ) : (
                                    notifications.map((notif) => (
                                        <li key={notif.id}>
                                            <a className="dropdown-item py-2" href="#">
                                                <span className="d-flex align-items-center justify-content-between w-100">
                                                    <span className="d-block fw-medium">{notif.title}</span>
                                                    <span className="fs-12">{new Date(notif.created_at).toLocaleTimeString()}</span>
                                                </span>
                                                <span className="fs-12 opacity-50">{notif.body}</span>
                                            </a>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        <Link
                            href={`/${role === 'general_contractor' ? 'general-contractor' : role}/profile`}
                            className="nav-link icon"
                            aria-label="Profile"
                        >
                            <Image
                                src="/assets/img/icons/user-dark.svg"
                                width={24}
                                height={24}
                                alt="Profile"
                            />
                        </Link>
                    </div>
                ) : (
                    <div className="gap-3 d-none d-lg-flex">
                        <Link href="/auth/login" className="btn btn-outline-dark rounded-3">
                            Login
                        </Link>
                        <Link href="/auth/register" className="btn btn-primary rounded-3">
                            Signup
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}