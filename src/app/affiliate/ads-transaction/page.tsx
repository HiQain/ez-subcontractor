'use client';

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../../../styles/profile.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarSubcontractor from "../../components/SidebarAffiliate";

interface AdTransaction {
    id: number;
    user_id: number;
    ad_id: number;
    amount: string;
    transaction_id: string;
    card_holder: string;
    card_last4: string;
    card_brand: string;
    status: string;
    created_at: string;
    updated_at: string;
    ad: {
        id: number;
        orientation: string;
        start_date: string;
        end_date: string;
        ad_placement_id: number;
    };
}

export default function AdTransactionsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [transactions, setTransactions] = useState<AdTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<AdTransaction[]>([]);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // ✅ Fetch ad transactions from API
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}affiliate/ad-transactions`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.message?.[0] || 'Failed to fetch ad transactions');
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
                tx.card_holder.toLowerCase().includes(term) ||
                tx.amount.toLowerCase().includes(term) ||
                tx.ad.orientation.toLowerCase().includes(term) ||
                tx.status.toLowerCase().includes(term)
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
                                        <div className="change fw-semibold fs-4">Ad Transaction History</div>
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
                                                <p className='p-4'>Loading ad transactions...</p>
                                            ) : error ? (
                                                <p className="text-danger">{error}</p>
                                            ) : transactions.length === 0 ? (
                                                <p className='p-4'>No ad transactions found.</p>
                                            ) : (
                                                <table className="custom-table">
                                                    <thead>
                                                        <tr>
                                                            <th>S. No</th>
                                                            <th>Transaction ID</th>
                                                            <th>Orientation</th>
                                                            <th>Card</th>
                                                            <th>Date</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredTransactions.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={8} className="text-center">No ad transactions found</td>
                                                            </tr>
                                                        ) : (
                                                            filteredTransactions.map((tx, index) => (
                                                                <tr key={tx.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{`${tx.transaction_id.slice(0, 14)}...`}</td>
                                                                    <td>{tx.ad.orientation}</td>
                                                                    <td>****{tx.card_last4}</td>
                                                                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                                                    <td>${tx.amount}</td>
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