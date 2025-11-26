'use client';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/pricing.css';

const pricingPlans = [
    {
        id: 1,
        title: '30-Days Free Trial',
        price: 'Free',
        features: [
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
        ],
        note: true,
        btnClass: 's1',
        expires: null,
        popular: false,
        saveText: null,
        saveColor: null,
    },
    {
        id: 2,
        title: '30-Days Free Trial',
        price: 'Free',
        features: [
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
        ],
        note: true,
        btnClass: 's2',
        expires: 'Expires on: December 12, 2025',
        popular: false,
        saveText: null,
        saveColor: null,
    },
    {
        id: 3,
        title: 'Yearly',
        price: 'Free',
        features: [
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
            'Registration with full company profile, license number, insurance, and workers’ comp details.',
        ],
        note: true,
        btnClass: 's3 bg-danger',
        expires: null,
        popular: true,
        saveText: 'Save $200',
        saveColor: '#DC2626',
    },
];

export default function SubscriptionPage() {
    return (
        <>
            <Header/>
            <div className="sections overflow-hidden">
                <section className="banner-sec profile pricing">
                    <div className="container">
                        <div className="row g-4">
                            {/* Sidebar */}
                            <div className="col-xl-3">
                                <div className="sidebar">
                                    <div className="main-wrapper bg-dark p-0">
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
                                                    <div className="title text-black fs-5 fw-medium mb-2">
                                                        Joseph Dome
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <Image
                                                            src="/assets/img/icons/message-dark.svg"
                                                            width={16}
                                                            height={16}
                                                            alt="Message Icon"
                                                            loading="lazy"
                                                        />
                                                        <Link
                                                            href="mailto:hello@example.com"
                                                            className="fs-14 fw-medium text-dark"
                                                        >
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
                                                        <Link
                                                            href="tel:+(000) 000-000"
                                                            className="fs-14 fw-medium text-dark"
                                                        >
                                                            (000) 000-000
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <Image
                                                src="/assets/img/icons/arrow-dark.svg"
                                                style={{objectFit: 'contain'}}
                                                width={16}
                                                height={10}
                                                alt="Arrow"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Sidebar Buttons */}
                                        <div className="buttons-wrapper">
                                            <Link href="/affiliate/change-password" className="custom-btn">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/lock.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Change Password</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    style={{objectFit: 'contain'}}
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>

                                            <Link href="/affiliate/saved-contractors" className="custom-btn">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Saved Contractors</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    style={{objectFit: 'contain'}}
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>

                                            <Link href="/affiliate/my-subscription" className="custom-btn active">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">My Subscription</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    style={{objectFit: 'contain'}}
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>

                                            <Link href="/affiliate/transaction-history" className="custom-btn">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Transaction History</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    style={{objectFit: 'contain'}}
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>

                                            <Link href="/affiliate/saved-cards" className="custom-btn">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Image
                                                        src="/assets/img/icons/saved.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                    <span className="text-white">Saved Cards</span>
                                                </div>
                                                <Image
                                                    src="/assets/img/icons/angle-right.svg"
                                                    style={{objectFit: 'contain'}}
                                                    width={15}
                                                    height={9}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>

                                        {/* Logout Button */}
                                        <div className="bottom-bar">
                                            <div className="buttons-wrapper">
                                                <Link
                                                    href="#"
                                                    className="custom-btn s1 bg-danger"
                                                    style={{borderColor: '#DC2626'}}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/assets/img/icons/logout.svg"
                                                            width={20}
                                                            height={20}
                                                            alt="Logout Icon"
                                                            loading="lazy"
                                                        />
                                                        <span className="text-white">Logout</span>
                                                    </div>
                                                    <Image
                                                        src="/assets/img/icons/angle-right.svg"
                                                        style={{objectFit: 'contain'}}
                                                        width={15}
                                                        height={9}
                                                        alt="Icon"
                                                        loading="lazy"
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Content */}
                            <div className="col-xl-9">
                                <div className="right-bar">
                                    <div
                                        className="d-flex align-items-center gap-2 justify-content-between flex-wrap mb-5">
                                        <div className="icon-wrapper d-flex align-items-center gap-3">
                                            <Link href="#" className="icon">
                                                <Image
                                                    src="/assets/img/button-angle.svg"
                                                    width={10}
                                                    height={15}
                                                    alt="Icon"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <span className="fs-4 fw-semibold">Subscription</span>
                                        </div>
                                    </div>
                                    <div className="pricing-sec p-0">
                                        <div className="row g-2">
                                            {pricingPlans.map((plan) => (
                                                <div key={plan.id} className="col-lg-4 col-md-6 col-12">
                                                    <div className={`price-card ${plan.popular ? 'price-card1' : ''}`}>
                                                        <div className="pricing-header mb-3">
                                                            {plan.popular ? (
                                                                <div
                                                                    className="d-flex align-items-center gap-1 justify-content-between mb-3">
                                                                    <span className="title1 mb-0">{plan.title}</span>
                                                                    <div
                                                                        style={{fontSize: '14px'}}
                                                                        className="custom-btn bg-white shadow p-2 rounded-pill"
                                                                    >
                                                                        🔥 Popular
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="title1">{plan.title}</span>
                                                            )}
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="price">{plan.price}</span>
                                                                {plan.saveText && (
                                                                    <button
                                                                        type="button"
                                                                        style={{backgroundColor: plan.saveColor}}
                                                                        className="custom-btn text-white p-2"
                                                                    >
                                                                        {plan.saveText}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="pricing-body">
                                                            <ul className="m-0 p-0 list-with-icon">
                                                                {plan.features.map((feature, i) => (
                                                                    <li key={i}>{feature}</li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {plan.note && (
                                                            <div className="note-card d-flex align-items-start gap-1">
                                                                <Image
                                                                    src="/assets/img/icons/note.webp"
                                                                    width={24}
                                                                    height={24}
                                                                    alt="Note"
                                                                    className="d-block"
                                                                    loading="lazy"
                                                                />
                                                                <div className="content">
                                                                    <span className="d-block fw-semibold mb-1"
                                                                          style={{fontSize: '14px'}}>
                                                                        Note
                                                                    </span>
                                                                    <p className="mb-0" style={{fontSize: '12px'}}>
                                                                        After your trial ends, you’ll need to subscribe
                                                                        to
                                                                        keep bidding on projects, chatting with
                                                                        contractors,
                                                                        and accessing premium tools.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="pricing-button mt-3">
                                                            <button className={`btn ${plan.btnClass}`}>Get Started
                                                            </button>
                                                        </div>

                                                        {plan.expires && (
                                                            <div
                                                                className="text-center text-danger fs-14 fw-medium mt-3 pb-3">
                                                                {plan.expires}
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
                </section>
            </div>
            <Footer/>
        </>
    );
}
