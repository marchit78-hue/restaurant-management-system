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
    minWidth: 0,
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const handleCardHover = (
    event,
    entering
  ) => {
    if (window.matchMedia('(hover: hover)').matches) {
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
    }
  };

  return (
    <>
      <main
        className="dashboard-page"
        style={{
          minHeight:
            'calc(100vh - 70px)',
          background: '#f5f6f8',
          padding: 'clamp(16px, 3vw, 38px)',
          boxSizing: 'border-box',
          width: '100%',
          overflowX: 'hidden',
        }}
      >

        {/* WELCOME */}

        <section
          className="dashboard-welcome"
          style={{
            background: '#20262b',
            color: '#fff',
            borderRadius: '14px',
            padding:
              'clamp(22px, 4vw, 38px) clamp(20px, 4vw, 44px)',
            marginBottom:
              'clamp(20px, 3vw, 32px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(18px, 3vw, 28px)',
            boxShadow:
              '0 8px 25px rgba(0,0,0,0.12)',
            width: '100%',
            minWidth: 0,
          }}
        >

          <div
            className="dashboard-chef"
            style={{
              width:
                'clamp(72px, 9vw, 110px)',
              height:
                'clamp(72px, 9vw, 110px)',
              borderRadius: '50%',
              background: '#9b7413',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize:
                'clamp(40px, 5vw, 58px)',
              flexShrink: 0,
            }}
          >
            👨‍🍳
          </div>

          <div
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <div
              style={{
                fontSize:
                  'clamp(18px, 2vw, 25px)',
                marginBottom: '8px',
              }}
            >
              Welcome to
            </div>

            <h1
              style={{
                margin: 0,
                fontSize:
                  'clamp(30px, 4vw, 46px)',
                fontWeight: '800',
                lineHeight: '1.1',
                overflowWrap: 'anywhere',
              }}
            >
              arch-restaurant
            </h1>

            <div
              style={{
                fontSize:
                  'clamp(16px, 2vw, 22px)',
                marginTop: '8px',
                lineHeight: '1.4',
              }}
            >
              Good Food. Great Moments.
            </div>

          </div>

        </section>

        {/* DASHBOARD CARDS */}

        <section
          className="dashboard-cards"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(0, 1fr))',
            gap:
              'clamp(12px, 2vw, 24px)',
            marginBottom:
              'clamp(20px, 3vw, 32px)',
            width: '100%',
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
                fontSize:
                  'clamp(15px, 1.5vw, 18px)',
                fontWeight: '600',
                lineHeight: '1.4',
              }}
            >
              🛒 Total Orders
            </div>

            <div
              style={{
                fontSize:
                  'clamp(30px, 3vw, 38px)',
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
                fontSize:
                  'clamp(15px, 1.5vw, 18px)',
                fontWeight: '600',
                lineHeight: '1.4',
              }}
            >
              🍽️ Total Menu Items
            </div>

            <div
              style={{
                fontSize:
                  'clamp(30px, 3vw, 38px)',
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
                fontSize:
                  'clamp(15px, 1.5vw, 18px)',
                fontWeight: '600',
                lineHeight: '1.4',
              }}
            >
              💬 Total Feedback
            </div>

            <div
              style={{
                fontSize:
                  'clamp(30px, 3vw, 38px)',
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
                fontSize:
                  'clamp(15px, 1.5vw, 18px)',
                fontWeight: '600',
                lineHeight: '1.4',
              }}
            >
              🛒 Live Customer Carts
            </div>

            <div
              style={{
                fontSize:
                  'clamp(30px, 3vw, 38px)',
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
            padding:
              'clamp(18px, 3vw, 30px)',
            boxShadow:
              '0 4px 14px rgba(0,0,0,0.07)',
            width: '100%',
            minWidth: 0,
          }}
        >

          <div
            className="recent-orders-header"
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '22px',
            }}
          >

            <h2
              style={{
                margin: 0,
                fontSize:
                  'clamp(20px, 2.5vw, 25px)',
                lineHeight: '1.3',
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
                whiteSpace: 'nowrap',
                flexShrink: 0,
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
                width: '100%',
                overflowX: 'auto',
                WebkitOverflowScrolling:
                  'touch',
              }}
            >

              <table
                style={{
                  width: '100%',
                  minWidth: '600px',
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

      {/* RESPONSIVE DASHBOARD STYLES */}

      <style>{`

        /* ==============================
           HALF SCREEN / SMALL LAPTOP
        ============================== */

        @media (max-width: 1150px) {

          .dashboard-cards {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
          }

        }


        /* ==============================
           TABLET
        ============================== */

        @media (max-width: 768px) {

          .dashboard-page {
            padding: 18px !important;
          }

          .dashboard-welcome {
            flex-direction: column !important;
            text-align: center;
          }

          .dashboard-cards {
            grid-template-columns:
              minmax(0, 1fr) !important;
          }

          .recent-orders-header {
            align-items: flex-start !important;
          }

        }


        /* ==============================
           PHONE
        ============================== */

        @media (max-width: 480px) {

          .dashboard-page {
            padding: 12px !important;
          }

          .dashboard-welcome {
            padding: 22px 16px !important;
            border-radius: 12px !important;
          }

          .dashboard-chef {
            width: 72px !important;
            height: 72px !important;
            font-size: 38px !important;
          }

          .dashboard-cards {
            gap: 12px !important;
          }

          .dashboard-cards button {
            padding: 20px !important;
          }

          .recent-orders-header {
            flex-direction: column !important;
          }

          .recent-orders-header button {
            width: 100%;
          }

        }


        /* ==============================
           VERY SMALL PHONE
        ============================== */

        @media (max-width: 360px) {

          .dashboard-page {
            padding: 9px !important;
          }

          .dashboard-welcome {
            padding: 18px 12px !important;
          }

          .dashboard-cards button {
            padding: 17px !important;
          }

        }


        /* ==============================
           TOUCH DEVICES
        ============================== */

        @media (hover: none) {

          .dashboard-cards button {
            transform: none !important;
          }

        }

      `}</style>
    </>
  );
}

export default Dashboard;