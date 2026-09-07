import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getMyCart,
  clearCart,
  addOrder,
  saveCart,
} from '../services/api';

const Cart = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [description, setDescription] =
    useState('');

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  // ==================== LOAD CART ====================

  const loadCart = async () => {
    try {
      setLoading(true);

      const data = await getMyCart();

      setCart(data || null);
    } catch (error) {
      console.error(
        'Cart loading error:',
        error
      );

      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'Unable to load your cart.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ==================== CART ITEMS ====================

  const getItems = () => {
    if (!cart) return [];

    if (Array.isArray(cart.items)) {
      return cart.items;
    }

    return [];
  };

  const items = getItems();

  // ==================== UPDATE QUANTITY ====================

  const updateQuantity = async (
    index,
    newQuantity
  ) => {
    if (newQuantity < 1) return;

    const updatedItems =
      items.map(
        (item, itemIndex) => {
          if (itemIndex !== index) {
            return item;
          }

          const unitPrice =
            Number(
              item.unitPrice || 0
            );

          return {
            ...item,
            quantity: newQuantity,
            totalPrice:
              unitPrice *
              newQuantity,
          };
        }
      );

    const updatedCart = {
      ...cart,
      items: updatedItems,
    };

    setCart(updatedCart);

    try {
      await saveCart({
        customerId: user.id,
        customerName: user.name,
        items: updatedItems,
      });
    } catch (error) {
      console.error(
        'Cart quantity update error:',
        error
      );

      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'Unable to update cart.',
      });

      await loadCart();
    }
  };

  // ==================== REMOVE ITEM ====================

  const removeItem = async (
    index
  ) => {
    const updatedItems =
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    const updatedCart = {
      ...cart,
      items: updatedItems,
    };

    setCart(updatedCart);

    try {
      if (updatedItems.length === 0) {
        await clearCart();
      } else {
        await saveCart({
          customerId: user.id,
          customerName: user.name,
          items: updatedItems,
        });
      }

      setMessage({
        type: 'success',
        text:
          'Item removed from cart.',
      });
    } catch (error) {
      console.error(
        'Remove cart item error:',
        error
      );

      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'Unable to remove item.',
      });

      await loadCart();
    }
  };

  // ==================== CLEAR CART ====================

  const handleClearCart = async () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to clear your entire cart?'
      );

    if (!confirmed) return;

    try {
      await clearCart();

      setCart(null);
      setDescription('');

      setMessage({
        type: 'success',
        text:
          'Your cart has been cleared.',
      });
    } catch (error) {
      console.error(
        'Clear cart error:',
        error
      );

      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'Unable to clear cart.',
      });
    }
  };

  // ==================== PLACE ORDER ====================

  const handlePlaceOrder = async () => {
    if (!user.id) {
      setMessage({
        type: 'danger',
        text:
          'Please login before placing an order.',
      });

      navigate('/');
      return;
    }

    if (items.length === 0) {
      setMessage({
        type: 'warning',
        text:
          'Your cart is empty. Add some delicious food first.',
      });

      return;
    }

    const cleanDescription =
      description.trim();

    try {
      setPlacingOrder(true);

      await addOrder({
        customerId: user.id,
        customerName:
          user.name || 'Customer',
        items,
        description:
          cleanDescription,
      });

      await clearCart();

      setCart(null);
      setDescription('');

      setMessage({
        type: 'success',
        text:
          '🎉 Your order has been placed successfully! Please wait a few minutes while we prepare your food.',
      });

      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (error) {
      console.error(
        'Place order error:',
        error
      );

      setMessage({
        type: 'danger',
        text:
          error.response?.data?.message ||
          'Unable to place your order. Please try again.',
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==================== EMPTY CART ====================

  if (loading) {
    return (
      <div className="cart-page container py-5">
        <div className="text-center py-5">

          <div className="spinner-border"></div>

          <p className="text-muted mt-3">
            Loading your cart...
          </p>

        </div>
      </div>
    );
  }

  // ==================== MAIN UI ====================

  return (
    <div className="cart-page container py-4">

      {/* ==================== HEADER ==================== */}

      <div className="cart-header mb-4">

        <div>
          <h2 className="fw-bold mb-2">
            🛒 My Cart
          </h2>

          <p className="text-muted mb-0">
            Review your selected items before
            placing your order.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={
              handleClearCart
            }
            disabled={
              placingOrder
            }
          >
            🗑️ Clear Cart
          </button>
        )}

      </div>

      {/* ==================== MESSAGE ==================== */}

      {message.text && (
        <div
          className={`alert alert-${message.type} cart-message`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {/* ==================== EMPTY CART ==================== */}

      {items.length === 0 ? (

        <div className="card shadow-sm cart-empty-card">

          <div className="card-body text-center py-5">

            <div className="cart-empty-icon">
              🛒
            </div>

            <h3 className="fw-bold mt-3">
              Your cart is empty
            </h3>

            <p className="text-muted mb-4">
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <button
              type="button"
              className="btn btn-warning px-4"
              onClick={() =>
                navigate('/menu')
              }
            >
              🍽️ Browse Menu
            </button>

          </div>

        </div>

      ) : (

        <div className="row g-4">

          {/* ==================== CART ITEMS ==================== */}

          <div className="col-12">

            <div className="card shadow-sm cart-items-card">

              <div className="card-header bg-white">

                <div className="d-flex justify-content-between align-items-center gap-2">

                  <h5 className="fw-bold mb-0">
                    Your Selected Items
                  </h5>

                  <span className="badge bg-dark">
                    {items.length}{' '}
                    {items.length === 1
                      ? 'item'
                      : 'items'}
                  </span>

                </div>

              </div>

              <div className="card-body p-0">

                {items.map(
                  (
                    item,
                    index
                  ) => {

                    const quantity =
                      Number(
                        item.quantity ||
                          0
                      );

                    const unitPrice =
                      Number(
                        item.unitPrice ||
                          0
                      );

                    const itemTotal =
                      Number(
                        item.totalPrice ||
                          unitPrice *
                            quantity
                      );

                    return (
                      <div
                        className="cart-item"
                        key={`${item.foodItem}-${item.sizeCategory}-${index}`}
                      >

                        {/* ITEM INFO */}

                        <div className="cart-item-info">

                          <div className="cart-food-icon">
                            🍽️
                          </div>

                          <div className="cart-food-details">

                            <h6 className="fw-bold mb-1">
                              {item.foodItem}
                            </h6>

                            <div className="text-muted small">
                              Size:{' '}
                              <strong>
                                {
                                  item.sizeCategory
                                }
                              </strong>
                            </div>

                            <div className="text-muted small">
                              ₹
                              {unitPrice.toFixed(
                                2
                              )}{' '}
                              per item
                            </div>

                          </div>

                        </div>

                        {/* QUANTITY */}

                        <div className="cart-quantity">

                          <span className="quantity-label">
                            Quantity
                          </span>

                          <div className="quantity-controls">

                            <button
                              type="button"
                              className="btn btn-outline-secondary quantity-btn"
                              onClick={() =>
                                updateQuantity(
                                  index,
                                  quantity -
                                    1
                                )
                              }
                              disabled={
                                quantity <=
                                  1 ||
                                placingOrder
                              }
                            >
                              −
                            </button>

                            <span className="quantity-value">
                              {
                                quantity
                              }
                            </span>

                            <button
                              type="button"
                              className="btn btn-outline-secondary quantity-btn"
                              onClick={() =>
                                updateQuantity(
                                  index,
                                  quantity +
                                    1
                                )
                              }
                              disabled={
                                placingOrder
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>

                        {/* TOTAL */}

                        <div className="cart-item-total">

                          <span className="item-total-label">
                            Total
                          </span>

                          <strong>
                            ₹
                            {itemTotal.toFixed(
                              2
                            )}
                          </strong>

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger remove-item-btn"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                          disabled={
                            placingOrder
                          }
                          title="Remove item"
                        >
                          🗑️
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* ==================== ORDER NOTE ==================== */}

          <div className="col-12">

            <div className="card shadow-sm order-note-card">

              <div className="card-body">

                <div className="order-note-header">

                  <div>

                    <h5 className="fw-bold mb-1">
                      📝 Special Instructions
                    </h5>

                    <p className="text-muted mb-0">
                      Add a note for the restaurant
                      if you have any special
                      requests.
                    </p>

                  </div>

                  <span className="badge bg-secondary">
                    Optional
                  </span>

                </div>

                <textarea
                  className="form-control order-note-input mt-3"
                  rows="4"
                  maxLength="1000"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Example: Less spicy, extra sauce, no onions, pack separately..."
                  disabled={
                    placingOrder
                  }
                />

                <div className="d-flex justify-content-between align-items-center mt-2 gap-2">

                  <small className="text-muted">
                    You can skip this if you
                    don't have any special
                    instructions.
                  </small>

                  <small className="text-muted text-nowrap">
                    {description.length}
                    /1000
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* ==================== PLACE ORDER ==================== */}

          <div className="col-12">

            <div className="place-order-section">

              <button
                type="button"
                className="btn btn-warning place-order-btn"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  placingOrder ||
                  items.length === 0
                }
              >
                {placingOrder
                  ? '⏳ Placing Order...'
                  : '🍽️ Place Order'}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary continue-shopping-btn"
                onClick={() =>
                  navigate('/menu')
                }
                disabled={
                  placingOrder
                }
              >
                ← Continue Shopping
              </button>

              <div className="order-note-info">

                <strong>
                  💡 What happens next?
                </strong>

                <span>
                  Your order will be sent to
                  the restaurant for confirmation.
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ==================== RESPONSIVE STYLES ==================== */}

      <style>{`

        .cart-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          min-width: 0;
          overflow-x: hidden;
          padding-bottom: 60px !important;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .cart-header h2 {
          font-size: clamp(
            1.5rem,
            3vw,
            2rem
          );
        }

        .cart-header p {
          line-height: 1.5;
        }

        .cart-message {
          overflow-wrap: anywhere;
        }

        .cart-empty-card,
        .cart-items-card,
        .order-note-card {
          border: 0;
          border-radius: 14px;
          overflow: hidden;
        }

        .cart-empty-icon {
          font-size: 60px;
        }

        .cart-item {
          display: grid;
          grid-template-columns:
            minmax(220px, 1fr)
            auto
            auto
            auto;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .cart-item:last-child {
          border-bottom: 0;
        }

        .cart-item-info {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .cart-food-icon {
          width: 50px;
          height: 50px;
          min-width: 50px;
          border-radius: 12px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .cart-food-details {
          min-width: 0;
        }

        .cart-food-details h6 {
          overflow-wrap: anywhere;
        }

        .cart-quantity {
          text-align: center;
        }

        .quantity-label,
        .item-total-label {
          display: block;
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 5px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .quantity-btn {
          width: 34px;
          height: 34px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          line-height: 1;
        }

        .quantity-value {
          min-width: 28px;
          text-align: center;
          font-weight: 700;
        }

        .cart-item-total {
          min-width: 85px;
          text-align: right;
        }

        .cart-item-total strong {
          font-size: 17px;
        }

        .remove-item-btn {
          width: 38px;
          height: 38px;
          padding: 0;
        }

        .order-note-card {
          background: #fff;
        }

        .order-note-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .order-note-header p {
          line-height: 1.5;
        }

        .order-note-input {
          resize: vertical;
          min-height: 110px;
        }

        .place-order-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .place-order-btn {
          width: min(100%, 500px);
          min-height: 50px;
          font-weight: 700;
          font-size: 16px;
        }

        .continue-shopping-btn {
          width: min(100%, 500px);
          min-height: 44px;
        }

        .order-note-info {
          width: min(100%, 500px);
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 12px 14px;
          border: 1px solid #dee2e6;
          border-radius: 10px;
          background: #f8f9fa;
          font-size: 13px;
          text-align: center;
        }

        .order-note-info span {
          color: #6c757d;
        }

        /* ==================== HALF SCREEN ==================== */

        @media (max-width: 1100px) {

          .cart-page {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .cart-item {
            grid-template-columns:
              minmax(180px, 1fr)
              auto
              auto
              auto;
            gap: 14px;
            padding: 16px;
          }

          .cart-food-icon {
            width: 44px;
            height: 44px;
            min-width: 44px;
            font-size: 21px;
          }

        }

        /* ==================== TABLET ==================== */

        @media (max-width: 991px) {

          .cart-item {
            grid-template-columns:
              minmax(0, 1fr)
              auto;
          }

          .cart-item-info {
            grid-column: 1;
          }

          .cart-quantity {
            grid-column: 2;
            grid-row: 1;
          }

          .cart-item-total {
            grid-column: 1;
            text-align: left;
          }

          .remove-item-btn {
            grid-column: 2;
            grid-row: 2;
            justify-self: end;
          }

        }

        /* ==================== MOBILE ==================== */

        @media (max-width: 576px) {

          .cart-page {
            padding-left: 10px !important;
            padding-right: 10px !important;
            padding-top: 16px !important;
          }

          .cart-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .cart-header h2 {
            font-size: 1.4rem;
          }

          .cart-header .btn {
            width: 100%;
          }

          .cart-items-card .card-header {
            padding: 13px;
          }

          .cart-item {
            grid-template-columns:
              minmax(0, 1fr)
              auto;
            gap: 12px;
            padding: 14px 12px;
          }

          .cart-food-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 19px;
          }

          .cart-food-details h6 {
            font-size: 14px;
          }

          .cart-food-details .small {
            font-size: 12px;
          }

          .cart-quantity {
            grid-column: 2;
            grid-row: 1;
          }

          .quantity-controls {
            gap: 4px;
          }

          .quantity-btn {
            width: 30px;
            height: 30px;
            font-size: 18px;
          }

          .quantity-value {
            min-width: 22px;
          }

          .cart-item-total {
            grid-column: 1;
            grid-row: 2;
            text-align: left;
          }

          .cart-item-total strong {
            font-size: 15px;
          }

          .remove-item-btn {
            grid-column: 2;
            grid-row: 2;
            align-self: center;
          }

          .order-note-card .card-body {
            padding: 15px;
          }

          .order-note-header {
            flex-direction: column;
            gap: 8px;
          }

          .order-note-header .badge {
            align-self: flex-start;
          }

          .order-note-input {
            min-height: 120px;
            font-size: 14px;
          }

          .order-note-info {
            font-size: 12px;
          }

          .cart-empty-icon {
            font-size: 50px;
          }

        }

        /* ==================== SMALL PHONES ==================== */

        @media (max-width: 380px) {

          .cart-page {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }

          .cart-item {
            padding: 12px 10px;
          }

          .cart-food-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
            font-size: 17px;
          }

          .cart-food-details h6 {
            font-size: 13px;
          }

          .quantity-btn {
            width: 28px;
            height: 28px;
          }

          .cart-item-total {
            font-size: 13px;
          }

          .order-note-input {
            min-height: 105px;
          }

        }

      `}</style>

    </div>
  );
};

export default Cart;