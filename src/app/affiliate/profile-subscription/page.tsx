'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/pricing.css';
export default function SubscriptionPage() {
    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec profile">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark m-0">
                                        <div className="topbar mb-5">
                                            <div className="icon-wrapper">
                                                <Image
                                                    src="/assets/img/icons/construction-worker.webp"
                                                    width={80}
                                                    height={80}
                                                    alt="Worker Icon"
                                                    loading="lazy"
                                                />
                                                <div className="content-wrapper">
                                                    <div className="title text-black fs-5 fw-medium mb-2">Joseph Dome</div>

                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                            loading="lazy"
                                                        />
                                                        <Link href="mailto:hello@example.com" className="fs-14 fw-medium text-dark">
                                                            hello@example.com
                                                        </Link>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/call-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Call Icon"
                                                            loading="lazy"
                                                        />
                                                        <Link href="tel:+(000)000-000" className="fs-14 fw-medium text-dark">
                                                            (000) 000-000
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            <Image
                                                src="/assets/img/icons/arrow-dark.svg"
                                                width={16}
                                                height={10}
                                                alt="Arrow"
                                                loading="lazy"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>

                                        <div className="buttons-wrapper">
                                            {Array(5)
                                                .fill('Switch Account')
                                                .map((text, i) => (
                                                    <Link href="#" key={i} className={`custom-btn ${i === 0 ? 'active' : ''}`}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Image
                                                                src="/assets/img/icons/saved.svg"
                                                                width={20}
                                                                height={20}
                                                                alt="Icon"
                                                                loading="lazy"
                                                            />
                                                            <span className="text-white">{text}</span>
                                                        </div>
                                                        <Image
                                                            src="/assets/img/icons/angle-right.svg"
                                                            width={15}
                                                            height={9}
                                                            alt="Icon"
                                                            loading="lazy"
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="bottom-bar">
                                        <div className="buttons-wrapper">
                                            <Link href="#" className="custom-btn s1 bg-danger" style={{ borderColor: '#DC2626' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/logout.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Logout</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Bar */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div className="change fw-semibold fs-4 mb-5">Subscription</div>

                                    <div className="pricing-sec p-0">
                                        <div className="container">
                                            <div className="tab-content pricing-wrapper mb-4" id="pricingTabContent">
                                                <div
                                                    className="tab-pane fade show active pricing-content"
                                                    id="sub-contractor"
                                                    role="tabpanel"
                                                >
                                                    <div className="row g-3">
                                                        {[1, 2, 3].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`col-xl-${i === 2 ? '4 col-md-12' : '4 col-md-6'}`}
                                                            >
                                                                <div className={`price-card ${i === 2 ? 'price-card1 free' : 'free'}`}>
                                                                    <div className="pricing-header">
                                                                        {i === 2 ? (
                                                                            <>
                                                                                <div className="d-flex align-items-center gap-1 justify-content-between mb-3">
                                                                                    <span className="title1 mb-0">Yearly</span>
                                                                                    <div
                                                                                        style={{ fontSize: '14px' }}
                                                                                        className="custom-btn bg-white shadow p-2 rounded-pill"
                                                                                    >
                                                                                        🔥 Popular
                                                                                    </div>
                                                                                </div>
                                                                                <div className="d-flex align-items-center gap-2">
                                          <span className="price">
                                            $<span className="fw-bold">Free</span>
                                          </span>
                                                                                    <Link
                                                                                        href="#"
                                                                                        className="btn p-2 rounded-pill mb-0 justify-content-center"
                                                                                        style={{
                                                                                            color: 'white',
                                                                                            backgroundColor: '#10BC17',
                                                                                            fontSize: '14px !important'
                                                                                        }}
                                                                                    >
                                                                                        Save $200
                                                                                    </Link>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="title1">30-Days Free Trial</span>
                                                                                <span className="price">
                                          $<span className="fw-bold">Free</span>
                                        </span>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    <div className="pricing-body">
                                                                        <ul className="m-0 p-0 list-with-icon">
                                                                            {Array(4)
                                                                                .fill(
                                                                                    'Registration with full company profile, license number, insurance, and workers’ comp details.'
                                                                                )
                                                                                .map((li, j) => (
                                                                                    <li key={j}>{li}</li>
                                                                                ))}
                                                                        </ul>
                                                                    </div>

                                                                    <div className="note-card d-flex align-items-start gap-1">
                                                                        <Image
                                                                            src="/assets/img/icons/note.webp"
                                                                            width={24}
                                                                            height={24}
                                                                            alt="Note"
                                                                            loading="lazy"
                                                                            className="d-block"
                                                                        />
                                                                        <div className="content">
                                      <span style={{ fontSize: '14px' }} className="d-block fw-semibold mb-1">
                                        Note
                                      </span>
                                                                            <p style={{ fontSize: '12px' }} className="mb-0">
                                                                                After your trial ends, you’ll need to subscribe to keep bidding on
                                                                                projects, chatting with contractors, and accessing premium tools.
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="pricing-button">
                                                                        <button
                                                                            className={`btn ${
                                                                                i === 0 ? 's1' : i === 1 ? 's2' : 's3 bg-danger'
                                                                            }`}
                                                                        >
                                                                            Get Started
                                                                        </button>
                                                                    </div>

                                                                    {i === 1 && (
                                                                        <div className="text-center text-danger fs-14 fw-medium mt-3 pb-3">
                                                                            Expires on: December 12, 2025
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* End Right Bar */}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
