"use client";
import "../styles/font-montserrat.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/style.css";
// import 'select2/dist/css/select2.min.css';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
        <head></head>
        <body>
        {/*{loading && <Loader fadeOut={fadeOut} />}*/}
        {/*{!loading && children}*/}
        {children}
        </body>
        </html>
    );
}
