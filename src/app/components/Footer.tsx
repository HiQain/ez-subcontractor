'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import "../../styles/footer.css";

export default function Footer() {
    const [email, setEmail] = useState('');

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
                <Link href="/" className="footer-logo d-flex justify-content-center mx-auto mb-4">
                    <Image
                        src="/assets/img/login-logo.webp"
                        width={283}
                        height={81}
                        alt="Logo"
                        className="img-fluid w-100"
                        style={{ maxWidth: '283px' }}
                    />
                </Link>

                <div className="footer-main">
                    <div className="row g-3">
                        {/* Reach Us */}
                        <div className="col-lg-4 col-sm-6">
                            <div className="footer-title">Reach us</div>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <div className="icon">
                                    <Image src="/assets/img/Message.svg" width={15} height={15} alt="Email" />
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
                                    <Image src="/assets/img/Call.svg" width={15} height={15} alt="Phone" />
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
                                    <Image src="/assets/img/Location1.svg" width={15} height={15} alt="Location" />
                                </div>
                                <span style={{ color: '#E6EE9D' }}>132 Dartmouth St Boston, MA 02116</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-lg-2 col-sm-6">
                            <div className="footer-title">Quick Links</div>
                            <ul className="footer-links m-0 p-0">
                                <li><Link href="/">Home</Link></li>
                                <li><Link href="/projects">Projects</Link></li>
                                <li><Link href="/about">About</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Other */}
                        <div className="col-lg-2 col-sm-6">
                            <div className="footer-title">Other</div>
                            <ul className="footer-links m-0 p-0">
                                <li><Link href="/privacy">Privacy Policy</Link></li>
                                <li><Link href="/terms">Terms of Service</Link></li>
                                <li><Link href="/faq">FAQ</Link></li>
                                <li><Link href="/support">Support</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="col-lg-4 col-sm-6">
                            <div className="newsletter-card">
                                <div className="title text-white fw-semibold">Join Our Newsletter</div>
                                <form className="form-wrapper mb-3">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                    <input type="submit" className="submit-btn" value="Subscribe" />
                                </form>
                                <p style={{ fontSize: '14px' }} className="mb-0 custom-text-gray">
                                    Will send you weekly updates for your better tool management.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom pt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="left text-white">© 2025 EZ Subcontractor. All Rights Reserved</div>
                    <div className="right text-white">
                        Developed By: <span className="custom-text">Design Spartans</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}