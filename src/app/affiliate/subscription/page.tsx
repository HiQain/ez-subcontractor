'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/pricing.css';

const pricingPlans = {
    'sub-contractor': [
        {
            id: 1,
            title: 'Free Registration',
            price: 'Free',
            features: [
                'Free registration',
                'See unlimited projects',
                'No credit card required',
                'Set radius to receive Projects',
            ],
            hasNote: false,
            isPopular: false,
            showStrike: false,
        },
        {
            id: 2,
            title: '30-Days Free Trial',
            price: 'Free',
            features: [
                'Access to directory of subcontractor and general contractor',
                'Can advertise on website $50 per week',
            ],
            hasNote: true, // sirf ye true rakha
            isPopular: false,
            showStrike: false,
        },
        {
            id: 3,
            title: 'Monthly',
            price: '60',
            features: [
                'Browsing Access to contractor directory all Contractors.',
                'Direct message all contractors on website.',
                'Search contractors on website.',
                'Access all contractors contact information.',
            ],
            hasNote: false,
            isPopular: false,
            showStrike: false,
        },
        {
            id: 4,
            title: 'Yearly',
            price: '500',
            features: [
                'Browsing Access to contractor directory all Contractors.',
                'Direct message all contractors on website.',
                'Search contractors on website.',
                '3 weeks of free advertising on site with annual subscription fee.',
                'Access all contractors contact information.',
            ],
            hasNote: false,
            isPopular: true,
            showStrike: true,
            saveText: '30% OFF',
            saveColor: '#DC2626',
        },
    ],
};

export default function PricingPage() {
    const router = useRouter();

    const handleSelectPlan = (plan: any, type: string) => {
        localStorage.setItem('selectedPlan', JSON.stringify({ ...plan, type }));
        router.push('/affiliate/checkout');
    };

    const renderNoteCard = () => (
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
    );

    const renderPlanCard = (plan: any, type: string) => (
        <div key={plan.id} className="col-lg-3 col-md-6">
            <div className={`price-card ${plan.isPopular ? 'price-card1' : ''} free`}>
                <div>
                    <div className="pricing-header">
                        {plan.isPopular ? (
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="title1 mb-0">{plan.title}</span>
                                <div
                                    style={{ fontSize: '14px' }}
                                    className="custom-btn bg-white shadow p-2 rounded-pill"
                                >
                                    🔥 Popular
                                </div>
                            </div>
                        ) : (
                            <span className="title1">{plan.title}</span>
                        )}
                        {plan.showStrike ? (
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                <del className="fs-4 fw-medium text-black">$ 720</del>
                                <div className="d-flex align-items-center gap-2">
                  <span className="price">
                    $<span className="fw-bold">{plan.price}</span>
                  </span>
                                    {plan.saveText && (
                                        <button
                                            type="button"
                                            style={{ backgroundColor: plan.saveColor }}
                                            className="custom-btn text-white p-2 rounded-pill"
                                        >
                                            {plan.saveText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                <span className="price">
                  $<span className="fw-bold">{plan.price}</span>
                </span>
                                {plan.saveText && (
                                    <button
                                        type="button"
                                        style={{ backgroundColor: plan.saveColor }}
                                        className="custom-btn text-white p-2"
                                    >
                                        {plan.saveText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pricing-body mb-3">
                        <ul className="m-0 p-0 list-with-icon">
                            {plan.features.map((feature: string, i: number) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="d-flex align-items-center flex-column">
                    {/* ✅ Sirf id === 2 pe note show hoga */}
                    {plan.id === 2 && renderNoteCard()}
                    <div className="pricing-button w-100 pt-0">
                        <button className="btn" onClick={() => handleSelectPlan(plan, type)}>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section
                    style={{
                        background: `url('/assets/img/pricing-hero.webp') center /cover no-repeat`,
                    }}
                    className="hero-sec position-relative pricing"
                >
                    <div className="container">
                        <div className="content-wrapper">
                            <h1 className="text-primary text-center mb-3">
                                Choose Your Plan and Start Getting Project Leads Today
                            </h1>
                            <p className="mb-4 text-white text-center fs-5 fw-medium">
                                Unlock full access to jobs, messaging, and contractor tools — no
                                hidden fees.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="pricing-sec">
                    <div className="container-fluid">
                        <div className="tab-content pricing-wrapper">
                            <div className="tab-pane fade show active pricing-content">
                                <div className="row g-3">
                                    {pricingPlans['sub-contractor'].map((plan) =>
                                        renderPlanCard(plan, 'sub-contractor')
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />

            <style jsx>{`
                .hero-sec {
                    position: relative;
                    z-index: 1;
                }
                .hero-sec::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #000;
                    opacity: 0.85;
                    z-index: -1;
                    display: block;
                }
            `}</style>
        </div>
    );
}
