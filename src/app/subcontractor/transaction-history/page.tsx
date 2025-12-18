'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Transaction {
    id: number;
    subscription_id: string;
    amount: string;
    transaction_id: string;
    promo_code: string | null;
    card_brand: string;
    card_last4: string;
    card_holder: string;
    created_at: string;
    plan: {
        id: number;
        name: string;
    };
}

export default function TransactionsPage() {
    const pathname = usePathname();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    // ✅ Fetch transactions from API
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/subscription/transactions`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.message?.[0] || 'Failed to fetch transactions');
                }

                setTransactions(data.data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // 🔹 Filter transactions based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredTransactions(transactions);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = transactions.filter(tx =>
                tx.transaction_id.toLowerCase().includes(term) ||
                tx.plan.name.toLowerCase().includes(term) ||
                tx.card_holder.toLowerCase().includes(term) ||
                tx.amount.toLowerCase().includes(term)
            );
            setFilteredTransactions(filtered);
        }
    }, [searchTerm, transactions]);

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">

                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar d-flex flex-column" style={{ height: '100%' }}>
                                    <div className="main-wrapper bg-dark p-0 flex-grow-1 d-flex flex-column">
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
                                                style={{ objectFit: 'contain' }}
                                                width={16}
                                                height={10}
                                                alt="Arrow"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Sidebar Links */}
                                        <div className="buttons-wrapper flex-grow-1">
                                            <Link
                                                href="/subcontractor/change-password"
                                                className={`custom-btn ${pathname === '/subcontractor/change-password' ? 'active' : ''}`}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/lock.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Change Password</span>
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

                                            <Link
                                                href="/subcontractor/saved-listing"
                                                className={`custom-btn ${pathname === '/subcontractor/saved-listing' ? 'active' : ''}`}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Saved Listing</span>
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

                                            <Link
                                                href="/subcontractor/my-subscription"
                                                className={`custom-btn ${pathname === '/subcontractor/my-subscription' ? 'active' : ''}`}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">My Subscription</span>
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

                                            <Link
                                                href="/subcontractor/transaction-history"
                                                className={`custom-btn ${pathname === '/subcontractor/transaction-history' ? 'active' : ''}`}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Transaction History</span>
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

                                    {/* Logout button fixed at bottom */}
                                    <div className="bottom-bar mt-auto">
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
                                                    alt="Arrow"
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
                                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
                                        <div className="change fw-semibold fs-4">Transaction History</div>
                                        <div className="form-wrapper mb-0" style={{ flexGrow: 1, maxWidth: '300px' }}>
                                            <input
                                                type="text"
                                                placeholder="Search here"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-0 mb-4">
                                        <div className="table-responsive">
                                            {loading ? (
                                                <p className='p-4'>Loading transactions...</p>
                                            ) : error ? (
                                                <p className="text-danger">{error}</p>
                                            ) : transactions.length === 0 ? (
                                                <p>No transactions found.</p>
                                            ) : (
                                                <table className="custom-table">
                                                    <thead>
                                                        <tr>
                                                            <th>S. No</th>
                                                            <th>Transaction ID</th>
                                                            <th>Subscription</th>
                                                            <th>Card</th>
                                                            <th>Date and Time</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredTransactions.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="text-center">No transactions found</td>
                                                            </tr>
                                                        ) : (
                                                            filteredTransactions.map((tx, index) => (
                                                                <tr key={tx.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{tx.transaction_id}</td>
                                                                    <td>{tx.plan.name}</td>
                                                                    <td>{tx.card_brand} ****{tx.card_last4} ({tx.card_holder})</td>
                                                                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                                                                    <td>${tx.amount}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pagination - keep static for now */}
                                    {/* <div className="data-table-pagination">
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
                                    </div> */}
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
