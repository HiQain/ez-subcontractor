'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../../styles/profile.css';
import '../../../styles/post-detail.css';

export default function EditAdPage() {
    const router = useRouter();

    // Initial state
    const [orientation, setOrientation] = useState('horizontal');
    const [url, setUrl] = useState('https://google.com');
    const [deleted, setDeleted] = useState(false);

    // Handle orientation change
    const handleOrientationChange = (e) => {
        setOrientation(e.target.value);
    };

    // Handle URL change
    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    // Handle update
    const handleUpdate = (e) => {
        e.preventDefault();
        alert(`✅ Ad updated!\n\nOrientation: ${orientation}\nURL: ${url}`);
    };

    // Handle delete
    const handleDelete = () => {
        if (confirm('⚠️ Are you sure you want to delete this ad?')) {
            setDeleted(true);
            alert('🗑️ Ad deleted successfully.');
        }
    };

    // Handle back button
    const handleBack = () => {
        router.push('/affiliate/my-ads'); // yahan redirect page set hai
    };

    if (deleted) {
        return (
            <>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-danger">This ad has been deleted.</h3>
                    <button onClick={handleBack} className="btn btn-primary mt-4">
                        Go Back
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="sections overflow-hidden">
                <section className="banner-sec post profile">
                    <div className="container">
                        <div className="right-bar">
                            {/* Header bar */}
                            <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap mb-5">
                                <div className="icon-wrapper d-flex align-items-center gap-3">
                                    <button onClick={handleBack} className="icon bg-transparent border-0 p-0">
                                        <Image
                                            src="/assets/img/button-angle.svg"
                                            width={10}
                                            height={15}
                                            alt="Back"
                                            loading="lazy"
                                        />
                                    </button>
                                    <span className="fs-4 fw-semibold">Edit Ad</span>
                                </div>

                                <div className="icon-wrapper">
                                    <button
                                        onClick={handleDelete}
                                        style={{ backgroundColor: '#DC2626 !important' }}
                                        className="icon border-0 p-2 rounded-2"
                                        title="Delete Ad"
                                    >
                                        <Image src="/assets/img/icons/delete.svg" width={24} height={24} alt="Delete" />
                                    </button>
                                </div>
                            </div>

                            <div className="row g-3">
                                {/* Image side */}
                                <div className="col-lg-6 order-lg-2">
                                    <div className="image-wrapper">
                                        <Image
                                            src="/assets/img/ad-posting1.webp"
                                            width={769}
                                            height={426}
                                            className="img-fluid w-100 h-100 post-img"
                                            alt="Ad Image"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* Form side */}
                                <div className="col-lg-6 order-lg-1">
                                    <div className="fs-18 fw-semibold mb-4">Select Orientation</div>

                                    <div className="radio-group mb-5">
                                        <div className="radio-wrapper mb-3">
                                            <input
                                                type="radio"
                                                id="horizontal"
                                                name="orientation"
                                                value="horizontal"
                                                checked={orientation === 'horizontal'}
                                                onChange={handleOrientationChange}
                                                className="radio"
                                            />
                                            <label htmlFor="horizontal" className="fw-medium">Horizontal</label>
                                        </div>

                                        <div className="radio-wrapper mb-3">
                                            <input
                                                type="radio"
                                                id="vertical"
                                                name="orientation"
                                                value="vertical"
                                                checked={orientation === 'vertical'}
                                                onChange={handleOrientationChange}
                                                className="radio"
                                            />
                                            <label htmlFor="vertical" className="fw-medium">Vertical</label>
                                        </div>

                                        <div className="radio-wrapper">
                                            <input
                                                type="radio"
                                                id="both"
                                                name="orientation"
                                                value="both"
                                                checked={orientation === 'both'}
                                                onChange={handleOrientationChange}
                                                className="radio"
                                            />
                                            <label htmlFor="both" className="fw-medium">Both</label>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <form className="form-s1" onSubmit={handleUpdate}>
                                        <div className="input-wrapper mb-5">
                                            <div className="label fw-semibold mb-1">URL</div>
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={handleUrlChange}
                                                placeholder="https://google.com"
                                            />
                                        </div>
                                        <input type="submit" value="Update" className="btn btn-primary" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
