import { useEffect, useState } from 'react';
import { getMenu, getOrders } from '../services/api';

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuItems, orders] = await Promise.all([getMenu(), getOrders()]);
        setMenuCount(menuItems.length);
        setOrderCount(orders.length);
      } catch (err) {
        setError('Failed to load dashboard data.');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Menu Items</h5>
              <h2 className="card-text">{menuCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <h2 className="card-text">{orderCount}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
