"use client";
import "../styles/font-montserrat.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/style.css";
import { useEffect } from "react";
import { generateToken, messaging } from "./notification/firebase";
import { onMessage } from "firebase/messaging";
import { showNotificationToast } from "./notification/toast";

export default function RootLayout({ children }) {
    useEffect(() => {
        // Firebase messaging
        generateToken();
        const unsubscribe = onMessage(messaging, (payload) => {
            if (payload.notification) {
                showNotificationToast(
                    payload.notification.title || 'New Notification',
                    payload.notification.body || '',
                    'success'
                );
            }
        });

        return () => unsubscribe();
    }, [])

    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/png" href="/assets/img/icons/fav.png" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
