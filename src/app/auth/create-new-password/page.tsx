'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';
import Link from 'next/link';

export default function CreateNewPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ New state
    const router = useRouter();

    const [email, setEmail] = useState<string | null>(null);
    const [otp, setOtp] = useState<string | null>(null);

    useEffect(() => {
        const savedEmail = localStorage.getItem('forgotPasswordEmail');
        const savedOtp = localStorage.getItem('verifiedOtp');

        setEmail(savedEmail);
        setOtp(savedOtp);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // ✅ Prevent duplicate submissions
        if (isSubmitting) return;

        // Validation (keep your existing logic)
        if (!password.trim()) {
            setError('New Password is required');
            return;
        }
        if (!confirmPassword.trim()) {
            setError('Confirm Password is required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!email || !otp) {
            setError('Session expired. Please start again.');
            return;
        }

        setIsSubmitting(true); // ✅ Disable button & show loading

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp,
                    new_password: password,
                    password_confirmation: password // ⚠️ Note: usually should be `confirmPassword`, but match your API spec
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem('forgotPasswordEmail');
                localStorage.removeItem('verifiedOtp');
                setSuccess('Password changed successfully!');

                setTimeout(() => {
                    router.push('/auth/login');
                }, 1500);
            } else {
                let errorMessage = 'Failed to reset password. Please try again.';
                if (typeof data.message === 'string') {
                    errorMessage = data.message;
                } else if (Array.isArray(data.message)) {
                    errorMessage = data.message[0];
                }
                setError(errorMessage);
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false); // ✅ Re-enable button after success/failure
        }
    };

    const isFormValid = password.trim() !== '' && confirmPassword.trim() !== '' && password === confirmPassword;

    const EyeIcon = ({ open }: { open: boolean }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {open ? (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.84 21.84 0 0 1 5.06-6.06" />
                    <path d="M1 1l22 22" />
                </>
            )}
        </svg>
    );

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
                    <Link href="https://designspartans.com/" target="_blank" className="text-primary fw-semibold"> Design Spartans</Link>
                </p>
            </div>

            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="content-wrapper">
                        <div className="content mx-auto">
                            <Image
                                src="/assets/img/icons/logo.webp"
                                width={350}
                                height={100}
                                alt="Login Logo"
                                style={{ maxWidth: '350px' }}
                                className="img-fluid d-block w-100 mx-auto mb-4"
                            />

                            <div className="fw-semibold fs-2 mb-4 text-center form-title">
                                Create New Password
                            </div>

                            <form className="form" onSubmit={handleSubmit}>
                                {/* New Password */}
                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="password" className="mb-1 fw-semibold">
                                        New Password *
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="form-control pe-5"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isSubmitting} // Optional: disable inputs too
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: 10, top: 38, cursor: 'pointer' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <EyeIcon open={showPassword} />
                                    </span>
                                </div>

                                {/* Confirm Password */}
                                <div className="input-wrapper d-flex flex-column position-relative">
                                    <label htmlFor="confirm_password" className="mb-1 fw-semibold">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirm_password"
                                        className="form-control pe-5"
                                        placeholder="Enter confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isSubmitting} // Optional
                                    />
                                    <span
                                        className="toggle-password position-absolute"
                                        style={{ right: 10, top: 38, cursor: 'pointer' }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <EyeIcon open={showConfirmPassword} />
                                    </span>
                                </div>

                                {/* Messages */}
                                {error && <p className="text-danger text-center mb-2">{error}</p>}
                                {success && <p className="text-success text-center mb-2">{success}</p>}

                                {/* Submit Button — ✅ Now disables on submit */}
                                <div className="buttons-wrapper d-flex align-items-center gap-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-3 w-100 justify-content-center"
                                        disabled={!isFormValid || isSubmitting}
                                        style={{
                                            opacity: !isFormValid || isSubmitting ? 0.6 : 1,
                                            cursor: !isFormValid || isSubmitting ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {isSubmitting ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}