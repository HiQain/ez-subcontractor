// app/how-it-works/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../../styles/how-it-works.css';

export default function HowItWorksPage() {
    return (
        <div>
            <Header />
            <div className="sections overflow-hidden">
                <section className="hero-sec how-it-works position-static v2">
                    <div className="container">
                        <h1 className="main-title text-center mb-5">How It Works</h1>
                        <div className="row g-3">
                            <div className="col-lg-6">
                                <Image
                                    src="/assets/img/how-it-work-banner.webp"
                                    width={769}
                                    height={615}
                                    alt="How It Works Banner"
                                    className="img-fluid w-100 rounded-4"
                                    loading="lazy"
                                />
                            </div>
                            <div className="col-lg-6">
                                <div className="tab">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="home-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#home"
                                                type="button"
                                                role="tab"
                                                aria-controls="home"
                                                aria-selected="true"
                                            >
                                                Subcontractors
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="profile-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="profile"
                                                aria-selected="false"
                                            >
                                                General Contractors
                                            </button>
                                        </li>
                                    </ul>

                                    <div className="tab-content" id="myTabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="home"
                                            role="tabpanel"
                                            aria-labelledby="home-tab"
                                        >
                                            <div className="content">
                                                <h2 className="mb-0">
                                                    Connect with General contractors and get more Jobs
                                                </h2>
                                                <p className="mb-0 fw-medium">
                                                    Don’t waste time chasing leads from Home owners. Connect with a verified General contractor and get more jobs. Sign up for free, no credit card required and start getting leads emailed and text to your phone in the radius area you choose to work. For one annual price you can obtain as many leads as you can handle with no per lead cost. With many other lead suppliers you can spend as much as $500 to $2000 per month just for the leads. With EZ Subcontractor you are getting leads from Verified General contractors. We know once you work for them and they like your work they will give you jobs directly and may not post the job, less competition and more work. But with our low price of $400 per year we know you will pay for another subscription because it is so low and why miss out on other projects by other General Contractors. Other websites like Thumbtack and Yelp, you end up competing with unlicensed contractors. Other websites dodge reports, Procore and plan Hub are primarily larger commercial jobs and require at least $500 to $1000 a month to subscribe. EZ Subcontractor is an easy way for Subcontractors to bid residential and commercial jobs for one low annual fee.
                                                </p>
                                                <Link href="/join-subcontractor" className="btn btn-primary rounded-3 mt-3">
                                                    Join as a Subcontractor
                                                </Link>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="profile"
                                            role="tabpanel"
                                            aria-labelledby="profile-tab"
                                        >
                                            <div className="content">
                                                <h2 className="mb-0">
                                                    Post your projects and connect with many different licensed contractors at one site
                                                </h2>
                                                <p className="mb-0 fw-medium">
                                                    Spending days and weeks thumbing through the blue book, craigslist, thumbtack and yelp to find reliable licensed contractors for your projects. Leaving messages that go nowhere. And when I finally did get a bid from a subcontractor I was stuck with his high price as I did not have enough time to get other bids. Don’t waste your time. Subscribe to EZ Subcontractor.com for free and get all your subcontractors coming to you. You don’t pay anything to subscribe and post your projects for free. As a licensed General Contractor I started this site as I had a lot of trouble finding good reliable subcontractors for all my projects — plumbing, roofing, electrical, drywall and many other trades. There is no site like it! Subscribe today and see how much time and money you save.
                                                </p>
                                                <Link href="/post-project" className="btn btn-primary rounded-3 mt-3">
                                                    Post a Project
                                                </Link>
                                            </div>
                                        </div>
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