import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMenu, updateMenu } from '../services/api';

const EditMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodName: '',
    halfPrice: '',
    fullPrice: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // =========================
  // LOAD MENU ITEM
  // =========================

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    try {
      setLoading(true);

      const menu = await getMenu();

      const item = menu.find(
        (menuItem) => menuItem._id === id
      );

      if (!item) {
        setMessage('Menu item not found.');
        return;
      }

      setFormData({
        foodName: item.foodName || '',
        halfPrice: item.halfPrice ?? '',
        fullPrice: item.fullPrice ?? '',
        image: item.image || '',
      });
    } catch (error) {
      console.error(
        'Error loading menu item:',
        error
      );

      setMessage(
        'Unable to load menu item.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SAVE CHANGES
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.foodName ||
      formData.halfPrice === '' ||
      formData.fullPrice === ''
    ) {
      setMessage(
        'Please fill in Food Name, Half Price and Full Price.'
      );

      return;
    }

    try {
      setSaving(true);
      setMessage('');

      await updateMenu(id, {
        foodName: formData.foodName,
        halfPrice: Number(formData.halfPrice),
        fullPrice: Number(formData.fullPrice),
        image: formData.image,
      });

      setMessage(
        'Menu item updated successfully!'
      );

      setTimeout(() => {
        navigate('/admin-menu');
      }, 700);
    } catch (error) {
      console.error(
        'Update menu error:',
        error
      );

      setMessage(
        error?.response?.data?.message ||
          'Unable to update menu item.'
      );
    } finally {
      setSaving(false);
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
          Loading menu item...
        </p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="container py-5">

      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={() =>
            navigate('/admin-menu')
          }
        >
          ← Back to Menu Management
        </button>

        <h1 className="fw-bold">
          ✏️ Edit Menu Item
        </h1>

        <p className="text-muted">
          Update the food name, Half price,
          Full price or food image.
        </p>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes('successfully')
              ? 'alert-success'
              : 'alert-danger'
          }`}
        >
          {message}
        </div>
      )}

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            {/* FOOD NAME */}

            <div className="mb-4">

              <label
                htmlFor="foodName"
                className="form-label fw-semibold"
              >
                Food Name
              </label>

              <input
                type="text"
                id="foodName"
                name="foodName"
                className="form-control"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Paneer Pizza"
                required
              />

            </div>

            {/* PRICES */}

            <div className="row g-3 mb-4">

              <div className="col-12 col-md-6">

                <label
                  htmlFor="halfPrice"
                  className="form-label fw-semibold"
                >
                  Half Price
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    id="halfPrice"
                    name="halfPrice"
                    className="form-control"
                    min="0"
                    value={formData.halfPrice}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="col-12 col-md-6">

                <label
                  htmlFor="fullPrice"
                  className="form-label fw-semibold"
                >
                  Full Price
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    id="fullPrice"
                    name="fullPrice"
                    className="form-control"
                    min="0"
                    value={formData.fullPrice}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>

            {/* IMAGE */}

            <div className="mb-4">

              <label
                htmlFor="image"
                className="form-label fw-semibold"
              >
                Food Image URL
              </label>

              <input
                type="url"
                id="image"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://image-url.com/food.jpg"
              />

              <small className="text-muted">
                Use one image for both Half and Full
                sizes.
              </small>

            </div>

            {/* PREVIEW */}

            {formData.image && (
              <div className="mb-4">

                <p className="fw-semibold mb-2">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt={formData.foodName}
                  style={{
                    width: '220px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      'none';
                  }}
                />

              </div>
            )}

            {/* PRICE PREVIEW */}

            <div className="alert alert-light border mb-4">

              <strong>
                Price Preview
              </strong>

              <div className="d-flex flex-wrap gap-4 mt-2">

                <span>
                  🥣 <strong>Half:</strong> ₹
                  {formData.halfPrice || 0}
                </span>

                <span>
                  🍽️ <strong>Full:</strong> ₹
                  {formData.fullPrice || 0}
                </span>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : '💾 Save Changes'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate('/admin-menu')
                }
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditMenu;
