import Pusher from "pusher-js";

let pusher: Pusher | null = null;

export const initPusher = () => {
    if (!pusher) {
        pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: "https://ezsubcontractor.designspartans.com/broadcasting/auth",
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        });
    }
    return pusher;
};

export const subscribeToChatChannel = (
    chatId: number,
    onMessage: (data: any) => void
) => {
    const pusherInstance = initPusher();
    const channel = pusherInstance.subscribe(`chat.${chatId}`);

    channel.bind("message-sent", (data: any) => {
        onMessage(data);
    });

    return channel;
};

export const unsubscribeFromChatChannel = (chatId: number) => {
    if (pusher) {
        pusher.unsubscribe(`chat.${chatId}`);
    }
};
