// api/chat.ts
export interface ChatMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    attachment: any[];
    created_at: string;
}

export interface Contractor {
    id: number;
    name: string;
    company_name: string;
    city: string | null;
    state: string | null;
    average_rating: string;
    ratings_count: string;
    created_at: string;
}

// Get contractors
export const getContractors = async (): Promise<Contractor[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/contractors?page=1&perPage=2000`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
        },
    });
    const data = await res.json();
    return data?.data?.data || [];
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

// Send message
export const sendMessageAPI = async (receiver_id: number, message: string): Promise<ChatMessage | null> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/chat/send-message`, {
        method: "POST",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiver_id, message }),
    });
    const data = await res.json();
    return data?.data || null;
};
