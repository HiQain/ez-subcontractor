'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../../styles/faqs.css';

export default function AboutUsPage() {
    const [faqs, setFaqs] = useState<any[]>([]);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}data/faqs`;
                const res = await fetch(url);
                const json = await res.json();
                console.log(json);
                setFaqs(json.data || []);
            } catch (e) {
                setFaqs([]);
            }
        };
        loadFaqs();
    }, []);

    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="hero-sec faqs position-static">
                    <div className="container">
                        <h1 className="main-title text-center mb-5">FAQs</h1>
                        <div className="accordion" id="accordionExample">
                            {faqs.map((faq, idx) => {
                                const num = idx + 1;
                                const collapseId = `collapse${num}`;
                                const headingId = `heading${num}`;
                                return (
                                    <div className="accordion-item" key={faq.id || num}>
                                        <h2 className="accordion-header" id={headingId}>
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#${collapseId}`}
                                                aria-expanded="false"
                                                aria-controls={collapseId}
                                            >
                                                {faq.question}
                                            </button>
                                        </h2>
                                        <div
                                            id={collapseId}
                                            className="accordion-collapse collapse"
                                            aria-labelledby={headingId}
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                {faq.answer}
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