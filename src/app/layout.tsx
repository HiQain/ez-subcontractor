"use client";
import "../styles/font-montserrat.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
                <script
                    src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
                    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
                    crossOrigin="anonymous"
                ></script>
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
                    integrity="sha384-..."
                    crossOrigin="anonymous"
                ></script>
            </body>
        </html>
    );
}
