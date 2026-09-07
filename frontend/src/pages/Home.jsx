import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  return (
    <div className="home-page">

      {/* =========================
          HERO SECTION
      ========================== */}

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
                type="button"
                className="home-primary-btn"
                onClick={() => navigate('/menu')}
              >
                🍽️ Explore Menu
              </button>

              <button
                type="button"
                className="home-secondary-btn"
                onClick={() => navigate('/orders')}
              >
                🧾 My Orders
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FEATURES
      ========================== */}

      <section className="home-features">

        <div className="container">

          <div className="home-section-heading text-center mb-5">

            <p className="section-label">
              WHY CHOOSE US
            </p>

            <h2 className="fw-bold">
              Everything You Need for a Great Meal
            </h2>

            <p className="home-section-description">
              A simple and convenient way to
              discover, order, and enjoy your food.
            </p>

          </div>

          <div className="row g-3 g-md-4">

            {/* FEATURE 1 */}

            <div className="col-12 col-md-4">

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

            {/* FEATURE 2 */}

            <div className="col-12 col-md-4">

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

            {/* FEATURE 3 */}

            <div className="col-12 col-md-4">

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

      {/* =========================
          CTA
      ========================== */}

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
            type="button"
            className="home-primary-btn"
            onClick={() => navigate('/menu')}
          >
            View Today's Menu →
          </button>

        </div>

      </section>

      {/* =========================
          RESPONSIVE STYLES
      ========================== */}

      <style>{`

        .home-page {
          width: 100%;
          overflow-x: hidden;
        }

        /* =========================
           HERO
        ========================== */

        .home-hero {
          min-height: calc(100vh - 70px);
          min-height: 650px;
          position: relative;
        }

        .home-overlay {
          min-height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
        }

        .home-content {
          width: 100%;
          max-width: 850px;
          text-align: center;
        }

        .home-welcome {
          font-size: clamp(
            0.72rem,
            1.5vw,
            0.9rem
          );
          font-weight: 800;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .home-content h1 {
          font-size: clamp(
            2.5rem,
            7vw,
            5.5rem
          );
          line-height: 1;
          font-weight: 800;
          margin-bottom: 16px;
          overflow-wrap: anywhere;
        }

        .home-content h2 {
          font-size: clamp(
            1.35rem,
            3.5vw,
            2.4rem
          );
          line-height: 1.25;
          margin-bottom: 20px;
        }

        .home-description {
          width: 100%;
          max-width: 650px;
          margin: 0 auto 30px;
          font-size: clamp(
            0.9rem,
            2vw,
            1.05rem
          );
          line-height: 1.7;
        }

        .home-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .home-primary-btn,
        .home-secondary-btn {
          min-height: 48px;
          padding: 12px 25px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .home-primary-btn:hover,
        .home-secondary-btn:hover {
          transform: translateY(-2px);
        }

        /* =========================
           FEATURES
        ========================== */

        .home-features {
          padding: 80px 0;
        }

        .home-section-heading h2 {
          font-size: clamp(
            1.6rem,
            3vw,
            2.3rem
          );
          line-height: 1.25;
        }

        .home-section-description {
          max-width: 650px;
          margin: 12px auto 0;
          color: #6c757d;
          line-height: 1.6;
        }

        .feature-card {
          height: 100%;
          padding: 32px 25px;
          text-align: center;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #e9ecef;
          box-shadow:
            0 5px 20px
            rgba(0, 0, 0, 0.06);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 10px 28px
            rgba(0, 0, 0, 0.09);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: #f8f9fa;
          font-size: 2rem;
        }

        .feature-card h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .feature-card p {
          margin-bottom: 0;
          color: #6c757d;
          line-height: 1.65;
          font-size: 0.94rem;
        }

        /* =========================
           CTA
        ========================== */

        .home-cta {
          padding: 85px 20px;
        }

        .home-cta h2 {
          font-size: clamp(
            1.7rem,
            4vw,
            2.7rem
          );
          line-height: 1.25;
          margin-bottom: 15px;
        }

        .home-cta > .container > p:not(.section-label) {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        /* =========================
           HALF SCREEN
        ========================== */

        @media (max-width: 1100px) {

          .home-hero {
            min-height: 580px;
          }

          .home-overlay {
            padding: 70px 25px;
          }

          .home-features {
            padding: 65px 0;
          }

          .feature-card {
            padding: 28px 20px;
          }

        }

        /* =========================
           TABLET
        ========================== */

        @media (max-width: 767.98px) {

          .home-hero {
            min-height: 570px;
          }

          .home-overlay {
            padding: 60px 18px;
          }

          .home-content h1 {
            font-size: clamp(
              2.3rem,
              11vw,
              4rem
            );
          }

          .home-content h2 {
            font-size: 1.45rem;
          }

          .home-description {
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 25px;
          }

          .home-buttons {
            width: 100%;
            flex-direction: column;
          }

          .home-primary-btn,
          .home-secondary-btn {
            width: min(100%, 360px);
          }

          .home-features {
            padding: 55px 0;
          }

          .home-section-heading {
            margin-bottom: 35px !important;
          }

          .home-section-description {
            font-size: 0.9rem;
          }

          .feature-card {
            padding: 25px 20px;
          }

          .feature-icon {
            width: 60px;
            height: 60px;
            font-size: 1.7rem;
          }

          .home-cta {
            padding: 65px 18px;
          }

        }

        /* =========================
           MOBILE
        ========================== */

        @media (max-width: 480px) {

          .home-hero {
            min-height: 540px;
          }

          .home-overlay {
            padding: 50px 14px;
          }

          .home-welcome {
            letter-spacing: 2px;
            font-size: 0.68rem;
          }

          .home-content h1 {
            font-size: 2.35rem;
            margin-bottom: 12px;
          }

          .home-content h2 {
            font-size: 1.25rem;
            margin-bottom: 16px;
          }

          .home-description {
            font-size: 0.84rem;
            max-width: 340px;
          }

          .home-primary-btn,
          .home-secondary-btn {
            min-height: 46px;
            padding: 10px 18px;
            font-size: 14px;
          }

          .home-features {
            padding: 45px 0;
          }

          .home-section-heading h2 {
            font-size: 1.5rem;
          }

          .home-section-description {
            font-size: 0.82rem;
          }

          .feature-card {
            padding: 24px 17px;
          }

          .feature-card h4 {
            font-size: 1.1rem;
          }

          .feature-card p {
            font-size: 0.85rem;
          }

          .home-cta {
            padding: 55px 14px;
          }

          .home-cta h2 {
            font-size: 1.55rem;
          }

          .home-cta > .container > p:not(.section-label) {
            font-size: 0.85rem;
          }

        }

        /* =========================
           SMALL PHONES
        ========================== */

        @media (max-width: 360px) {

          .home-hero {
            min-height: 510px;
          }

          .home-overlay {
            padding: 42px 10px;
          }

          .home-content h1 {
            font-size: 2.05rem;
          }

          .home-content h2 {
            font-size: 1.1rem;
          }

          .home-description {
            font-size: 0.8rem;
          }

          .feature-card {
            padding: 21px 14px;
          }

        }

      `}</style>

    </div>
  );
};

export default Home;