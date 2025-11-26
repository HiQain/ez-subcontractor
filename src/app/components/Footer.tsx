// components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import "../../styles/footer.css";

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You can add newsletter subscription logic here later
        console.log('Subscribed with email:', email);
        setEmail('');
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
                <Link
                    href="/"
                    className="footer-logo d-flex justify-content-center mx-auto mb-4"
                    style={{ width: 'fit-content' }}
                    aria-label="Home"
                >
                    <Image
                        src="/assets/img/icons/logo.webp"
                        width={283}
                        height={81}
                        alt="EZ Subcontractor Logo"
                        className="img-fluid w-100"
                        loading="lazy"
                    />
                </Link>

                <div className="footer-main">
                    <div className="row g-3">
                        {/* Contact Info */}
                        <div className="col-lg-4 col-sm-6">
                            <div className="footer-title">Reach us</div>
                            <div className="d-flex align-items-center gap-2 mb-3">
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
                                    href="mailto:EZcontractorz1@gmail.com"
                                    className="text-decoration-none"
                                    style={{ color: '#E6EE9D' }}
                                >
                                    EZcontractorz1@gmail.com
                                </Link>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <div className="icon">
                                    <Image
                                        src="/assets/img/icons/call-green.svg"
                                        width={15}
                                        height={15}
                                        alt="Phone"
                                        loading="lazy"
                                    />
                                </div>
                                <Link
                                    href="tel:+10001234392"
                                    className="text-decoration-none"
                                    style={{ color: '#E6EE9D' }}
                                >
                                    +1 (000) 123-4392
                                </Link>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div className="icon">
                                    <Image
                                        src="/assets/img/icons/location-green.svg"
                                        width={15}
                                        height={15}
                                        alt="Location"
                                        loading="lazy"
                                    />
                                </div>
                                <span style={{ color: '#E6EE9D' }}>
                                    132 Dartmouth St Boston, MA 02116
                                </span>
                            </div>
                        </div>

                        {/* Quick Links – Updated to match new structure */}
                        <div className="col-lg-2 col-sm-6">
                            <div className="footer-title">Quick Links</div>
                            <ul className="footer-links m-0 p-0">
                                <li><Link href="/">Home</Link></li>
                                <li><Link href="/projects">Projects</Link></li>
                                <li><Link href="/subscription">30 Days Free Trial</Link></li>
                                <li><Link href="/how-it-works">How It Works</Link></li>
                            </ul>
                        </div>

                        {/* Other Links */}
                        <div className="col-lg-2 col-sm-6">
                            <div className="footer-title">Other</div>
                            <ul className="footer-links m-0 p-0">
                                <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                                <li><Link href="/faq">FAQs</Link></li>
                                <li><Link href="/blogs">Blogs</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="col-lg-4 col-sm-6">
                            <div className="newsletter-card">
                                <div className="title text-white fw-semibold">
                                    Join Our Newsletter
                                </div>
                                <form className="form-wrapper mb-3" onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        className="form-control"
                                        required
                                    />
                                    <input
                                        type="submit"
                                        className="submit-btn"
                                        value="Subscribe"
                                    />
                                </form>
                                <p className="mb-0 text-white opacity-50" style={{ fontSize: '14px' }}>
                                    Will send you weekly updates for your better tool management.
                                </p>
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