import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password) {
      alert('Please enter your login details.');
      return;
    }

    try {
      setLoading(true);

      const role = isAdminLogin ? 'admin' : 'customer';

      const data = await loginUser(
        loginId.trim(),
        password,
        role
      );

      localStorage.setItem('token', data.token);

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
      console.error('Login error:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLogin(true);
    setLoginId('');
    setPassword('');
    setShowPassword(false);
  };

  const handleCustomerLogin = () => {
    setIsAdminLogin(false);
    setLoginId('');
    setPassword('');
    setShowPassword(false);
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">

      <div className="login-overlay"></div>

      {!isAdminLogin && (
        <button
          type="button"
          onClick={handleAdminLogin}
          style={{
            position: 'fixed',
            top: '24px',
            right: '28px',
            zIndex: 9999,
            background: 'rgba(20, 20, 20, 0.78)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            borderRadius: '24px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          }}
        >
          🔐 Admin Login
        </button>
      )}

      <div className="login-container">

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

        <div className="login-card">

          <div className="login-heading">

            <h2>
              {isAdminLogin
                ? 'Admin Login'
                : 'Welcome Back'}
            </h2>

            <p>
              {isAdminLogin
                ? 'Authorized restaurant administrator only'
                : 'Login to continue to arch-restaurant'}
            </p>

          </div>

          {isAdminLogin && (
            <div
              style={{
                background:
                  'rgba(255, 193, 7, 0.12)',
                border:
                  '1px solid rgba(255, 193, 7, 0.35)',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '18px',
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#5f4300',
              }}
            >
              🔐 Admin access is restricted to the
              authorized restaurant administrator.
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>
                {isAdminLogin
                  ? 'Admin User ID'
                  : 'Phone Number / User ID'}
              </label>

              <div className="input-wrapper">

                <span>
                  {isAdminLogin ? '🔑' : '👤'}
                </span>

                <input
                  type="text"
                  placeholder={
                    isAdminLogin
                      ? 'Enter admin User ID'
                      : 'Enter phone number or user ID'
                  }
                  value={loginId}
                  onChange={(e) =>
                    setLoginId(e.target.value)
                  }
                  autoComplete="username"
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
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? '🙈'
                    : '👁️'}
                </button>

              </div>

            </div>

            {!isAdminLogin && (
              <div className="login-options">

                <label className="remember-me">

                  <input type="checkbox" />

                  Remember me

                </label>

              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? 'Logging in...'
                : isAdminLogin
                  ? 'Login as Admin'
                  : 'Login as Customer'}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </form>

          {!isAdminLogin && (
            <div className="signup-section">

              <span>
                New to arch-restaurant?
              </span>

              <button
                type="button"
                onClick={handleCreateAccount}
              >
                Create Customer Account
              </button>

            </div>
          )}

          {isAdminLogin && (
            <div className="signup-section">

              <span>
                Not the administrator?
              </span>

              <button
                type="button"
                onClick={handleCustomerLogin}
              >
                Customer Login
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Login;
