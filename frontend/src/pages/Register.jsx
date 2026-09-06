import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // =========================
  // REGISTER CUSTOMER
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !phone ||
      !userId.trim() ||
      !password ||
      !confirmPassword
    ) {
      alert('Please fill in all fields.');
      return;
    }

    // Phone must contain exactly 10 digits.
    if (!/^\d{10}$/.test(phone)) {
      alert(
        'Phone number must contain exactly 10 digits.'
      );
      return;
    }

    if (password.length < 6) {
      alert(
        'Password must contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      // Do NOT send a role from the frontend.
      // The backend creates every public registration
      // as a customer.
      await registerUser({
        name: name.trim(),
        phone,
        userId: userId.trim(),
        password,
      });

      alert(
        'Customer account created successfully! Please login.'
      );

      navigate('/');
    } catch (error) {
      console.error(
        'Registration error:',
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PHONE INPUT
  // =========================

  const handlePhoneChange = (e) => {
    // Keep digits only and stop at 10 digits.
    const numericValue =
      e.target.value.replace(/\D/g, '').slice(0, 10);

    setPhone(numericValue);
  };

  return (
    <div className="register-page">

      <div className="register-overlay"></div>

      <div className="register-container">

        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="register-welcome">

          <div className="register-logo">
            🍽️
          </div>

          <h1>
            arch-<span>restaurant</span>
          </h1>

          <h3>
            Good Food. Great Moments.
          </h3>

          <p>
            Create your account and discover
            delicious food, easy ordering and
            a better dining experience at
            arch-restaurant.
          </p>

          <div className="register-benefits">

            <div>
              <span>🍕</span>

              <div>
                <strong>
                  Explore Our Menu
                </strong>

                <small>
                  Discover delicious dishes
                </small>
              </div>
            </div>

            <div>
              <span>🛒</span>

              <div>
                <strong>
                  Easy Ordering
                </strong>

                <small>
                  Add items and order easily
                </small>
              </div>
            </div>

            <div>
              <span>📋</span>

              <div>
                <strong>
                  Track Your Orders
                </strong>

                <small>
                  Keep track of your food orders
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="register-card">

          <div className="register-heading">

            <h2>
              Create Customer Account
            </h2>

            <p>
              Join arch-restaurant today
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="register-input-group">

              <label>
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="register-input-group">

              <label>
                Phone Number
              </label>

              <div className="register-input-wrapper">

                <span>📱</span>

                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={handlePhoneChange}
                  autoComplete="tel"
                />

              </div>

              <small
                style={{
                  display: 'block',
                  marginTop: '6px',
                  fontSize: '12px',
                  opacity: 0.7,
                }}
              >
                {phone.length}/10 digits
              </small>

            </div>

            {/* USER ID */}

            <div className="register-input-group">

              <label>
                User ID
              </label>

              <div className="register-input-wrapper">

                <span>🪪</span>

                <input
                  type="text"
                  placeholder="Create a unique user ID"
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                  autoComplete="username"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-input-group">

              <label>
                Password
              </label>

              <div className="register-input-wrapper">

                <span>🔒</span>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
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

            {/* CONFIRM PASSWORD */}

            <div className="register-input-group">

              <label>
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span>🔐</span>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                />

              </div>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading
                ? 'Creating Account...'
                : 'Create Customer Account'}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </form>

          {/* LOGIN REDIRECT */}

          <div className="login-redirect">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate('/')}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
