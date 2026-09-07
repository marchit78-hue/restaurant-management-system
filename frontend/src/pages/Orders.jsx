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

  // ==================== USER ====================

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

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        'Orders loading error:',
        error
      );

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
        const data =
          await getMyFeedback(user.id);

        setSubmittedFeedback(
          Array.isArray(data)
            ? data
            : []
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

    return () =>
      clearInterval(interval);
  }, [isAdmin]);

  // ==================== ADMIN ====================

  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    try {
      await updateOrder(order._id, {
        customerName:
          order.customerName,

        customerId:
          order.customerId,

        items:
          order.items,

        description:
          order.description || '',

        status:
          newStatus,
      });

      setFeedback({
        type: 'success',
        message:
          'Order status updated successfully.',
      });

      await fetchOrders(false);
    } catch (error) {
      console.error(
        'Status update error:',
        error
      );

      setFeedback({
        type: 'danger',
        message:
          error.response?.data?.message ||
          'Failed to update order status.',
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
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
      console.error(
        'Delete order error:',
        error
      );

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

  const getCustomerStatusMessage = (
    status
  ) => {
    switch (status) {
      case 'Pending':
        return '⏳ Your order has been received! Please wait while the restaurant confirms it.';

      case 'Confirmed':
        return '✅ Your order is confirmed! 👨‍🍳 We are preparing your food now. Please wait a few minutes.';

      case 'Preparing':
        return '👨‍🍳 Your food is being freshly prepared! It will be ready soon.';

      case 'Ready':
        return '🍽️ Your order is ready! Please collect your order and enjoy!';

      case 'Completed':
        return '🎉 Your order has been completed. Thank you for dining with us!';

      case 'Cancelled':
        return '❌ This order has been cancelled. Please contact the restaurant if you need assistance.';

      default:
        return 'Your order is being processed.';
    }
  };

  // ==================== FEEDBACK HELPERS ====================

  const hasFeedback = (orderId) => {
    return submittedFeedback.some(
      (item) =>
        String(item.orderId) ===
        String(orderId)
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

    if (
      selectedRating < 1 ||
      selectedRating > 5
    ) {
      setFeedback({
        type: 'warning',
        message:
          'Please select a rating from 1 to 5 stars.',
      });

      return;
    }

    try {
      setSubmittingFeedback(true);

      const response =
        await submitFeedback({
          orderId:
            feedbackOrder._id,

          customerId:
            user.id,

          customerName:
            user.name ||
            feedbackOrder.customerName ||
            'Customer',

          rating:
            selectedRating,

          comment:
            feedbackComment.trim(),
        });

      if (response) {
        setSubmittedFeedback(
          (previous) => [
            ...previous,
            response.feedback,
          ]
        );

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

  // ==================== CUSTOMER ORDER ====================

  const renderCustomerOrder = (
    order
  ) => {
    const billAvailable =
      order.status &&
      order.status !== 'Pending' &&
      order.status !== 'Cancelled';

    const feedbackAllowed =
      order.status === 'Confirmed' ||
      order.status === 'Preparing' ||
      order.status === 'Ready' ||
      order.status === 'Completed';

    const reviewed =
      hasFeedback(order._id);

    return (
      <div
        className="col-12"
        key={order._id}
      >

        <div className="card shadow-sm orders-card">

          {/* ORDER HEADER */}

          <div className="card-header orders-card-header">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <div className="order-heading-block">

                <h5 className="mb-1 order-title">
                  🧾 Order #
                  {order._id.slice(-6)}
                </h5>

                <small className="text-muted">
                  Your order
                </small>

              </div>

              <span
                className={`badge order-status ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

            </div>

          </div>

          {/* BODY */}

          <div className="card-body orders-card-body">

            {/* CUSTOMER STATUS */}

            <div
              className={`alert order-status-alert ${
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

            <div className="table-responsive orders-table-wrapper">

              <table className="table align-middle orders-table">

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
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={`${order._id}-${index}`}
                      >

                        <td>
                          <strong>
                            {item.foodItem}
                          </strong>
                        </td>

                        <td>
                          {
                            item.sizeCategory
                          }
                        </td>

                        <td>
                          {
                            item.quantity
                          }
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}
                        </td>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              item.totalPrice
                            ).toFixed(2)}
                          </strong>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* BILL */}

            {billAvailable && (
              <div className="mt-4 order-bill-section">

                <div className="text-center mb-3">

                  <h4 className="fw-bold">
                    🧾 Bill
                  </h4>

                  <p className="text-muted mb-0">
                    {order.status ===
                    'Confirmed'
                      ? 'Your order has been confirmed and your bill is ready.'
                      : 'Order bill'}
                  </p>

                </div>

                <div className="row justify-content-end">

                  <div className="col-md-6 col-lg-5">

                    <div className="border rounded p-4 order-bill-box">

                      <div className="d-flex justify-content-between mb-2 bill-row">

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.subtotal ||
                              0
                          ).toFixed(2)}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2 bill-row">

                        <span>
                          Tax (5%)
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.tax ||
                              0
                          ).toFixed(2)}
                        </strong>

                      </div>

                      <hr />

                      <div className="d-flex justify-content-between bill-total-row">

                        <strong>
                          Grand Total
                        </strong>

                        <strong className="fs-4">
                          ₹
                          {Number(
                            order.grandTotal ||
                              0
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

                  <div className="border rounded p-4 text-center order-feedback-box">

                    <div className="feedback-icon">
                      ⭐
                    </div>

                    <h5 className="fw-bold mt-2">
                      How was your order?
                    </h5>

                    <p className="text-muted mb-3">
                      Your rating helps us
                      improve your dining
                      experience.
                    </p>

                    <button
                      type="button"
                      className="btn btn-warning px-4"
                      onClick={() =>
                        openFeedback(
                          order
                        )
                      }
                    >
                      ⭐ Rate Your Order
                    </button>

                  </div>

                ) : (

                  <div className="alert alert-success d-flex justify-content-between align-items-center flex-wrap gap-2">

                    <div>
                      <strong>
                        ⭐ Feedback submitted
                      </strong>

                      <div className="small mt-1">
                        Thank you for
                        sharing your
                        experience!
                      </div>
                    </div>

                    <div
                      className="fs-5"
                      aria-label="Your rating"
                    >
                      {
                        submittedFeedback.find(
                          (item) =>
                            String(
                              item.orderId
                            ) ===
                            String(
                              order._id
                            )
                        )?.rating || 0
                      }
                      /5 ⭐
                    </div>

                  </div>

                )}

              </div>
            )}

            {/* WAITING */}

            {order.status ===
              'Pending' && (
              <div className="text-center mt-4 p-3 border rounded order-waiting-box">

                <div className="waiting-icon">
                  ⏳
                </div>

                <h5 className="mt-2">
                  Waiting for confirmation
                </h5>

                <p className="text-muted mb-0">
                  The restaurant is reviewing
                  your order. Once it is
                  confirmed, your bill will
                  appear and we will start
                  preparing your food.
                </p>

              </div>
            )}

            {/* CONFIRMED */}

            {order.status ===
              'Confirmed' && (
              <div className="order-progress-message confirmed-message">

                <div className="progress-message-icon">
                  👨‍🍳
                </div>

                <div>
                  <h5>
                    Your order is confirmed!
                  </h5>

                  <p>
                    Your food is being prepared.
                    Please wait a few minutes
                    while we get everything ready.
                  </p>
                </div>

              </div>
            )}

            {/* PREPARING */}

            {order.status ===
              'Preparing' && (
              <div className="order-progress-message preparing-message">

                <div className="progress-message-icon">
                  👨‍🍳
                </div>

                <div>
                  <h5>
                    We're preparing your food!
                  </h5>

                  <p>
                    Your order is being freshly
                    prepared. It will be ready soon.
                  </p>
                </div>

              </div>
            )}

            {/* READY */}

            {order.status ===
              'Ready' && (
              <div className="order-progress-message ready-message">

                <div className="progress-message-icon">
                  🍽️
                </div>

                <div>
                  <h5>
                    Your order is ready!
                  </h5>

                  <p>
                    Your delicious food is ready
                    to be collected. Enjoy your meal!
                  </p>
                </div>

              </div>
            )}

            {/* COMPLETED */}

            {order.status ===
              'Completed' && (
              <div className="order-progress-message completed-message">

                <div className="progress-message-icon">
                  🎉
                </div>

                <div>
                  <h5>
                    Order completed!
                  </h5>

                  <p>
                    Thank you for dining with
                    arch-restaurant. We hope to
                    see you again!
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    );
  };

  // ==================== ADMIN ORDER ====================

  const renderAdminOrder = (
    order
  ) => {
    return (
      <div
        className="col-12"
        key={order._id}
      >

        <div className="card shadow-sm orders-card">

          {/* HEADER */}

          <div className="card-header orders-card-header">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <div className="order-heading-block">

                <h5 className="mb-1 order-title">
                  🧾 Order #
                  {order._id.slice(-6)}
                </h5>

                <small className="text-muted">
                  Customer:{' '}
                  {order.customerName}
                </small>

              </div>

              <span
                className={`badge order-status ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

            </div>

          </div>

          {/* BODY */}

          <div className="card-body orders-card-body">

            {/* CUSTOMER NOTE */}

            {order.description &&
              order.description.trim() && (
                <div className="customer-order-note mb-4">

                  <div className="customer-note-icon">
                    📝
                  </div>

                  <div className="customer-note-content">

                    <h6 className="fw-bold mb-1">
                      Customer Note
                    </h6>

                    <p className="mb-0">
                      {order.description}
                    </p>

                  </div>

                </div>
              )}

            <div className="table-responsive orders-table-wrapper">

              <table className="table align-middle orders-table">

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
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={`${order._id}-${index}`}
                      >

                        <td>
                          <strong>
                            {item.foodItem}
                          </strong>
                        </td>

                        <td>
                          {
                            item.sizeCategory
                          }
                        </td>

                        <td>
                          {
                            item.quantity
                          }
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}
                        </td>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              item.totalPrice
                            ).toFixed(2)}
                          </strong>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* BILL SUMMARY */}

            <div className="row justify-content-end">

              <div className="col-md-5 col-lg-4">

                <div className="border rounded p-3 admin-bill-box">

                  <div className="d-flex justify-content-between mb-2">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.subtotal ||
                          0
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
                        order.tax ||
                          0
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
                        order.grandTotal ||
                          0
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ADMIN CONTROLS */}

          <div className="card-footer admin-controls">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div className="status-control">

                <label
                  className="form-label mb-1"
                  style={{
                    fontSize:
                      '13px',
                  }}
                >
                  Update Status
                </label>

                <select
                  className="form-select"
                  value={
                    order.status ||
                    'Pending'
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
                className="btn btn-danger delete-order-btn"
                onClick={() =>
                  handleDelete(
                    order._id
                  )
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
    <div className="container orders-page py-4">

      {/* HEADER */}

      <div className="mb-4 orders-page-header">

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
          className={`alert alert-${feedback.type} orders-feedback-alert`}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      {/* LOADING */}

      {loading ? (

        <div className="text-center py-5 orders-loading">

          <div className="spinner-border"></div>

          <p className="mt-3 text-muted">
            Loading orders...
          </p>

        </div>

      ) : orders.length === 0 ? (

        <div className="card shadow-sm orders-empty-card">

          <div className="card-body text-center py-5">

            <div className="empty-orders-icon">
              {isAdmin
                ? '📋'
                : '🍽️'}
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

          {orders.map(
            (order) =>
              isAdmin
                ? renderAdminOrder(
                    order
                  )
                : renderCustomerOrder(
                    order
                  )
          )}

        </div>

      )}

      {/* ==================== FEEDBACK MODAL ==================== */}

      {feedbackOrder && (
        <div
          className="modal d-block orders-feedback-modal"
          tabIndex="-1"
          style={{
            backgroundColor:
              'rgba(0, 0, 0, 0.55)',
            zIndex: 1050,
          }}
        >

          <div className="modal-dialog modal-dialog-centered feedback-modal-dialog">

            <div className="modal-content border-0 shadow-lg">

              {/* HEADER */}

              <div className="modal-header">

                <div>

                  <h5 className="modal-title fw-bold">
                    ⭐ Rate Your Order
                  </h5>

                  <small className="text-muted">
                    Order #
                    {
                      feedbackOrder._id.slice(
                        -6
                      )
                    }
                  </small>

                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={
                    closeFeedback
                  }
                  disabled={
                    submittingFeedback
                  }
                />

              </div>

              {/* BODY */}

              <div className="modal-body text-center feedback-modal-body">

                <h6 className="fw-bold mb-3">
                  How would you rate your
                  experience?
                </h6>

                {/* STARS */}

                <div className="d-flex justify-content-center gap-2 mb-4 feedback-stars">

                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                  ].map(
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
                        className="feedback-star-button"
                        style={{
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
                      selectedRating >
                      0
                        ? 'bg-warning text-dark'
                        : 'bg-secondary'
                    }`}
                  >
                    {selectedRating ===
                    0
                      ? 'Select a rating'
                      : `${selectedRating} out of 5 stars`}
                  </span>

                </div>

                {/* COMMENT */}

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
                    value={
                      feedbackComment
                    }
                    onChange={(
                      event
                    ) =>
                      setFeedbackComment(
                        event.target
                          .value
                      )
                    }
                    placeholder="Tell us what you liked about your food or experience..."
                    disabled={
                      submittingFeedback
                    }
                  />

                  <div className="text-end mt-1">

                    <small className="text-muted">
                      {
                        feedbackComment.length
                      }
                      /1000
                    </small>

                  </div>

                </div>

                <div className="alert alert-light border text-start mt-3 mb-0">

                  <small className="text-muted">
                    💡 Your review helps
                    the restaurant
                    understand what
                    customers enjoy.
                  </small>

                </div>

              </div>

              {/* FOOTER */}

              <div className="modal-footer feedback-modal-footer">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={
                    closeFeedback
                  }
                  disabled={
                    submittingFeedback
                  }
                >
                  Skip for Now
                </button>

                <button
                  type="button"
                  className="btn btn-warning px-4"
                  onClick={
                    handleSubmitFeedback
                  }
                  disabled={
                    submittingFeedback ||
                    selectedRating ===
                      0
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

      {/* ==================== RESPONSIVE STYLES ==================== */}

      <style>{`

        .orders-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          min-width: 0;
          overflow-x: hidden;
        }

        .orders-page-header h2 {
          font-size: clamp(
            1.5rem,
            3vw,
            2rem
          );
          margin-bottom: 8px;
        }

        .orders-page-header p {
          font-size: clamp(
            0.9rem,
            1.5vw,
            1rem
          );
          margin-bottom: 0;
        }

        .orders-card {
          border: 0;
          border-radius: 14px;
          overflow: hidden;
          width: 100%;
        }

        .orders-card-header {
          padding: 16px 20px;
        }

        .orders-card-body {
          padding: 20px;
        }

        .order-title {
          font-size: clamp(
            1rem,
            2vw,
            1.25rem
          );
          overflow-wrap: anywhere;
        }

        .order-status {
          font-size: 0.85rem;
          padding: 7px 11px;
          white-space: nowrap;
        }

        .order-status-alert {
          margin-bottom: 20px;
          overflow-wrap: anywhere;
          line-height: 1.5;
        }

        .orders-table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 8px;
        }

        .orders-table {
          min-width: 620px;
          margin-bottom: 0;
        }

        .orders-table th,
        .orders-table td {
          white-space: nowrap;
          vertical-align: middle;
        }

        .orders-table th:first-child,
        .orders-table td:first-child {
          min-width: 180px;
        }

        .order-bill-box,
        .admin-bill-box {
          background: #fafafa;
        }

        .bill-row,
        .bill-total-row {
          gap: 15px;
        }

        .order-feedback-box {
          background: linear-gradient(
            135deg,
            #fffaf0,
            #ffffff
          );
        }

        .feedback-icon {
          font-size: 38px;
        }

        .waiting-icon {
          font-size: 35px;
        }

        .order-waiting-box {
          overflow-wrap: anywhere;
        }

        /* ==================== CUSTOMER PROGRESS MESSAGES ==================== */

        .order-progress-message {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding: 18px;
          border-radius: 12px;
          border: 1px solid #dee2e6;
        }

        .order-progress-message h5 {
          margin-bottom: 5px;
          font-weight: 700;
        }

        .order-progress-message p {
          margin: 0;
          color: #6c757d;
          line-height: 1.5;
        }

        .progress-message-icon {
          width: 55px;
          height: 55px;
          min-width: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: #f8f9fa;
        }

        .confirmed-message {
          background: #f0faff;
        }

        .preparing-message {
          background: #f4f7ff;
        }

        .ready-message {
          background: #f0fff5;
        }

        .completed-message {
          background: #f8f9fa;
        }

        /* ==================== CUSTOMER NOTE FOR ADMIN ==================== */

        .customer-order-note {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #ffe08a;
          background: #fffaf0;
        }

        .customer-note-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff3cd;
          font-size: 22px;
        }

        .customer-note-content {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .customer-note-content p {
          line-height: 1.55;
          white-space: pre-wrap;
        }

        /* ==================== ADMIN CONTROLS ==================== */

        .admin-controls {
          padding: 16px 20px;
        }

        .status-control {
          min-width: 220px;
        }

        .delete-order-btn {
          white-space: nowrap;
        }

        /* ==================== EMPTY ==================== */

        .orders-empty-card {
          border: 0;
          border-radius: 14px;
        }

        .empty-orders-icon {
          font-size: 50px;
        }

        /* ==================== MODAL ==================== */

        .orders-feedback-modal {
          padding: 12px;
          overflow-y: auto;
        }

        .feedback-modal-dialog {
          width: 100%;
          max-width: 520px;
          margin: 20px auto;
        }

        .feedback-modal-body {
          padding: 22px;
        }

        .feedback-stars {
          font-size: 38px;
        }

        .feedback-star-button {
          border: none;
          background: transparent;
          padding: 0 3px;
          cursor: pointer;
          transition: all 0.15s ease;
          line-height: 1;
        }

        .feedback-star-button:disabled {
          cursor: not-allowed;
        }

        .feedback-modal-footer {
          gap: 8px;
        }

        /* ==================== HALF SCREEN ==================== */

        @media (max-width: 1100px) {

          .orders-page {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .orders-card-header,
          .orders-card-body {
            padding: 16px;
          }

          .orders-table {
            min-width: 600px;
          }

          .admin-controls {
            padding: 14px 16px;
          }

          .order-progress-message {
            padding: 15px;
          }

        }

        /* ==================== TABLET ==================== */

        @media (max-width: 768px) {

          .orders-page {
            padding-top: 20px !important;
            padding-bottom: 35px !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          .orders-page-header {
            margin-bottom: 20px !important;
          }

          .orders-card-header,
          .orders-card-body {
            padding: 14px;
          }

          .orders-card-header
          .d-flex {
            align-items: flex-start !important;
          }

          .order-status {
            align-self: flex-start;
          }

          .orders-table {
            min-width: 570px;
            font-size: 14px;
          }

          .orders-table th,
          .orders-table td {
            padding: 9px 8px;
          }

          .order-bill-section {
            margin-top: 24px !important;
          }

          .order-feedback-box {
            padding: 20px !important;
          }

          .admin-controls
          > .d-flex {
            align-items: stretch !important;
          }

          .status-control {
            width: 100%;
            min-width: 0;
          }

          .delete-order-btn {
            width: 100%;
          }

          .customer-order-note {
            padding: 14px;
          }

          .order-progress-message {
            align-items: flex-start;
          }

        }

        /* ==================== MOBILE ==================== */

        @media (max-width: 576px) {

          .orders-page {
            padding-left: 10px !important;
            padding-right: 10px !important;
            padding-top: 16px !important;
          }

          .orders-page-header h2 {
            font-size: 1.4rem;
          }

          .orders-page-header p {
            line-height: 1.5;
          }

          .orders-card {
            border-radius: 10px;
          }

          .orders-card-header,
          .orders-card-body {
            padding: 12px;
          }

          .order-title {
            font-size: 1rem;
          }

          .order-status {
            font-size: 0.75rem;
            padding: 6px 9px;
          }

          .order-status-alert {
            font-size: 13px;
            line-height: 1.45;
            padding: 10px 12px;
          }

          .orders-table {
            min-width: 540px;
            font-size: 13px;
          }

          .orders-table th,
          .orders-table td {
            padding: 8px 7px;
          }

          .orders-table th:first-child,
          .orders-table td:first-child {
            min-width: 150px;
          }

          .order-bill-box {
            padding: 14px !important;
          }

          .bill-row,
          .bill-total-row {
            font-size: 14px;
          }

          .bill-total-row .fs-4 {
            font-size: 1.15rem !important;
          }

          .order-feedback-box {
            padding: 18px 12px !important;
          }

          .order-feedback-box h5 {
            font-size: 1rem;
          }

          .order-feedback-box p {
            font-size: 13px;
            line-height: 1.5;
          }

          .order-feedback-box .btn {
            width: 100%;
          }

          .order-waiting-box {
            padding: 14px !important;
          }

          .order-waiting-box h5 {
            font-size: 1rem;
          }

          .order-waiting-box p {
            font-size: 13px;
            line-height: 1.5;
          }

          .admin-bill-box {
            padding: 12px !important;
          }

          .admin-controls {
            padding: 12px;
          }

          .delete-order-btn {
            min-height: 42px;
          }

          .customer-order-note {
            flex-direction: column;
            gap: 10px;
            padding: 13px;
          }

          .customer-note-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 20px;
          }

          .customer-note-content h6 {
            font-size: 14px;
          }

          .customer-note-content p {
            font-size: 13px;
          }

          .order-progress-message {
            gap: 12px;
            padding: 14px;
          }

          .progress-message-icon {
            width: 45px;
            height: 45px;
            min-width: 45px;
            font-size: 23px;
          }

          .order-progress-message h5 {
            font-size: 15px;
          }

          .order-progress-message p {
            font-size: 13px;
          }

          .feedback-modal-dialog {
            margin: 10px auto;
          }

          .feedback-modal-body {
            padding: 18px 14px;
          }

          .feedback-stars {
            font-size: 32px;
            gap: 5px !important;
          }

          .feedback-star-button {
            padding: 0 2px;
          }

          .feedback-modal-footer {
            display: flex;
            flex-direction: column-reverse;
            padding: 12px;
          }

          .feedback-modal-footer .btn {
            width: 100%;
            min-height: 42px;
          }

        }

        /* ==================== SMALL MOBILE ==================== */

        @media (max-width: 400px) {

          .orders-page {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }

          .orders-page-header h2 {
            font-size: 1.25rem;
          }

          .orders-card-header,
          .orders-card-body {
            padding: 10px;
          }

          .order-title {
            font-size: 0.95rem;
          }

          .orders-table {
            min-width: 510px;
            font-size: 12px;
          }

          .orders-table th,
          .orders-table td {
            padding: 7px 6px;
          }

          .orders-table th:first-child,
          .orders-table td:first-child {
            min-width: 135px;
          }

          .feedback-stars {
            font-size: 29px;
          }

          .feedback-modal-body {
            padding: 16px 12px;
          }

          .feedback-modal-body textarea {
            font-size: 14px;
          }

          .order-progress-message {
            padding: 12px;
          }

          .progress-message-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 20px;
          }

        }

        /* ==================== VERY SMALL PHONES ==================== */

        @media (max-width: 350px) {

          .orders-page-header h2 {
            font-size: 1.15rem;
          }

          .orders-page-header p {
            font-size: 12px;
          }

          .orders-table {
            min-width: 490px;
          }

          .orders-table th,
          .orders-table td {
            padding: 6px 5px;
          }

          .feedback-stars {
            font-size: 26px;
            gap: 3px !important;
          }

          .order-progress-message {
            gap: 9px;
          }

          .progress-message-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
            font-size: 18px;
          }

        }

        /* Prevent hover effects from causing mobile layout issues */

        @media (hover: hover) {

          .orders-card {
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
          }

          .orders-card:hover {
            transform: translateY(-2px);
          }

        }

      `}</style>

    </div>
  );
};

export default Orders;