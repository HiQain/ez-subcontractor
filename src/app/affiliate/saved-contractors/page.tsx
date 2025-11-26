'use client';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/free-trial.css';
import { usePathname } from 'next/navigation';

export default function SavedContractors() {
    const pathname = usePathname();

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
                <section className="banner-sec profile filter-sec">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark p-0">
                                        <div className="topbar mb-5 d-flex justify-content-between align-items-start">
                                            <div className="icon-wrapper d-flex align-items-start gap-3">
                                                <Image src="/assets/img/profile-img.webp" width={80} height={80} alt="Worker Icon" />
                                                <div className="content-wrapper">
                                                    <div className="title text-black fs-5 fw-medium mb-2">Joseph Dome</div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image src="/assets/img/icons/message-dark.svg" width={16} height={16} alt="Message Icon" />
                                                        <Link href="mailto:hello@example.com" className="fs-14 fw-medium text-dark">hello@example.com</Link>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image src="/assets/img/icons/call-dark.svg" width={16} height={16} alt="Call Icon" />
                                                        <Link href="tel:+000000000" className="fs-14 fw-medium text-dark">(000) 000-000</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <Image src="/assets/img/icons/arrow-dark.svg" width={16} height={10} alt="Arrow" style={{ objectFit: 'contain' }} />
                                        </div>

                                        {/* Updated Sidebar Buttons */}
                                        <div className="buttons-wrapper">
                                            {sidebarLinks.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.href}
                                                    className={`custom-btn d-flex align-items-center justify-content-between ${pathname === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image src={link.icon} width={20} height={20} alt="Icon" />
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
                                            <Link href="#" className="custom-btn s1 bg-danger" style={{ borderColor: '#DC2626' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image src="/assets/img/icons/logout.svg" width={20} height={20} alt="Icon" />
                                                    <span className="text-white">Logout</span>
                                                </div>
                                                <Image src="/assets/img/icons/angle-right.svg" width={15} height={9} alt="Icon" style={{ objectFit: 'contain' }} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="topbar d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <Link href="#" className="icon">
                                                <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Icon" />
                                            </Link>
                                            <span className="fs-4 fw-semibold">Saved Contractors</span>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="col-lg-4 col-md-6">
                                                <div className="filter-card text-center">
                                                    <Image src="/assets/img/icons/p-icon.svg" width={104} height={104} className="d-block mx-auto mb-3" alt="P Icon" />
                                                    <div className="title text-black fw-semibold fs-5 mb-3" style={{ color: '#333342' }}>ProBuilds Express</div>
                                                    <Link href="#" className="btn btn-primary p-2 mx-auto mb-3">General Contractor</Link>

                                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2">
                                                        <Image src="/assets/img/icons/message-dark.svg" width={20} height={20} alt="Icon" />
                                                        <Link href="mailto:hello@example.com" className="text-dark fw-medium">hello@example.com</Link>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
                                                        <Image src="/assets/img/icons/call-dark.svg" width={20} height={20} alt="Icon" />
                                                        <Link href="tel:+000000000" className="text-dark fw-medium">(000) 000-000</Link>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                                                        <Link href="#" className="icon">
                                                            <Image src="/assets/img/icons/Chat.svg" width={20} height={20} alt="Icon" />
                                                        </Link>
                                                        <Link href="#" className="icon">
                                                            <Image src="/assets/img/icons/message-white.svg" width={20} height={20} alt="Icon" />
                                                        </Link>
                                                        <Link href="#" className="icon">
                                                            <Image src="/assets/img/icons/call-white.svg" width={20} height={20} alt="Icon" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
