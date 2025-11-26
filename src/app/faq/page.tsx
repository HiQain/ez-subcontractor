// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

import '../../styles/faqs.css';

// FAQ data — update with your real questions/answers
const faqData = [
    {
        id: 1,
        question: 'Can I register and not pay any registration fee?',
        answer: 'Yes! Registration is completely free. You can create your profile, browse projects, and explore the platform without any upfront cost. You only pay if you choose to upgrade for premium features or after your free trial ends.',
    },
    {
        id: 2,
        question: 'How long does the free trial last?',
        answer: 'The free trial lasts for 30 days from the date of registration. During this time, you’ll have full access to all platform features including bidding on projects, messaging contractors, and managing your profile.',
    },
    {
        id: 3,
        question: 'Do I need to provide license and insurance details?',
        answer: 'Yes, to ensure trust and safety on our platform, all subcontractors must verify their business license, insurance, and workers’ compensation details during registration. This helps general contractors feel confident when hiring you.',
    },
];

export default function AboutUsPage() {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleAccordion = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="hero-sec faqs position-static">
                    <div className="container">
                        <h1 className="main-title text-center mb-5">FAQs</h1>
                        <div className="accordion" id="faqAccordion">
                            {faqData.map((item) => {
                                const isOpen = openId === item.id;
                                return (
                                    <div key={item.id} className="accordion-item mb-3 shadow-sm">
                                        <h2 className="accordion-header" id={`faqHeading${item.id}`}>
                                            <button
                                                className={`accordion-button ${!isOpen ? 'collapsed' : ''} bg-white`}
                                                type="button"
                                                // onclick={() => toggleAccordion(item.id)}
                                                aria-expanded={isOpen}
                                                aria-controls={`faqCollapse${item.id}`}
                                            >
                                                {item.question}
                                            </button>
                                        </h2>
                                        <div
                                            id={`faqCollapse${item.id}`}
                                            className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                                            aria-labelledby={`faqHeading${item.id}`}
                                            data-bs-parent="#faqAccordion"
                                        >
                                            <div className="accordion-body">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}