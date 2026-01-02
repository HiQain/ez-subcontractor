'use client';

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarSubcontractor from "../../components/SidebarSubcontractor";

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
    const router = useRouter();
    const pathname = usePathname();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [logoutLoading, setLogoutLoading] = useState(false);

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

    const handleLogout = async () => {
        setLogoutLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/logout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text };
            }

            if (response.ok) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('token');
                localStorage.removeItem('subscription');
                router.push('/auth/login');
            } else {
                alert(data?.message || 'Logout failed');
            }
        } catch (err) {
            console.error('Logout Error:', err);
            alert('Network error. Please try again.');
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">

                            <div className="col-xl-3">
                                <SidebarSubcontractor onLogout={handleLogout} />
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
                                                <p className='p-4'>No transactions found.</p>
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
