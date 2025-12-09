'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../../styles/login.css';

export default function VerifyEmail() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(59);
    const [error, setError] = useState('');
    const [email, setEmail] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // ✅ Initialize email & timer on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('forgotPasswordEmail');
        if (!savedEmail) {
            router.push('/auth/forgot-password');
            return;
        }
        setEmail(savedEmail);

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [router]);

    // ✅ Handle input changes (no auto-submit here — we use useEffect instead)
    const handleChange = (index: number, value: string) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value.slice(-1);
            setOtp(newOtp);

            // Focus next input
            if (value && index < 3) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) (nextInput as HTMLInputElement).focus();
            }
        }
    };

    // ✅ Auto-submit when OTP is complete (reliable — no race condition!)
    useEffect(() => {
        if (otp.every(d => d !== '') && !isSubmitting) {
            const submitTimer = setTimeout(() => {
                void handleSubmit();
            }, 30); // Small debounce for safety
            return () => clearTimeout(submitTimer);
        }
    }, [otp, isSubmitting]);

    // ✅ Submit handler (guarded against double calls)
    const handleSubmit = async () => {
        if (isSubmitting) return;
        setError('');
        setIsSubmitting(true);

        if (!email) {
            setError('Email not found. Please try again.');
            setIsSubmitting(false);
            return;
        }

        if (otp.some((d) => d === '')) {
            setError('Please enter all OTP digits');
            setIsSubmitting(false);
            return;
        }

        const enteredOtp = otp.join('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: enteredOtp }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('verifiedOtp', enteredOtp);
                router.push('/auth/create-new-password');
            } else {
                let errorMessage = 'Invalid OTP, please try again.';
                if (typeof data.message === 'string') {
                    errorMessage = data.message;
                } else if (Array.isArray(data.message)) {
                    errorMessage = data.message[0];
                }
                setError(errorMessage);
            }
        } catch (err) {
            setError('Network error. Please check your internet connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError('Email not found. Please go back and try again.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setTimer(59);
                setOtp(['', '', '', '']);
                setError('');
                // Refocus first input
                setTimeout(() => {
                    const firstInput = document.getElementById('otp-0');
                    if (firstInput) (firstInput as HTMLInputElement).focus();
                }, 50);
            } else {
                let errorMessage = 'Failed to resend OTP. Please try again.';
                if (typeof data.message === 'string') {
                    errorMessage = data.message;
                } else if (Array.isArray(data.message)) {
                    errorMessage = data.message[0];
                }
                setError(errorMessage);
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    const isOtpComplete = otp.every(d => d !== '');

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
                    <div className="content-wrapper">
                        <div className="content mx-auto w-100">
                            <Image
                                src="/assets/img/icons/logo.webp"
                                width={350}
                                height={100}
                                alt="Login Logo"
                                style={{ maxWidth: '350px' }}
                                className="img-fluid d-block w-100 mx-auto mb-4"
                            />

                            <div className="fw-semibold fs-2 mb-4 text-center form-title">
                                Verify Email
                            </div>

                            <div className="numbers mb-3 d-flex justify-content-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        className={`number ${digit ? 'active' : ''}`}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        inputMode="numeric"
                                        disabled={isSubmitting}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>

                            <div className="timer-button d-flex align-items-center justify-content-center mb-2">
                                <Image
                                    src="/assets/img/icons/timer.svg"
                                    width={20}
                                    height={20}
                                    alt="Timer"
                                    loading="lazy"
                                />
                                <div className="content fw-medium ms-2">
                                    0:{timer.toString().padStart(2, '0')}
                                </div>
                            </div>

                            {timer === 0 && (
                                <div
                                    style={{ marginBottom: 20 }}
                                    className="detail fw-medium text-center text-gray-light"
                                >
                                    Didn’t receive a code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="fw-semibold text-primary border-0 bg-transparent"
                                        style={{ textDecoration: 'underline' }}
                                        disabled={isSubmitting}
                                    >
                                        Resend
                                    </button>
                                </div>
                            )}

                            {error && <p className="text-danger text-center mb-2">{error}</p>}

                            <div className="buttons-wrapper d-flex align-items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/auth/forget-password')}
                                    className="btn btn-outline-dark rounded-3 justify-content-center w-100"
                                    disabled={isSubmitting}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-primary rounded-3 justify-content-center w-100"
                                    disabled={!isOtpComplete || isSubmitting}
                                    style={{
                                        opacity: !isOtpComplete || isSubmitting ? 0.6 : 1,
                                        cursor: !isOtpComplete || isSubmitting ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isSubmitting ? 'Verifying...' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}