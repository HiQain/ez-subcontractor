'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { showToast } from '../../utils/appToast';

import '../../styles/contact-us.css';

type ContactFormState = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function ContactUsPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ContactFormState>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setIsSubmitted(false);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/contact-us`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim(),
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage = Array.isArray(data?.message)
                    ? data.message[0]
                    : data?.message || 'Failed to send message. Please try again.';
                throw new Error(errorMessage);
            }

            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
            showToast(data?.message || 'Your message has been sent successfully!');
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : 'Network error. Please try again.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                {/* Banner */}
                <section className="banner-sec contact position-static">
                    <div className="container">
                        <div className="content-wrapper mb-5 text-center">
                            <h1 className="mb-2">Contact Us</h1>
                            <p className="mb-0">Any questions or remarks? Just write us a message!</p>
                        </div>

                        <div className="main-wrapper">
                            <div className="row g-lg-0 g-3">
                                <div className="col-lg-5">
                                    <div
                                        className="contact-wrapper"
                                        style={{
                                            background: `url('/assets/img/contact-us-image.webp')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >
                                        <div className="top-wrapper">
                                            <div className="sub-title">Contact Information</div>
                                            <p className="contact-copy">
                                                Reach out through email, phone, or social media and we&apos;ll get back
                                                to you as soon as possible.
                                            </p>
                                            <div className="contact-links">
                                                <div className="link">
                                                    <div className="icon">
                                                        <Image
                                                            src="/assets/img/icons/message-green.svg"
                                                            width={30}
                                                            height={30}
                                                            alt="Message Icon"
                                                        />
                                                    </div>
                                                    <Link
                                                        href="mailto:info@ezsubcontractor.com"
                                                        className="text"
                                                    >
                                                        info@ezsubcontractor.com
                                                    </Link>
                                                </div>
                                                <div className="link">
                                                    <div className="icon">
                                                        <Image
                                                            src="/assets/img/icons/call-green.svg"
                                                            width={30}
                                                            height={30}
                                                            alt="Call Icon"
                                                        />
                                                    </div>
                                                    <Link href="tel:8883177624" className="text">
                                                        888 317-7624
                                                    </Link>
                                                </div>
                                                <div className="link">
                                                    <div className="icon">
                                                        <Image
                                                            src="/assets/img/icons/location-green.svg"
                                                            width={30}
                                                            height={30}
                                                            alt="Location Icon"
                                                        />
                                                    </div>
                                                    <div className="text">
                                                        1310 South Beach Blvd Suite 1035
                                                        <br />
                                                        La Habra CA 90631
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="social-links">
                                            <Link
                                                href="https://www.instagram.com/ezsubcontractor/"
                                                className="icon icon1"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src="/assets/img/icons/insta.svg"
                                                    width={15}
                                                    height={15}
                                                    alt="Instagram"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <Link
                                                href="https://www.facebook.com/ezsubcontractor"
                                                className="icon"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src="/assets/img/icons/facebook.svg"
                                                    width={12}
                                                    height={12}
                                                    alt="Facebook"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-7">
                                    <div className="form-wrapper">
                                        <div className="form-heading">
                                            <h2>Send Us a Message</h2>
                                            <p>Fill out the form below and our team will contact you shortly.</p>
                                        </div>
                                        <form className="form" onSubmit={handleSubmit}>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="name" className="mb-1 fw-semibold">
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    placeholder="Alex"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="email" className="mb-1 fw-semibold">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder="hello@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="subject" className="mb-1 fw-semibold">
                                                    Subject *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    placeholder="Enter subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="message" className="mb-1 fw-semibold">
                                                    Message *
                                                </label>
                                                <textarea
                                                    id="message"
                                                    placeholder="Write your message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="submit-btn d-block mt-2"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </button>
                                            {isSubmitted && (
                                                <div className="text-success fw-semibold">
                                                    Thank you! Your message has been submitted.
                                                </div>
                                            )}
                                        </form>
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
