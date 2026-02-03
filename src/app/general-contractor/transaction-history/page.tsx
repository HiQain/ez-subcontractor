'use client';

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
    id: number;
    title: string;
}

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
    categories: Category[];
}

export default function TransactionsPage() {
    const pathname = usePathname();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const links = [
        { href: '/general-contractor/edit-profile', label: 'Edit Profile', icon: '/assets/img/icons/user.svg' },
        { href: '/general-contractor/change-password', label: 'Change Password', icon: '/assets/img/icons/lock.svg' },
        { href: '/general-contractor/my-subscription', label: 'My Subscription', icon: '/assets/img/icons/subscription.svg' },
        { href: '/general-contractor/transaction-history', label: 'Transaction History', icon: '/assets/img/icons/transactions.svg' },
    ];

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
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark p-0">
                                        <div className="buttons-wrapper">
                                            {links.map((link) => (
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

                                    <div className="bottom-bar">
                                        <div className="buttons-wrapper">
                                            <button
                                                onClick={handleLogout}
                                                disabled={logoutLoading}
                                                className="custom-btn bg-danger w-100 border-0"
                                                style={{ borderColor: '#DC2626' }}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Logout Icon"
                                                    />
                                                    <span className="text-white">
                                                        {logoutLoading ? 'Logging out...' : 'Logout'}
                                                    </span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    width={15}
                                                    height={9}
                                                    alt="Arrow"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </button>
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
                                                <p className='p-4'>No transactions found.</p>
                                            ) : (
                                                <table className="custom-table">
                                                    <thead>
                                                        <tr>
                                                            <th>S. No</th>
                                                            <th>Transaction ID</th>
                                                            <th>Subscription</th>
                                                            <th>Card</th>
                                                            <th>Date</th>
                                                            <th>Amount</th>
                                                            <th>Categories</th>
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
                                                                    <td>{`${tx.transaction_id !== null && tx.transaction_id !== '' ? tx.transaction_id.slice(0, 14) + '...' : 'N/A'}`}</td>
                                                                    <td>{tx.plan.name}</td>
                                                                    <td>****{tx.card_last4}</td>
                                                                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                                                    <td>${tx.amount}</td>
                                                                    <td>
                                                                        {tx.categories.length > 0 ? (
                                                                            <select
                                                                                className="form-select"
                                                                                value={tx.categories[0].id}
                                                                                onChange={(e) => e.preventDefault()}
                                                                            >
                                                                                {tx.categories.map(cat => (
                                                                                    <option key={cat.id} value={cat.id}>
                                                                                        {cat.title}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        ) : (
                                                                            <span>No Categories</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
