'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { usePathname } from 'next/navigation';

export default function ProfilePage() {
    const pathname = usePathname();

    const links = [
        { href: '/affiliate/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/affiliate/saved-contractors', label: 'Saved Contractors', icon: '/assets/img/icons/saved.svg' },
        { href: '/affiliate/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/affiliate/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
        { href: '/affiliate/saved-cards', label: 'Saved Cards', icon: '/assets/img/icons/saved.svg' },
    ];

    return (
        <div className="sections overflow-hidden">
            <Header />
            <section className="banner-sec profile">
                <div className="container">
                    <div className="row g-4">
                        {/* Sidebar */}
                        <div className="col-xl-3">
                            <div className="sidebar">
                                <div className="main-wrapper bg-dark p-0">
                                    <div className="topbar mb-5">
                                        <div className="icon-wrapper">
                                            <Image
                                                src="/assets/img/profile-img.webp"
                                                width={80}
                                                height={80}
                                                alt="Profile Image"
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
                                                    alt="Icon"
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
                                        <Link
                                            href="#"
                                            className="custom-btn s1 bg-danger"
                                            style={{ borderColor: '#DC2626' }}
                                        >
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
                                                alt="Icon"
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
                                <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                    <div className="icon-wrapper d-flex align-items-center gap-3">
                                        <Link href="#" className="icon">
                                            <Image
                                                src="/assets/img/button-angle.svg"
                                                width={10}
                                                height={15}
                                                alt="Icon"
                                                loading="lazy"
                                            />
                                        </Link>
                                        <span className="fs-4 fw-semibold">Saved Cards</span>
                                    </div>
                                    <Link href="#" className="btn btn-primary rounded-3">
                                        Save Changes
                                    </Link>
                                </div>

                                <div className="row g-3">
                                    {/* Card 1 */}
                                    <div className="col-xl-4 col-md-6">
                                        <div className="credit-card mb-2">
                                            <div className="numbers fs-4 fw-semibold mb-4">***************4854</div>
                                            <div className="content-wrapper d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                <div className="left d-flex align-items-center gap-4 flex-wrap">
                                                    <div>
                                                        <div className="fs-12 mb-1">Card Holder Name</div>
                                                        <div className="fs-14 fw-semibold">Christopher Charles</div>
                                                    </div>
                                                    <div>
                                                        <div className="fs-12 mb-1">Expiry Date</div>
                                                        <div className="fs-14 fw-semibold">10/28</div>
                                                    </div>
                                                </div>
                                                <div className="icon">
                                                    <Image
                                                        src="/assets/img/icons/visa-icon.svg"
                                                        width={28}
                                                        height={9}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="checkbox-wrapper">
                                            <input type="checkbox" id="checkbox" className="checkbox" />
                                            <label htmlFor="checkbox" className="fs-14 fw-medium text-gray-light">
                                                Set as Primary
                                            </label>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="col-xl-4 col-md-6">
                                        <div className="credit-card mb-2">
                                            <div className="numbers fs-4 fw-semibold mb-4">***************4854</div>
                                            <div className="content-wrapper d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                <div className="left d-flex align-items-center gap-4 flex-wrap">
                                                    <div>
                                                        <div className="fs-12 mb-1">Card Holder Name</div>
                                                        <div className="fs-14 fw-semibold">Christopher Charles</div>
                                                    </div>
                                                    <div>
                                                        <div className="fs-12 mb-1">Expiry Date</div>
                                                        <div className="fs-14 fw-semibold">10/28</div>
                                                    </div>
                                                </div>
                                                <div className="icon">
                                                    <Image
                                                        src="/assets/img/icons/visa-icon.svg"
                                                        width={28}
                                                        height={9}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="checkbox-wrapper">
                                            <input type="checkbox" id="checkbox1" className="checkbox" />
                                            <label htmlFor="checkbox1" className="fs-14 fw-medium text-gray-light">
                                                Set as Primary
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
