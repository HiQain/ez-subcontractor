'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import { usePathname } from 'next/navigation';

export default function EditProfilePage() {
    const pathname = usePathname();

    const links = [
        { href: '/affiliate/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/affiliate/saved-contractors', label: 'Saved Contractors', icon: '/assets/img/icons/saved.svg' },
        { href: '/affiliate/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/affiliate/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
        { href: '/affiliate/saved-cards', label: 'Saved Cards', icon: '/assets/img/icons/saved.svg' },
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
                                        <div className="topbar mb-5">
                                            <div className="icon-wrapper">
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
                                                            href="tel:+(000)000-000"
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

                                        {/* Sidebar Links */}
                                        <div className="buttons-wrapper">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="custom-btn"
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image
                                                            src={link.icon}
                                                            width={20}
                                                            height={20}
                                                            alt="Icon"
                                                        />
                                                        <span className="text-white">{link.label}</span>
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

                                    {/* Logout */}
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
                                    <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <Link href="#" className="icon">
                                                <Image
                                                    src="/assets/img/button-angle.svg"
                                                    width={10}
                                                    height={15}
                                                    alt="Icon"
                                                />
                                            </Link>
                                            <span className="fs-4 fw-semibold">Edit Profile</span>
                                        </div>
                                        <Link href="#" className="btn btn-primary rounded-3">
                                            Save Changes
                                        </Link>
                                    </div>

                                    <Image
                                        src="/assets/img/profile-img.webp"
                                        width={234}
                                        height={234}
                                        alt="Worker Image"
                                        className="d-block mb-4 img-fluid w-100"
                                        style={{ maxWidth: '234px' }}
                                    />

                                    <div className="form mb-4">
                                        {[
                                            { label: 'Full Name *', type: 'text', id: 'name', placeholder: 'Jason Doe' },
                                            { label: 'Company Name *', type: 'text', id: 'name1', placeholder: 'Jason Tiles Limited' },
                                            { label: 'Email Address *', type: 'email', id: 'email', placeholder: 'hello@example.com' },
                                            { label: 'Phone Number *', type: 'tel', id: 'phone', placeholder: '(000) 000-0000' },
                                        ].map((field, i) => (
                                            <div className="input-wrapper d-flex flex-column" key={i}>
                                                <label htmlFor={field.id} className="mb-1 fw-semibold">
                                                    {field.label}
                                                </label>
                                                <input type={field.type} id={field.id} placeholder={field.placeholder} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row g-3">
                                        {[
                                            { label: 'City', placeholder: 'New York' },
                                            { label: 'State', placeholder: 'NY' },
                                            { label: 'Zip Code', placeholder: 'Enter zip code' },
                                            { label: 'Work Radius', placeholder: 'Enter work Radius (in miles)' },
                                        ].map((field, i) => (
                                            <div className="col-lg-3 col-md-6" key={i}>
                                                <div className="input-wrapper d-flex flex-column">
                                                    <label className="mb-1 fw-semibold">{field.label}</label>
                                                    <input type="text" placeholder={field.placeholder} />
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
