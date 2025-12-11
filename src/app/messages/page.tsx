'use client';

import Image from 'next/image';
import Header from '../components/Header';
import '../../styles/chat.css';
import { useEffect, useRef, useState } from 'react';
import { capitalizeEachWord, ChatMessage, Contractor, getContractors, getMessages, sendMessageAPI } from '../api/chat';
import { subscribeToChatChannel, unsubscribeFromChatChannel } from '../api/userChatPusher';

export default function ChatPage() {
  const [results, setResults] = useState<Contractor[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<Contractor | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<File[]>([]);

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
    if (!selectedChatId || (!messageText.trim() && files.length === 0)) return;

    const tempMessage: ChatMessage = {
      id: Date.now(),
      sender_id: 0,
      receiver_id: selectedChatId!,
      message: messageText,
      attachment: files.map(f => URL.createObjectURL(f)),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");
    setFiles([]);

    const savedMessage = await sendMessageAPI(selectedChatId, messageText, files);
    if (savedMessage) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? savedMessage : msg))
      );
    }
  };

  const filteredResults = results.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      </div>

                      <div className="chat-meta">
                        <div className="time">
                          {new Date(item.created_at).toLocaleDateString()}
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
                    <div className="chat-header-info">
                      <div className="chat-name">{capitalizeEachWord(selectedUser.name)}</div>
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
              {selectedUser && (
                <div className="message-input">
                  {files.length > 0 && (
                    <div className="attachments-preview p-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="preview-item d-flex align-items-center gap-2 mb-1">
                          <span>📎 {file.name}</span>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              setFiles(files.filter((_, i) => i !== idx));
                            }}
                          >
                            x
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
          </div>
        </div>
      </section>
    </div>
  );
}
