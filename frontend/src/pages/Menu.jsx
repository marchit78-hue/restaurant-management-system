import { useEffect, useState } from 'react';
import MenuForm from '../components/MenuForm';
import { addMenu, deleteMenu, getMenu, updateMenu } from '../services/api';

const initialFormState = {
  foodName: '',
  sizeCategory: '',
  price: '',
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchMenu = async () => {
    try {
      const data = await getMenu();
      setMenuItems(data);
    } catch (error) {
      setFeedback({ type: 'danger', message: 'Failed to load menu items.' });
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateMenu(editingId, formData);
        setFeedback({ type: 'success', message: 'Menu item updated successfully.' });
      } else {
        await addMenu(formData);
        setFeedback({ type: 'success', message: 'Menu item added successfully.' });
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchMenu();
    } catch (error) {
      setFeedback({ type: 'danger', message: error.response?.data?.message || 'Failed to save menu item.' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      foodName: item.foodName,
      sizeCategory: item.sizeCategory,
      price: item.price,
    });
    setFeedback({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this menu item?');
    if (!confirmed) return;

    try {
      await deleteMenu(id);
      setFeedback({ type: 'success', message: 'Menu item deleted successfully.' });
      fetchMenu();
    } catch (error) {
      setFeedback({ type: 'danger', message: error.response?.data?.message || 'Failed to delete menu item.' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div>
      <h2 className="page-title">Menu Management</h2>

      {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}

      <div className="card p-4 mb-4">
        <MenuForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          editingId={editingId}
          onCancel={handleCancelEdit}
        />
      </div>

      <div className="card p-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Food Name</th>
                <th>Size Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.foodName}</td>
                    <td>{item.sizeCategory}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No menu items found.
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

export default Menu;
