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
    const permission = await Notification.requestPermission();
    console.log('permission ===>', permission);
    if (permission === 'granted') {
        const token = await getToken(messaging!, {
            vapidKey: "BOkqAoS5BG3-70xSaY140knjWQDpfBKcOx3L1eUspSG27srt6-x2lwlQCkfh25cC5il4TbbQLdJp6CmEAUGu0fs",
        });
        console.log('token ===>', token);
    }
}