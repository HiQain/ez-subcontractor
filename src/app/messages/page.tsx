// 'use client';

// import Image from 'next/image';
// import Link from "next/link";
// import Header from './../../components/Header';
// import '../../../styles/chat.css';
// import { useEffect, useState } from 'react';

// interface Contractor {
//   id: number;
//   name: string;
//   company_name: string;
//   city: string | null;
//   state: string | null;
//   average_rating: string;
//   ratings_count: string;
//   created_at: string;
// }

// interface ChatMessage {
//   id: number;
//   sender_id: number;
//   receiver_id: number;
//   message: string;
//   attachment: any[];
//   created_at: string;
// }

// export default function ChatPage() {
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [results, setResults] = useState<Contractor[]>([]);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);


//   useEffect(() => {
//     getUsers();
//   }, []);

//   const getUsers = async () => {
//     setSearchLoading(true);

//     try {
//       const token = localStorage.getItem('token');

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors?page=1&perPage=2000`,
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : '',
//             Accept: 'application/json',
//           },
//         }
//       );

//       const data = await res.json();
//       const contractors = data?.data?.data || [];

//       console.log(contractors);
//       setResults(contractors);
//     } catch (error) {
//       console.error('Search failed:', error);
//       setResults([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const getMessages = async (chatId: number) => {
//     setLoadingMessages(true);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}common/chat/messages/${chatId}`,
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             Accept: "application/json",
//           },
//         }
//       );

//       const data = await res.json();
//       setMessages(data?.data || []);
//       console.log(messages);
//     } catch (err) {
//       console.error("Failed to load messages:", err);
//       setMessages([]);
//     } finally {
//       setLoadingMessages(false);
//     }
//   };


//   return (
//     <div className="sections overflow-hidden">
//       <Header />

//       <section className="chat-sec">
//         <div className="container">
//           <div className="chat-wrapper">

//             {/* Sidebar */}
//             <div className="sidebar">
//               <div className="form-wrapper">
//                 <div className="d-flex align-items-center gap-2">
//                   <Image
//                     src="/assets/img/icons/search-gray.svg"
//                     width={18}
//                     height={18}
//                     alt="Search Icon"
//                     loading="lazy"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search here"
//                     className="form-control border-0 shadow-none"
//                   />
//                 </div>

//                 <Link
//                   href={'#'}
//                   className="btn bg-transparent px-2 py-0 text-decoration-none border-0"
//                 >
//                   <Image
//                     src="/assets/img/icons/voice.svg"
//                     width={18}
//                     height={18}
//                     alt="Voice Icon"
//                     loading="lazy"
//                   />
//                 </Link>
//               </div>

//               <div className="filter-tabs">
//                 <button className="filter-btn active">All</button>
//                 <button className="filter-btn">Unread</button>
//                 <button className="filter-btn">Read</button>
//                 <button className="filter-btn">Archived</button>
//               </div>

//               <div className="chat-list">
//                 {results.length === 0 && !searchLoading && (
//                   <div className="text-center py-4 text-muted">
//                     No contractors found
//                   </div>
//                 )}

//                 {searchLoading && (
//                   <div className="text-center py-4 text-muted">
//                     Loading...
//                   </div>
//                 )}

//                 {results.map((item) => {
//                   const initials = (item.company_name || item.name || "?")
//                     .split(" ")
//                     .map(word => word[0])
//                     .join("")
//                     .toUpperCase()
//                     .slice(0, 2);

//                   return (
//                     <div
//                       key={item.id}
//                       className="chat-item"
//                       onClick={() => {
//                         setSelectedChatId(item.id);
//                         getMessages(item.id);
//                       }}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <div className="avatar">
//                         <div className="initials-circle">
//                           {initials}
//                         </div>
//                       </div>

//                       {/* Info Section */}
//                       <div className="chat-info">
//                         <div className="chat-title">
//                           {item.company_name || item.name}
//                         </div>
//                       </div>

