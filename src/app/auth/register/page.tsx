'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';

export default function SelectAccountType() {
    const [selectedType, setSelectedType] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const accountTypes = [
        {
            id: 'general_contractor',
            title: 'General Contractor',
            icon: '/assets/img/icons/construction-worker.webp',
        },
        {
            id: 'subcontractor',
            title: 'Subcontractor',
            icon: '/assets/img/icons/settings.svg',
        },
        {
            id: 'affiliate',
            title: 'Affiliate',
            icon: '/assets/img/icons/portfolio.webp',
        },
    ];

    const handleNext = () => {
        setError('');
        if (!selectedType) {
            setError('Please select an account type');
            return;
        }
        router.push(`/auth/register/${selectedType}`);
    };

    const handleSelection = (typeId) => {
        setSelectedType(typeId);
        localStorage.setItem('role', typeId);
        console.log(typeId);
    };

    return (
        <section className="hero-sec login overflow-hidden">
            <div className="image-wrapper">
                <Image
                    src="/assets/img/left-image.webp"
                    className="left-image"
                    alt="Section Image"
                    width={500}
                    height={800}
                />
                <p className="main-title mb-0">
                    Developed by:{' '}
                    <Link
                        href="https://designspartans.com/"
                        target="_blank"
                    >
                        <span className="text-primary fw-semibold">Design Spartans</span>
                    </Link>
                </p>
            </div>

            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="content-wrapper">
                        <div className="content mx-auto">
                            <a href="/" className="d-block mb-4">
                                <Image
                                    src="/assets/img/icons/logo.webp"
                                    width={350}
                                    height={100}
                                    alt="Login Logo"
                                    style={{ maxWidth: '350px' }}
                                    className="img-fluid d-block w-100 mx-auto"
                                />
                            </a>

                            <div className="login-title fw-semibold fs-2 mb-4 text-center">
                                Select Account Type
                            </div>

                            {/* Account Cards */}
                            {accountTypes.map((acc) => (
                                <div
                                    className={`account-card mb-3 px-4 ${selectedType === acc.id ? 'active' : ''}`}
                                    key={acc.id}
                                    onClick={() => handleSelection(acc.id)}
                                    style={{ cursor: 'pointer', minWidth: '430px' }}

                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <Image src={acc.icon} width={50} height={50} alt={`${acc.title} Icon`} />
                                        <div className="title fw-semibold">{acc.title}</div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="accountType"
                                        className="account-radio"
                                        value={acc.id}
                                        checked={selectedType === acc.id}
                                        onChange={() => handleSelection(acc.id)}
                                    />
                                </div>
                            ))}

                            <div className="note-card mb-4 d-none">
                                No credit card required — enjoy a free 30-day trial.
                            </div>

                            {error && <p className="text-danger mb-2">{error}</p>}

                            <div className="form">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn btn-primary w-100 rounded-3 d-block"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
