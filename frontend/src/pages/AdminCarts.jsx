import { useEffect, useState } from 'react';
import { getAllCarts } from '../services/api';

function AdminCarts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] =
    useState(null);
  const [error, setError] = useState('');

  const loadCarts = async () => {
    try {
      setError('');

      const data = await getAllCarts();

      const cartData = Array.isArray(data)
        ? data
        : data?.carts || [];

      setCarts(cartData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        'Admin carts loading error:',
        error
      );

      setError(
        error?.response?.data?.message ||
          'Unable to load customer carts.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();

    const interval = setInterval(() => {
      loadCarts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCartItems = (cart) => {
    if (!Array.isArray(cart?.items)) {
      return [];
    }

    return cart.items;
  };

  const getCustomerName = (cart) => {
    return (
      cart?.customerName ||
      cart?.user?.name ||
      cart?.customer?.name ||
      'Customer'
    );
  };

  const getCustomerUserId = (cart) => {
    return (
      cart?.user?.userId ||
      cart?.customer?.userId ||
      cart?.userId ||
      '—'
    );
  };

  const getCartTotal = (cart) => {
    return getCartItems(cart).reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const unitPrice =
          Number(item.unitPrice) || 0;

        return (
          total +
          quantity * unitPrice
        );
      },
      0
    );
  };

  const getItemTotal = (item) => {
    const quantity =
      Number(item.quantity) || 0;

    const unitPrice =
      Number(item.unitPrice) || 0;

    return quantity * unitPrice;
  };

  const activeCarts = carts.filter(
    (cart) =>
      getCartItems(cart).length > 0
  );

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: '#f5f6f8',
        padding: '35px',
        boxSizing: 'border-box',
      }}
    >

      {/* PAGE HEADER */}

      <div
        style={{
          background: '#20262b',
          color: '#fff',
          borderRadius: '14px',
          padding: '28px 32px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          boxShadow:
            '0 8px 25px rgba(0,0,0,0.12)',
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '800',
            }}
          >
            🛒 Live Customer Carts
          </h1>

          <p
            style={{
              margin:
                '8px 0 0',
              color:
                'rgba(255,255,255,0.75)',
            }}
          >
            Monitor what customers currently
            have in their carts.
          </p>

        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >

          <div
            style={{
              background:
                'rgba(40, 167, 69, 0.18)',
              border:
                '1px solid rgba(40, 167, 69, 0.5)',
              color: '#7dff9a',
              padding: '9px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            ● LIVE
          </div>

          <button
            type="button"
            onClick={loadCarts}
            style={{
              border:
                '1px solid rgba(255,255,255,0.45)',
              background:
                'rgba(255,255,255,0.08)',
              color: '#fff',
              padding: '9px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            ↻ Refresh
          </button>

        </div>

      </div>

      {/* STATUS */}

      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '18px 22px',
          marginBottom: '24px',
          boxShadow:
            '0 4px 14px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >

        <div>

          <strong>
            {activeCarts.length}
          </strong>{' '}
          customer
          {activeCarts.length !== 1
            ? 's'
            : ''}{' '}
          currently have items
          in their cart.

        </div>

        <div
          style={{
            fontSize: '13px',
            color: '#777',
          }}
        >
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : 'Updating...'}
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: '#fff0f0',
            border:
              '1px solid #f0b5b5',
            color: '#a33',
            padding: '15px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow:
              '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              fontSize: '38px',
              marginBottom: '12px',
            }}
          >
            🛒
          </div>

          <p
            style={{
              margin: 0,
              color: '#777',
            }}
          >
            Loading customer carts...
          </p>
        </div>
      ) : activeCarts.length === 0 ? (

        /* EMPTY */

        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '70px 20px',
            textAlign: 'center',
            boxShadow:
              '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >

          <div
            style={{
              fontSize: '55px',
              marginBottom: '15px',
            }}
          >
            🛒
          </div>

          <h2
            style={{
              margin:
                '0 0 8px',
            }}
          >
            No Active Carts
          </h2>

          <p
            style={{
              margin: 0,
              color: '#777',
            }}
          >
            Customers currently have no
            items in their carts.
          </p>

        </div>

      ) : (

        /* CARTS */

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px',
          }}
        >

          {activeCarts.map(
            (cart, index) => {

              const items =
                getCartItems(cart);

              const cartTotal =
                getCartTotal(cart);

              return (
                <div
                  key={
                    cart._id ||
                    cart.userId ||
                    index
                  }
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow:
                      '0 5px 18px rgba(0,0,0,0.08)',
                    border:
                      '1px solid #e9e9e9',
                  }}
                >

                  {/* CUSTOMER */}

                  <div
                    style={{
                      background:
                        '#20262b',
                      color: '#fff',
                      padding:
                        '20px 22px',
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      gap: '15px',
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize:
                            '18px',
                          fontWeight:
                            '700',
                        }}
                      >
                        👤{' '}
                        {getCustomerName(
                          cart
                        )}
                      </div>

                      <div
                        style={{
                          fontSize:
                            '13px',
                          opacity:
                            '0.7',
                          marginTop:
                            '5px',
                        }}
                      >
                        User ID:{' '}
                        {getCustomerUserId(
                          cart
                        )}
                      </div>

                    </div>

                    <div
                      style={{
                        background:
                          'rgba(40,167,69,0.2)',
                        color:
                          '#7dff9a',
                        padding:
                          '6px 10px',
                        borderRadius:
                          '16px',
                        fontSize:
                          '12px',
                        fontWeight:
                          '600',
                      }}
                    >
                      ACTIVE
                    </div>

                  </div>

                  {/* ITEMS */}

                  <div
                    style={{
                      padding:
                        '20px 22px',
                      maxHeight:
                        '390px',
                      overflowY:
                        'auto',
                    }}
                  >

                    {items.map(
                      (item, itemIndex) => {

                        const itemTotal =
                          getItemTotal(
                            item
                          );

                        return (
                          <div
                            key={`${item.foodItem}-${item.sizeCategory}-${itemIndex}`}
                            style={{
                              padding:
                                '14px 0',
                              borderBottom:
                                itemIndex ===
                                items.length -
                                  1
                                  ? 'none'
                                  : '1px solid #eee',
                            }}
                          >

                            <div
                              style={{
                                display:
                                  'flex',
                                justifyContent:
                                  'space-between',
                                alignItems:
                                  'flex-start',
                                gap:
                                  '15px',
                              }}
                            >

                              <div>

                                <div
                                  style={{
                                    fontWeight:
                                      '700',
                                    fontSize:
                                      '15px',
                                  }}
                                >
                                  {item.foodItem ||
                                    'Food Item'}
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      '5px',
                                    fontSize:
                                      '13px',
                                    color:
                                      '#777',
                                  }}
                                >
                                  Size:{' '}
                                  {item.sizeCategory ||
                                    '—'}
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      '3px',
                                    fontSize:
                                      '13px',
                                    color:
                                      '#777',
                                  }}
                                >
                                  Quantity:{' '}
                                  <strong>
                                    {Number(
                                      item.quantity ||
                                        0
                                    )}
                                  </strong>
                                </div>

                              </div>

                              <div
                                style={{
                                  textAlign:
                                    'right',
                                  flexShrink:
                                    0,
                                }}
                              >

                                <div
                                  style={{
                                    fontWeight:
                                      '700',
                                    fontSize:
                                      '15px',
                                  }}
                                >
                                  ₹
                                  {itemTotal.toFixed(
                                    2
                                  )}
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      '4px',
                                    fontSize:
                                      '12px',
                                    color:
                                      '#888',
                                  }}
                                >
                                  ₹
                                  {Number(
                                    item.unitPrice ||
                                      0
                                  ).toFixed(
                                    2
                                  )}{' '}
                                  each
                                </div>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* TOTAL */}

                  <div
                    style={{
                      background:
                        '#f7f8fa',
                      borderTop:
                        '1px solid #eee',
                      padding:
                        '18px 22px',
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize:
                            '13px',
                          color:
                            '#777',
                        }}
                      >
                        Cart Total
                      </div>

                      <div
                        style={{
                          fontSize:
                            '24px',
                          fontWeight:
                            '800',
                          marginTop:
                            '3px',
                        }}
                      >
                        ₹
                        {cartTotal.toFixed(
                          2
                        )}
                      </div>

                    </div>

                    <div
                      style={{
                        fontSize:
                          '13px',
                        color:
                          '#777',
                        textAlign:
                          'right',
                      }}
                    >
                      {items.reduce(
                        (
                          total,
                          item
                        ) =>
                          total +
                          Number(
                            item.quantity ||
                              0
                          ),
                        0
                      )}{' '}
                      item
                      {items.reduce(
                        (
                          total,
                          item
                        ) =>
                          total +
                          Number(
                            item.quantity ||
                              0
                          ),
                        0
                      ) !== 1
                        ? 's'
                        : ''}
                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default AdminCarts;
