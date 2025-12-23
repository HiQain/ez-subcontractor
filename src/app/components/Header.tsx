// components/Header.tsx
'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';

import '../../styles/header.css';

export default function Header() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [login, setLogin] = useState<string | null>(null);
    const pathname = usePathname();


    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);


        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}common/get-profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data)
                if (response.ok) {

                    const isLoggedIn = !!localStorage.getItem('token');
                    setLogin(isLoggedIn ? localStorage.getItem('role') : null);
                }
            } catch (err) {
                localStorage.setItem('token', null);
                setLogin(null);
            }
        };
        fetchProfile();
    });

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-white shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" href={'/'}>
                        <Image
                            src="/assets/img/icons/logo.webp"
                            width={234}
                            height={67}
                            alt="Logo"
                            title="Logo"
                            priority
                        />
                    </Link>
                    <div className={'d-flex gap-1'}>
                        {!userRole && (
                            <Link href="/auth/login" className="btn btn-outline-dark px-3 rounded-3 border-0 d-lg-none">
                                <Image src="/assets/img/user.svg" width={20} height={20} alt="Login"/>
                            </Link>
                        )}

                        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {
                            (
                                pathname.startsWith('/general-contractor') ||
                                (pathname === '/messages' && userRole === 'general_contractor')
                            ) &&
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page"
                                          href={'/general-contractor/dashboard'}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" href={'/messages'}>Messages</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page"
                                          href={'/general-contractor/my-projects'}>My Projects</Link>
                                </li>
                            </ul>
                        }


                        {
                            (
                                pathname.startsWith('/subcontractor') ||
                                (pathname === '/messages' && userRole === 'subcontractor')
                            ) &&
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page"
                                          href={'/subcontractor/dashboard'}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" href={'/messages'}>Messages</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page"
                                          href={'/subcontractor/rating'}>Ratings</Link>
                                </li>
                            </ul>
                        }

                        {
                            (
                                pathname === '/' ||
                                pathname === '/subscription' ||
                                pathname === '/blogs' ||
                                pathname === '/how-it-works'
                            ) &&
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 rounded-3 px-lg-2 py-lg-2">
                                {userRole && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" aria-current="page" href={'/'}>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" aria-current="page" href={'/subscription'}>Free
                                                Trial</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href={'/how-it-works'}>How It Works</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href={'/blogs'}>Blogs</Link>
                                        </li>
                                    </>
                                )}

                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Contractor
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex align-items-center ${
                                                    userRole === 'general_contractor' ? 'fw-bold' : ''
                                                }`}
                                                type="button"
                                                onclick={(e) => {
                                                    e.preventDefault();
                                                    const role = 'general_contractor';
                                                    localStorage.setItem('role', role);
                                                    setUserRole(role);
                                                }}
                                            >
                                                {userRole === 'general_contractor' && (
                                                    <span className="me-2">✓</span>
                                                )}
                                                General Contractor
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex align-items-center ${
                                                    userRole === 'subcontractor' ? 'fw-bold' : ''
                                                }`}
                                                type="button"
                                                onclick={(e) => {
                                                    e.preventDefault();
                                                    const role = 'subcontractor';
                                                    localStorage.setItem('role', role);
                                                    setUserRole(role);
                                                }}
                                            >
                                                {userRole === 'subcontractor' && (
                                                    <span className="me-2">✓</span>
                                                )}
                                                Subcontractor
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item d-flex align-items-center ${
                                                    userRole === 'affiliate' ? 'fw-bold' : ''
                                                }`}
                                                type="button"
                                                onclick={(e) => {
                                                    e.preventDefault();
                                                    const role = 'affiliate';
                                                    localStorage.setItem('role', role);
                                                    setUserRole(role);
                                                }}
                                            >
                                                {userRole === 'affiliate' && (
                                                    <span className="me-2">✓</span>
                                                )}
                                                Affiliates
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        }
                    </div>


                    {!login ? (
                            <div className="gap-3 d-none d-lg-flex">
                                <Link href="/auth/login" className="btn btn-outline-dark rounded-3">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="btn btn-primary rounded-3">
                                    Signup
                                </Link>
                            </div>
                        ) :
                        (
                            <div className="icon-buttons d-flex align-items-center gap-2">
                                <div className={'dropdown hide-arrow'}>
                                    <Link
                                        href="#"
                                        className="nav-link icon dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <Image src="/assets/img/icons/notification-dark.svg" width={24} height={24}
                                               alt="Notifications"/>
                                    </Link>
                                    <ul className="dropdown-menu dropdown-menu-end" style={{minWidth: '300px'}}>
                                        <li>
                                            <span
                                                className={"fw-bold px-3 border-bottom d-block py-2"}>Notifications</span>
                                        </li>
                                        <li>
                                            <a className="dropdown-item py-2" href="#">
                                                     <span
                                                         className={'d-flex align-items-center justify-content-between w-100'}>
                                                         <span className={'d-block fw-medium'}>Success</span>
                                                        <span className={'fs-12'}>1 hr ago</span>
                                                     </span>
                                                <span className={'fs-12 opacity-50'}>You have accessed the app at 07:00 AM</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item py-2" href="#">
                                                     <span
                                                         className={'d-flex align-items-center justify-content-between w-100'}>
                                                         <span className={'d-block fw-medium'}>Success</span>
                                                        <span className={'fs-12'}>1 hr ago</span>
                                                     </span>
                                                <span className={'fs-12 opacity-50'}>You have accessed the app at 07:00 AM</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {
                                    userRole === 'subcontractor' &&
                                    <Link href="/subcontractor/profile" className="nav-link icon"
                                          aria-label="Profile">
                                        <Image src="/assets/img/icons/user-dark.svg" width={24} height={24}
                                               alt="Profile"/>
                                    </Link>
                                }
                                {
                                    userRole === 'general_contractor' &&
                                    <Link href="/general-contractor/profile" className="nav-link icon"
                                          aria-label="Profile">
                                        <Image src="/assets/img/icons/user-dark.svg" width={24} height={24}
                                               alt="Profile"/>
                                    </Link>
                                }
                            </div>
                        )}

                </div>
            </nav>
        </div>
    );
}