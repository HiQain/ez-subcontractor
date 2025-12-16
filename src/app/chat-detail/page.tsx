'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './../components/Header';
import '../../styles/chat.css';
import '../../styles/chat-1.css';
import '../../styles/chat-2.css';
import Link from 'next/link';

// ✅ Block User Modal Component
const BlockUserModal = ({ 
  show, 
  onClose, 
  onConfirm 
}: { 
  show: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  if (!show) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ 
        display: 'block', 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        zIndex: 1050,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-body p-4">
            <div className="d-flex mb-3 justify-content-start">
              <Image
                src="/assets/img/icons/block-icon.svg"
                width={48}
                height={48}
                alt="Block Icon"
                loading="lazy"
              />
            </div>
            <h5 className="modal-title fw-semibold fs-5 mb-2">Block User</h5>
            <p className="text-muted mb-4">
              Are you sure you want to block <strong>ProBuilds Express</strong>?
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                type="button" 
                className="btn btn-outline-dark rounded-3 px-4"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn bg-danger rounded-3 px-4 text-white"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Block
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Media Panel Component
const MediaPanel = ({ onClose }: { onClose: () => void }) => {
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

// ✅ Main Page Component
export default function ChatPage() {
  const [activePanel, setActivePanel] = useState<null | 'contact' | 'media'>(null);
  const [showSearchBarInChat, setShowSearchBarInChat] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const handleMenuClick = (panelType: 'contact' | 'media' | 'search') => {
    setActivePanel(null);
    setShowSearchBarInChat(false);
    if (panelType === 'contact' || panelType === 'media') {
      setActivePanel(panelType);
    } else if (panelType === 'search') {
      setShowSearchBarInChat(true);
    }
  };

  const closePanel = () => setActivePanel(null);
  const closeSearchBar = () => setShowSearchBarInChat(false);

  // Close all on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePanel(null);
        setShowSearchBarInChat(false);
        setShowBlockModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="sections overflow-hidden">
      <Header />

      <section className="chat-sec">
        <div className="container">
          <div className="chat-wrapper">
            {/* Sidebar */}
            <div className="sidebar">
              <div className="form-wrapper">
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src="/assets/img/icons/search-gray.svg"
                    width={18}
                    height={18}
                    alt="Search Icon"
                    loading="lazy"
                  />
                  <input
                    type="text"
                    placeholder="Search here"
                    className="form-control border-0 shadow-none"
                  />
                </div>
                <Link
                  href="#"
                  className="btn bg-transparent px-2 py-0 text-decoration-none border-0"
                >
                  <Image
                    src="/assets/img/icons/voice.svg"
                    width={18}
                    height={18}
                    alt="Voice Icon"
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="filter-tabs">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Unread</button>
                <button className="filter-btn">Read</button>
                <button className="filter-btn">Archived</button>
              </div>
              <div className="chat-list">
                {[
                  { id: 1, title: 'ProBuilds Express', preview: "You didn't get any ice cream?", time: 'Just Now', unread: 99 },
                  { id: 2, title: 'BuildRight Construction', preview: "You: Good Chris. I've taught you well...", time: '1hr ago' },
                  { id: 3, title: 'BrightSide Homes', preview: '✓ Not really, but will keep it', time: '1 day ago' },
                  { id: 4, title: 'Apex General Contractors', preview: 'Nothing just warming up', time: '2w ago' },
                  { id: 5, title: 'Horizon Homes Inc', preview: 'Tomorrow you have game get ready', time: '2w ago' },
                  { id: 6, title: 'SolidFrame Builders', preview: 'Keep going dear!', time: '2w ago' },
                  { id: 7, title: 'Prime Construction Co.', preview: "You: It was fantastic really enjoyed!", time: '1m ago' },
                ].map((item) => (
                  <div key={item.id} className={`chat-item ${item.id === 1 ? 'active' : ''}`}>
                    <div className="avatar">
                      <Image
                        src="/assets/img/icons/p-icon.svg"
                        width={40}
                        height={40}
                        alt="Icon"
                        loading="lazy"
                      />
                    </div>
                    <div className="chat-info">
                      <div className="chat-title">{item.title}</div>
                      <div className="chat-preview">{item.preview}</div>
                    </div>
                    <div className="chat-meta">
                      <div className="time">{item.time}</div>
                      {item.unread && <div className="unread-count">{item.unread}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="main-chat">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="avatar">
                    <Image
                      src="/assets/img/icons/p-icon.svg"
                      width={50}
                      height={50}
                      alt="Icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="chat-header-info">
                    <div className="chat-name">ProBuilds Express</div>
                    <div className="chat-time">Today at 3:30 PM</div>
                  </div>
                </div>
                <div className="chat-header-right">
                  <div className="dropdown-container">
                    <button className="more-options">⋯</button>
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={() => handleMenuClick('contact')}>
                        View contact
                      </div>
                      <div className="dropdown-item" onClick={() => handleMenuClick('search')}>
                        Search
                      </div>
                      <div className="dropdown-item" onClick={() => handleMenuClick('media')}>
                        Media
                      </div>
                      <div className="dropdown-item">Mute chat</div>
                      <div className="dropdown-item">Clear chat</div>
                      {/* ✅ Block User with Modal */}
                      <div 
                        className="dropdown-item danger" 
                        onClick={() => {
                          setActivePanel(null);
                          setShowSearchBarInChat(false);
                          setShowBlockModal(true);
                        }}
                      >
                        Block user
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              {showSearchBarInChat && (
                <div
                  className="d-flex align-items-center me-3"
                  style={{
                    maxWidth: '340px',
                    background: 'white',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    margin: '16px auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Image
                    src="/assets/img/icons/search-gray.svg"
                    width={18}
                    height={18}
                    alt="Search Icon"
                    loading="lazy"
                  />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="form-control border-0 shadow-none ms-2"
                    autoFocus
                    style={{
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.95rem',
                      flex: 1,
                      minWidth: 0,
                    }}
                  />
                  <button
                    className="btn p-0 ms-2"
                    onClick={closeSearchBar}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      lineHeight: 1,
                      color: '#888',
                    }}
                  >
                    &times;
                  </button>
                </div>
              )}

              <div className="chat-messages">
                {/* Incoming Message */}
                <div className="message incoming">
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="message-bubble-inner">
                        Hi! Yes, I'm available. Could you please share some details about the project?
                      </div>
                      <div className="message-meta">
                        <span className="message-time">21:34</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outgoing Message */}
                <div className="message outgoing">
                  <div className="message-content">
                    <div className="message-bubble">
                      Sure. It's a two-story home addition approximately 1,200 sq. ft. We need framing for the walls, roof, and interior partitions. Plans are ready in PDF format.
                      <div className="message-meta">
                        <span className="message-time">22:34</span>
                        <span className="message-status">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incoming Message */}
                <div className="message incoming">
                  <div className="message-content">
                    <div className="message-bubble">
                      Sounds good. When do you expect the work to start?
                      <div className="message-meta">
                        <span className="message-time">23:34</span>
                        <span className="message-status">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outgoing Audio Message */}
                <div className="message outgoing">
                  <div className="message-content">
                    <div className="audio-message">
                      <button style={{ padding: 0 }} className="play-btn">
                        <Image
                          src="/assets/img/play.png"
                          width={24}
                          height={24}
                          alt="Play"
                          loading="lazy"
                        />
                      </button>
                      <div className="audio-waveform">
                        <div className="wave">
                          {[...Array(15)].map((_, i) => (
                            <div key={i}></div>
                          ))}
                        </div>
                      </div>
                      <span className="audio-duration">00:16</span>
                      <div className="message-meta">
                        <span className="message-time">23:34</span>
                        <span className="message-status">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incoming File Message */}
                <div className="message incoming">
                  <div className="message-content">
                    <div className="file-message">
                      <div className="file-icon">
                        <Image
                          src="/assets/img/pdf-icon.svg"
                          width={24}
                          height={24}
                          alt="PDF"
                          loading="lazy"
                        />
                      </div>
                      <div className="file-info">
                        <div className="file-name">master_craftsman.pdf</div>
                        <div className="file-date">30 May 2024 at 4:36 pm</div>
                      </div>
                      <div className="message-meta">
                        <span className="message-time">13:34</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outgoing Text */}
                <div className="message outgoing">
                  <div className="message-content">
                    <div className="message-bubble">
                      We're aiming for November 3rd. The foundation will be complete by then, so framing can begin right after.
                      <div className="message-meta">
                        <span className="message-time">12:34</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incoming */}
                <div className="message incoming">
                  <div className="message-content">
                    <div className="message-bubble">
                      Perfect. Can you send over the framing plans so I can prepare an estimate?
                      <div className="message-meta">
                        <span className="message-time">23:34</span>
                        <span className="message-status">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outgoing File Message */}
                <div className="message outgoing">
                  <div className="message-content">
                    <div className="file-message">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <div className="file-name">master_craftsman.pdf</div>
                        <div className="file-date">30 May 2024 at 4:36 pm</div>
                      </div>
                      <button className="download-btn">↓</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="message-input">
                <div className="form-wrapper w-100 m-0">
                  <div className="d-flex align-items-center gap-2 w-100">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="form-control border-0 shadow-none"
                    />
                    <div className="d-flex align-items-center">
                      <Link
                        href="#"
                        className="btn bg-transparent px-3 border-0"
                      >
                        <Image
                          src="/assets/img/attachment.svg"
                          width={18}
                          height={18}
                          alt="Attachment"
                          loading="lazy"
                        />
                      </Link>
                      <Link
                        href="#"
                        className="btn bg-transparent px-3 border-0"
                      >
                        <Image
                          src="/assets/img/icons/voice.svg"
                          width={18}
                          height={18}
                          alt="Voice"
                          loading="lazy"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="input-actions">
                  <button className="send-btn">➤</button>
                </div>
              </div>
            </div>

            {/* Panels */}
            {activePanel === 'contact' && (
              <div className="contact-panel" style={{ minWidth: 300 }}>
                <button className="close-btn" onClick={closePanel}>&times;</button>
                <div className="card-2 p-4 text-center">
                  <Image
                    src="/assets/img/icons/p-icon.svg"
                    width={104}
                    height={104}
                    className="d-block mx-auto mb-3"
                    alt="P Icon"
                    loading="lazy"
                  />
                  <div className="title text-black fw-semibold fs-5 mb-2">
                    ProBuilds Express
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2">
                    <Image
                      src="/assets/img/icons/message-dark.svg"
                      width={20}
                      height={20}
                      alt="Email"
                      loading="lazy"
                    />
                    <a href="mailto:hello@example.com" className="text-dark fw-medium">
                      hello@example.com
                    </a>
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
                    <Image
                      src="/assets/img/icons/call-dark.svg"
                      width={20}
                      height={20}
                      alt="Phone"
                      loading="lazy"
                    />
                    <a href="tel:+10000000000" className="text-dark fw-medium">
                      (000) 000-0000
                    </a>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <a href="#" className="btn btn-outline-dark rounded-3 fs-14 text-dark">
                      <Image
                        src="/assets/img/icons/message-dark.svg"
                        width={20}
                        height={20}
                        alt="Chat Icon"
                        loading="lazy"
                      />
                      <span>Email</span>
                    </a>
                    <a href="#" className="btn btn-outline-dark rounded-3 fs-14 text-dark">
                      <Image
                        src="/assets/img/icons/call-dark.svg"
                        width={20}
                        height={20}
                        alt="Chat Icon"
                        loading="lazy"
                      />
                      <span>Phone</span>
                    </a>
                  </div>
                </div>

                <div className="contact-options p-4">
                  <div className="option d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>Media</span>
                    <Image
                      src="/assets/img/icons/arrow-dark.svg"
                      width={7}
                      height={11}
                      alt="icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="option d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>Search</span>
                    <Image
                      src="/assets/img/icons/arrow-dark.svg"
                      width={7}
                      height={11}
                      alt="icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="option d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>Mute</span>
                    <label className="mute-toggle">
                      <input type="checkbox" id="muteToggle" />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="option d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>Clear Chat</span>
                    <Image
                      src="/assets/img/icons/arrow-dark.svg"
                      width={7}
                      height={11}
                      alt="icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="option danger d-flex justify-content-between align-items-center py-2 text-danger">
                    <span>Block User</span>
                    <Image
                      src="/assets/img/icons/arrow-dark.svg"
                      width={7}
                      height={11}
                      alt="icon"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'media' && <MediaPanel onClose={closePanel} />}

            {/* ✅ Block Modal */}
            <BlockUserModal
              show={showBlockModal}
              onClose={() => setShowBlockModal(false)}
              onConfirm={() => {
                // ✅ Add your block logic here (e.g., API call)
                console.log('User blocked successfully');
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}