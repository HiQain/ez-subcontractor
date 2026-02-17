// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import '../../styles/header.css';
import { notificationEmitter } from '../notificationEmitter';

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
    const [readAll, setReadAll] = useState(true);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

    useEffect(() => {
        const listener = () => fetchNotifications();

        notificationEmitter.on('newNotification', listener);

        return () => {
            notificationEmitter.off('newNotification', listener);
        };
    }, []);

    const fetchNotifications = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/notifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await res.json();

            if (res.ok && data.success && data.data) {
                setNotifications(data.data.notifications || []);
                setReadAll(data.data.read_all);
            } else {
                setNotifications([]);
                setReadAll(true);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setNotifications([]);
            setReadAll(true);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        if (!token || readAll) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}common/notifications/read-all`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await res.json();

            if (res.ok && data.success) {
                setReadAll(true); // 🟢 green dot remove
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                );
            }
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    useEffect(() => {
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
                        (pathname === '/messages' && role === 'general_contractor') ||
                        (pathname === '/subscription-list' && role === 'general_contractor') ||
                        (pathname === '/checkout' && role === 'general_contractor')
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
                                    <Link className="nav-link" href="/general-contractor/reviews">
                                        Ratings
                                    </Link>
                                </li>
                            </ul>
                        )}

                    {(
                        pathname.startsWith('/subcontractor') ||
                        (pathname === '/messages' && role === 'subcontractor') ||
                        (pathname === '/subscription-list' && role === 'subcontractor') ||
                        (pathname === '/checkout' && role === 'subcontractor')
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
                        (pathname === '/subscription-list' && role === 'affiliate') ||
                        (pathname === '/checkout' && role === 'affiliate')
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
                        '/', '/home-general-contractor', '/home-subcontractor', '/home-affiliate', '/subscription', '/how-it-works', '/blogs', '/faq', '/terms-and-conditions', '/privacy-policy', '/blog-detail', '/contact-us'
                    ].includes(pathname) && (
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
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
                                                href={'/home-general-contractor#plans'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor#plans'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate#plans'}
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
                                                href={'/home-general-contractor#howsItsWorks'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor#howsItsWorks'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate#howsItsWorks'}
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
                                                href={'/home-general-contractor#blogs'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                General Contractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-subcontractor#blogs'}
                                                className={`dropdown-item d-flex align-items-center`}>
                                                Subcontractor
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/home-affiliate#blogs'}
                                                className={`dropdown-item d-flex align-items-center `}>
                                                Affiliate
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/contact-us">Contact Us</Link>
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
                                onClick={markAllAsRead}
                            >
                                <Image
                                    src="/assets/img/icons/notification-dark.svg"
                                    width={24}
                                    height={24}
                                    alt="Notifications"
                                />
                            </Link>
                            {/* 🔹 Green dot */}
                            {!readAll && <span className="green-dot"></span>}
                            <ul
                                className="dropdown-menu dropdown-menu-end notifications-dropdown"
                                style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}
                            >
                                <li className="d-flex justify-content-between align-items-center px-3 border-bottom py-2">
                                    <span className="fw-bold">Notifications</span>
                                    {notifications.length > 0 && (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={async () => {
                                                const token = localStorage.getItem('token');
                                                if (!token) return;

                                                try {
                                                    const res = await fetch(
                                                        `${process.env.NEXT_PUBLIC_API_BASE_URL}common/notifications/clear`,
                                                        {
                                                            method: 'POST',
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                                'Content-Type': 'application/json',
                                                            },
                                                        }
                                                    );

                                                    const data = await res.json();
                                                    if (res.ok && data.success) {
                                                        setNotifications([]);
                                                        setReadAll(true);
                                                        console.log('Notifications cleared');
                                                    } else {
                                                        console.error('Failed to clear notifications');
                                                    }
                                                } catch (err) {
                                                    console.error('Error clearing notifications:', err);
                                                }
                                            }}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </li>
                                {loadingNotifications ? (
                                    <li className="dropdown-item py-2 text-center">Loading...</li>
                                ) : notifications.length === 0 ? (
                                    <li className="dropdown-item py-2 text-center">No notifications</li>
                                ) : (
                                    notifications.map((notif) => (
                                        <li key={notif.id}>
                                            <a className="dropdown-item py-2" href={`${notif.title === 'New Message Received' ? '/messages' : '#'}`}>
                                                <span className="d-flex align-items-center justify-content-between w-100">
                                                    <span className="d-block fw-medium">{notif.title}</span>
                                                    <span style={{ fontSize: '10px', marginLeft: '10px' }}>{new Date(notif.created_at).toLocaleTimeString()}</span>
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
