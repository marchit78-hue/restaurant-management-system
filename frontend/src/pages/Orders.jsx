import { useEffect, useState } from 'react';

import {
  deleteOrder,
  getOrders,
  updateOrder,
  submitFeedback,
  getMyFeedback,
} from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  });

  const [loading, setLoading] = useState(true);

  // ==================== CUSTOMER FEEDBACK ====================

  const [submittedFeedback, setSubmittedFeedback] =
    useState([]);

  const [feedbackOrder, setFeedbackOrder] =
    useState(null);

  const [selectedRating, setSelectedRating] =
    useState(0);

  const [feedbackComment, setFeedbackComment] =
    useState('');

  const [submittingFeedback, setSubmittingFeedback] =
    useState(false);

  // Check logged-in user's role
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  const isAdmin = user.role === 'admin';

  // ==================== FETCH ORDERS ====================

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const data = await getOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Orders loading error:', error);

      setFeedback({
        type: 'danger',
        message:
          error.response?.data?.message ||
          'Failed to load orders.',
      });
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==================== LOAD CUSTOMER FEEDBACK ====================

  useEffect(() => {
    if (isAdmin || !user.id) return;

    const loadMyFeedback = async () => {
      try {
        const data = await getMyFeedback(user.id);

        setSubmittedFeedback(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          'Feedback loading error:',
          error
        );
      }
    };

    loadMyFeedback();
  }, [isAdmin, user.id]);

  // ==================== CUSTOMER AUTO REFRESH ====================
  // Checks for status changes every 5 seconds.

  useEffect(() => {
    if (isAdmin) return;

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  // ==================== ADMIN ====================

  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    try {
      await updateOrder(order._id, {
        customerName: order.customerName,
        customerId: order.customerId,
        items: order.items,
        status: newStatus,
      });

      setFeedback({
        type: 'success',
        message:
          'Order status updated successfully.',
      });

      await fetchOrders(false);
    } catch (error) {
      console.error('Status update error:', error);

      setFeedback({
        type: 'danger',
        message:
          error.response?.data?.message ||
          'Failed to update order status.',
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this order?'
    );

    if (!confirmed) return;

    try {
      await deleteOrder(id);

      setFeedback({
        type: 'success',
        message:
          'Order deleted successfully.',
      });

      await fetchOrders(false);
    } catch (error) {
      console.error('Delete order error:', error);

      setFeedback({
        type: 'danger',
        message:
          error.response?.data?.message ||
          'Failed to delete order.',
      });
    }
  };

  // ==================== STATUS STYLE ====================

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';

      case 'Confirmed':
        return 'bg-info text-dark';

      case 'Preparing':
        return 'bg-primary';

      case 'Ready':
        return 'bg-success';

      case 'Completed':
        return 'bg-dark';

      case 'Cancelled':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }
  };

  // ==================== CUSTOMER STATUS MESSAGE ====================

  const getCustomerStatusMessage = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳ Waiting for restaurant confirmation...';

      case 'Confirmed':
        return '✅ Your order has been confirmed!';

      case 'Preparing':
        return '👨‍🍳 Your delicious food is being prepared!';

      case 'Ready':
        return '🍽️ Your order is ready!';

      case 'Completed':
        return '🎉 Order completed. Thank you for dining with us!';

      case 'Cancelled':
        return '❌ This order has been cancelled.';

      default:
        return 'Your order is being processed.';
    }
  };

  // ==================== FEEDBACK HELPERS ====================

  const hasFeedback = (orderId) => {
    return submittedFeedback.some(
      (item) =>
        String(item.orderId) === String(orderId)
    );
  };

  const openFeedback = (order) => {
    setFeedbackOrder(order);
    setSelectedRating(0);
    setFeedbackComment('');
  };

  const closeFeedback = () => {
    if (submittingFeedback) return;

    setFeedbackOrder(null);
    setSelectedRating(0);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackOrder) return;

    if (selectedRating < 1 || selectedRating > 5) {
      setFeedback({
        type: 'warning',
        message:
          'Please select a rating from 1 to 5 stars.',
      });

      return;
    }

    try {
      setSubmittingFeedback(true);

      const response = await submitFeedback({
        orderId: feedbackOrder._id,
        customerId: user.id,
        customerName:
          user.name ||
          feedbackOrder.customerName ||
          'Customer',
        rating: selectedRating,
        comment: feedbackComment.trim(),
      });

      if (response) {
        setSubmittedFeedback((previous) => [
          ...previous,
          response.feedback,
        ]);

        setFeedbackOrder(null);
        setSelectedRating(0);
        setFeedbackComment('');

        setFeedback({
          type: 'success',
          message:
            '⭐ Thank you! Your feedback has been submitted.',
        });
      }
    } catch (error) {
      console.error(
        'Submit feedback error:',
        error
      );

      setFeedback({
        type: 'danger',
        message:
          error.response?.data?.message ||
          'Unable to submit feedback.',
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // ==================== CUSTOMER ====================

  const renderCustomerOrder = (order) => {
    const billAvailable =
      order.status &&
      order.status !== 'Pending' &&
      order.status !== 'Cancelled';

    const feedbackAllowed =
  order.status === 'Confirmed' ||
  order.status === 'Preparing' ||
  order.status === 'Ready' ||
  order.status === 'Completed';

const reviewed = hasFeedback(order._id);

    return (
      <div
        className="col-12"
        key={order._id}
      >
        <div className="card shadow-sm">

          {/* ORDER HEADER */}

          <div className="card-header">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <div>

                <h5 className="mb-1">
                  🧾 Order #{order._id.slice(-6)}
                </h5>

                <small className="text-muted">
                  Your order
                </small>

              </div>

              <span
                className={`badge ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

            </div>

          </div>

          {/* CUSTOMER STATUS */}

          <div className="card-body">

            <div
              className={`alert ${
                order.status === 'Cancelled'
                  ? 'alert-danger'
                  : order.status === 'Pending'
                  ? 'alert-warning'
                  : 'alert-success'
              }`}
            >
              <strong>
                {getCustomerStatusMessage(
                  order.status
                )}
              </strong>
            </div>

            {/* ITEMS */}

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>

                  {order.items?.map(
                    (item, index) => (
                      <tr
                        key={`${order._id}-${index}`}
                      >

                        <td>
                          <strong>
                            {item.foodItem}
                          </strong>
                        </td>

                        <td>
                          {item.sizeCategory}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.totalPrice
                          ).toFixed(2)}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* BILL */}

            {billAvailable && (
              <div className="mt-4">

                <div className="text-center mb-3">

                  <h4 className="fw-bold">
                    🧾 Bill
                  </h4>

                  <p className="text-muted mb-0">
                    {order.status === 'Confirmed'
                      ? 'Your order has been confirmed and your bill is ready.'
                      : 'Order bill'}
                  </p>

                </div>

                <div className="row justify-content-end">

                  <div className="col-md-6">

                    <div
                      className="border rounded p-4"
                      style={{
                        background: '#fafafa',
                      }}
                    >

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.subtotal || 0
                          ).toFixed(2)}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Tax (5%)
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.tax || 0
                          ).toFixed(2)}
                        </strong>

                      </div>

                      <hr />

                      <div className="d-flex justify-content-between">

                        <strong>
                          Grand Total
                        </strong>

                        <strong className="fs-4">
                          ₹
                          {Number(
                            order.grandTotal || 0
                          ).toFixed(2)}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* FEEDBACK */}

            {feedbackAllowed && (
              <div className="mt-4">

                {!reviewed ? (
                  <div
                    className="border rounded p-4 text-center"
                    style={{
                      background:
                        'linear-gradient(135deg, #fffaf0, #ffffff)',
                    }}
                  >

                    <div
                      style={{
                        fontSize: '38px',
                      }}
                    >
                      ⭐
                    </div>

                    <h5 className="fw-bold mt-2">
                      How was your order?
                    </h5>

                    <p className="text-muted mb-3">
                      Your rating helps us improve
                      your dining experience.
                    </p>

                    <button
                      type="button"
                      className="btn btn-warning px-4"
                      onClick={() =>
                        openFeedback(order)
                      }
                    >
                      ⭐ Rate Your Order
                    </button>

                  </div>
                ) : (
                  <div
                    className="alert alert-success d-flex justify-content-between align-items-center flex-wrap gap-2"
                  >
                    <div>
                      <strong>
                        ⭐ Feedback submitted
                      </strong>

                      <div className="small mt-1">
                        Thank you for sharing your
                        experience!
                      </div>
                    </div>

                    <div
                      className="fs-5"
                      aria-label="Your rating"
                    >
                      {submittedFeedback.find(
                        (item) =>
                          String(
                            item.orderId
                          ) ===
                          String(order._id)
                      )?.rating || 0}
                      /5 ⭐
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* WAITING FOR CONFIRMATION */}

            {order.status === 'Pending' && (
              <div className="text-center mt-4 p-3 border rounded">

                <div
                  style={{
                    fontSize: '35px',
                  }}
                >
                  ⏳
                </div>

                <h5 className="mt-2">
                  Bill will appear after confirmation
                </h5>

                <p className="text-muted mb-0">
                  The restaurant is reviewing your
                  order. This page will update
                  automatically.
                </p>

              </div>
            )}

          </div>

        </div>
      </div>
    );
  };

  // ==================== ADMIN ====================

  const renderAdminOrder = (order) => {
    return (
      <div
        className="col-12"
        key={order._id}
      >

        <div className="card shadow-sm">

          {/* HEADER */}

          <div className="card-header">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <div>

                <h5 className="mb-1">
                  🧾 Order #{order._id.slice(-6)}
                </h5>

                <small className="text-muted">
                  Customer: {order.customerName}
                </small>

              </div>

              <span
                className={`badge ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

            </div>

          </div>

          {/* BODY */}

          <div className="card-body">

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Item Total</th>
                  </tr>
                </thead>

                <tbody>

                  {order.items?.map(
                    (item, index) => (
                      <tr
                        key={`${order._id}-${index}`}
                      >

                        <td>
                          <strong>
                            {item.foodItem}
                          </strong>
                        </td>

                        <td>
                          {item.sizeCategory}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.totalPrice
                          ).toFixed(2)}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* BILL SUMMARY */}

            <div className="row justify-content-end">

              <div className="col-md-5">

                <div className="border rounded p-3">

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.subtotal || 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Tax (5%)
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.tax || 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <strong>
                      Grand Total
                    </strong>

                    <strong className="fs-5">
                      ₹
                      {Number(
                        order.grandTotal || 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ADMIN CONTROLS */}

          <div className="card-footer">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div>

                <label
                  className="form-label mb-1"
                  style={{
                    fontSize: '13px',
                  }}
                >
                  Update Status
                </label>

                <select
                  className="form-select"
                  value={
                    order.status || 'Pending'
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      order,
                      e.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Preparing">
                    Preparing
                  </option>

                  <option value="Ready">
                    Ready
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  handleDelete(order._id)
                }
              >
                🗑️ Delete Order
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // ==================== MAIN UI ====================

  return (
    <div className="container py-4">

      {/* HEADER */}

      <div className="mb-4">

        <h2 className="fw-bold">
          {isAdmin
            ? '📋 Customer Orders'
            : '🧾 My Orders'}
        </h2>

        <p className="text-muted">
          {isAdmin
            ? 'View and manage all customer orders.'
            : 'Track your orders and view your bill.'}
        </p>

      </div>

      {/* FEEDBACK MESSAGE */}

      {feedback.message && (
        <div
          className={`alert alert-${feedback.type}`}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      {/* LOADING */}

      {loading ? (

        <div className="text-center py-5">

          <div className="spinner-border"></div>

          <p className="mt-3 text-muted">
            Loading orders...
          </p>

        </div>

      ) : orders.length === 0 ? (

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <div
              style={{
                fontSize: '50px',
              }}
            >
              {isAdmin ? '📋' : '🍽️'}
            </div>

            <h4 className="mt-3">
              {isAdmin
                ? 'No customer orders yet'
                : 'You have no orders yet'}
            </h4>

            <p className="text-muted">
              {isAdmin
                ? 'Orders will appear here when customers place them.'
                : 'Visit the menu and place your first order.'}
            </p>

          </div>

        </div>

      ) : (

        <div className="row g-4">

          {orders.map((order) =>
            isAdmin
              ? renderAdminOrder(order)
              : renderCustomerOrder(order)
          )}

        </div>

      )}

      {/* ==================== FEEDBACK MODAL ==================== */}

      {feedbackOrder && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              'rgba(0, 0, 0, 0.55)',
            zIndex: 1050,
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content border-0 shadow-lg">

              {/* MODAL HEADER */}

              <div className="modal-header">

                <div>

                  <h5 className="modal-title fw-bold">
                    ⭐ Rate Your Order
                  </h5>

                  <small className="text-muted">
                    Order #
                    {feedbackOrder._id.slice(-6)}
                  </small>

                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeFeedback}
                  disabled={submittingFeedback}
                />

              </div>

              {/* MODAL BODY */}

              <div className="modal-body text-center">

                <h6 className="fw-bold mb-3">
                  How would you rate your
                  experience?
                </h6>

                {/* STARS */}

                <div
                  className="d-flex justify-content-center gap-2 mb-4"
                  style={{
                    fontSize: '38px',
                  }}
                >

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setSelectedRating(
                            star
                          )
                        }
                        disabled={
                          submittingFeedback
                        }
                        aria-label={`${star} star`}
                        style={{
                          border: 'none',
                          background:
                            'transparent',
                          padding: '0 3px',
                          cursor:
                            submittingFeedback
                              ? 'not-allowed'
                              : 'pointer',
                          opacity:
                            selectedRating >=
                            star
                              ? 1
                              : 0.25,
                          transform:
                            selectedRating ===
                            star
                              ? 'scale(1.15)'
                              : 'scale(1)',
                          transition:
                            'all 0.15s ease',
                        }}
                      >
                        ⭐
                      </button>
                    )
                  )}

                </div>

                <div className="mb-3">

                  <span
                    className={`badge ${
                      selectedRating > 0
                        ? 'bg-warning text-dark'
                        : 'bg-secondary'
                    }`}
                  >
                    {selectedRating === 0
                      ? 'Select a rating'
                      : `${selectedRating} out of 5 stars`}
                  </span>

                </div>

                {/* OPTIONAL COMMENT */}

                <div className="text-start">

                  <label
                    htmlFor="feedbackComment"
                    className="form-label fw-semibold"
                  >
                    Your Review
                    <span className="text-muted fw-normal">
                      {' '}
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="feedbackComment"
                    className="form-control"
                    rows="4"
                    maxLength="1000"
                    value={feedbackComment}
                    onChange={(event) =>
                      setFeedbackComment(
                        event.target.value
                      )
                    }
                    placeholder="Tell us what you liked about your food or experience..."
                    disabled={submittingFeedback}
                  />

                  <div className="text-end mt-1">

                    <small className="text-muted">
                      {feedbackComment.length}
                      /1000
                    </small>

                  </div>

                </div>

                <div className="alert alert-light border text-start mt-3 mb-0">

                  <small className="text-muted">
                    💡 Your review helps the
                    restaurant understand what
                    customers enjoy.
                  </small>

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeFeedback}
                  disabled={submittingFeedback}
                >
                  Skip for Now
                </button>

                <button
                  type="button"
                  className="btn btn-warning px-4"
                  onClick={handleSubmitFeedback}
                  disabled={
                    submittingFeedback ||
                    selectedRating === 0
                  }
                >
                  {submittingFeedback
                    ? 'Submitting...'
                    : '⭐ Submit Feedback'}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Orders;