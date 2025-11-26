'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';

export default function SavedListingPage() {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState<number[]>([]);

    const toggleExpand = (index: number) => {
        setExpanded(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const savedListings = Array(3).fill({
        location: 'Whittier, CA',
        timeAgo: '23 mins ago',
        description: `Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate. Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.Looking for a licensed painter to complete full interior repainting of a 2,000 sq ft office. Includes two coats of primer and final flat finish. Must bring own equipment and provide material estimate.`,
    });

    // Sidebar links
    const links = [
        { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
    ];

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark m-0">
                                        <div className="topbar mb-5">
                                            <div className="icon-wrapper">
                                                <Image
                                                    src="/assets/img/icons/construction-worker.webp"
                                                    width={80}
                                                    height={80}
                                                    alt="Worker Icon"
                                                    loading="lazy"
                                                />
                                                <div className="content-wrapper">
                                                    <div className="title text-black fs-5 fw-medium mb-2">Joseph Dome</div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                            loading="lazy"
                                                        />
                                                        <Link href="mailto:hello@example.com" className="fs-14 fw-medium text-dark">
                                                            hello@example.com
                                                        </Link>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/call-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Call Icon"
                                                            loading="lazy"
                                                        />
                                                        <Link href="tel:+(000) 000-000" className="fs-14 fw-medium text-dark">
                                                            (000) 000-000
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
                                                loading="lazy"
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
                                                        <Image src={link.icon} width={20} height={20} alt="Icon" loading="lazy" />
                                                        <span className="text-white">{link.label}</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        width={15}
                                                        height={9}
                                                        alt="Arrow"
                                                        style={{ objectFit: 'contain' }}
                                                        loading="lazy"
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <div className="bottom-bar">
                                        <div className="buttons-wrapper">
                                            <Link href="#" className="custom-btn bg-danger" style={{ borderColor: '#DC2626' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Logout Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Logout</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    width={15}
                                                    height={9}
                                                    alt="Arrow"
                                                    style={{ objectFit: 'contain' }}
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Bar */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-5">
                                        <div className="change fw-semibold fs-4">Saved Listing</div>
                                        <div
                                            className="form-wrapper mb-0"
                                            style={{ minWidth: 'clamp(200px,34vw,335px)' }}
                                        >
                                            <Image
                                                src="/assets/img/icons/search-gray.svg"
                                                width={18}
                                                height={18}
                                                alt="Search Icon"
                                                loading="lazy"
                                            />
                                            <input type="text" placeholder="Search here" />
                                            <Image
                                                src="/assets/img/icons/voice.svg"
                                                width={18}
                                                height={18}
                                                alt="Voice Icon"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>

                                    {savedListings.map((job, index) => (
                                        <div key={index} className="posted-card posted-card-1 custom-card mb-3">
                                            <div className="topbar mb-2">
                                                <div className="title">{job.location}</div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="date">{job.timeAgo}</div>
                                                    <div className="icon">
                                                        <Image
                                                            src="/assets/img/copy-icon.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Icon"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <p
                                                className={`description mb-0 ${
                                                    expanded.includes(index) ? 'expanded' : ''
                                                }`}
                                            >
                                                {job.description}
                                            </p>

                                            <button
                                                className="see-more-btn d-block"
                                                onClick={() => toggleExpand(index)}
                                            >
                                                {expanded.includes(index) ? 'See less' : 'See more'}
                                            </button>

                                            <div className="bottom-bar">
                                                <div className="left">
                                                    <Image
                                                        src="/assets/img/icons/p-icon.svg"
                                                        width={50}
                                                        height={50}
                                                        alt="P Icon"
                                                        loading="lazy"
                                                    />
                                                    <p className="mb-0 fs-5 fw-semibold">ProBuilds Express</p>
                                                </div>
                                                <div className="social-icons">
                                                    {['message-white.svg', 'chat.svg', 'call-white.svg'].map(
                                                        (icon, i) => (
                                                            <Link href="#" key={i} className="icon">
                                                                <Image
                                                                    src={`/assets/img/icons/${icon}`}
                                                                    width={20}
                                                                    height={20}
                                                                    alt="Social Icon"
                                                                    loading="lazy"
                                                                />
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
