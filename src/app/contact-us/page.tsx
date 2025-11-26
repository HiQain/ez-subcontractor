// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/contact-us.css';


export default function AboutUsPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your form submission logic here (e.g., API call)
        console.log('Form submitted');
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
                            <p className="mb-0">Any questions or remarks? Just write us a message!s</p>
                        </div>

                        <div className="main-wrapper">
                            <div className="row g-lg-0 g-3">
                                {/* Contact Info Card */}
                                <div className="col-lg-4">
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
                                                        href="mailto:EZcontractorz1@gmail.com"
                                                        className="text"
                                                    >
                                                        EZcontractorz1@gmail.com
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
                                                    <Link href="tel:+10001234392" className="text">
                                                        +1 (000) 123-4392
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
                                                    <div className="text">132 Dartmouth St Boston, MA 02116</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="social-links">
                                            <Link href="#" className="icon">
                                                <Image
                                                    src="/assets/img/icons/youtube.svg"
                                                    width={12}
                                                    height={12}
                                                    alt="YouTube"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <Link href="#" className="icon icon1">
                                                <Image
                                                    src="/assets/img/icons/insta.svg"
                                                    width={15}
                                                    height={15}
                                                    alt="Instagram"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <Link href="#" className="icon">
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

                                {/* Contact Form */}
                                <div className="col-lg-8">
                                    <div className="form-wrapper">
                                        <form className="form">
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="firstName" className="mb-1 fw-semibold">
                                                    First Name *
                                                </label>
                                                <input type="text" id="firstName" placeholder="Jason" required/>
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="lastName" className="mb-1 fw-semibold">
                                                    Last Name *
                                                </label>
                                                <input type="text" id="lastName" placeholder="Doe" required/>
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="email" className="mb-1 fw-semibold">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder="hello@example.com"
                                                    required
                                                />
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="phone" className="mb-1 fw-semibold">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="(000) 000-0000"
                                                    required
                                                />
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="subject" className="mb-1 fw-semibold">
                                                    Subject *
                                                </label>
                                                <input type="text" id="subject" placeholder="Enter subject" required/>
                                            </div>
                                            <div className="input-wrapper d-flex flex-column">
                                                <label htmlFor="message" className="mb-1 fw-semibold">
                                                    Description *
                                                </label>
                                                <textarea
                                                    id="message"
                                                    placeholder="Write description"
                                                    required
                                                ></textarea>
                                            </div>

                                            <button type="submit" className="submit-btn d-block mt-2">
                                                Send Message
                                            </button>
                                            <Image
                                                src="/assets/img/send-btn.webp"
                                                width={212}
                                                height={92}
                                                alt="Send Button"
                                                loading="lazy"
                                                style={{
                                                    marginLeft: 'auto',
                                                    marginRight: '120px',
                                                    marginTop: '-30px',
                                                }}
                                            />
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