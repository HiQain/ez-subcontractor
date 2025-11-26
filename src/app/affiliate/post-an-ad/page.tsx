'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/post-detail.css';
import '../../../styles/profile.css';

export default function PostAnAd() {
    const router = useRouter();

    // Tabs state
    const [activeTab, setActiveTab] = useState('saved-cards');

    // Image upload states
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [smallImage, setSmallImage] = useState<string | null>(null);
    const mainFileRef = useRef<HTMLInputElement>(null);
    const smallFileRef = useRef<HTMLInputElement>(null);

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImage(imgUrl);
        }
    };

    // Handle Post Ad button click
    const handlePostAd = () => {
        router.push('/affiliate/ad-posted');
    };

    return (
        <>
            <Header />

            <div className="banner-sec post profile">
                <div className="container">
                    <div className="right-bar mb-5">
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
                            <span className="fs-4 fw-semibold">Post an Ad</span>
                        </div>
                    </div>

                    <div className="form-section">
                        {/* Left Side */}
                        <div className="left-side">
                            <div className="fw-semibold fs-18 mb-3">Select Orientation</div>

                            <div className="radio-group mb-4">
                                <div className="radio-wrapper mb-3">
                                    <input type="radio" id="radio1" className="radio" defaultChecked />
                                    <label htmlFor="radio1" className="fw-medium">Horizontal</label>
                                </div>
                                <div className="radio-wrapper mb-3">
                                    <input type="radio" id="radio2" className="radio" />
                                    <label htmlFor="radio2" className="fw-medium">Vertical</label>
                                </div>
                                <div className="radio-wrapper">
                                    <input type="radio" id="radio3" className="radio" />
                                    <label htmlFor="radio3" className="fw-medium">Both</label>
                                </div>
                            </div>

                            <div className="input-wrapper mb-4">
                                <label className="fw-semibold mb-1">Horizontal URL</label>
                                <input type="text" placeholder="Enter URL" />
                            </div>

                            <div className="fs-4 fw-semibold mb-3">Payment Details</div>

                            {/* Tabs */}
                            <div className="tab mb-4">
                                <ul className="nav nav-tabs mb-5" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'saved-cards' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('saved-cards')}
                                        >
                                            Saved Cards
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'add-card' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('add-card')}
                                        >
                                            Add a New Card
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content">
                                    {activeTab === 'saved-cards' && (
                                        <div className="tab-pane fade show active">
                                            <div className="cards-wrapper">
                                                <div className="row g-3">
                                                    <div className="col-xl-6">
                                                        <div className="credit-card mb-2 position-relative">
                                                            <div className="checkbox-wrapper">
                                                                <input
                                                                    type="checkbox"
                                                                    id="checkbox1"
                                                                    className="checkbox checkbox1"
                                                                    defaultChecked
                                                                />
                                                            </div>
                                                            <div className="numbers fs-4 fw-semibold mb-4">
                                                                ***************4854
                                                            </div>
                                                            <div className="content-wrapper d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                                <div className="left d-flex align-items-center gap-4 flex-wrap">
                                                                    <div>
                                                                        <div className="fs-12 mb-1">Card Holder Name</div>
                                                                        <div className="fs-14 fw-semibold">Christopher Charles</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="fs-12 mb-1">Expiry Date</div>
                                                                        <div className="fs-14 fw-semibold">10/28</div>
                                                                    </div>
                                                                </div>
                                                                <div className="icon">
                                                                    <Image
                                                                        src="/assets/img/icons/visa-icon.svg"
                                                                        width={28}
                                                                        height={9}
                                                                        alt="Icon"
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xl-6">
                                                        <div className="credit-card mb-2 position-relative">
                                                            <div className="checkbox-wrapper">
                                                                <input type="checkbox" id="checkbox2" className="checkbox checkbox1" />
                                                            </div>
                                                            <div className="numbers fs-4 fw-semibold mb-4">
                                                                ***************8547
                                                            </div>
                                                            <div className="content-wrapper d-flex align-items-center gap-2 flex-wrap justify-content-between">
                                                                <div className="left d-flex align-items-center gap-4 flex-wrap">
                                                                    <div>
                                                                        <div className="fs-12 mb-1">Card Holder Name</div>
                                                                        <div className="fs-14 fw-semibold">John Smith</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="fs-12 mb-1">Expiry Date</div>
                                                                        <div className="fs-14 fw-semibold">11/26</div>
                                                                    </div>
                                                                </div>
                                                                <div className="icon">
                                                                    <Image
                                                                        src="/assets/img/icons/visa-icon.svg"
                                                                        width={28}
                                                                        height={9}
                                                                        alt="Icon"
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'add-card' && (
                                        <div className="tab-pane fade show active">
                                            <div className="form">
                                                {[['Full Name','text','Jason Doe'], ['Email Address','email','hello@example.com'], ['Card Holder Name','text','Enter card holder name'], ['Card Number','text','4242 4242 4242 4242'], ['CVV','number','Enter CVV'], ['Expiry Date','text','12/25'], ['Zip Code','text','Enter zip code'], ['Promo Code','text','Enter promo code']].map(([label,type,placeholder],i)=>(
                                                    <div key={i} className="input-wrapper">
                                                        <label className="mb-1 fw-semibold">{label}{i<7 && <span className="required">*</span>}</label>
                                                        <input type={type} placeholder={placeholder}/>
                                                    </div>
                                                ))}

                                                <div className="radio-wrapper d-flex align-items-center gap-2">
                                                    <input style={{width:'24px',height:'24px'}} type="radio" id="saveCard" className="radio"/>
                                                    <label htmlFor="saveCard" className="fs-14 fw-medium">
                                                        Save card for future transactions
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Note + Summary */}
                            <div className="note-card d-flex align-items-start gap-1 mb-4">
                                <Image src="/assets/img/icons/note.webp" width={24} height={24} alt="Note" loading="lazy" className="d-block"/>
                                <div className="content">
                                    <span className="d-block fw-semibold mb-1" style={{fontSize:'14px'}}>Note</span>
                                    <ul className="m-0 p-0">
                                        <li className="fs-12">You can only post one ad at a time</li>
                                        <li className="fs-12">You can only post one ad at a time</li>
                                        <li className="fs-12">You can only post one ad at a time</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="summary-box mb-4">
                                <div className="icon-box d-flex gap-2">
                                    <Image src="/assets/img/summary.svg" width={24} height={24} alt="Icon" loading="lazy"/>
                                    <div className="content w-100">
                                        <div className="fs-14 fw-semibold mb-2">Summary</div>
                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100 mb-1">
                                            <div className="fs-14 text-gray-light fw-medium">Orientation</div>
                                            <div className="fs-14 fw-semibold">Horizontal</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100 mb-1">
                                            <div className="fs-14 text-gray-light fw-medium">Duration (7 Weeks X $50)</div>
                                            <div className="fs-14 fw-semibold">$350.00</div>
                                        </div>
                                        <hr className="mb-2 mt-2"/>
                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap w-100">
                                            <div className="fs-14 text-gray-light fw-medium">Total</div>
                                            <div className="fs-14 fw-semibold">$350.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary w-100 rounded-3 justify-content-center" onClick={handlePostAd}>
                                Post an Ad
                            </button>
                        </div>

                        {/* Right Side Upload Boxes */}
                        <div className="right-side align-lg-end">
                            <div className="image-box" onClick={()=>mainFileRef.current?.click()} style={{cursor:'pointer'}}>
                                {mainImage ? <Image src={mainImage} alt="Upload" width={760} height={246}/> : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                        </svg>
                                        <p>Drag and drop image here<br/>or click to upload</p>
                                        <small>Resolution: 760x246 | 200 MB Max</small>
                                    </>
                                )}
                                <input type="file" accept="image/*,application/pdf" ref={mainFileRef} style={{display:'none'}} onChange={(e)=>handleFileChange(e,setMainImage)}/>
                            </div>

                            <div className="image-box small margin-right" style={{maxWidth:'371px',cursor:'pointer'}} onClick={()=>smallFileRef.current?.click()}>
                                {smallImage ? <Image src={smallImage} alt="Upload" width={371} height={426}/> : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                        </svg>
                                        <p>Drag and drop image here<br/>or click to upload</p>
                                        <small>Resolution: 571x426 | 200 MB Max</small>
                                    </>
                                )}
                                <input type="file" accept="image/*,application/pdf" ref={smallFileRef} style={{display:'none'}} onChange={(e)=>handleFileChange(e,setSmallImage)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
