import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMenu,
  addOrder,
  saveCart,
  getMyCart,
  clearCart,
} from '../services/api';
import './Menu.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85';

const Menu = () => {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [cartLoaded, setCartLoaded] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // =========================
  // LOAD MENU + CART
  // =========================

  useEffect(() => {
    fetchMenu();
    loadCart();
  }, []);

  // =========================
  // FETCH MENU
  // =========================

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const data = await getMenu();

      setMenuItems(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        'Menu loading error:',
        error
      );

      setFeedback(
        'Unable to load the menu. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD CART
  // =========================

  const loadCart = async () => {
    try {
      const savedCart =
        localStorage.getItem(
          'archRestaurantCart'
        );

      let localCart = [];

      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
        } catch {
          localStorage.removeItem(
            'archRestaurantCart'
          );
        }
      }

      const userData = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      if (userData.id) {
        try {
          const backendCart =
            await getMyCart();

          if (
            backendCart &&
            Array.isArray(
              backendCart.items
            ) &&
            backendCart.items.length > 0
          ) {
            setCart(
              backendCart.items
            );
          } else {
            setCart(localCart);
          }
        } catch (error) {
          console.error(
            'Backend cart loading error:',
            error
          );

          setCart(localCart);
        }
      } else {
        setCart(localCart);
      }
    } finally {
      setCartLoaded(true);
    }
  };

  // =========================
  // SAVE CART
  // =========================

  useEffect(() => {
    if (!cartLoaded) return;

    localStorage.setItem(
      'archRestaurantCart',
      JSON.stringify(cart)
    );

    syncCartWithBackend();
  }, [cart, cartLoaded]);

  const syncCartWithBackend = async () => {
    const userData = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    if (!userData.id || !userData.name) {
      return;
    }

    try {
      await saveCart({
        customerName: userData.name,

        items: cart.map((item) => ({
          foodItem: item.foodItem,
          sizeCategory:
            item.sizeCategory,
          quantity: Number(
            item.quantity
          ),
          unitPrice: Number(
            item.unitPrice
          ),
        })),
      });
    } catch (error) {
      console.error(
        'Cart synchronization error:',
        error
      );
    }
  };

  // =========================
  // SELECTED SIZE
  // =========================

  const getSelectedSize = (item) => {
    return (
      selectedSizes[item._id] ||
      'Half'
    );
  };

  // =========================
  // SELECTED PRICE
  // =========================

  const getSelectedPrice = (item) => {
    const size =
      getSelectedSize(item);

    if (size === 'Full') {
      return Number(
        item.fullPrice || 0
      );
    }

    return Number(
      item.halfPrice || 0
    );
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (item) => {

    // Do not allow unavailable items
    if (item.isAvailable === false) {
      setFeedback(
        `${item.foodName} is currently unavailable.`
      );

      setTimeout(() => {
        setFeedback('');
      }, 2500);

      return;
    }

    const selectedSize =
      getSelectedSize(item);

    const selectedPrice =
      getSelectedPrice(item);

    if (!selectedPrice) {
      setFeedback(
        'This size does not have a valid price.'
      );

      return;
    }

    const existingItemIndex =
      cart.findIndex(
        (cartItem) =>
          cartItem.foodItem ===
            item.foodName &&
          cartItem.sizeCategory ===
            selectedSize
      );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];

      updatedCart[
        existingItemIndex
      ].quantity += 1;

      updatedCart[
        existingItemIndex
      ].totalPrice =
        updatedCart[
          existingItemIndex
        ].quantity *
        Number(
          updatedCart[
            existingItemIndex
          ].unitPrice
        );

      setCart(updatedCart);
    } else {
      const newItem = {
        foodItem: item.foodName,

        sizeCategory:
          selectedSize,

        quantity: 1,

        unitPrice:
          selectedPrice,

        totalPrice:
          selectedPrice,
      };

      setCart([
        ...cart,
        newItem,
      ]);
    }

    setFeedback(
      `${item.foodName} (${selectedSize}) added to cart.`
    );

    setTimeout(() => {
      setFeedback('');
    }, 2000);
  };

  // =========================
  // UPDATE CART QUANTITY
  // =========================

  const updateQuantity = (
    index,
    change
  ) => {
    const updatedCart = [...cart];

    updatedCart[index].quantity +=
      change;

    if (
      updatedCart[index].quantity <=
      0
    ) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].totalPrice =
        updatedCart[index].quantity *
        Number(
          updatedCart[index].unitPrice
        );
    }

    setCart(updatedCart);
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeFromCart = (index) => {
    const updatedCart = [...cart];

    updatedCart.splice(index, 1);

    setCart(updatedCart);
  };

  // =========================
  // CART TOTALS
  // =========================

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(
          item.totalPrice || 0
        ),
      0
    );
  }, [cart]);

  const tax = subtotal * 0.05;

  const grandTotal =
    subtotal + tax;

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder =
    async () => {

      if (cart.length === 0) {
        setFeedback(
          'Your cart is empty.'
        );

        return;
      }

      const userData =
        JSON.parse(
          localStorage.getItem(
            'user'
          ) || '{}'
        );

      if (!userData.id) {
        setFeedback(
          'Please login before placing an order.'
        );

        navigate('/');

        return;
      }

      try {
        setPlacingOrder(true);
        setFeedback('');

        const orderData = {
          customerName:
            userData.name ||
            'Customer',

          customerId:
            userData.id,

          items: cart.map(
            (item) => ({
              foodItem:
                item.foodItem,

              sizeCategory:
                item.sizeCategory,

              quantity: Number(
                item.quantity
              ),

              unitPrice: Number(
                item.unitPrice
              ),
            })
          ),
        };

        const response =
          await addOrder(
            orderData
          );

        if (response) {
          await clearCart();

          setCart([]);

          localStorage.removeItem(
            'archRestaurantCart'
          );

          setFeedback(
            'Order placed successfully! Your bill is ready.'
          );

          setTimeout(() => {
            navigate('/orders');
          }, 800);
        }
      } catch (error) {
        console.error(
          'Order placement error:',
          error
        );

        setFeedback(
          error?.response?.data
            ?.message ||
            'Unable to place order. Please try again.'
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="mt-3">
          Loading menu...
        </p>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="menu-page">

      {/* =========================
          HEADER
      ========================== */}

      <div className="menu-header text-center mb-5">

        <h1 className="fw-bold">
          Our Menu
        </h1>

        <p className="text-muted">
          Choose your favourite food,
          select Half or Full,
          and add it to your cart.
        </p>

      </div>


      {/* =========================
          FEEDBACK
      ========================== */}

      {feedback && (
        <div
          className="alert alert-info text-center"
          role="alert"
        >
          {feedback}
        </div>
      )}


      {/* =========================
          MENU GRID
      ========================== */}

      <div className="row g-4">

        {menuItems.map(
          (item) => {

            const selectedSize =
              getSelectedSize(item);

            const selectedPrice =
              getSelectedPrice(item);

            const unavailable =
              item.isAvailable === false;

            return (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={item._id}
              >

                <div
                  className={`card h-100 shadow-sm border-0 overflow-hidden ${
                    unavailable
                      ? 'opacity-75'
                      : ''
                  }`}
                >

                  {/* =========================
                      FOOD IMAGE
                  ========================== */}

                  <div
                    style={{
                      position: 'relative',
                    }}
                  >

                    <img
                      src={
                        item.image?.trim()
                          ? item.image
                          : FALLBACK_IMAGE
                      }
                      alt={item.foodName}
                      className="food-image card-img-top"
                      onError={(event) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          FALLBACK_IMAGE;
                      }}
                    />

                    {/* UNAVAILABLE BADGE */}

                    {unavailable && (
                      <div
                        style={{
                          position:
                            'absolute',
                          top: '15px',
                          left: '15px',
                          right: '15px',
                          textAlign:
                            'center',
                        }}
                      >
                        <span className="badge bg-danger fs-6 px-3 py-2">
                          ❌ Currently Unavailable
                        </span>
                      </div>
                    )}

                  </div>


                  {/* =========================
                      CARD BODY
                  ========================== */}

                  <div className="card-body d-flex flex-column">

                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

                      <h3 className="card-title fw-bold mb-0">
                        {item.foodName}
                      </h3>

                      {/* STATUS */}

                      <span
                        className={`badge ${
                          unavailable
                            ? 'bg-danger'
                            : 'bg-success'
                        }`}
                      >
                        {unavailable
                          ? 'Unavailable'
                          : 'Available'}
                      </span>

                    </div>


                    {/* =========================
                        SIZE BUTTONS
                    ========================== */}

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Select Size
                      </label>

                      <div className="d-flex gap-2">

                        <button
                          type="button"
                          disabled={unavailable}
                          className={`btn flex-fill ${
                            selectedSize ===
                            'Half'
                              ? 'btn-dark'
                              : 'btn-outline-dark'
                          }`}
                          onClick={() =>
                            setSelectedSizes(
                              (
                                previous
                              ) => ({
                                ...previous,
                                [item._id]:
                                  'Half',
                              })
                            )
                          }
                        >
                          🥣 Half
                          <br />
                          <strong>
                            ₹
                            {Number(
                              item.halfPrice ||
                                0
                            ).toFixed(
                              2
                            )}
                          </strong>
                        </button>


                        <button
                          type="button"
                          disabled={unavailable}
                          className={`btn flex-fill ${
                            selectedSize ===
                            'Full'
                              ? 'btn-dark'
                              : 'btn-outline-dark'
                          }`}
                          onClick={() =>
                            setSelectedSizes(
                              (
                                previous
                              ) => ({
                                ...previous,
                                [item._id]:
                                  'Full',
                              })
                            )
                          }
                        >
                          🍽️ Full
                          <br />
                          <strong>
                            ₹
                            {Number(
                              item.fullPrice ||
                                0
                            ).toFixed(
                              2
                            )}
                          </strong>
                        </button>

                      </div>

                    </div>


                    {/* =========================
                        PRICE
                    ========================== */}

                    <div className="mb-3">

                      <span className="text-muted">
                        Selected:{' '}
                        {selectedSize}
                      </span>

                      <div className="fs-3 fw-bold">
                        ₹
                        {selectedPrice.toFixed(
                          2
                        )}
                      </div>

                    </div>


                    {/* =========================
                        ADD TO CART
                    ========================== */}

                    <button
                      type="button"
                      className={`btn w-100 mt-auto ${
                        unavailable
                          ? 'btn-secondary'
                          : 'btn-primary'
                      }`}
                      onClick={() =>
                        addToCart(item)
                      }
                      disabled={
                        unavailable
                      }
                    >
                      {unavailable
                        ? '🚫 Item Unavailable'
                        : '🛒 Add to Cart'}
                    </button>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>


      {/* =========================
          EMPTY MENU
      ========================== */}

      {menuItems.length === 0 && (
        <div className="text-center py-5">

          <h4>
            No menu items available.
          </h4>

          <p className="text-muted">
            Please check back later.
          </p>

        </div>
      )}


      {/* =========================
          CART
      ========================== */}

      <div className="card shadow-sm border-0 mt-5">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="fw-bold mb-0">
              🛒 Your Cart
            </h2>

            <span className="badge bg-dark fs-6">
              {cart.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.quantity || 0
                  ),
                0
              )}{' '}
              items
            </span>

          </div>


          {cart.length === 0 ? (

            <div className="text-center py-4">

              <div className="fs-1">
                🛒
              </div>

              <h5 className="mt-3">
                Your cart is empty
              </h5>

              <p className="text-muted">
                Add something delicious
                from the menu.
              </p>

            </div>

          ) : (

            <>

              {/* CART ITEMS */}

              <div className="list-group mb-4">

                {cart.map(
                  (item, index) => (

                    <div
                      key={`${item.foodItem}-${item.sizeCategory}-${index}`}
                      className="list-group-item"
                    >

                      <div className="row align-items-center g-3">

                        {/* ITEM */}

                        <div className="col-12 col-md-4">

                          <h6 className="fw-bold mb-1">
                            {item.foodItem}
                          </h6>

                          <small className="text-muted">
                            Size:{' '}
                            {
                              item.sizeCategory
                            }
                          </small>

                        </div>


                        {/* QUANTITY */}

                        <div className="col-6 col-md-3">

                          <div className="d-flex align-items-center gap-2">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                updateQuantity(
                                  index,
                                  -1
                                )
                              }
                            >
                              −
                            </button>

                            <span className="fw-bold">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                updateQuantity(
                                  index,
                                  1
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>


                        {/* PRICE */}

                        <div className="col-4 col-md-3">

                          <div className="fw-bold">
                            ₹
                            {Number(
                              item.totalPrice ||
                                0
                            ).toFixed(
                              2
                            )}
                          </div>

                          <small className="text-muted">
                            ₹
                            {Number(
                              item.unitPrice ||
                                0
                            ).toFixed(
                              2
                            )}{' '}
                            each
                          </small>

                        </div>


                        {/* REMOVE */}

                        <div className="col-2 col-md-2 text-end">

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              removeFromCart(
                                index
                              )
                            }
                            title="Remove item"
                          >
                            🗑️
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* =========================
                  TOTALS
              ========================== */}

              <div className="row justify-content-end">

                <div className="col-12 col-md-6 col-lg-4">

                  <div className="border rounded p-3">

                    <div className="d-flex justify-content-between mb-2">

                      <span>
                        Subtotal
                      </span>

                      <strong>
                        ₹
                        {subtotal.toFixed(
                          2
                        )}
                      </strong>

                    </div>


                    <div className="d-flex justify-content-between mb-2">

                      <span>
                        Tax (5%)
                      </span>

                      <strong>
                        ₹
                        {tax.toFixed(
                          2
                        )}
                      </strong>

                    </div>


                    <hr />


                    <div className="d-flex justify-content-between mb-3">

                      <span className="fw-bold">
                        Grand Total
                      </span>

                      <strong className="fs-5">
                        ₹
                        {grandTotal.toFixed(
                          2
                        )}
                      </strong>

                    </div>


                    {/* PLACE ORDER */}

                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={
                        handlePlaceOrder
                      }
                      disabled={
                        placingOrder
                      }
                    >
                      {placingOrder
                        ? 'Placing Order...'
                        : '✅ Place Order'}
                    </button>

                  </div>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default Menu;