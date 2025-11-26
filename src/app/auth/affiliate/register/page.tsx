'use client';
import '../../../../styles/login.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        router.push('/affiliate/subscription');
    };

    return (
        <section className="hero-sec login overflow-hidden position-static">
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
                        className="text-primary fw-semibold"
                    >
                        Design Spartans
                    </Link>
                </p>
            </div>

            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div
                        style={{ padding: '20px' }}
                        className="content-wrapper d-flex align-items-center justify-content-center"
                    >
                        <div style={{ maxWidth: '482px' }} className="content w-100 mx-auto">
                            <Link href="/" className="d-block mb-4">
                                <Image
                                    src="/assets/img/icons/logo.webp"
                                    width={350}
                                    height={100}
                                    alt="Login Logo"
                                    style={{ maxWidth: '350px' }}
                                    className="img-fluid d-block w-100 mx-auto"
                                />
                            </Link>

                            <div className="fw-semibold fs-2 mb-4 text-center">Register</div>

                            <div className="register-topbar mb-3">
                                <Image
                                    src="/assets/img/icons/portfolio.webp"
                                    width={50}
                                    height={50}
                                    alt="Worker Image"
                                />
                                <div className="fw-semibold">Affiliate</div>
                            </div>

                            <form className="form" onSubmit={handleSubmit}>
                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="fullName" className="mb-1 fw-semibold">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Jason Doe"
                                    />
                                </div>

                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="companyName" className="mb-1 fw-semibold">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Jason Tiles Limited"
                                    />
                                </div>

                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="email" className="mb-1 fw-semibold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hello@example.com"
                                    />
                                </div>

                                <div className="input-wrapper d-flex flex-column">
                                    <label htmlFor="phone" className="mb-1 fw-semibold">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(000) 000-0000"
                                    />
                                </div>

                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="password" className="mb-1 fw-semibold">
                                        Password
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i
                                            className={`bi ${
                                                showPassword ? 'bi-eye' : 'bi-eye-slash'
                                            }`}
                                        ></i>
                                    </span>
                                </div>

                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="confirmPassword" className="mb-1 fw-semibold">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <i
                                            className={`bi ${
                                                showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'
                                            }`}
                                        ></i>
                                    </span>
                                </div>

                                <div className="form-check my-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isAgreed}
                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                        id="agreement"
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="agreement">
                                        By registering, you accept our{' '}
                                        <Link href="#" className="text-primary">
                                            Privacy Policy
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="#" className="text-primary">
                                            Terms & Conditions
                                        </Link>
                                        .
                                    </label>
                                </div>

                                <input
                                    type="submit"
                                    value="Next"
                                    className="btn btn-primary w-100 rounded-3 d-block mb-2"
                                />

                                <div className="text-center fw-medium text-gray-light">
                                    Already have an account?{' '}
                                    <Link href="/auth/login" className="fw-semibold text-black">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
