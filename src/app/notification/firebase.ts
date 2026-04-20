import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDFhuWjxhqeB-AnduOD7Ho2fdTORNHpKYs",
    authDomain: "ez-subcontractor.firebaseapp.com",
    projectId: "ez-subcontractor",
    storageBucket: "ez-subcontractor.firebasestorage.app",
    messagingSenderId: "900367896212",
    appId: "1:900367896212:web:d1122497083f86e284ae81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging =
    typeof window !== "undefined" ? getMessaging(app) : null;

export const generateToken = async () => {
    if (typeof window === 'undefined') return;

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn("Notification permission not granted");
            return;
        }

        if (!messaging) {
            console.warn("Firebase messaging not initialized");
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
            localStorage.setItem("fcmToken", token);
            console.log("FCM Token generated:", token);
        } else {
            console.warn("No FCM token received");
        }

    } catch (error) {
        console.error("FCM error:", error);
    }
};

