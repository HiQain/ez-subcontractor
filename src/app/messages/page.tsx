'use client';

import Image from 'next/image';
import Header from '../components/Header';
import '../../styles/chat.css';
import '../../styles/chat-1.css';
import '../../styles/chat-2.css';
import { useEffect, useRef, useState } from 'react';
import { capitalizeEachWord, ChatMessage, clearChatAPI, Contractor, getContractors, getInitials, getMessages, sendMessageAPI } from '../api/chat';
import { subscribeToChatChannel, unsubscribeFromChatChannel } from '../api/userChatPusher';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '../../utils/appToast';

export default function ChatPage() {
  const router = useRouter();
  const chatNowHandledRef = useRef(false);

  const [results, setResults] = useState<Contractor[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<Contractor | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [activePanel, setActivePanel] = useState<null | 'contact' | 'media'>(null);
  const [showSearchBarInChat, setShowSearchBarInChat] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [chatUserName, setChatUserName] = useState<string | null>(null);
  const [chatUserEmail, setChatUserEmail] = useState<string | null>(null);
  const [chatUserPhone, setChatUserPhone] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<string | null>(null);
  const [zip, setZip] = useState<string | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(null);
  const [chatUserCompanyName, setChatUserCompanyName] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    setChatUserId(params.get('userId'));
    setChatUserName(params.get('name'));
    setChatUserEmail(params.get('email'));
    setChatUserPhone(params.get('phone'));
    setChatUserCompanyName(params.get('companyName'));
    setAverageRating(params.get('average_rating'));
    setZip(params.get('zip'));
    setRatingCount(parseInt(params.get('rating_count')));
  }, []);

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

  useEffect(() => {
    getContractors().then(apiUsers => {
      setResults(prev => {
        const existingIds = new Set(prev.map(u => u.id));

        const merged = [
          ...prev,
          ...apiUsers.filter(u => !existingIds.has(u.id)),
        ];

        return merged;
      });
    });
  }, []);

  const loadMessages = async (chatId: number) => {
    setLoadingMessages(true);
    try {
      const msgs = await getMessages(chatId);

      setMessages(prev => {
        const tempMsgs = prev.filter(
          m => m.sending && m.receiver_id === chatId
        );

        // ✅ API messages first, temp messages last
        return [...msgs, ...tempMsgs];
      });

    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!selectedChatId) return;

    const channel = subscribeToChatChannel(selectedChatId, (msg: any) => {
      setMessages((prev) => [...prev, msg]);

      setResults(prev =>
        Array.isArray(prev)
          ? prev.map(user =>
            user.id === selectedChatId
              ? {
                ...user,
                last_message: msg.message || "📎 Attachment",
                last_message_time: msg.created_at,
              }
              : user
          )
          : prev
      );
    });

    return () => {
      unsubscribeFromChatChannel(selectedChatId);
    };
  }, [selectedChatId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!selectedChatId || loadingMessages) return;
    if (!selectedChatId) return;
    if ((!messageText || messageText.trim() === "") && files.length === 0) return;

    const tempId = Date.now();

    const tempMessage: ChatMessage = {
      id: tempId,
      sender_id: 0,
      receiver_id: selectedChatId,
      message: messageText,
      attachment: files.map(f => URL.createObjectURL(f)),
      created_at: new Date().toISOString(),
      sending: true,
    };

    // Append temp message
    setMessages(prev => [...prev, tempMessage]);

    // Update last message in sidebar
    setResults(prev =>
      prev.map(user =>
        user.id === selectedChatId
          ? {
            ...user,
            last_message: messageText || (files.length > 0 ? "📎 Attachment" : ""),
            last_message_time: new Date().toISOString(),
          }
          : user
      )
    );

    setMessageText("");
    setFiles([]);

    try {
      const sentMsg = await sendMessageAPI(selectedChatId, messageText, files);
      // Replace temp message with real message if API returns it
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? { ...sentMsg, sending: false } : msg))
      );
    } catch (error) {
      console.error("Send message error:", error);
      // Remove temp message if failed
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const filteredResults = Array.isArray(results)
    ? results.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const filteredMessages = messages.filter(msg => {
    if (!messageSearchTerm.trim()) return true;
    if (msg.message?.toLowerCase().includes(messageSearchTerm.toLowerCase())) {
      return true;
    }
    return false;
  });

  const handleClearChat = async () => {
    if (!selectedChatId || messages.length === 0) return;

    setMessages([]);

    setResults(prev =>
      prev.map(user =>
        user.id === selectedChatId
          ? {
            ...user,
            last_message: '',
          }
          : user
      )
    );

    showToast('Chat cleared successfully!')

    try {
      await clearChatAPI(selectedChatId);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  useEffect(() => {
    if (!chatUserId) return;

    const userId = Number(chatUserId);

    setResults(prev => {
      const exists = prev.find(u => u.id === userId);
      if (exists) return prev;

      const incomingUser: Contractor = {
        id: userId,
        name: chatUserName || 'Unknown',
        email: chatUserEmail || '',
        phone: chatUserPhone || '',
        last_message: '',
        last_message_time: new Date().toISOString(),
        created_at: new Date().toISOString(),
        company_name: chatUserCompanyName,
        average_rating: averageRating,
        rating_count: ratingCount,
        zip: zip,
      };

      return [incomingUser, ...prev];
    });
  }, [chatUserId]);

  useEffect(() => {
    if (!chatUserId || results.length === 0) return;
    if (chatNowHandledRef.current) return; // ✅ sirf 1 baar

    const userId = Number(chatUserId);
    const user = results.find(u => u.id === userId);

    if (!user) return;

    chatNowHandledRef.current = true;

    setSelectedChatId(userId);
    setSelectedUser(user);
    loadMessages(userId);

    // ✅ URL clean — taake dobara effect trigger na ho
    router.replace('/messages');

  }, [chatUserId, results, router]);

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (userRole === 'general_contractor') {
      const token = localStorage.getItem('token');

      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            }
          );

          if (!response.ok) throw new Error('Failed to fetch profile');

          const data = await response.json();
          const subId = data?.data?.subscription_id || null;

          setSubscriptionId(subId);
        } catch (err) {
          console.error('Profile fetch error:', err);
        } finally {
          setProfileLoaded(true);
        }
      };
      fetchProfile();
    } else {
      setProfileLoaded(true);
    }
  }, [router]);

  if (!profileLoaded) {
    return (
      <>
        <Header />
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{ height: 'calc(90vh - 80px)' }}
        >
          <div className="spinner-border text-primary" />
        </div>
      </>
    );
  }

  if (!subscriptionId && localStorage.getItem('role') === 'general_contractor') {
    return (
      <>
        <Header />
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{ height: 'calc(90vh - 80px)' }}
        >
          <Image
            src="/assets/img/post.webp"
            width={120}
            height={120}
            alt="No subscription"
          />
          <p className="text-muted mt-3">
            You need a subscription to rate and view contractor reviews.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => router.push('/subscription-list')}
          >
            View Plans
          </button>
        </div>
      </>
    );
  }

  const rating = Number(selectedUser?.average_rating);
  const hasValidRating = !isNaN(rating) && rating > 0;

  return (
    <div className="sections overflow-hidden">
      <Header />

      <section className="chat-sec">
        <div className="container">
          <div className={`chat-wrapper ${selectedChatId ? 'chat-open' : ''}`}>

            {/* SidebarSubcontractor */}
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="chat-list">
                {filteredResults.map((item) => {
                  const initials = (item.name || "?")
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={item.id}
                      className={`chat-item ${selectedChatId === item.id ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedChatId === item.id) return;
                        setMessages([]);
                        setLoadingMessages(false);
                        setSelectedChatId(item.id);
                        setSelectedUser(item);
                        loadMessages(item.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="avatar">
                        <div className="initials-circle">
                          {initials}
                        </div>
                      </div>

                      <div className="chat-info">
                        <div className="chat-title">
                          {capitalizeEachWord(item.name)}
                        </div>
                        <div className="chat-last-message">
                          {item.last_message}
                        </div>
                      </div>

                      <div className="chat-meta">
                        <div className="time">
                          {new Date(item.last_message_time).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredResults.length === 0 && (
                  <div className="text-center p-4">No results found</div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="main-chat">

              {/* Dynamic Header */}
              <div className="chat-header">
                {selectedUser ? (
                  <div className="chat-header-left">
                    {/* 🔙 Mobile Back Button */}
                    <button
                      className="mobile-back-btn"
                      onClick={() => {
                        setSelectedChatId(null);
                        setSelectedUser(null);
                        setMessages([]);
                      }}
                    >
                      ←
                    </button>

                    <div className="chat-header-info">
                      <div className="chat-name">
                        {capitalizeEachWord(selectedUser.name)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-header-left">
                    <div className="chat-header-info">
                      <div className="chat-name">Select a user to start chat</div>
                      <div className="chat-time">Select a user to start chat</div>
                    </div>
                  </div>
                )}

                {selectedUser && (
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
                        {/* <div className="dropdown-item" onClick={() => handleMenuClick('media')}>
                          Media
                        </div> */}
                        {/* <div className="dropdown-item">Mute chat</div> */}
                        <div className="dropdown-item" onClick={handleClearChat}>Clear chat</div>
                        {/* <div
                        className="dropdown-item danger"
                        onClick={() => {
                          setActivePanel(null);
                          setShowSearchBarInChat(false);
                          setShowBlockModal(true);
                        }}
                      >
                        Block user
                      </div> */}
                      </div>
                    </div>
                  </div>
                )}
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
                    value={messageSearchTerm}
                    onChange={(e) => setMessageSearchTerm(e.target.value)}
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

              {/* Chat Messages */}
              <div className="chat-messages" ref={chatMessagesRef}>
                {selectedUser ? (
                  loadingMessages && messages.length === 0 ? (
                    <div className="text-center p-4">Loading messages...</div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="text-center p-4">No messages found</div>
                  ) : (
                    filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender_id === selectedChatId ? 'incoming' : 'outgoing'}`}
                      >
                        <div className="message-content" style={{
                          minWidth: '80px'
                        }}>
                          <div className="message-bubble">
                            {/* Attachments first */}
                            {msg.attachment && msg.attachment.length > 0 && (
                              <div className="message-attachments mb-2">
                                {msg.attachment.map((att, index) => (
                                  <Image
                                    key={index}
                                    src={att}
                                    alt={`attachment-${index}`}
                                    width={200}
                                    height={200}
                                    className="rounded-md"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Text below image */}
                            {msg.message && <div className="message-text">{msg.message}</div>}

                            <div className="message-meta">
                              <span className="message-time">
                                {new Date(msg.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))
                  )
                ) : (
                  <div className="text-center p-4">Select a user to start chat</div>
                )}
              </div>

              {/* 🔥 SHOW ATTACHMENT PREVIEW HERE */}
              {selectedUser && files.length > 0 && (
                <div className="message-input">
                  {files.length > 0 && (
                    <div className="attachments-preview p-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="preview-item d-flex align-items-center gap-2 mb-1">
                          <span>📎 {file.name}</span>
                          <button
                            className="remove-attachment"
                            onClick={() => {
                              setFiles(files.filter((_, i) => i !== idx));
                              const fileInput = document.getElementById("fileInput") as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message Input */}
              {selectedUser && (
                <div className="message-input">
                  <div className="form-wrapper w-100 m-0">
                    <div className="d-flex align-items-center gap-2 w-100">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="form-control border-0 shadow-none"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />

                      <div className="btn bg-transparent px-3 border-0" onClick={() => document.getElementById("fileInput")?.click()}>
                        <Image
                          src="/assets/img/attachment.svg"
                          width={18}
                          height={18}
                          alt="Attachment"
                          loading="lazy"
                        />
                      </div>

                      <input
                        id="fileInput"
                        type="file"
                        multiple
                        className="d-none"
                        onChange={(e) => {
                          if (e.target.files) {
                            setFiles(Array.from(e.target.files));
                          }
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </div>

                  <div className="input-actions">
                    <button className="send-btn" onClick={sendMessage}>➤</button>
                  </div>
                </div>
              )}

            </div>

            {/* Panels */}
            {activePanel === 'contact' && (
              <div className="contact-panel" style={{ minWidth: 300 }}>
                <button className="close-btn" onClick={closePanel}>&times;</button>
                <div className="card-2 p-4 text-center">
                  <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: 104,
                      height: 104,
                      borderRadius: '50%',
                      background: '#C8DA2A',
                      color: '#111',
                      fontSize: '32px',
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(selectedUser?.name)}
                  </div>

                  <div className="title text-black fw-semibold fs-5">
                    {capitalizeEachWord(selectedUser.name)}
                  </div>
                  <div className="title text-black fw-semibold fs-6 mb-2">
                    {capitalizeEachWord(selectedUser.company_name)}
                  </div>
                  <div className="title text-black fw-semibold fs-6 mb-2">
                    {selectedUser.zip}
                  </div>

                  {hasValidRating && (
                    <div className="d-flex align-items-center flex-wrap justify-content-center mb-2">
                      <div className="rating-icons d-flex align-items-center gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, j) => {
                            const starValue = j + 1;
                            const isFull = starValue <= Math.floor(rating);
                            const isHalf = !isFull && starValue <= rating + 0.5;

                            return (
                              <Image
                                key={j}
                                src={
                                  isFull
                                    ? '/assets/img/start1.svg'
                                    : isHalf
                                      ? '/assets/img/star2.svg'
                                      : '/assets/img/star-empty.svg'
                                }
                                width={14}
                                height={14}
                                alt="Star Icon"
                                loading="lazy"
                              />
                            );
                          })}
                      </div>

                      <div className="content" style={{ marginLeft: '5px' }}>
                        <div className="fs-12">
                          {rating.toFixed(1)}/5 ({selectedUser?.rating_count})
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2">
                    <Image
                      src="/assets/img/icons/message-dark.svg"
                      width={20}
                      height={20}
                      alt="Email"
                      loading="lazy"
                    />
                    <a href={`mailto:${selectedUser.email}`} className="text-dark fw-medium">
                      {selectedUser.email}
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
                    <a href={`tel:${selectedUser.phone}`} className="text-dark fw-medium">
                      {selectedUser.phone}
                    </a>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <Link href={`mailto:${selectedUser.email}`} className="btn btn-outline-dark rounded-3 fs-14 text-dark">
                      <Image
                        src="/assets/img/icons/message-dark.svg"
                        width={20}
                        height={20}
                        alt="Chat Icon"
                        loading="lazy"
                      />
                      <span className='p-1'>Email</span>
                    </Link>
                    <Link href={`tel:${selectedUser.phone}`} className="btn btn-outline-dark rounded-3 fs-14 text-dark">
                      <Image
                        src="/assets/img/icons/call-dark.svg"
                        width={20}
                        height={20}
                        alt="Chat Icon"
                        loading="lazy"
                      />
                      <span className='p-1'>Phone</span>
                    </Link>
                  </div>
                </div>

                {/* <div className="contact-options p-4">
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
                </div> */}
              </div>
            )}

            {/* {activePanel === 'media' && <MediaPanel onClose={closePanel} />} */}

            {/* ✅ Block Modal */}

            {/* <BlockUserModal
              show={showBlockModal}
              onClose={() => setShowBlockModal(false)}
              onConfirm={() => {
                // ✅ Add your block logic here (e.g., API call)
                console.log('User blocked successfully');
              }}
            /> */}

          </div>
        </div>
      </section >
    </div >
  );
}
