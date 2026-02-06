// api/chat.ts
export interface ChatMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    attachment: any[];
    created_at: string;
    sending?: boolean;
}

export interface Contractor {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    created_at: string;
    last_message: string | null;
    last_message_time: string | null;
    average_rating: string;
    zip: string;
    rating_count: number;
    unread_count: number;
}

// Get contractors
export const getContractors = async (): Promise<Contractor[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/chat/users`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
        },
    });
    const data = await res.json();
    return Array.isArray(data?.data?.data) ? data.data?.data : [];
};

// Get messages
export const getMessages = async (chatId: number): Promise<ChatMessage[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/chat/messages/${chatId}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
        },
    });
    const data = await res.json();
    return Array.isArray(data?.data?.data) ? data.data.data : [];
};

// Mark as read
export const markUnreadMessages = async (senderId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}common/chat/mark-unread-messages/${senderId}`,
        {
            method: "GET",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                Accept: "application/json",
            },
        }
    );
    return res.json();
};

// Send message with optional attachment
export const sendMessageAPI = async (
    receiver_id: number,
    message: string,
    files?: File[]
): Promise<ChatMessage | null> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("receiver_id", receiver_id.toString());
    formData.append("message", message || "");

    if (files && files.length > 0) {
        files.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file, file.name);
        });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/chat/send-message`, {
        method: "POST",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
        },
        body: formData,
    });

    const data = await res.json();
    return data?.data || null;
};

// Clear chat messages
export const clearChatAPI = async (chatId: number): Promise<boolean> => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/chat/clear/${chatId}`, {
            method: "DELETE",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                Accept: "application/json",
            },
        });
        const data = await res.json();
        return data?.success || false;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export const capitalizeEachWord = (text: string): string => {
    if (!text) return "";
    return text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const getInitials = (name?: string) =>
    name
        ? name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '?';
