import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState('customer');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [forgotLoginId, setForgotLoginId] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginId || !password) {
      alert('Please enter your login details.');
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(
        loginId,
        password,
        role
      );

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      alert(
        `Welcome to arch-restaurant, ${data.user.name}!`
      );

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }

    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotLoginId.trim()) {
      alert(
        'Please enter your phone number or User ID.'
      );
      return;
    }

    if (!newPassword) {
      alert(
        'Please enter your new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      alert(
        'New password must contain at least 6 characters.'
      );
      return;
    }

    if (!confirmPassword) {
      alert(
        'Please confirm your new password.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        'New password and confirm password do not match.'
      );
      return;
    }

    try {
      setResetLoading(true);

      const response = await axios.post(
        'http://localhost:5001/api/auth/forgot-password',
        {
          loginId: forgotLoginId.trim(),
          newPassword,
        }
      );

      alert(
        response.data.message ||
          'Password reset successfully.'
      );

      // Clear reset fields
      setForgotLoginId('');
      setNewPassword('');
      setConfirmPassword('');

      // Return to login
      setShowForgotPassword(false);

      // Put the reset account ID into login
      setLoginId(forgotLoginId.trim());

    } catch (error) {
      console.error(
        'Password reset error:',
        error
      );

      const message =
        error.response?.data?.message ||
        'Unable to reset password. Please try again.';

      alert(message);

    } finally {
      setResetLoading(false);
    }
  };

  // =========================
  // BACK TO LOGIN
  // =========================

  const handleBackToLogin = () => {
    setShowForgotPassword(false);

    setForgotLoginId('');
    setNewPassword('');
    setConfirmPassword('');

    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="login-page">

      <div className="login-overlay"></div>

      <div className="login-container">

        {/* =========================
            WELCOME SECTION
        ========================== */}

        <div className="login-welcome">

          <div className="brand-logo">
            🍽️
          </div>

          <h1>
            arch-<span>restaurant</span>
          </h1>

          <h3>
            Good Food. Great Moments.
          </h3>

          <p>
            Welcome to arch-restaurant,
            where delicious food, quality
            ingredients and unforgettable
            experiences come together.
          </p>

          <div className="food-highlights">

            <span>
              🍕 Fresh Food
            </span>

            <span>
              🥗 Quality Ingredients
            </span>

            <span>
              ❤️ Made With Love
            </span>

          </div>

        </div>

        {/* =========================
            LOGIN CARD
        ========================== */}

        <div className="login-card">

          {!showForgotPassword ? (

            <>
              {/* LOGIN HEADING */}

              <div className="login-heading">

                <h2>
                  Welcome Back
                </h2>

                <p>
                  Login to continue to
                  arch-restaurant
                </p>

              </div>

              {/* ROLE SELECTOR */}

              <div className="role-selector">

                <button
                  type="button"
                  className={`role-button ${
                    role === 'customer'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setRole('customer')
                  }
                >

                  <span>👤</span>

                  <div>

                    <strong>
                      Customer
                    </strong>

                    <small>
                      Order delicious food
                    </small>

                  </div>

                </button>

                <button
                  type="button"
                  className={`role-button ${
                    role === 'admin'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setRole('admin')
                  }
                >

                  <span>👨‍💼</span>

                  <div>

                    <strong>
                      Admin
                    </strong>

                    <small>
                      Manage restaurant
                    </small>

                  </div>

                </button>

              </div>

              {/* LOGIN FORM */}

              <form onSubmit={handleLogin}>

                <div className="input-group">

                  <label>
                    Phone Number / User ID
                  </label>

                  <div className="input-wrapper">

                    <span>
                      👤
                    </span>

                    <input
                      type="text"
                      placeholder="Enter phone number or user ID"
                      value={loginId}
                      onChange={(e) =>
                        setLoginId(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="input-group">

                  <label>
                    Password
                  </label>

                  <div className="input-wrapper">

                    <span>
                      🔒
                    </span>

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? '🙈'
                        : '👁️'}
                    </button>

                  </div>

                </div>

                <div className="login-options">

                  <label className="remember-me">

                    <input
                      type="checkbox"
                    />

                    Remember me

                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      setShowForgotPassword(
                        true
                      )
                    }
                  >
                    Forgot Password?
                  </button>

                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >

                  {loading
                    ? 'Logging in...'
                    : `Login as ${
                        role === 'admin'
                          ? 'Admin'
                          : 'Customer'
                      }`
                  }

                  {!loading && (
                    <span>→</span>
                  )}

                </button>

              </form>

              {/* SIGN UP */}

              <div className="signup-section">

                <span>
                  {role === 'admin'
                    ? 'New restaurant administrator?'
                    : 'New to arch-restaurant?'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/register?role=${role}`
                    )
                  }
                >
                  Create Account
                </button>

              </div>

            </>

          ) : (

            /* =========================
               FORGOT PASSWORD SCREEN
            ========================== */

            <div className="forgot-password-card">

              <div className="login-heading">

                <div
                  style={{
                    fontSize: '48px',
                    marginBottom: '10px',
                  }}
                >
                  🔐
                </div>

                <h2>
                  Reset Password
                </h2>

                <p>
                  Enter your account details
                  and create a new password.
                </p>

              </div>

              <form
                onSubmit={
                  handleForgotPassword
                }
              >

                {/* ACCOUNT ID */}

                <div className="input-group">

                  <label>
                    Phone Number / User ID
                  </label>

                  <div className="input-wrapper">

                    <span>
                      👤
                    </span>

                    <input
                      type="text"
                      placeholder="Enter phone number or user ID"
                      value={forgotLoginId}
                      onChange={(e) =>
                        setForgotLoginId(
                          e.target.value
                        )
                      }
                      autoFocus
                    />

                  </div>

                </div>

                {/* NEW PASSWORD */}

                <div className="input-group">

                  <label>
                    New Password
                  </label>

                  <div className="input-wrapper">

                    <span>
                      🔒
                    </span>

                    <input
                      type={
                        showNewPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                    >
                      {showNewPassword
                        ? '🙈'
                        : '👁️'}
                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="input-group">

                  <label>
                    Confirm New Password
                  </label>

                  <div className="input-wrapper">

                    <span>
                      🔒
                    </span>

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Confirm new password"
                      value={
                        confirmPassword
                      }
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword
                        ? '🙈'
                        : '👁️'}
                    </button>

                  </div>

                </div>

                {/* RESET BUTTON */}

                <button
                  type="submit"
                  className="login-button"
                  disabled={
                    resetLoading
                  }
                >

                  {resetLoading
                    ? 'Resetting Password...'
                    : 'Reset Password'}

                  {!resetLoading && (
                    <span>→</span>
                  )}

                </button>

              </form>

              {/* BACK TO LOGIN */}

              <div className="signup-section">

                <span>
                  Remember your password?
                </span>

                <button
                  type="button"
                  onClick={
                    handleBackToLogin
                  }
                >
                  Back to Login
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Login;