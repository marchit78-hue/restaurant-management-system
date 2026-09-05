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
        style={{
          letterSpacing: '2px',
        }}
        aria-label={`${numericRating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= numericRating
              ? '⭐'
              : '☆'}
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
      (ratingCounts[rating] / totalReviews) *
      100
    );
  };

  // ==================== UI ====================

  return (
    <div className="container py-4">

      {/* ==================== HEADER ==================== */}

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>

          <span className="text-primary fw-bold">
            CUSTOMER EXPERIENCE
          </span>

          <h1 className="fw-bold mt-1 mb-1">
            ⭐ Reviews & Ratings
          </h1>

          <p className="text-muted mb-0">
            See what customers think about your
            restaurant and food.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadReviews}
          disabled={loading}
        >
          🔄 Refresh
        </button>

      </div>

      {/* ==================== MESSAGE ==================== */}

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      {/* ==================== LOADING ==================== */}

      {loading ? (

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3">
            Loading customer reviews...
          </p>

        </div>

      ) : (
        <>
          {/* ==================== SUMMARY ==================== */}

          <div className="row g-4 mb-5">

            {/* OVERALL RATING */}

            <div className="col-12 col-md-4">

              <div
                className="card h-100 shadow-sm border-0 text-center"
                style={{
                  borderRadius: '14px',
                }}
              >

                <div className="card-body p-4">

                  <div
                    className="text-primary fw-bold"
                    style={{
                      fontSize: '13px',
                      letterSpacing: '1px',
                    }}
                  >
                    OVERALL RATING
                  </div>

                  <div
                    className="fw-bold mt-2"
                    style={{
                      fontSize: '48px',
                    }}
                  >
                    {averageRating.toFixed(1)}
                  </div>

                  <div
                    className="mb-2"
                    style={{
                      fontSize: '24px',
                    }}
                  >
                    {renderStars(
                      Math.round(averageRating)
                    )}
                  </div>

                  <p className="text-muted mb-0">
                    Based on {totalReviews}{' '}
                    {totalReviews === 1
                      ? 'review'
                      : 'reviews'}
                  </p>

                </div>

              </div>

            </div>

            {/* TOTAL REVIEWS */}

            <div className="col-12 col-md-4">

              <div
                className="card h-100 shadow-sm border-0 text-center"
                style={{
                  borderRadius: '14px',
                }}
              >

                <div className="card-body p-4">

                  <div
                    className="text-success fw-bold"
                    style={{
                      fontSize: '13px',
                      letterSpacing: '1px',
                    }}
                  >
                    CUSTOMER REVIEWS
                  </div>

                  <div
                    className="fw-bold mt-2"
                    style={{
                      fontSize: '48px',
                    }}
                  >
                    {totalReviews}
                  </div>

                  <div
                    style={{
                      fontSize: '28px',
                    }}
                  >
                    💬
                  </div>

                  <p className="text-muted mb-0">
                    Customer feedback received
                  </p>

                </div>

              </div>

            </div>

            {/* TOP FOOD */}

            <div className="col-12 col-md-4">

              <div
                className="card h-100 shadow-sm border-0 text-center"
                style={{
                  borderRadius: '14px',
                }}
              >

                <div className="card-body p-4">

                  <div
                    className="text-warning fw-bold"
                    style={{
                      fontSize: '13px',
                      letterSpacing: '1px',
                    }}
                  >
                    TOP RATED FOOD
                  </div>

                  {foodRatings.length > 0 ? (
                    <>
                      <div
                        className="fw-bold mt-2"
                        style={{
                          fontSize: '26px',
                        }}
                      >
                        🏆{' '}
                        {
                          foodRatings[0]
                            .foodItem
                        }
                      </div>

                      <div
                        className="mt-2"
                        style={{
                          fontSize: '20px',
                        }}
                      >
                        {renderStars(
                          Math.round(
                            foodRatings[0]
                              .averageRating
                          )
                        )}
                      </div>

                      <p className="text-muted mb-0">
                        {
                          foodRatings[0]
                            .averageRating
                        } / 5
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="mt-3"
                        style={{
                          fontSize: '35px',
                        }}
                      >
                        🍽️
                      </div>

                      <p className="text-muted mb-0">
                        No ratings yet
                      </p>
                    </>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* ==================== RATING BREAKDOWN ==================== */}

          <div className="card shadow-sm border-0 mb-5">

            <div className="card-body p-4">

              <h3 className="fw-bold mb-4">
                📊 Rating Breakdown
              </h3>

              {[5, 4, 3, 2, 1].map(
                (rating) => (
                  <div
                    key={rating}
                    className="row align-items-center mb-3"
                  >

                    <div className="col-3 col-md-2">

                      <strong>
                        {rating} ⭐
                      </strong>

                    </div>

                    <div className="col-7 col-md-8">

                      <div
                        className="progress"
                        style={{
                          height: '12px',
                        }}
                      >

                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{
                            width: `${getRatingPercentage(
                              rating
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                    <div className="col-2 text-end">

                      <small className="text-muted">
                        {ratingCounts[rating]}
                      </small>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* ==================== FOOD RATINGS ==================== */}

          <div className="card shadow-sm border-0 mb-5">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                <div>

                  <h3 className="fw-bold mb-1">
                    🍽️ Food Ratings
                  </h3>

                  <p className="text-muted mb-0">
                    Average ratings for individual
                    food items.
                  </p>

                </div>

              </div>

              {foodRatings.length === 0 ? (

                <div className="text-center py-4">

                  <div
                    style={{
                      fontSize: '45px',
                    }}
                  >
                    🍽️
                  </div>

                  <h5 className="mt-2">
                    No food ratings yet
                  </h5>

                  <p className="text-muted">
                    Food ratings will appear after
                    customers submit feedback.
                  </p>

                </div>

              ) : (

                <div className="row g-3">

                  {foodRatings.map(
                    (food, index) => (
                      <div
                        className="col-12 col-md-6 col-lg-4"
                        key={food.foodItem}
                      >

                        <div className="border rounded p-3 h-100">

                          <div className="d-flex justify-content-between align-items-start gap-2">

                            <h5 className="fw-bold mb-2">
                              {index === 0 &&
                                '🏆 '}
                              {food.foodItem}
                            </h5>

                            <span className="badge bg-warning text-dark">
                              {food.averageRating}
                              /5
                            </span>

                          </div>

                          <div
                            className="mb-2"
                            style={{
                              fontSize: '18px',
                            }}
                          >
                            {renderStars(
                              Math.round(
                                food.averageRating
                              )
                            )}
                          </div>

                          <small className="text-muted">
                            Based on{' '}
                            {food.totalRatings}{' '}
                            {food.totalRatings ===
                            1
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

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                <div>

                  <h3 className="fw-bold mb-1">
                    💬 Customer Reviews
                  </h3>

                  <p className="text-muted mb-0">
                    Read comments and ratings from
                    your customers.
                  </p>

                </div>

                <span className="badge bg-dark fs-6">
                  {totalReviews}{' '}
                  {totalReviews === 1
                    ? 'Review'
                    : 'Reviews'}
                </span>

              </div>

              {reviews.length === 0 ? (

                <div className="text-center py-5">

                  <div
                    style={{
                      fontSize: '55px',
                    }}
                  >
                    💬
                  </div>

                  <h4 className="mt-3">
                    No customer reviews yet
                  </h4>

                  <p className="text-muted">
                    Customer reviews will appear
                    here after they rate their
                    completed orders.
                  </p>

                </div>

              ) : (

                <div className="row g-4">

                  {reviews.map((review) => (
                    <div
                      className="col-12 col-lg-6"
                      key={review._id}
                    >

                      <div
                        className="border rounded-3 p-4 h-100"
                        style={{
                          background: '#fafafa',
                        }}
                      >

                        {/* CUSTOMER */}

                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">

                          <div>

                            <h5 className="fw-bold mb-1">
                              👤{' '}
                              {review.customerName}
                            </h5>

                            <small className="text-muted">
                              Order #
                              {String(
                                review.orderId
                              ).slice(-6)}
                            </small>

                          </div>

                          <small className="text-muted text-nowrap">
                            {formatDate(
                              review.createdAt
                            )}
                          </small>

                        </div>

                        {/* RATING */}

                        <div
                          className="mb-3"
                          style={{
                            fontSize: '21px',
                          }}
                        >

                          {renderStars(
                            review.rating
                          )}

                          <span className="ms-2 text-muted small">
                            {review.rating}/5
                          </span>

                        </div>

                        {/* COMMENT */}

                        {review.comment ? (
                          <div className="mb-3">

                            <div className="fw-semibold mb-1">
                              💬 Review
                            </div>

                            <p className="mb-0 text-secondary">
                              "{review.comment}"
                            </p>

                          </div>
                        ) : (
                          <div className="text-muted fst-italic mb-3">
                            Customer submitted a
                            rating without a written
                            review.
                          </div>
                        )}

                        {/* FOOD ITEMS */}

                        {review.items &&
                          review.items.length >
                            0 && (
                            <div>

                              <div className="fw-semibold mb-2">
                                🍽️ Ordered
                              </div>

                              <div className="d-flex flex-wrap gap-2">

                                {review.items.map(
                                  (
                                    item,
                                    index
                                  ) => (
                                    <span
                                      key={`${review._id}-${index}`}
                                      className="badge bg-light text-dark border"
                                    >
                                      {item.foodItem}
                                      {' · '}
                                      {
                                        item.sizeCategory
                                      }
                                      {' × '}
                                      {
                                        item.quantity
                                      }
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

    </div>
  );
};

export default Reviews;