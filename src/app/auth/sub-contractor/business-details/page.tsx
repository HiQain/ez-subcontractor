'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../../../styles/login.css';
import Link from 'next/link';

export default function BusinessDetails() {
    const router = useRouter();
    const [category, setCategory] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [workRadius, setWorkRadius] = useState('');
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories = [
        { id: '1', name: 'Plumbing' },
        { id: '2', name: 'Electric Work' },
        { id: '3', name: 'Framing' },
        { id: '4', name: 'Roofing' },
    ];

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!category) {
            setError('Please select a category');
            return;
        }
        if (!licenseNumber.trim()) {
            setError('License Number is required');
            return;
        }
        if (!zipCode.trim()) {
            setError('Zip Code is required');
            return;
        }
        if (!workRadius.trim()) {
            setError('Work Radius is required');
            return;
        }

        console.log({ category, licenseNumber, zipCode, workRadius });

        // ✅ Redirect to subscription page
        router.push('/subcontractor/subscription');
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
                    Developed by:
                    <Link href="https://designspartans.com/" target="_blank" className="text-primary fw-semibold">Design Spartans</Link>
                </p>
            </div>

            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="content-wrapper">
                        <div className="content mx-auto w-100">
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

                            <div className="fw-semibold fs-2 mb-4 text-center">Business Details</div>

                            <div className="register-topbar justify-content-start mb-3 d-flex align-items-center gap-2">
                                <Image
                                    src="/assets/img/icons/settings.svg"
                                    width={50}
                                    height={50}
                                    alt="Worker Image"
                                />
                                <div className="fw-semibold">Subcontractor</div>
                            </div>

                            <form className="form" onSubmit={handleSubmit}>
                                {/* Custom Select */}
                                <div
                                    className="input-wrapper d-flex flex-column position-relative"
                                    ref={dropdownRef}
                                >
                                    <label htmlFor="category" className="mb-1 fw-semibold">
                                        Category *
                                    </label>
                                    <div className={`custom-select ${dropdownOpen ? 'open' : ''}`}>
                                        <div
                                            className="select-selected"
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                        >
                                            {category
                                                ? categories.find((c) => c.id === category)?.name
                                                : 'Select category'}
                                        </div>

                                        {/* Static SVG Arrow */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="select-arrow"
                                            viewBox="0 0 16 16"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                            }}
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M1.646 5.646a.5.5 0 0 1 .708 0L8 11.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                            />
                                        </svg>

                                        <ul className="select-options">
                                            {categories.map((cat) => (
                                                <li
                                                    key={cat.id}
                                                    data-value={cat.id}
                                                    onClick={() => {
                                                        setCategory(cat.id);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {cat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* License Number */}
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="licenseNumber" className="mb-1 fw-semibold">
                                        License Number
                                    </label>
                                    <input
                                        type="text"
                                        id="licenseNumber"
                                        placeholder="123456"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                    />
                                </div>

                                {/* Zip Code */}
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="zipCode" className="mb-1 fw-semibold">
                                        Zip Code
                                    </label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        placeholder="Enter zip code"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                    />
                                </div>

                                {/* Work Radius */}
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="workRadius" className="mb-1 fw-semibold">
                                        Work Radius
                                    </label>
                                    <input
                                        type="text"
                                        id="workRadius"
                                        placeholder="Enter work Radius (in miles)"
                                        value={workRadius}
                                        onChange={(e) => setWorkRadius(e.target.value)}
                                    />
                                </div>

                                {error && <p className="text-danger mb-2">{error}</p>}

                                <input
                                    type="submit"
                                    value="Complete Registration"
                                    className="btn btn-primary w-100 rounded-3 d-block"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}