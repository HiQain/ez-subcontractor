import Image from "next/image";
import { useState } from "react";
import '../../../styles/chat.css';
import '../../../styles/chat-1.css';
import '../../../styles/chat-2.css';

export default function MediaPanel({ onClose }: { onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images');

    return (
        <div className="media-card-wrapper">
            <div className="media-card">
                <div className="media-card-header">
                    <h5 className="mb-0">Media</h5>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <ul className="nav nav-tabs mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link fw-medium fs-6 ${activeTab === 'images' ? 'active' : ''}`}
                            onClick={() => setActiveTab('images')}
                            type="button"
                            role="tab"
                        >
                            Images
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link fw-medium fs-6 ${activeTab === 'documents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('documents')}
                            type="button"
                            role="tab"
                        >
                            Documents
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    {activeTab === 'images' && (
                        <div className="tab-pane fade show active" role="tabpanel">
                            <div className="media-section">
                                <div className="media-section-title mb-2">Today</div>
                                <div className="media-grid mb-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="media-item">
                                            <Image
                                                src="/assets/img/media-img1.webp"
                                                alt="Media"
                                                width={80}
                                                height={80}
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="media-section">
                                <div className="media-section-title mb-2">Yesterday</div>
                                <div className="media-grid mb-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="media-item">
                                            <Image
                                                src="/assets/img/media-img1.webp"
                                                alt="Media"
                                                width={80}
                                                height={80}
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="media-section">
                                <div className="media-section-title">Last Week</div>
                                <div className="media-grid">
                                    <div className="media-item">
                                        <Image
                                            src="/assets/img/media-img1.webp"
                                            alt="Media"
                                            width={80}
                                            height={80}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="tab-pane fade show active" role="tabpanel">
                            <div className="media-section">
                                <div className="media-section-title mb-2">Today</div>
                                <div className="document-list">
                                    {[
                                        { name: 'master_craftsman.pdf', size: '10 GB', time: '16:01' },
                                        { name: 'master_craftsman.pdf', size: '32 MB', time: '14:22' },
                                    ].map((doc, i) => (
                                        <div key={i} className="document-item d-flex align-items-center gap-2 py-2">
                                            <Image
                                                src="/assets/img/icons/pdf-img.svg"
                                                width={24}
                                                height={24}
                                                alt="PDF"
                                                loading="lazy"
                                            />
                                            <div className="flex-grow-1">
                                                <div className="fw-medium">{doc.name}</div>
                                                <div className="text-gray-light fs-12">{doc.size}</div>
                                            </div>
                                            <div className="text-gray-light fs-12">{doc.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="media-section">
                                <div className="media-section-title mb-2">Yesterday</div>
                                <div className="document-list">
                                    <div className="document-item d-flex align-items-center gap-2 py-2">
                                        <Image
                                            src="/assets/img/icons/pdf-img.svg"
                                            width={24}
                                            height={24}
                                            alt="PDF"
                                            loading="lazy"
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-medium">master_craftsman.pdf</div>
                                            <div className="text-gray-light fs-12">24 MB</div>
                                        </div>
                                        <div className="text-gray-light fs-12">12:36</div>
                                    </div>
                                </div>
                            </div>
                            <div className="media-section">
                                <div className="media-section-title mb-2">Last Week</div>
                                <div className="document-list">
                                    <div className="document-item d-flex align-items-center gap-2 py-2">
                                        <Image
                                            src="/assets/img/icons/pdf-img.svg"
                                            width={24}
                                            height={24}
                                            alt="PDF"
                                            loading="lazy"
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-medium">master_craftsman.pdf</div>
                                            <div className="text-gray-light fs-12">24 MB</div>
                                        </div>
                                        <div className="text-gray-light fs-12">Jan 12, 2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
//     const [activeTab, setActiveTab] = useState<'images' | 'documents'>('images');

//     return (
//         <div className="media-card-wrapper">
//             <div className="media-card">
//                 <div className="media-card-header">
//                     <h5 className="mb-0">Media</h5>
//                     <button className="close-btn" onClick={onClose}>&times;</button>
//                 </div>

//                 <ul className="nav nav-tabs mb-3" role="tablist">
//                     <li className="nav-item" role="presentation">
//                         <button
//                             className={`nav-link fw-medium fs-6 ${activeTab === 'images' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('images')}
//                             type="button"
//                             role="tab"
//                         >
//                             Images
//                         </button>
//                     </li>
//                     <li className="nav-item" role="presentation">
//                         <button
//                             className={`nav-link fw-medium fs-6 ${activeTab === 'documents' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('documents')}
//                             type="button"
//                             role="tab"
//                         >
//                             Documents
//                         </button>
//                     </li>
//                 </ul>

//                 <div className="tab-content">
//                     {activeTab === 'images' && (
//                         <div className="tab-pane fade show active" role="tabpanel">
//                             <div className="media-section">
//                                 <div className="media-section-title mb-2">Today</div>
//                                 <div className="media-grid mb-3">
//                                     {[1, 2, 3, 4].map((i) => (
//                                         <div key={i} className="media-item">
//                                             <Image
//                                                 src="/assets/img/media-img1.webp"
//                                                 alt="Media"
//                                                 width={80}
//                                                 height={80}
//                                                 loading="lazy"
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="media-section">
//                                 <div className="media-section-title mb-2">Yesterday</div>
//                                 <div className="media-grid mb-3">
//                                     {[1, 2].map((i) => (
//                                         <div key={i} className="media-item">
//                                             <Image
//                                                 src="/assets/img/media-img1.webp"
//                                                 alt="Media"
//                                                 width={80}
//                                                 height={80}
//                                                 loading="lazy"
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="media-section">
//                                 <div className="media-section-title">Last Week</div>
//                                 <div className="media-grid">
//                                     <div className="media-item">
//                                         <Image
//                                             src="/assets/img/media-img1.webp"
//                                             alt="Media"
//                                             width={80}
//                                             height={80}
//                                             loading="lazy"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'documents' && (
//                         <div className="tab-pane fade show active" role="tabpanel">
//                             <div className="media-section">
//                                 <div className="media-section-title mb-2">Today</div>
//                                 <div className="document-list">
//                                     {[
//                                         { name: 'master_craftsman.pdf', size: '10 GB', time: '16:01' },
//                                         { name: 'master_craftsman.pdf', size: '32 MB', time: '14:22' },
//                                     ].map((doc, i) => (
//                                         <div key={i} className="document-item d-flex align-items-center gap-2 py-2">
//                                             <Image
//                                                 src="/assets/img/icons/pdf-img.svg"
//                                                 width={24}
//                                                 height={24}
//                                                 alt="PDF"
//                                                 loading="lazy"
//                                             />
//                                             <div className="flex-grow-1">
//                                                 <div className="fw-medium">{doc.name}</div>
//                                                 <div className="text-gray-light fs-12">{doc.size}</div>
//                                             </div>
//                                             <div className="text-gray-light fs-12">{doc.time}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="media-section">
//                                 <div className="media-section-title mb-2">Yesterday</div>
//                                 <div className="document-list">
//                                     <div className="document-item d-flex align-items-center gap-2 py-2">
//                                         <Image
//                                             src="/assets/img/icons/pdf-img.svg"
//                                             width={24}
//                                             height={24}
//                                             alt="PDF"
//                                             loading="lazy"
//                                         />
//                                         <div className="flex-grow-1">
//                                             <div className="fw-medium">master_craftsman.pdf</div>
//                                             <div className="text-gray-light fs-12">24 MB</div>
//                                         </div>
//                                         <div className="text-gray-light fs-12">12:36</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="media-section">
//                                 <div className="media-section-title mb-2">Last Week</div>
//                                 <div className="document-list">
//                                     <div className="document-item d-flex align-items-center gap-2 py-2">
//                                         <Image
//                                             src="/assets/img/icons/pdf-img.svg"
//                                             width={24}
//                                             height={24}
//                                             alt="PDF"
//                                             loading="lazy"
//                                         />
//                                         <div className="flex-grow-1">
//                                             <div className="fw-medium">master_craftsman.pdf</div>
//                                             <div className="text-gray-light fs-12">24 MB</div>
//                                         </div>
//                                         <div className="text-gray-light fs-12">Jan 12, 2025</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };