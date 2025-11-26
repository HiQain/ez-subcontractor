'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface DocumentItem {
    name: string;
    file?: File;
    description: string;
}

export default function PostAd() {
    const router = useRouter(); // <- Router hook
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectOpen, setSelectOpen] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([
        { name: 'master_crafts_man.pdf', description: '' },
        { name: 'master_crafts_man.pdf', description: '' },
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories = [
        { id: '1', name: 'Plumbing' },
        { id: '2', name: 'Electric Work' },
        { id: '3', name: 'Framing' },
        { id: '4', name: 'Roofing' },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        setSelectedCategory(id);
        setSelectOpen(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newDocs: DocumentItem[] = files.map(f => ({ name: f.name, file: f, description: '' }));
        setAllDocuments(prev => [...prev, ...newDocs]);
    };

    const handleRemoveFile = (index: number) => {
        setAllDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleDocumentDescriptionChange = (index: number, value: string) => {
        const updated = [...allDocuments];
        updated[index].description = value;
        setAllDocuments(updated);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newDocs: DocumentItem[] = files.map(f => ({ name: f.name, file: f, description: '' }));
        setAllDocuments(prev => [...prev, ...newDocs]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    return (
        <>
            <Header />
            <div className="sections overflow-hidden">
                <section className="banner-sec post profile">
                    <div className="container">
                        <div className="right-bar mb-5">
                            <div className="d-flex align-items-center gap-3">
                                <Link href="#" className="icon">
                                    <Image
                                        src="/assets/img/button-angle.svg"
                                        width={10}
                                        height={15}
                                        alt="Icon"
                                        unoptimized
                                    />
                                </Link>
                                <span className="fs-4 fw-semibold">Post an Ad</span>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-lg-8">
                                <form className="mb-4">
                                    {/* Category Select */}
                                    <div className="input-wrapper d-flex flex-column position-relative mb-4" ref={dropdownRef}>
                                        <label className="mb-1 fw-semibold">Category *</label>
                                        <div className={`custom-select position-relative ${selectOpen ? 'open' : ''}`}>
                                            <div className="select-selected" onClick={() => setSelectOpen(!selectOpen)}>
                                                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Select category'}
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="select-arrow"
                                                viewBox="0 0 16 16"
                                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                                            >
                                                <path fillRule="evenodd" d="M1.646 5.646a.5.5 0 0 1 .708 0L8 11.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            <ul className="select-options">
                                                {categories.map(cat => <li key={cat.id} onClick={() => handleSelect(cat.id)}>{cat.name}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Input Fields */}
                                    <div className="row g-4">
                                        {[
                                            { label: 'City *', type: 'text', placeholder: 'New York' },
                                            { label: 'State *', type: 'text', placeholder: 'NY' },
                                            { label: 'Zip Code *', type: 'text', placeholder: '12345' },
                                            { label: 'Estimate Due Date *', type: 'date' },
                                            { label: 'Project Start Date *', type: 'date' },
                                            { label: 'Project End Date *', type: 'date' },
                                        ].map((field, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="input-wrapper">
                                                    <div className="label mb-1 fw-semibold">{field.label}</div>
                                                    <input type={field.type} placeholder={field.placeholder || ''} />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="col-12">
                                            <div className="label mb-1 fw-semibold">Description *</div>
                                            <div className="input-wrapper">
                                                <ReactQuill theme="snow" value={description} onChange={setDescription} placeholder="Message" />
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                {/* Documents */}
                                <div className="documents-wrapper mb-4">
                                    <div className="fs-5 fw-semibold mb-3">Documents Description</div>
                                    {allDocuments.map((doc, index) => (
                                        <div className="document-item mb-3" key={index}>
                                            <div className="d-flex align-items-center gap-3 justify-content-between mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" width={27} height={32} alt="PDF" />
                                                    <span className="d-block fs-14 fw-semibold">{doc.name}</span>
                                                </div>
                                                <button type="button" className="remove-btn" onClick={() => handleRemoveFile(index)}>x</button>
                                            </div>
                                            <div className="input-wrapper">
                                                <textarea
                                                    style={{ minHeight: '120px' }}
                                                    placeholder="Write description"
                                                    value={doc.description}
                                                    onChange={e => handleDocumentDescriptionChange(index, e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ✅ Add Project Button -> Redirect */}
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-3 w-100 justify-content-center"
                                    onClick={() => router.push('/general_contractor/view-more-reviews')}
                                >
                                    Add Project
                                </button>
                            </div>

                            {/* Attachments */}
                            <div className="col-lg-4">
                                <div className="attachment-wrapper">
                                    <div className="fw-semibold mb-3">Attachment</div>
                                    <div className="attachment-box mb-4" onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => fileInputRef.current?.click()}>
                                        <div className="upload-content">
                                            <div className="upload-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" style={{ stroke: '#272727' }} width="55" height="55" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4" />
                                                </svg>
                                            </div>
                                            <p>Drag and drop files here<br />or click to upload</p>
                                            <small>Supported: .pdf, .doc, .xml, .jpeg (Max 10MB)</small>
                                        </div>
                                        <input type="file" hidden multiple ref={fileInputRef} onChange={handleFileUpload} />
                                    </div>
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