//                       {/* Meta */}
//                       <div className="chat-meta">
//                         <div className="time">
//                           {new Date(item.created_at).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}

//               </div>
//             </div>

//             {/* Main Chat Area */}
//             <div className="main-chat">
//               <div className="chat-header">
//                 <div className="chat-header-left">
//                   <div className="avatar">
//                     <Image
//                       src="/assets/img/icons/p-icon.svg"
//                       width={50}
//                       height={50}
//                       alt="Icon"
//                       loading="lazy"
//                     />
//                   </div>
//                   <div className="chat-header-info">
//                     <div className="chat-name">ProBuilds Express</div>
//                     <div className="chat-time">Today at 3:30 PM</div>
//                   </div>
//                 </div>

//                 <div className="chat-header-right">
//                   <div className="dropdown-container">
//                     <button className="more-options">⋯</button>
//                     <div className="dropdown-menu">
//                       <div className="dropdown-item">View contact</div>
//                       <div className="dropdown-item">Search</div>
//                       <div className="dropdown-item">Media</div>
//                       <div className="dropdown-item">Mute chat</div>
//                       <div className="dropdown-item">Clear chat</div>
//                       <div className="dropdown-item danger">Block user</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Chat Messages */}
//               <div className="chat-messages">
//                 {/* Incoming Message */}
//                 <div className="message incoming">
//                   <div className="message-content">
//                     <div className="message-bubble">
//                       <div className="message-bubble-inner">
//                         Hi! Yes, I'm available. Could you please share some details about the project?
//                       </div>
//                       <div className="message-meta">
//                         <span className="message-time">21:34</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Outgoing Message */}
//                 <div className="message outgoing">
//                   <div className="message-content">
//                     <div className="message-bubble">
//                       Sure. It's a two-story home addition approximately 1,200 sq. ft. We need framing for the walls, roof, and interior partitions. Plans are ready in PDF format.
//                       <div className="message-meta">
//                         <span className="message-time">22:34</span>
//                         <span className="message-status">✓</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Incoming Message */}
//                 <div className="message incoming">
//                   <div className="message-content">
//                     <div className="message-bubble">
//                       Sounds good. When do you expect the work to start?
//                       <div className="message-meta">
//                         <span className="message-time">23:34</span>
//                         <span className="message-status">✓</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Outgoing Audio Message */}
//                 <div className="message outgoing">
//                   <div className="message-content">
//                     <div className="audio-message">
//                       <button style={{ padding: 0 }} className="play-btn">
//                         <Image
//                           src="/assets/img/play.png"
//                           width={24}
//                           height={24}
//                           alt="Play"
//                           loading="lazy"
//                         />
//                       </button>

//                       <div className="audio-waveform">
//                         <div className="wave">
//                           {[...Array(15)].map((_, i) => (
//                             <div key={i}></div>
//                           ))}
//                         </div>
//                       </div>

//                       <span className="audio-duration">00:16</span>

//                       <div className="message-meta">
//                         <span className="message-time">23:34</span>
//                         <span className="message-status">✓</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Incoming File Message */}
//                 <div className="message incoming">
//                   <div className="message-content">
//                     <div className="file-message">
//                       <div className="file-icon">
//                         <Image
//                           src="/assets/img/pdf-icon.svg"
//                           width={24}
//                           height={24}
//                           alt="Search"
//                           loading="lazy"
//                         />
//                       </div>
//                       <div className="file-info">
//                         <div className="file-name">master_craftsman.pdf</div>
//                         <div className="file-date">30 May 2024 at 4:36 pm</div>
//                       </div>

