// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 👈 Import this

import '../../styles/header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname(); // 👈 Get current route

    // Helper function to check if a link is active
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <Link href="/" className="logo">
                        <Image
                            src="/assets/img/login-logo.webp"
                            width={234}
                            height={67}
                            alt="Logo"
                        />
                    </Link>

                    <button
                        className="hamburger"
                        id="hamburger-icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle navigation"
                    >
                        <span className="line line-1"></span>
                        <span className="line line-2"></span>
                        <span className="line line-3"></span>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className={isMenuOpen ? 'mobile-open' : ''}>
                        <ul className="menu-links mb-0">
                            <li>
                                <Link
                                    href="/"
                                    className={isActive('/') ? 'active' : ''}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/projects"
                                    className={isActive('/projects') ? 'active' : ''}
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/subscription"
                                    className={isActive('/subscription') ? 'active' : ''}
                                >
                                    30 Days Free Trial
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blogs"
                                    className={isActive('/blogs') ? 'active' : ''}
                                >
                                    Blogs
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="buttons d-flex align-items-center flex-wrap">
                        <Link href="/auth/login" className="custom-btn-s1 custom-outline-s1">
                            Log In
                        </Link>
                        <Link href="/auth/register" className="custom-btn-s1 custom-primary-s1">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}