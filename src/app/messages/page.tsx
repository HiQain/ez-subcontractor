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
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentContractor, setCurrentContractor] = useState<Contractor | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDownload = () => {
    if (!previewImage) return;

    const a = document.createElement('a');
    a.href = previewImage;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

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

  const handleRateSubcontractor = async () => {
    if (!currentContractor || selectedRating === 0) return;

    setRatingLoading(true);
    setRatingError(null);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}common/rating/add`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            rated_user_id: currentContractor.id.toString(),
            rating: selectedRating.toString(),
            comment: comment.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Rating failed');
      }

      showToast('Rating submitted successfully');

      // 🔥 TEMPORARY COUNT INCREASE
      if (selectedUser) {
        setSelectedUser(prev => {
          if (!prev) return prev;

          const oldCount = prev.rating_count || 0;
          const oldAvg = Number(prev.average_rating) || 0;

          const newCount = oldCount + 1;
          const newAvg =
            ((oldAvg * oldCount) + selectedRating) / newCount;

          return {
            ...prev,
            rating_count: newCount,
            average_rating: newAvg.toFixed(1),
          };
        });
      }

      setIsRatingModalOpen(false);
      setCurrentContractor(null);
      setSelectedRating(0);
      setComment('');
    } catch (err: any) {
      setRatingError(err.message || 'Something went wrong');
    } finally {
      setRatingLoading(false);
    }
  };


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
                  const initials = (item.company_name || "?")
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
                          {capitalizeEachWord(item.company_name)}
                        </div>
                        <div className="chat-last-message">
                          {item.last_message}
                        </div>
                      </div>

                      <div className="chat-meta">
                        <div className="time">
                          {
                            item.last_message_time !== null
                              ? new Date(item.last_message_time).toLocaleDateString()
                              : new Date().toLocaleDateString()
                          }
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
                        {capitalizeEachWord(selectedUser.company_name)}
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
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setPreviewImage(att)}
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
                    {getInitials(selectedUser?.company_name)}
                  </div>

                  <div className="title text-black fw-semibold fs-5">
                    {capitalizeEachWord(selectedUser.company_name)}
                  </div>
                  <div className="title text-black fw-semibold fs-6 mb-2">
                    {capitalizeEachWord(selectedUser.name)}
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
                          {Number.isInteger(rating) ? rating : rating.toFixed(1)}/5 ({selectedUser?.rating_count})
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
                  {localStorage.getItem('role') === 'general_contractor' && (
                    <button
                      className="btn btn-warning rounded-3 d-flex align-items-center gap-2 px-4 py-2 fs-4 mt-2"
                      style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
                      onClick={() => {
                        setCurrentContractor(selectedUser);
                        setIsRatingModalOpen(true);
                      }}
                    >
                      <span>Rate Subcontractor</span>
                    </button>
                  )}
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

            {/* Image Modal */}
            {/* Image Preview Modal */}
            {previewImage && (
              <>
                <div
                  className="modal-backdrop show"
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 2000,
                  }}
                  onClick={() => setPreviewImage(null)}
                />

                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2100,
                    maxWidth: '90%',
                    maxHeight: '90%',
                    background: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      borderRadius: '8px',
                    }}
                  />

                  <div className="mt-3 d-flex justify-content-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="btn btn-primary"
                    >
                      Download
                    </button>
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setPreviewImage(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Rating Modal */}
            {isRatingModalOpen && currentContractor && (
              <div className="modal-backdrop show" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}></div>
            )}
            {isRatingModalOpen && currentContractor && (
              <div
                className="modal show d-block"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1060,
                  maxWidth: '400px',
                  width: '90%',
                  height: '330px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <div className="modal-header border-0 mb-0 py-0 px-0">
                  <h5 className="modal-title text-center w-100 mb-0 py-0 px-0">Rate Now</h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => {
                      setIsRatingModalOpen(false);
                      setCurrentContractor(null);
                      setSelectedRating(0);
                      setComment('');
                      setRatingError(null);
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-center">
                  {/* Avatar */}
                  <img
                    src="/assets/img/placeholder-round.png"
                    alt="Contractor"
                    className="rounded-circle mb-1"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <h6 className="mb-1 text-capitalize">{currentContractor.name}</h6>
                  <h6 className="mb-1 text-capitalize text-primary">{currentContractor.company_name}</h6>
                  <h6 className="mb-1 text-capitalize">{currentContractor.zip}</h6>
                  {/* Star Rating */}
                  <div className="d-flex justify-content-center align-items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="border-0 bg-transparent p-0"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => { }}
                        style={{ cursor: 'pointer' }}
                      >
                        <Image
                          src={
                            star <= selectedRating
                              ? '/assets/img/start1.svg'
                              : star <= selectedRating + 0.5
                                ? '/assets/img/star2.svg'
                                : '/assets/img/star-empty.svg'
                          }
                          width={32}
                          height={32}
                          alt={`Star ${star}`}
                          className="mx-1"
                        />
                      </button>
                    ))}
                  </div>
                  {ratingError && (
                    <div className="alert alert-danger mt-2 p-2 mb-3 text-start">
                      {ratingError}
                    </div>
                  )}
                  {/* Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-dark justify-content-center w-50 rounded-2"
                      onClick={() => {
                        setIsRatingModalOpen(false);
                        setCurrentContractor(null);
                        setSelectedRating(0);
                        setComment('');
                        setRatingError(null);
                      }}
                      disabled={ratingLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary w-50 justify-content-center rounded-2"
                      style={{ height: 50 }}
                      onClick={handleRateSubcontractor}
                      disabled={ratingLoading || selectedRating === 0}
                    >
                      {ratingLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        'Done'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section >
    </div >
  );
}
