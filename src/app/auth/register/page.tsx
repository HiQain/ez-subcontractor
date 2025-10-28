// app/auth/register/page.tsx
'use client';
import '../../../styles/login.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAgreed, setIsAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!isAgreed) {
      newErrors.agreement = 'You must accept the Privacy Policy and Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Registration data:', formData);
      alert('Registration successful! (Demo)');
    }
  };

  return (
      <section className="login-sec overflow-hidden">
        <div className="row g-2">
          {/* Left Image */}
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

          {/* Register Form */}
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

              <div className="login-title fw-semibold fs-2 mb-4 text-center">Register</div>

              <div className="register-card mb-3 d-flex align-items-center gap-3">
                <Image
                    src="/assets/img/settings.svg"
                    width={50}
                    height={50}
                    alt="Worker Image"
                />
                <div className="title fw-semibold">Subcontractor</div>
              </div>

              <form onSubmit={handleSubmit} className="form">
                {/* Full Name */}
                <div className="input-wrapper d-flex flex-column mb-3">
                  <label htmlFor="fullName" className="mb-1 fw-semibold">
                    Full Name *
                  </label>
                  <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control"
                      placeholder="Jason Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                  />
                  {errors.fullName && <div className="text-danger mt-1">{errors.fullName}</div>}
                </div>

                {/* Company Name */}
                <div className="input-wrapper d-flex flex-column mb-3">
                  <label htmlFor="companyName" className="mb-1 fw-semibold">
                    Company Name *
                  </label>
                  <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      className="form-control"
                      placeholder="Jason Tiles Limited"
                      value={formData.companyName}
                      onChange={handleChange}
                  />
                  {errors.companyName && <div className="text-danger mt-1">{errors.companyName}</div>}
                </div>

                {/* Email */}
                <div className="input-wrapper d-flex flex-column mb-3">
                  <label htmlFor="email" className="mb-1 fw-semibold">
                    Email Address *
                  </label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="hello@example.com"
                      value={formData.email}
                      onChange={handleChange}
                  />
                  {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="input-wrapper d-flex flex-column mb-3">
                  <label htmlFor="phone" className="mb-1 fw-semibold">
                    Phone Number *
                  </label>
                  <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="(000) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                  />
                  {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
                </div>

                {/* Password */}
                <div className="input-wrapper d-flex flex-column mb-3 position-relative">
                  <label htmlFor="password" className="mb-1 fw-semibold">
                    Password *
                  </label>
                  <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-control pe-5"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                  />
                  <span
                      className="toggle-password position-absolute"
                      style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                  {showPassword ? (
                      <i className="bi bi-eye" />
                  ) : (
                      <i className="bi bi-eye-slash" />
                  )}
                </span>
                  {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="input-wrapper d-flex flex-column mb-3 position-relative">
                  <label htmlFor="confirmPassword" className="mb-1 fw-semibold">
                    Confirm Password *
                  </label>
                  <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control pe-5"
                      placeholder="Re enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                  />
                  <span
                      className="toggle-password position-absolute"
                      style={{ right: '10px', top: '38px', cursor: 'pointer' }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                  {showConfirmPassword ? (
                      <i className="bi bi-eye" />
                  ) : (
                      <i className="bi bi-eye-slash" />
                  )}
                </span>
                  {errors.confirmPassword && (
                      <div className="text-danger mt-1">{errors.confirmPassword}</div>
                  )}
                </div>

                {/* Agreement */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="form-check">
                    <input
                        className="form-check-input mt-1"
                        type="checkbox"
                        id="agreement"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="agreement">
                      By registering, you confirm that you have reviewed and accepted our{' '}
                      <Link href="/privacy" className="custom-text text-decoration-none">
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link href="/terms" className="custom-text text-decoration-none">
                        Terms & Conditions
                      </Link>
                      .
                    </label>
                  </div>
                </div>
                {errors.agreement && <div className="text-danger mb-3">{errors.agreement}</div>}

                {/* Submit Button */}
                <button type="submit" className="submit-btn d-block mb-4">
                  Next
                </button>

                {/* Login Link */}
                <div className="text-center">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="fw-bold text-black text-decoration-none">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
  );
}