// components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import "../../styles/footer.css";

export default function Footer() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText('https://www.ezsubcontractor.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleDropdown = (key: string) => {
        setOpenDropdown(prev => (prev === key ? null : key));
    };

    return (
        <footer
            className="footer"
            style={{
                backgroundImage: `url('/assets/img/footer-bg.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container">


                <div className="footer-main">
                    <div className="row g-3">
                        {/* Contact Info */}
                        <div className={"col-lg-4 col-sm-6"}>
                            <Link
                                href="/"
                                className="footer-logo d-flex justify-content-center mb-4"
                                style={{ width: 'fit-content' }}
                                aria-label="Home"
                            >
                                <Image
                                    src="/assets/img/icons/logo.svg"
                                    width={350}
                                    height={120}
                                    alt="EZ Subcontractor Logo"

                                    loading="lazy"
                                />
                            </Link>
                            {/* <p className={'text-white'}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p> */}
                        </div>

                        {/* Quick Links – Updated to match new structure */}
                        <div className="col-6 col-lg-2 offset-lg-1 col-sm-6">
                            <div className="footer-title">Menu</div>
                            <ul className="footer-links m-0 p-0">

                                <li><Link href="/">Home</Link></li>
                                {/* Free Trial */}
                                <li className="footer-dropdown">
                                    <button
                                        className="footer-dropdown-btn"
                                        onClick={() => toggleDropdown('trial')}
                                    >
                                        Free Trial
                                    </button>

                                    {openDropdown === 'trial' && (
                                        <ul className="footer-submenu">
                                            <li><Link href="/home-general-contractor#plans">General Contractor</Link></li>
                                            <li><Link href="/home-subcontractor#plans">Subcontractor</Link></li>
                                            <li><Link href="/home-affiliate#plans">Affiliate</Link></li>
                                        </ul>
                                    )}
                                </li>

                                {/* How It Works */}
                                <li className="footer-dropdown">
                                    <button
                                        className="footer-dropdown-btn"
                                        onClick={() => toggleDropdown('how')}
                                    >
                                        How It Works
                                    </button>

                                    {openDropdown === 'how' && (
                                        <ul className="footer-submenu">
                                            <li><Link href="/home-general-contractor#howsItsWorks">General Contractor</Link></li>
                                            <li><Link href="/home-subcontractor#howsItsWorks">Subcontractor</Link></li>
                                            <li><Link href="/home-affiliate#howsItsWorks">Affiliate</Link></li>
                                        </ul>
                                    )}
                                </li>

                                {/* Blogs */}
                                <li className="footer-dropdown">
                                    <button
                                        className="footer-dropdown-btn"
                                        onClick={() => toggleDropdown('blogs')}
                                    >
                                        Blogs
                                    </button>

                                    {openDropdown === 'blogs' && (
                                        <ul className="footer-submenu">
                                            <li><Link href="/home-general-contractor#blogs">General Contractor</Link></li>
                                            <li><Link href="/home-subcontractor#blogs">Subcontractor</Link></li>
                                            <li><Link href="/home-affiliate#blogs">Affiliate</Link></li>
                                        </ul>
                                    )}
                                </li>

                            </ul>
                        </div>

                        {/* Other Links */}
                        <div className="col-6 col-lg-2 col-sm-6">
                            <div className="footer-title">Other</div>
                            <ul className="footer-links m-0 p-0">

                                <li className="footer-dropdown">
                                    <button
                                        className="footer-dropdown-btn"
                                        onClick={() => toggleDropdown('faq')}
                                    >
                                        FAQs
                                    </button>

                                    {openDropdown === 'faq' && (
                                        <ul className="footer-submenu">
                                            <li><Link href="/home-general-contractor#faq">General Contractor</Link></li>
                                            <li><Link href="/home-subcontractor#faq">Subcontractor</Link></li>
                                            <li><Link href="/home-affiliate#faq">Affiliate</Link></li>
                                        </ul>
                                    )}
                                </li>
                                <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-sm-6">
                            <div className="footer-title">Reach Us:</div>
                            <div className="d-flex align-items-center gap-2" style={{
                                marginBottom: '35px'
                            }}>
                                <div className="icon">
                                    <Image
                                        src="/assets/img/icons/message-green.svg"
                                        width={15}
                                        height={15}
                                        alt="Email"
                                        loading="lazy"
                                    />
                                </div>
                                <Link
                                    href="mailto:info@ezsubcontractor.com"
                                    className="text-decoration-none"
                                    style={{ color: '#E6EE9D' }}
                                >
                                    info@ezsubcontractor.com
                                </Link>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <button
                                    onClick={copyLink}
                                    className="text-decoration-none fw-semibold"
                                    style={{
                                        color: '#A5D6A7',
                                        backgroundColor: '#1B5E20',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    Copy Website Link
                                </button>

                                {copied && (
                                    <span
                                        style={{
                                            color: '#fff',
                                            backgroundColor: '#4CAF50',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            transition: 'opacity 0.3s'
                                        }}
                                    >
                                        Copied!
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom pt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="left text-white fw-medium">
                        © {new Date().getFullYear()} EZ Subcontractor. All Rights Reserved
                    </div>
                    <div className="right text-white fw-medium">
                        Developed By:{' '}
                        <Link
                            href="https://designspartans.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary fw-semibold text-decoration-underline"
                        >
                            Design Spartans
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}