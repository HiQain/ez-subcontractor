'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';
import { usePathname } from 'next/navigation';

export default function TransactionsPage() {
    const pathname = usePathname();

    // Sidebar links
    const links = [
        { href: '/subcontractor/saved-listing', label: 'Saved Listing', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
        { href: '/subcontractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/subcontractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/lock.svg' },
    ];

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">

                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar d-flex flex-column" style={{height: '100%'}}>
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
                            </div>

                            {/* Right Bar */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
                                        <div className="change fw-semibold fs-4">Transaction History</div>
                                        <div className="form-wrapper mb-0 flex-nowrap">
                                            <Image
                                                src="/assets/img/icons/search-gray.svg"
                                                width={18}
                                                height={18}
                                                alt="Search Icon"
                                                loading="lazy"
                                            />
                                            <input type="text" placeholder="Search here" />
                                        </div>
                                    </div>

                                    <div className="p-0 mb-4">
                                        <div className="table-responsive">
                                            <table className="custom-table">
                                                <thead>
                                                <tr>
                                                    <th>S. No</th>
                                                    <th>Transaction ID</th>
                                                    <th>Subscription</th>
                                                    <th>Categories</th>
                                                    <th>Date and Time</th>
                                                    <th>Amount</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {[1, 2, 3].map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>55412821</td>
                                                        <td>{index % 2 === 0 ? 'Yearly' : 'Monthly'}</td>
                                                        <td>
                                                            <span className="badge">Framing</span>
                                                            <span className="badge">Electrical</span>
                                                            <span className="badge more">+3 More</span>
                                                        </td>
                                                        <td>Jan 21, 2025 - 12:21</td>
                                                        <td>${index === 0 ? '650' : index === 1 ? '400' : '50'}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="data-table-pagination">
                                        <div className="rows-per-page">
                                            <div className="custom-select" tabIndex={0}>
                                                <span className="custom-select__label">Rows per page:</span>
                                                <span className="custom-select__selected-value">14</span>
                                                <svg
                                                    className="custom-select__icon"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                                <ul className="custom-select__options">
                                                    <li className="custom-select__option" data-value="7">7</li>
                                                    <li className="custom-select__option custom-select__option--selected" data-value="14">14</li>
                                                    <li className="custom-select__option" data-value="20">20</li>
                                                    <li className="custom-select__option" data-value="50">50</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="pagination-controls">
                                            <button className="pagination-button pagination-button--nav" aria-label="First page" disabled>
                                                &laquo;
                                            </button>
                                            <button className="pagination-button pagination-button--nav" aria-label="Previous page" disabled>
                                                &lt;
                                            </button>

                                            <button className="pagination-button pagination-button--page pagination-button--active" aria-current="page">
                                                1
                                            </button>
                                            <button className="pagination-button pagination-button--page">2</button>
                                            <button className="pagination-button pagination-button--page">3</button>

                                            <span className="pagination-separator">&ndash;</span>

                                            <button className="pagination-button pagination-button--page">10</button>

                                            <button className="pagination-button pagination-button--nav" aria-label="Next page">
                                                &gt;
                                            </button>
                                            <button className="pagination-button pagination-button--nav" aria-label="Last page">
                                                &raquo;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Bar End */}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
