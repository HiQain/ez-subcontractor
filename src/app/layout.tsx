"use client";
import "../styles/font-montserrat.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/style.css";
// import 'select2/dist/css/select2.min.css';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import Loader from "./components/Loader";

export default function RootLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const pathname = usePathname(); // detects route changes

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        // Trigger loader immediately on route change
        setLoading(true);
        setFadeOut(false);

        const minLoaderTime = 0; // minimum 2 sec

        const timer = setTimeout(() => {
            setFadeOut(true); // start fade-out
            setTimeout(() => setLoading(false), 500); // remove loader after fade-out
        }, minLoaderTime);

        return () => clearTimeout(timer);
    }, [pathname]); // runs on every route change

    return (
        <html lang="en">
        <head>
            <link rel="icon" type="image/png" href="/assets/img/icons/fav.png"/>
        </head>
        <body>
        {/*{loading && <Loader fadeOut={fadeOut} />}*/}
        {/*{!loading && children}*/}
        {children}
        {/* 👇 Add Bootstrap JS (Popper + Bootstrap) */}
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
