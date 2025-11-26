'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import '../../../styles/job-single.css';

export default function JobDetailsPage() {
    return (
        <>
            <Header/>

            <div className="sections overflow-hidden">
                <section className="banner-sec job-single position-static">
                    <div className="container">
                        <div style={{backgroundColor: 'transparent !important'}} className="topbar">
                            <div className="d-flex align-items-center flex-wrap justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="icon">
                                        <Image src="/assets/img/button-angle.svg" width={10} height={15} alt="Angle"/>
                                    </div>
                                    <div className="login-title fw-semibold fs-4 text-center">Project Details</div>
                                </div>
                                <div className="icon-wrapper d-flex align-items-center gap-3 flex-wrap" >
                                    <Link href="#" className="icon">
                                        <Image
                                            src="/assets/img/icons/edit.svg"
                                            width={24}
                                            height={24}
                                            alt="Edit Icon"
                                        />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="icon"
                                        style={{backgroundColor: '#DC2626 !important'}}
                                    >
                                        <Image
                                            src="/assets/img/icons/delete.svg"
                                            width={24}
                                            height={24}
                                            alt="Delete Icon"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Left Side */}
                            <div className="col-12">
                                <div className="custom-card mb-4">
                                    <div
                                        className="mb-4 d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                        <Link href="#" className="btn btn-primary">Framing</Link>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="date custom-text-gray-light fs-14">12 days ago</div>
                                            <Link href="#" style={{backgroundColor: '#61BA4710', color: '#10BC17',}}
                                                  className="btn pt-2 pb-2 ps-3 pe-3">Active</Link>
                                        </div>
                                    </div>

                                    <div className="title text-black fs-5 fw-semibold mb-3">Whittier, CA</div>
                                    <div className="mb-3">
                                        We’re looking for a licensed and experienced painter to handle a complete
                                        interior repaint of a 2,000 sq. ft. office space. The project requires two coats
                                        of primer followed by a final flat finish for a clean, professional look. All
                                        surfaces must be properly prepared before painting to ensure long-lasting
                                        quality. The painter should bring all necessary tools and equipment and be able
                                        to work efficiently with minimal disruption to office operations. A detailed
                                        estimate of required materials must be provided prior to starting. Only licensed
                                        and insured contractors will be considered for this project. Reliability,
                                        attention to detail, and adherence to timelines are essential.
                                    </div>

                                    <div className="title text-black fs-5 fw-semibold mb-1">The project includes:</div>
                                    <ul className="list-with-dots mb-3">
                                        <li>Must be a licensed and insured painter</li>
                                        <li>Painting of walls, ceilings, and trim</li>
                                        <li>Proper surface preparation before painting</li>
                                    </ul>

                                    <div className="title text-black fs-5 fw-semibold mb-1">Requirements:</div>
                                    <ul className="list-with-dots mb-3">
                                        <li>Must be a licensed and insured painter</li>
                                        <li>Must bring all necessary equipment and tools</li>
                                        <li>Provide a detailed material estimate (paint, primer, supplies, etc.)</li>
                                    </ul>

                                    <div className="title text-black fs-5 fw-semibold mb-3">Project Details</div>
                                    <div className="estimated-wrapper">
                                        <div className="estimated-card">
                                            <div className="icon">
                                                <Image src="/assets/img/icons/calander.svg" width={24} height={24}
                                                       alt="Calendar Icon"/>
                                            </div>
                                            <div className="content">
                                                <div className="fs-12 mb-1">Estimate Due Date</div>
                                                <div className="fs-14 text-black fw-semibold">Jan 12, 2026</div>
                                            </div>
                                        </div>

                                        <div className="estimated-card card-1">
                                            <div className="icon">
                                                <Image src="/assets/img/icons/calander.svg" width={24} height={24}
                                                       alt="Calendar Icon"/>
                                            </div>
                                            <div className="content">
                                                <div>
                                                    <div className="fs-12 mb-1">Project Start Date</div>
                                                    <div className="fs-14 text-black fw-semibold">Mar 26, 2026</div>
                                                </div>
                                                <div>
                                                    <div className="fs-12 mb-1">Project End Date</div>
                                                    <div className="fs-14 text-black fw-semibold">Dec 14, 2026</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments Section */}
                                <div className="custom-card mb-4">
                                    <div className="title text-black fs-5 fw-semibold mb-3">Attachments</div>
                                    <div className="mb-2 fw-medium">Files</div>
                                    <div className="pdf-wrapper mb-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={`pdf-card mb-2 ${i === 3 ? 'card-1' : ''}`}>
                                                <Image src="/assets/img/icons/pdf-img.svg" width={27} height={32}
                                                       alt="Pdf Icon"/>
                                                <div className="content">
                                                    <div className="fw-semibold text-black mb-1">master_craftsman.pdf
                                                    </div>
                                                    <div className="fs-12">30 May 2024 at 4:36 pm</div>
                                                </div>
                                                {i === 2 && (
                                                    <Link href="#" style={{marginLeft: 'auto'}}>
                                                        <Image src="/assets/img/icons/download.svg" width={18}
                                                               height={18} alt="Download Icon"/>
                                                    </Link>
                                                )}
                                                {i === 3 && (
                                                    <Link href="#" style={{marginLeft: 'auto'}} className="icon">
                                                        <div className="percantage">50%</div>
                                                    </Link>
                                                )}
                                                <p className="mb-0">
                                                    Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                                                    vulputate libero et velit
                                                    interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad
                                                    litora torquent per conubia
                                                    nostra, per inceptos himenaeos.
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-2 fw-medium">Images</div>
                                    <div className="gallery-images">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <Image
                                                key={i}
                                                src={`/assets/img/gallery-img (${i}).webp`}
                                                width={112}
                                                height={117}
                                                alt={`Gallery Image ${i}`}
                                                className="img-fluid"
                                            />
                                        ))}
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
