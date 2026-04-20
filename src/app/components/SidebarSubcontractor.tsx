'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Hardcoded links — no prop needed
const sidebarLinks = [
    { href: '/subcontractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/user.svg' },
    { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
    { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
    { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/subscription.svg' },
    { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/transactions.svg' },
];

interface SidebarProps {
    onLogout?: () => void;
}

export default function SidebarSubcontractor({ onLogout }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="sidebar">
            <div className="main-wrapper bg-dark m-0">
                <div className="buttons-wrapper">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`custom-btn ${pathname === link.href ? 'active' : ''}`}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <Image
                                    src={link.icon}
                                    width={20}
                                    height={20}
                                    alt={`${link.label} Icon`}
                                    loading="lazy"
                                />
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

            {/* Logout Section */}
            <div className="bottom-bar">
                <div className="buttons-wrapper">
                    <button
                        onClick={onLogout || (() => { })}
                        className="custom-btn bg-danger"
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
                            alt="Arrow"
                            style={{ objectFit: 'contain' }}
                            loading="lazy"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}