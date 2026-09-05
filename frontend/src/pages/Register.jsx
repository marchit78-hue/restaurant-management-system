import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedRole =
    searchParams.get('role') === 'admin'
      ? 'admin'
      : 'customer';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !phone ||
      !userId ||
      !password ||
      !confirmPassword
    ) {
      alert('Please fill in all fields.');
      return;
    }

    if (phone.length < 10) {
      alert('Please enter a valid phone number.');
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

      await registerUser({
        name,
        phone,
        userId,
        password,
        role: selectedRole,
      });

      alert(
        `${selectedRole === 'admin' ? 'Admin' : 'Customer'} account created successfully! Please login.`
      );

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-overlay"></div>

      <div className="register-container">

        {/* LEFT SIDE */}

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
            {selectedRole === 'admin'
              ? 'Create your restaurant administrator account and manage arch-restaurant with ease.'
              : 'Create your account and discover delicious food, easy ordering and a better dining experience at arch-restaurant.'}
          </p>

          <div className="register-benefits">

            <div>
              <span>
                {selectedRole === 'admin' ? '📊' : '🍕'}
              </span>

              <div>
                <strong>
                  {selectedRole === 'admin'
                    ? 'Manage Restaurant'
                    : 'Explore Our Menu'}
                </strong>

                <small>
                  {selectedRole === 'admin'
                    ? 'Control your restaurant operations'
                    : 'Discover delicious dishes'}
                </small>
              </div>
            </div>

            <div>
              <span>
                {selectedRole === 'admin' ? '🍽️' : '🛒'}
              </span>

              <div>
                <strong>
                  {selectedRole === 'admin'
                    ? 'Manage Menu'
                    : 'Easy Ordering'}
                </strong>

                <small>
                  {selectedRole === 'admin'
                    ? 'Add and manage food items'
                    : 'Add items and order easily'}
                </small>
              </div>
            </div>

            <div>
              <span>
                {selectedRole === 'admin' ? '📦' : '📋'}
              </span>

              <div>
                <strong>
                  {selectedRole === 'admin'
                    ? 'Manage Orders'
                    : 'Track Your Orders'}
                </strong>

                <small>
                  {selectedRole === 'admin'
                    ? 'View and manage customer orders'
                    : 'Keep track of your food orders'}
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="register-card">

          <div className="register-heading">

            <h2>
              Create {selectedRole === 'admin'
                ? 'Admin'
                : 'Customer'} Account
            </h2>

            <p>
              {selectedRole === 'admin'
                ? 'Create your arch-restaurant administrator account'
                : 'Join arch-restaurant today'}
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="register-input-group">

              <label>Full Name</label>

              <div className="register-input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="register-input-group">

              <label>Phone Number</label>

              <div className="register-input-wrapper">

                <span>📱</span>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />

              </div>

            </div>

            {/* USER ID */}

            <div className="register-input-group">

              <label>User ID</label>

              <div className="register-input-wrapper">

                <span>🪪</span>

                <input
                  type="text"
                  placeholder="Create a unique user ID"
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-input-group">

              <label>Password</label>

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
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-input-group">

              <label>Confirm Password</label>

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
                : `Create ${
                    selectedRole === 'admin'
                      ? 'Admin'
                      : 'Customer'
                  } Account`}

              {!loading && <span>→</span>}

            </button>

          </form>

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
