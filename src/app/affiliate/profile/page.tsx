'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';

export default function ProfilePage() {
    const pathname = usePathname();
    const router = useRouter();

    const sidebarLinks = [
        { name: 'Change Password', href: '/affiliate/change-password', icon: '/assets/img/icons/saved.svg' },
        { name: 'Saved Contractors', href: '/affiliate/saved-contractors', icon: '/assets/img/icons/saved.svg' },
        { name: 'My Subscription', href: '/affiliate/my-subscription', icon: '/assets/img/icons/saved.svg' },
        { name: 'Transaction History', href: '/affiliate/transaction-history', icon: '/assets/img/icons/saved.svg' },
        { name: 'Saved Cards', href: '/affiliate/saved-cards', icon: '/assets/img/icons/saved.svg' },
    ];

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

                                        <div className="topbar mb-5 d-flex justify-content-between align-items-start">
                                            <div className="icon-wrapper d-flex align-items-start gap-3">
                                                <Image
                                                    src="/assets/img/profile-img.webp"
                                                    width={80}
                                                    height={80}
                                                    alt="Worker Icon"
                                                />
                                                <div className="content-wrapper">
                                                    <div className="title text-black fs-5 fw-medium mb-2">
                                                        Joseph Dome
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                        />
                                                        <Link
                                                            href="mailto:hello@example.com"
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            hello@example.com
                                                        </Link>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/call-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Call Icon"
                                                        />
                                                        <Link
                                                            href="tel:+000000000"
                                                            className="fs-14 fw-medium text-dark"
                                                        >
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
                                            />
                                        </div>

                                        {/* Sidebar Buttons */}
                                        <div className="buttons-wrapper">
                                            {sidebarLinks.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.href}
                                                    className={`custom-btn d-flex align-items-center justify-content-between ${pathname === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image
                                                            src={link.icon}
                                                            width={20}
                                                            height={20}
                                                            alt="Icon"
                                                        />
                                                        <span className="text-white">{link.name}</span>
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

                                    <div className="bottom-bar">
                                        <div className="buttons-wrapper">
                                            <Link
                                                href="#"
                                                className="custom-btn bg-danger"
                                                style={{ borderColor: '#DC2626' }}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Logout Icon"
                                                    />
                                                    <span className="text-white">Logout</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    width={15}
                                                    height={9}
                                                    alt="Arrow"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Side */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    {/* Topbar */}
                                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <button onClick={() => router.back()} className="icon bg-transparent border-0">
                                                <Image
                                                    src="/assets/img/button-angle.svg"
                                                    width={10}
                                                    height={15}
                                                    alt="Back Icon"
                                                />
                                            </button>
                                            <span className="fs-4 fw-semibold">Profile Detail</span>
                                        </div>
                                        {/* Edit & Delete Buttons */}
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <button
                                                onClick={() => router.push('/affiliate/edit-profile')}
                                                className="icon bg-transparent border-0 p-0"
                                                title="Edit Profile"
                                            >
                                                <Image
                                                    src="/assets/img/icons/edit.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="Edit Icon"
                                                />
                                            </button>

                                            <Link
                                                href="#"
                                                className="icon bg-danger"
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

                                    {/* Right Side Main Content */}
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
                                                <div className="title fw-semibold fs-4 mb-2">Jason Doe</div>
                                                <p className="mb-1 text-gray-light">Subcontractor</p>
                                                <p className="mb-1 text-gray-light">Whittier, CA 30201</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="review-bar">
                                        <div className="row g-2 mb-4">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">Full Name</div>
                                                    <div className="fw-semibold fs-18">Jason Doe</div>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Company Name
                                                    </div>
                                                    <div className="fw-semibold fs-18">Jason Tiles Limited</div>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Email Address
                                                    </div>
                                                    <Link
                                                        href="mailto:hello@example.com"
                                                        className="fw-semibold fs-18 text-dark"
                                                    >
                                                        hello@example.com
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Phone Number
                                                    </div>
                                                    <Link
                                                        href="tel:+0000000000"
                                                        className="fw-semibold fs-18 text-dark"
                                                    >
                                                        (000) 000-0000
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">City</div>
                                                    <div className="fw-semibold fs-18">New York</div>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">State</div>
                                                    <div className="fw-semibold fs-18">NY</div>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">Zip Code</div>
                                                    <div className="fw-semibold fs-18">10001</div>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 col-sm-6">
                                                <div className="content">
                                                    <div className="text-gray-light fw-medium mb-2">
                                                        Work Radius
                                                    </div>
                                                    <div className="fw-semibold fs-18">123 miles</div>
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
