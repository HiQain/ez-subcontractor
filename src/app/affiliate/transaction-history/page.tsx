'use client';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';

const sidebarLinks = [
    { href: '/affiliate/change-password', text: 'Change Password', icon: '/assets/img/icons/lock.svg' },
    { href: '/affiliate/saved-contractors', text: 'Saved Contractors', icon: '/assets/img/icons/saved.svg' },
    { href: '/affiliate/my-subscription', text: 'My Subscription', icon: '/assets/img/icons/saved.svg' },
    { href: '/affiliate/transaction-history', text: 'Transaction History', icon: '/assets/img/icons/saved.svg' },
    { href: '/affiliate/saved-cards', text: 'Saved Cards', icon: '/assets/img/icons/saved.svg' },
];

export default function TransactionHistory() {
    const activePage = '/affiliate/transaction-history'; // Active page highlight

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
                                                style={{ objectFit: 'contain' }}
                                                width={16}
                                                height={10}
                                                alt="Arrow"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Sidebar Links */}
                                        <div className="buttons-wrapper">
                                            {sidebarLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`custom-btn ${activePage === link.href ? 'active' : ''}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image src={link.icon} width={20} height={20} alt="Icon" loading="lazy" />
                                                        <span className="text-white">{link.text}</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        style={{ objectFit: 'contain' }}
                                                        width={15}
                                                        height={9}
                                                        alt="Icon"
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
                                                    style={{ objectFit: 'contain' }}
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    {/* Header */}
                                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
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
                                            <span className="fs-4 fw-semibold">Transaction History</span>
                                        </div>

                                        <div className="form-wrapper mb-0 d-flex align-items-center gap-2">
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

                                    {/* Table */}
                                    <div className="p-0 mb-3">
                                        <div className="table-responsive">
                                            <table className="custom-table">
                                                <thead>
                                                <tr>
                                                    <th>S. No</th>
                                                    <th>Transaction ID</th>
                                                    <th>Subscription</th>
                                                    <th>Date and Time</th>
                                                    <th>Amount</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>01</td>
                                                    <td>55412821</td>
                                                    <td>Yearly</td>
                                                    <td>Jan 21, 2025 - 12:21</td>
                                                    <td>$650</td>
                                                </tr>
                                                <tr>
                                                    <td>02</td>
                                                    <td>55412821</td>
                                                    <td>Monthly</td>
                                                    <td>Jan 21, 2025 - 12:21</td>
                                                    <td>$400</td>
                                                </tr>
                                                <tr>
                                                    <td>03</td>
                                                    <td>55412821</td>
                                                    <td>Yearly</td>
                                                    <td>Jan 21, 2025 - 12:21</td>
                                                    <td>$50</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination */}
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
                                                    <li className="custom-select__option" data-value="7">
                                                        7
                                                    </li>
                                                    <li className="custom-select__option custom-select__option--selected" data-value="14">
                                                        14
                                                    </li>
                                                    <li className="custom-select__option" data-value="20">
                                                        20
                                                    </li>
                                                    <li className="custom-select__option" data-value="50">
                                                        50
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="pagination-controls">
                                            <button className="pagination-button pagination-button--nav" aria-label="First page" disabled>
                                                «
                                            </button>
                                            <button className="pagination-button pagination-button--nav" aria-label="Previous page" disabled>
                                                &lt;
                                            </button>

                                            <button className="pagination-button pagination-button--page pagination-button--active" aria-current="page">
                                                1
                                            </button>
                                            <button className="pagination-button pagination-button--page">2</button>
                                            <button className="pagination-button pagination-button--page">3</button>

                                            <span className="pagination-separator">–</span>

                                            <button className="pagination-button pagination-button--page">10</button>

                                            <button className="pagination-button pagination-button--nav" aria-label="Next page">
                                                &gt;
                                            </button>
                                            <button className="pagination-button pagination-button--nav" aria-label="Last page">
                                                »
                                            </button>
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
