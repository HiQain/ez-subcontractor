// app/auth/login/page.tsx
'use client';
import '../../../styles/login.css';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('info@admin.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // ✅ Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // ✅ Dummy login check
    if (email === 'info@admin.com' && password === 'admin') {
      // ✅ Success — redirect
      console.log('Login successful!');
      // Save to localStorage if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
      }
      router.push('/dashboard'); // or your desired route
    } else {
      // ❌ Invalid credentials
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <section className="login-sec overflow-hidden">
        <div className="row">
          <div className="col-lg-6">
            <div
                className="image-wrapper d-flex align-items-end p-4 w-100"
                style={{
                  backgroundImage: `url('/assets/img/left-side.webp')`,
                  backgroundRepeat: 'no-repeat',
                }}
            >
              <p className="detail text-white mb-0">
                Developed by: <span className="custom-text">Design Spartans</span>
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div
                className="login-wrapper d-flex flex-column justify-content-center w-100 h-100 p-3 mx-auto"
                style={{ maxWidth: '482px' }}
            >
              <Image
                  src="/assets/img/login-logo.webp"
                  width={300}
                  height={100}
                  alt="Login Logo"
                  className="img-fluid d-block mx-auto mb-4"
              />

              <div className="login-title fw-semibold fs-2 mb-4 text-center">Login</div>

              {/* ✅ Error Message */}
              {error && (
                  <div className="alert alert-danger text-center mb-3" role="alert">
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="form">
                <div className="input-wrapper d-flex flex-column mb-3">
                  <label htmlFor="email" className="mb-1 fw-semibold">
                    Email Address *
                  </label>
                  <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>

                <div className="input-wrapper d-flex flex-column mb-3 position-relative">
                  <label htmlFor="password" className="mb-1 fw-semibold">
                    Password *
                  </label>
                  <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="form-control pe-5"
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  <span
                      className="toggle-password position-absolute"
                      style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                  {showPassword ? (
                      <i className="bi bi-eye" />
                  ) : (
                      <i className="bi bi-eye-slash" />
                  )}
                </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label fw-medium" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-decoration-none fw-medium text-dark">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className="submit-btn d-block mb-4">
                  Login
                </button>

                <div className="detail fs-5 fw-semibold text-center mb-3">Or Login With</div>

                <Link
                    href="/api/auth/google"
                    className="icon-wrapper d-flex align-items-center justify-content-center mx-auto mb-4"
                >
                  <Image
                      src="/assets/img/google-logo.webp"
                      alt="Google Logo"
                      width={26}
                      height={26}
                  />
                </Link>

                <div className="text-center mb-5">
                  Don’t have an account?{' '}
                  <Link href="/auth/register" className="fw-bold text-black text-decoration-none">
                    Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
  );
}