//                       <div className="message-meta">
//                         <span className="message-time">13:34</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Outgoing Text */}
//                 <div className="message outgoing">
//                   <div className="message-content">
//                     <div className="message-bubble">
//                       We're aiming for November 3rd. The foundation will be complete by then, so framing can begin right after.
//                       <div className="message-meta">
//                         <span className="message-time">12:34</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Incoming */}
//                 <div className="message incoming">
//                   <div className="message-content">
//                     <div className="message-bubble">
//                       Perfect. Can you send over the framing plans so I can prepare an estimate?
//                       <div className="message-meta">
//                         <span className="message-time">23:34</span>
//                         <span className="message-status">✓</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Outgoing File Message */}
//                 <div className="message outgoing">
//                   <div className="message-content">
//                     <div className="file-message">
//                       <div className="file-icon">📄</div>
//                       <div className="file-info">
//                         <div className="file-name">master_craftsman.pdf</div>
//                         <div className="file-date">30 May 2024 at 4:36 pm</div>
//                       </div>
//                       <button className="download-btn">↓</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="message-input">
//                 <div className="form-wrapper w-100 m-0">
//                   <div className="d-flex align-items-center gap-2 w-100">
//                     <input
//                       type="text"
//                       placeholder="Type a message..."
//                       className="form-control border-0 shadow-none"
//                     />

//                     <div className="d-flex align-items-center">
//                       <Link href={'#'} className="btn bg-transparent px-3 border-0">
//                         <Image
//                           src="/assets/img/attachment.svg"
//                           width={18}
//                           height={18}
//                           alt="Attachment"
//                           loading="lazy"
//                         />
//                       </Link>

//                       <Link href={'#'} className="btn bg-transparent px-3 border-0">
//                         <Image
//                           src="/assets/img/icons/voice.svg"
//                           width={18}
//                           height={18}
//                           alt="Voice"
//                           loading="lazy"
//                         />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="input-actions">
//                   <button className="send-btn">➤</button>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


'use client';

import Image from 'next/image';
import Header from '../components/Header';
import '../../styles/chat.css';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage, Contractor, getContractors, getMessages, sendMessageAPI } from '../api/chat';
import { subscribeToChatChannel, unsubscribeFromChatChannel } from '../api/userChatPusher';

export default function ChatPage() {
  const [results, setResults] = useState<Contractor[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<Contractor | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getContractors().then(setResults);
  }, []);

  const loadMessages = async (chatId: number) => {
    setLoadingMessages(true);
    try {
      const msgs = await getMessages(chatId);
      setMessages(msgs);
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
    if (!selectedChatId || !messageText.trim()) return;

    // Optimistic UI
    const tempMessage: ChatMessage = {
      id: Date.now(),
      sender_id: 0,
      receiver_id: selectedChatId!,
      message: messageText,
      attachment: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    // API call
    const savedMessage = await sendMessageAPI(selectedChatId, tempMessage.message);
    if (savedMessage) {
      // Optionally replace tempMessage with real API message
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? savedMessage : msg))
      );
    }
  };

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
              </div>

              <div className="chat-list">

                {results.map((item) => {
                  const initials = (item.name || "?")
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={item.id}
                      className="chat-item"
                      onClick={() => {
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
                          {item.name}
                        </div>
                      </div>

                      <div className="chat-meta">
                        <div className="time">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Main Chat Area */}
            <div className="main-chat">

              {/* Dynamic Header */}
              <div className="chat-header">
                {selectedUser ? (
                  <div className="chat-header-left">
                    <div className="chat-header-info">
                      <div className="chat-name">{selectedUser.name}</div>
                      <div className="chat-time">
                        {new Date(selectedUser.created_at).toLocaleString()}
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
              </div>

              {/* Chat Messages */}
              <div className="chat-messages" ref={chatMessagesRef}>
                {selectedUser ? (
                  loadingMessages ? (
                    <div className="text-center p-4">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-4">No messages</div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender_id === selectedChatId ? 'incoming' : 'outgoing'}`}
                      >
                        <div className="message-content">
                          <div className="message-bubble">
                            {msg.message}
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

              {/* Message Input */}
              {selectedUser && (
                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="form-control border-0 shadow-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button className="send-btn" onClick={sendMessage}>➤</button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
