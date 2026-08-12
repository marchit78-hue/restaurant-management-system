import { useEffect, useState } from 'react';
import { addOrder, deleteOrder, getOrders, updateOrder } from '../services/api';

const initialFormState = {
  customerName: '',
  foodItem: '',
  quantity: '',
  totalPrice: '',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      setFeedback({ type: 'danger', message: 'Failed to load orders.' });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateOrder(editingId, formData);
        setFeedback({ type: 'success', message: 'Order updated successfully.' });
      } else {
        await addOrder(formData);
        setFeedback({ type: 'success', message: 'Order added successfully.' });
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchOrders();
    } catch (error) {
      setFeedback({ type: 'danger', message: error.response?.data?.message || 'Failed to save order.' });
    }
  };

  const handleEdit = (order) => {
    setEditingId(order._id);
    setFormData({
      customerName: order.customerName,
      foodItem: order.foodItem,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
    });
    setFeedback({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    try {
      await deleteOrder(id);
      setFeedback({ type: 'success', message: 'Order deleted successfully.' });
      fetchOrders();
    } catch (error) {
      setFeedback({ type: 'danger', message: error.response?.data?.message || 'Failed to delete order.' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div>
      <h2 className="page-title">Orders Management</h2>

      {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}

      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label htmlFor="customerName" className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-control"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="foodItem" className="form-label">Food Item</label>
            <input
              type="text"
              className="form-control"
              id="foodItem"
              name="foodItem"
              value={formData.foodItem}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="totalPrice" className="form-label">Total Price</label>
            <input
              type="number"
              className="form-control"
              id="totalPrice"
              name="totalPrice"
              min="0"
              value={formData.totalPrice}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Save' : 'Add'}
            </button>
          </div>

          {editingId && (
            <div className="col-12">
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel Edit
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="card p-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Customer Name</th>
                <th>Food Item</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>{order.foodItem}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(order)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
