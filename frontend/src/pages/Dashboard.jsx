import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getOrders,
  getMenu,
  getAllFeedback,
  getAllCarts,
} from '../services/api';

function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        ordersData,
        menuData,
        feedbackData,
        cartsData,
      ] = await Promise.all([
        getOrders(),
        getMenu(),
        getAllFeedback(),
        getAllCarts(),
      ]);

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData?.orders || []
      );

      setMenu(
        Array.isArray(menuData)
          ? menuData
          : menuData?.menu || []
      );

      setFeedback(
        Array.isArray(feedbackData)
          ? feedbackData
          : feedbackData?.feedback || []
      );

      setCarts(
        Array.isArray(cartsData)
          ? cartsData
          : cartsData?.carts || []
      );
    } catch (error) {
      console.error(
        'Dashboard data loading error:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalOrders = orders.length;
  const totalMenuItems = menu.length;
  const totalFeedback = feedback.length;

  const activeCarts = carts.filter(
    (cart) =>
      Array.isArray(cart?.items) &&
      cart.items.length > 0
  );

  const totalLiveCarts = activeCarts.length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt ||
            b.orderDate ||
            0
        ) -
        new Date(
          a.createdAt ||
            a.orderDate ||
            0
        )
    )
    .slice(0, 5);

  const cardStyle = {
    borderRadius: '12px',
    padding: '28px',
    boxShadow:
      '0 4px 14px rgba(0,0,0,0.07)',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const handleCardHover = (
    event,
    entering
  ) => {
    if (entering) {
      event.currentTarget.style.transform =
        'translateY(-4px)';

      event.currentTarget.style.boxShadow =
        '0 8px 22px rgba(0,0,0,0.12)';
    } else {
      event.currentTarget.style.transform =
        'translateY(0)';

      event.currentTarget.style.boxShadow =
        '0 4px 14px rgba(0,0,0,0.07)';
    }
  };

  return (
    <main
      style={{
        minHeight:
          'calc(100vh - 70px)',
        background: '#f5f6f8',
        padding: '38px',
        boxSizing: 'border-box',
      }}
    >

      {/* WELCOME */}

      <section
        style={{
          background: '#20262b',
          color: '#fff',
          borderRadius: '14px',
          padding: '38px 44px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          boxShadow:
            '0 8px 25px rgba(0,0,0,0.12)',
        }}
      >

        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: '#9b7413',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '58px',
            flexShrink: 0,
          }}
        >
          👨‍🍳
        </div>

        <div>

          <div
            style={{
              fontSize: '25px',
              marginBottom: '8px',
            }}
          >
            Welcome to
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '46px',
              fontWeight: '800',
            }}
          >
            arch-restaurant
          </h1>

          <div
            style={{
              fontSize: '22px',
              marginTop: '8px',
            }}
          >
            Good Food. Great Moments.
          </div>

        </div>

      </section>

      {/* DASHBOARD CARDS */}

      <section
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, minmax(0, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >

        {/* TOTAL ORDERS */}

        <button
          type="button"
          onClick={() =>
            navigate('/orders')
          }
          style={{
            ...cardStyle,
            background: '#eefbf5',
          }}
          onMouseEnter={(event) =>
            handleCardHover(
              event,
              true
            )
          }
          onMouseLeave={(event) =>
            handleCardHover(
              event,
              false
            )
          }
        >

          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🛒 Total Orders
          </div>

          <div
            style={{
              fontSize: '38px',
              fontWeight: '800',
              marginTop: '14px',
            }}
          >
            {loading
              ? '...'
              : totalOrders}
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '13px',
              color: '#27805b',
              fontWeight: '600',
            }}
          >
            View Orders →
          </div>

        </button>

        {/* TOTAL MENU ITEMS */}

        <button
          type="button"
          onClick={() =>
            navigate('/admin-menu')
          }
          style={{
            ...cardStyle,
            background: '#eef5ff',
          }}
          onMouseEnter={(event) =>
            handleCardHover(
              event,
              true
            )
          }
          onMouseLeave={(event) =>
            handleCardHover(
              event,
              false
            )
          }
        >

          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🍽️ Total Menu Items
          </div>

          <div
            style={{
              fontSize: '38px',
              fontWeight: '800',
              marginTop: '14px',
            }}
          >
            {loading
              ? '...'
              : totalMenuItems}
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '13px',
              color: '#356da8',
              fontWeight: '600',
            }}
          >
            Manage Menu →
          </div>

        </button>

        {/* TOTAL FEEDBACK */}

        <button
          type="button"
          onClick={() =>
            navigate('/reviews')
          }
          style={{
            ...cardStyle,
            background: '#fff0f0',
          }}
          onMouseEnter={(event) =>
            handleCardHover(
              event,
              true
            )
          }
          onMouseLeave={(event) =>
            handleCardHover(
              event,
              false
            )
          }
        >

          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            💬 Total Feedback
          </div>

          <div
            style={{
              fontSize: '38px',
              fontWeight: '800',
              marginTop: '14px',
            }}
          >
            {loading
              ? '...'
              : totalFeedback}
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '13px',
              color: '#b54d55',
              fontWeight: '600',
            }}
          >
            View Feedback →
          </div>

        </button>

        {/* LIVE CUSTOMER CARTS */}

        <button
          type="button"
          onClick={() =>
            navigate('/admin-carts')
          }
          style={{
            ...cardStyle,
            background: '#fff8e8',
          }}
          onMouseEnter={(event) =>
            handleCardHover(
              event,
              true
            )
          }
          onMouseLeave={(event) =>
            handleCardHover(
              event,
              false
            )
          }
        >

          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🛒 Live Customer Carts
          </div>

          <div
            style={{
              fontSize: '38px',
              fontWeight: '800',
              marginTop: '14px',
            }}
          >
            {loading
              ? '...'
              : totalLiveCarts}
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '13px',
              color: '#a06b0c',
              fontWeight: '600',
            }}
          >
            View Live Carts →
          </div>

        </button>

      </section>

      {/* RECENT ORDERS */}

      <section
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow:
            '0 4px 14px rgba(0,0,0,0.07)',
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            marginBottom: '22px',
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: '25px',
            }}
          >
            📊 Recent Orders
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate('/orders')
            }
            style={{
              border: 'none',
              background: '#eef1f4',
              padding: '11px 18px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            View All
          </button>

        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p
            style={{
              color: '#777',
              margin: 0,
            }}
          >
            No orders yet.
          </p>
        ) : (
          <div
            style={{
              overflowX: 'auto',
            }}
          >

            <table
              style={{
                width: '100%',
                borderCollapse:
                  'collapse',
              }}
            >

              <thead>

                <tr>

                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderBottom:
                        '1px solid #ddd',
                    }}
                  >
                    Order
                  </th>

                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderBottom:
                        '1px solid #ddd',
                    }}
                  >
                    Customer
                  </th>

                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderBottom:
                        '1px solid #ddd',
                    }}
                  >
                    Total
                  </th>

                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderBottom:
                        '1px solid #ddd',
                    }}
                  >
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentOrders.map(
                  (order, index) => (
                    <tr
                      key={
                        order._id ||
                        order.id ||
                        index
                      }
                    >

                      <td
                        style={{
                          padding:
                            '14px 12px',
                          borderBottom:
                            '1px solid #eee',
                        }}
                      >
                        #
                        {String(
                          order._id ||
                            order.id ||
                            index + 1
                        ).slice(-6)}
                      </td>

                      <td
                        style={{
                          padding:
                            '14px 12px',
                          borderBottom:
                            '1px solid #eee',
                        }}
                      >
                        {order.user?.name ||
                          order.customer
                            ?.name ||
                          'Customer'}
                      </td>

                      <td
                        style={{
                          padding:
                            '14px 12px',
                          borderBottom:
                            '1px solid #eee',
                        }}
                      >
                        ₹
                        {Number(
                          order.grandTotal ||
                            order.total ||
                            0
                        ).toFixed(2)}
                      </td>

                      <td
                        style={{
                          padding:
                            '14px 12px',
                          borderBottom:
                            '1px solid #eee',
                        }}
                      >
                        {order.status ||
                          'Pending'}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}

export default Dashboard;
