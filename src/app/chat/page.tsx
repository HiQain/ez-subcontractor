// app/chat/page.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Header from './../components/Header';
import '../../styles/chat.css';
import Link from "next/link";


export default function ChatPage() {
  // Optional: Agar koi JS behavior chahiye ho (jaise dropdown, waveform, etc.), yahan useEffect mein handle karein

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
                  <input type="text" placeholder="Search here" className="form-control border-0 shadow-none" />
                </div>
                <Link
                    href={'#'}
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
                      <div className="dropdown-item">View contact</div>
                      <div className="dropdown-item">Search</div>
                      <div className="dropdown-item">Media</div>
                      <div className="dropdown-item">Mute chat</div>
                      <div className="dropdown-item">Clear chat</div>
                      <div className="dropdown-item danger">Block user</div>
                    </div>
                  </div>
                </div>
              </div>

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
                            alt="Search"
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

              {/* Message Input */}
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
                          href={'#'}
                          className="btn bg-transparent px-3 border-0"
                      >
                        <Image
                            src="/assets/img/attachment.svg"
                            width={18}
                            height={18}
                            alt="Search"
                            loading="lazy"
                        />
                      </Link>
                      <Link
                          href={'#'}
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
          </div>
        </div>
      </section>

    </div>
  );
}