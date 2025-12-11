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

// Send message with optional attachment
export const sendMessageAPI = async (
    receiver_id: number,
    message: string,
    file?: File
): Promise<ChatMessage | null> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("receiver_id", receiver_id.toString());
    formData.append("message", message || "");
    if (file) {
        formData.append("attachments[0]", file, file.name);
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


export const capitalizeEachWord = (text: string): string => {
    if (!text) return "";
    return text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
