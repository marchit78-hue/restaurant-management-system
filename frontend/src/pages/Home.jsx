import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section className="home-hero">

        <div className="home-overlay">

          <div className="home-content">

            <p className="home-welcome">
              WELCOME TO
            </p>

            <h1>
              arch-restaurant
            </h1>

            <h2>
              Good Food. Great Moments.
            </h2>

            <p className="home-description">
              Discover delicious food, choose your
              favourite size, and order everything
              you love in just a few clicks.
            </p>

            <div className="home-buttons">

              <button
                className="home-primary-btn"
                onClick={() => navigate('/menu')}
              >
                🍽️ Explore Menu
              </button>

              <button
                className="home-secondary-btn"
                onClick={() => navigate('/orders')}
              >
                🧾 My Orders
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="home-features">

        <div className="container">

          <div className="text-center mb-5">

            <p className="section-label">
              WHY CHOOSE US
            </p>

            <h2 className="fw-bold">
              Everything You Need for a Great Meal
            </h2>

          </div>

          <div className="row g-4">

            <div className="col-md-4">

              <div className="feature-card">

                <div className="feature-icon">
                  🍽️
                </div>

                <h4>
                  Delicious Menu
                </h4>

                <p>
                  Explore our carefully selected
                  dishes and choose the size that
                  suits you.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="feature-card">

                <div className="feature-icon">
                  🛒
                </div>

                <h4>
                  Easy Ordering
                </h4>

                <p>
                  Add multiple dishes to your cart
                  and place your order effortlessly.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="feature-card">

                <div className="feature-icon">
                  🧾
                </div>

                <h4>
                  Automatic Bill
                </h4>

                <p>
                  Your subtotal, tax and final bill
                  are calculated automatically.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="home-cta">

        <div className="container text-center">

          <p className="section-label">
            READY TO ORDER?
          </p>

          <h2>
            Your next favourite meal is waiting.
          </h2>

          <p>
            {user.name
              ? `Welcome back, ${user.name}!`
              : 'Explore our menu and discover something delicious.'}
          </p>

          <button
            className="home-primary-btn"
            onClick={() => navigate('/menu')}
          >
            View Today's Menu →
          </button>

        </div>

      </section>

    </div>
  );
};

export default Home;
