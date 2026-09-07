import { useEffect, useMemo, useState } from 'react';
import {
  getAllFeedback,
  getFoodRatings,
} from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [foodRatings, setFoodRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // ==================== LOAD REVIEWS ====================

  const loadReviews = async () => {
    try {
      setLoading(true);
      setMessage('');

      const [reviewsData, ratingsData] =
        await Promise.all([
          getAllFeedback(),
          getFoodRatings(),
        ]);

      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData
          : []
      );

      setFoodRatings(
        Array.isArray(ratingsData)
          ? ratingsData
          : []
      );
    } catch (error) {
      console.error(
        'Reviews loading error:',
        error
      );

      setMessage(
        error?.response?.data?.message ||
          'Unable to load reviews and ratings.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // ==================== STATISTICS ====================

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return Number(
      (total / reviews.length).toFixed(1)
    );
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return {
      5: reviews.filter(
        (review) => Number(review.rating) === 5
      ).length,
      4: reviews.filter(
        (review) => Number(review.rating) === 4
      ).length,
      3: reviews.filter(
        (review) => Number(review.rating) === 3
      ).length,
      2: reviews.filter(
        (review) => Number(review.rating) === 2
      ).length,
      1: reviews.filter(
        (review) => Number(review.rating) === 1
      ).length,
    };
  }, [reviews]);

  // ==================== HELPERS ====================

  const renderStars = (rating) => {
    const numericRating = Number(rating || 0);

    return (
      <span
        className="reviews-stars"
        aria-label={`${numericRating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= numericRating ? '⭐' : '☆'}
          </span>
        ))}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const getRatingPercentage = (rating) => {
    if (totalReviews === 0) return 0;

    return (
      (ratingCounts[rating] / totalReviews) * 100
    );
  };

  // ==================== UI ====================

  return (
    <div className="reviews-page container-fluid px-3 px-md-4 px-lg-5 py-4">

      {/* ==================== PAGE HEADER ==================== */}

      <div className="reviews-header d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">

        <div className="reviews-heading">
          <span className="reviews-eyebrow">
            CUSTOMER EXPERIENCE
          </span>

          <h1 className="fw-bold mt-2 mb-2">
            ⭐ Reviews & Ratings
          </h1>

          <p className="text-muted mb-0">
            See what customers think about your
            restaurant and food.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary reviews-refresh-btn"
          onClick={loadReviews}
          disabled={loading}
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>

      </div>

      {/* ==================== MESSAGE ==================== */}

      {message && (
        <div className="alert alert-danger reviews-alert">
          {message}
        </div>
      )}

      {/* ==================== LOADING ==================== */}

      {loading ? (
        <div className="reviews-loading text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Loading customer reviews...
          </p>

        </div>
      ) : (
        <>
          {/* ==================== SUMMARY CARDS ==================== */}

          <div className="row g-3 g-lg-4 mb-4 mb-lg-5">

            {/* OVERALL RATING */}

            <div className="col-12 col-md-6 col-xl-4">

              <div className="reviews-summary-card overall-rating-card h-100">

                <div className="card-body">

                  <div className="summary-label rating-label">
                    OVERALL RATING
                  </div>

                  <div className="summary-rating">
                    {averageRating.toFixed(1)}
                  </div>

                  <div className="summary-stars">
                    {renderStars(
                      Math.round(averageRating)
                    )}
                  </div>

                  <p className="summary-description">
                    Based on {totalReviews}{' '}
                    {totalReviews === 1
                      ? 'review'
                      : 'reviews'}
                  </p>

                </div>

              </div>

            </div>

            {/* TOTAL REVIEWS */}

            <div className="col-12 col-md-6 col-xl-4">

              <div className="reviews-summary-card customer-reviews-card h-100">

                <div className="card-body">

                  <div className="summary-label customer-label">
                    CUSTOMER REVIEWS
                  </div>

                  <div className="summary-number">
                    {totalReviews}
                  </div>

                  <div className="summary-icon">
                    💬
                  </div>

                  <p className="summary-description">
                    Customer feedback received
                  </p>

                </div>

              </div>

            </div>

            {/* TOP FOOD */}

            <div className="col-12 col-xl-4">

              <div className="reviews-summary-card top-food-card h-100">

                <div className="card-body">

                  <div className="summary-label top-food-label">
                    TOP RATED FOOD
                  </div>

                  {foodRatings.length > 0 ? (
                    <>
                      <div className="top-food-name">
                        🏆{' '}
                        {foodRatings[0].foodItem}
                      </div>

                      <div className="top-food-stars">
                        {renderStars(
                          Math.round(
                            foodRatings[0]
                              .averageRating
                          )
                        )}
                      </div>

                      <p className="summary-description">
                        {
                          foodRatings[0]
                            .averageRating
                        }{' '}
                        / 5
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="summary-icon top-food-empty">
                        🍽️
                      </div>

                      <p className="summary-description">
                        No ratings yet
                      </p>
                    </>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* ==================== RATING BREAKDOWN ==================== */}

          <div className="reviews-section-card mb-4 mb-lg-5">

            <div className="card-body">

              <div className="section-heading">
                <div className="section-heading-icon">
                  📊
                </div>

                <div>
                  <h3 className="fw-bold mb-1">
                    Rating Breakdown
                  </h3>

                  <p className="text-muted mb-0">
                    Distribution of customer ratings.
                  </p>
                </div>
              </div>

              <div className="rating-breakdown mt-4">

                {[5, 4, 3, 2, 1].map(
                  (rating) => (
                    <div
                      key={rating}
                      className="rating-row"
                    >

                      <div className="rating-name">
                        <strong>
                          {rating} ⭐
                        </strong>
                      </div>

                      <div className="rating-progress-wrapper">

                        <div className="progress rating-progress">

                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{
                              width: `${getRatingPercentage(
                                rating
                              )}%`,
                            }}
                            aria-valuenow={getRatingPercentage(
                              rating
                            )}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />

                        </div>

                      </div>

                      <div className="rating-count">
                        <span>
                          {ratingCounts[rating]}
                        </span>
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

          {/* ==================== FOOD RATINGS ==================== */}

          <div className="reviews-section-card mb-4 mb-lg-5">

            <div className="card-body">

              <div className="section-heading food-section-heading">

                <div className="section-heading-icon">
                  🍽️
                </div>

                <div>
                  <h3 className="fw-bold mb-1">
                    Food Ratings
                  </h3>

                  <p className="text-muted mb-0">
                    Average ratings for individual
                    food items.
                  </p>
                </div>

              </div>

              {foodRatings.length === 0 ? (

                <div className="empty-reviews-state py-5">

                  <div className="empty-state-icon">
                    🍽️
                  </div>

                  <h5 className="mt-3 mb-2">
                    No food ratings yet
                  </h5>

                  <p className="text-muted mb-0">
                    Food ratings will appear after
                    customers submit feedback.
                  </p>

                </div>

              ) : (

                <div className="row g-3 mt-2">

                  {foodRatings.map(
                    (food, index) => (
                      <div
                        className="col-12 col-md-6 col-xl-4"
                        key={food.foodItem}
                      >

                        <div className="food-rating-card h-100">

                          <div className="food-rating-top">

                            <h5 className="fw-bold mb-0">
                              {index === 0 && '🏆 '}
                              {food.foodItem}
                            </h5>

                            <span className="food-rating-badge">
                              {food.averageRating}/5
                            </span>

                          </div>

                          <div className="food-stars mt-3 mb-2">
                            {renderStars(
                              Math.round(
                                food.averageRating
                              )
                            )}
                          </div>

                          <small className="text-muted">
                            Based on{' '}
                            {food.totalRatings}{' '}
                            {food.totalRatings === 1
                              ? 'rating'
                              : 'ratings'}
                          </small>

                        </div>

                      </div>
                    )
                  )}

                </div>

              )}

            </div>

          </div>

          {/* ==================== CUSTOMER REVIEWS ==================== */}

          <div className="reviews-section-card">

            <div className="card-body">

              <div className="customer-reviews-heading">

                <div className="section-heading">

                  <div className="section-heading-icon">
                    💬
                  </div>

                  <div>
                    <h3 className="fw-bold mb-1">
                      Customer Reviews
                    </h3>

                    <p className="text-muted mb-0">
                      Read comments and ratings from
                      your customers.
                    </p>
                  </div>

                </div>

                <span className="reviews-total-badge">
                  {totalReviews}{' '}
                  {totalReviews === 1
                    ? 'Review'
                    : 'Reviews'}
                </span>

              </div>

              {reviews.length === 0 ? (

                <div className="empty-reviews-state py-5">

                  <div className="empty-state-icon">
                    💬
                  </div>

                  <h4 className="mt-3 mb-2">
                    No customer reviews yet
                  </h4>

                  <p className="text-muted mb-0">
                    Customer reviews will appear
                    here after they rate their
                    completed orders.
                  </p>

                </div>

              ) : (

                <div className="row g-3 g-lg-4 mt-2">

                  {reviews.map((review) => (
                    <div
                      className="col-12 col-xl-6"
                      key={review._id}
                    >

                      <div className="customer-review-card h-100">

                        {/* CUSTOMER */}

                        <div className="review-customer-header">

                          <div className="review-customer-info">

                            <div className="customer-avatar">
                              👤
                            </div>

                            <div className="customer-details">

                              <h5 className="fw-bold mb-1">
                                {review.customerName}
                              </h5>

                              <small className="text-muted">
                                Order #
                                {String(
                                  review.orderId
                                ).slice(-6)}
                              </small>

                            </div>

                          </div>

                          <small className="review-date">
                            {formatDate(
                              review.createdAt
                            )}
                          </small>

                        </div>

                        {/* RATING */}

                        <div className="review-rating-row">

                          {renderStars(
                            review.rating
                          )}

                          <span className="review-rating-number">
                            {review.rating}/5
                          </span>

                        </div>

                        {/* COMMENT */}

                        {review.comment ? (
                          <div className="review-comment">

                            <div className="review-label">
                              💬 Review
                            </div>

                            <p className="mb-0">
                              "{review.comment}"
                            </p>

                          </div>
                        ) : (
                          <div className="review-no-comment">
                            Customer submitted a
                            rating without a written
                            review.
                          </div>
                        )}

                        {/* FOOD ITEMS */}

                        {review.items &&
                          review.items.length > 0 && (
                            <div className="review-foods">

                              <div className="review-label mb-2">
                                🍽️ Ordered
                              </div>

                              <div className="review-food-list">

                                {review.items.map(
                                  (item, index) => (
                                    <span
                                      key={`${review._id}-${index}`}
                                      className="review-food-badge"
                                    >
                                      {item.foodItem}
                                      {' · '}
                                      {
                                        item.sizeCategory
                                      }
                                      {' × '}
                                      {item.quantity}
                                    </span>
                                  )
                                )}

                              </div>

                            </div>
                          )}

                      </div>

                    </div>
                  ))}

                </div>

              )}

            </div>

          </div>

        </>
      )}

      {/* ==================== RESPONSIVE STYLES ==================== */}

      <style>{`

        .reviews-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .reviews-header {
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
        }

        .reviews-heading h1 {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
        }

        .reviews-heading p {
          font-size: 0.98rem;
        }

        .reviews-eyebrow {
          color: #0d6efd;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .reviews-refresh-btn {
          min-width: 110px;
          border-radius: 10px;
          font-weight: 600;
        }

        .reviews-alert {
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          border-radius: 12px;
        }

        .reviews-summary-card,
        .reviews-section-card {
          background: #ffffff;
          border: 0;
          border-radius: 16px;
          box-shadow: 0 5px 22px rgba(0, 0, 0, 0.07);
          overflow: hidden;
        }

        .reviews-summary-card {
          text-align: center;
        }

        .reviews-summary-card .card-body {
          padding: 30px 24px;
        }

        .summary-label {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .rating-label {
          color: #0d6efd;
        }

        .customer-label {
          color: #198754;
        }

        .top-food-label {
          color: #f0ad00;
        }

        .summary-rating {
          font-size: clamp(3rem, 6vw, 4rem);
          line-height: 1;
          font-weight: 800;
          margin-top: 13px;
        }

        .summary-number {
          font-size: clamp(3rem, 6vw, 4rem);
          line-height: 1;
          font-weight: 800;
          margin-top: 13px;
        }

        .summary-stars {
          font-size: 1.35rem;
          margin-top: 13px;
        }

        .summary-icon {
          font-size: 2rem;
          margin-top: 8px;
        }

        .summary-description {
          color: #6c757d;
          margin: 10px 0 0;
          font-size: 0.92rem;
        }

        .top-food-name {
          font-size: clamp(1.35rem, 3vw, 1.7rem);
          font-weight: 800;
          margin-top: 17px;
          word-break: break-word;
        }

        .top-food-stars {
          font-size: 1.15rem;
          margin-top: 12px;
        }

        .top-food-empty {
          margin-top: 18px;
        }

        .reviews-stars {
          letter-spacing: 2px;
          white-space: nowrap;
        }

        .reviews-section-card .card-body {
          padding: clamp(20px, 3vw, 32px);
        }

        .section-heading {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .section-heading-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #f1f3f5;
          font-size: 1.25rem;
        }

        .section-heading h3 {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
        }

        .rating-row {
          display: grid;
          grid-template-columns: 75px minmax(0, 1fr) 45px;
          align-items: center;
          gap: 15px;
          margin-bottom: 16px;
        }

        .rating-row:last-child {
          margin-bottom: 0;
        }

        .rating-progress {
          height: 11px;
          border-radius: 20px;
          background: #e9ecef;
          overflow: hidden;
        }

        .rating-progress .progress-bar {
          border-radius: 20px;
        }

        .rating-count {
          text-align: right;
          color: #6c757d;
          font-weight: 600;
        }

        .food-rating-card {
          border: 1px solid #e9ecef;
          border-radius: 14px;
          padding: 18px;
          background: #ffffff;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .food-rating-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
        }

        .food-rating-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .food-rating-top h5 {
          min-width: 0;
          word-break: break-word;
          font-size: 1.05rem;
        }

        .food-rating-badge {
          flex-shrink: 0;
          background: #fff3cd;
          color: #664d03;
          border: 1px solid #ffecb5;
          border-radius: 20px;
          padding: 5px 9px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .food-stars {
          font-size: 1rem;
        }

        .customer-reviews-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          flex-wrap: wrap;
        }

        .reviews-total-badge {
          background: #212529;
          color: #ffffff;
          border-radius: 20px;
          padding: 8px 13px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .customer-review-card {
          background: #fafafa;
          border: 1px solid #e9ecef;
          border-radius: 15px;
          padding: clamp(17px, 2.5vw, 23px);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .customer-review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .review-customer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .review-customer-info {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .customer-avatar {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          border-radius: 50%;
          font-size: 1.15rem;
        }

        .customer-details {
          min-width: 0;
        }

        .customer-details h5 {
          font-size: 1rem;
          overflow-wrap: anywhere;
        }

        .review-date {
          white-space: nowrap;
          color: #6c757d;
        }

        .review-rating-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin: 18px 0;
        }

        .review-rating-number {
          color: #6c757d;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .review-label {
          font-weight: 700;
          margin-bottom: 6px;
        }

        .review-comment {
          margin-bottom: 17px;
          color: #495057;
          line-height: 1.6;
        }

        .review-comment p {
          overflow-wrap: anywhere;
        }

        .review-no-comment {
          color: #6c757d;
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 17px;
        }

        .review-foods {
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .review-food-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .review-food-badge {
          display: inline-block;
          max-width: 100%;
          padding: 6px 9px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #dee2e6;
          color: #343a40;
          font-size: 0.78rem;
          overflow-wrap: anywhere;
        }

        .empty-reviews-state {
          text-align: center;
        }

        .empty-state-icon {
          font-size: 3.2rem;
        }

        @media (max-width: 767.98px) {

          .reviews-page {
            padding-top: 20px !important;
          }

          .reviews-heading {
            width: 100%;
          }

          .reviews-heading h1 {
            line-height: 1.2;
          }

          .reviews-heading p {
            font-size: 0.9rem;
          }

          .reviews-refresh-btn {
            width: 100%;
          }

          .reviews-summary-card .card-body {
            padding: 25px 18px;
          }

          .rating-row {
            grid-template-columns: 58px minmax(0, 1fr) 32px;
            gap: 9px;
            margin-bottom: 14px;
          }

          .rating-row strong {
            font-size: 0.86rem;
          }

          .customer-reviews-heading {
            align-items: stretch;
          }

          .reviews-total-badge {
            align-self: flex-start;
          }

          .review-customer-header {
            flex-direction: column;
            gap: 8px;
          }

          .review-date {
            margin-left: 53px;
          }

        }

        @media (max-width: 479.98px) {

          .reviews-page {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .reviews-section-card .card-body {
            padding: 17px 14px;
          }

          .section-heading {
            gap: 9px;
          }

          .section-heading-icon {
            width: 37px;
            height: 37px;
            min-width: 37px;
            border-radius: 10px;
            font-size: 1.05rem;
          }

          .section-heading h3 {
            font-size: 1.15rem;
          }

          .section-heading p {
            font-size: 0.82rem;
          }

          .rating-row {
            grid-template-columns: 48px minmax(0, 1fr) 27px;
            gap: 7px;
          }

          .rating-progress {
            height: 9px;
          }

          .customer-review-card {
            padding: 15px;
          }

          .customer-avatar {
            width: 38px;
            height: 38px;
            min-width: 38px;
          }

          .review-date {
            margin-left: 49px;
            font-size: 0.75rem;
          }

          .reviews-stars {
            letter-spacing: 1px;
            font-size: 0.92rem;
          }

          .review-food-badge {
            font-size: 0.73rem;
          }

          .food-rating-card {
            padding: 15px;
          }

        }

        @media (min-width: 1200px) {

          .reviews-page {
            max-width: 1600px;
            margin: 0 auto;
          }

        }

      `}</style>

    </div>
  );
};

export default Reviews;