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
      !formData.foodName.trim() ||
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
        foodName:
          formData.foodName.trim(),

        halfPrice:
          Number(formData.halfPrice),

        fullPrice:
          Number(formData.fullPrice),

        image:
          formData.image.trim(),
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
      <div className="edit-menu-page container-fluid px-3 px-md-4 py-5">

        <div className="edit-menu-loading text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 text-muted mb-0">
            Loading menu item...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="edit-menu-page container-fluid px-3 px-md-4 px-lg-5 py-4">

      <div className="edit-menu-wrapper">

        {/* =========================
            HEADER
        ========================== */}

        <div className="edit-menu-header mb-4">

          <button
            type="button"
            className="btn btn-outline-secondary edit-back-btn mb-3"
            onClick={() =>
              navigate('/admin-menu')
            }
          >
            ← Back to Menu Management
          </button>

          <span className="edit-menu-eyebrow">
            RESTAURANT MANAGEMENT
          </span>

          <h1 className="fw-bold mt-2 mb-2">
            ✏️ Edit Menu Item
          </h1>

          <p className="text-muted mb-0">
            Update the food name, Half price,
            Full price or food image.
          </p>

        </div>

        {/* =========================
            MESSAGE
        ========================== */}

        {message && (
          <div
            className={`alert ${
              message.includes(
                'successfully'
              )
                ? 'alert-success'
                : 'alert-danger'
            } edit-menu-alert`}
          >
            {message}
          </div>
        )}

        {/* =========================
            FORM CARD
        ========================== */}

        <div className="edit-menu-card">

          <div className="edit-menu-card-body">

            <form onSubmit={handleSubmit}>

              {/* =========================
                  FOOD NAME
              ========================== */}

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
                  className="form-control edit-menu-input"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Paneer Pizza"
                  required
                />

              </div>

              {/* =========================
                  PRICES
              ========================== */}

              <div className="row g-3 mb-4">

                <div className="col-12 col-md-6">

                  <label
                    htmlFor="halfPrice"
                    className="form-label fw-semibold"
                  >
                    Half Price
                  </label>

                  <div className="input-group">

                    <span className="input-group-text price-symbol">
                      ₹
                    </span>

                    <input
                      type="number"
                      id="halfPrice"
                      name="halfPrice"
                      className="form-control edit-menu-input"
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

                    <span className="input-group-text price-symbol">
                      ₹
                    </span>

                    <input
                      type="number"
                      id="fullPrice"
                      name="fullPrice"
                      className="form-control edit-menu-input"
                      min="0"
                      value={formData.fullPrice}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </div>

              {/* =========================
                  IMAGE
              ========================== */}

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
                  className="form-control edit-menu-input"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://image-url.com/food.jpg"
                />

                <small className="text-muted image-help-text">
                  Use one image for both Half and Full
                  sizes.
                </small>

              </div>

              {/* =========================
                  IMAGE PREVIEW
              ========================== */}

              {formData.image && (
                <div className="image-preview-section mb-4">

                  <p className="fw-semibold mb-2">
                    Image Preview
                  </p>

                  <div className="image-preview-wrapper">

                    <img
                      src={formData.image}
                      alt={formData.foodName}
                      className="edit-menu-image-preview"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          'none';

                        if (
                          event.currentTarget
                            .nextElementSibling
                        ) {
                          event.currentTarget
                            .nextElementSibling
                            .style.display =
                            'flex';
                        }
                      }}
                    />

                    <div
                      className="image-preview-error"
                      style={{
                        display: 'none',
                      }}
                    >
                      🖼️
                      <span>
                        Image could not be loaded
                      </span>
                    </div>

                  </div>

                </div>
              )}

              {/* =========================
                  PRICE PREVIEW
              ========================== */}

              <div className="price-preview-card mb-4">

                <div className="price-preview-title">
                  💰 Price Preview
                </div>

                <div className="price-preview-grid">

                  <div className="price-preview-item">
                    <span>
                      🥣
                    </span>

                    <div>
                      <small>
                        Half
                      </small>

                      <strong>
                        ₹
                        {formData.halfPrice ||
                          0}
                      </strong>
                    </div>
                  </div>

                  <div className="price-preview-item">
                    <span>
                      🍽️
                    </span>

                    <div>
                      <small>
                        Full
                      </small>

                      <strong>
                        ₹
                        {formData.fullPrice ||
                          0}
                      </strong>
                    </div>
                  </div>

                </div>

              </div>

              {/* =========================
                  BUTTONS
              ========================== */}

              <div className="edit-menu-actions">

                <button
                  type="submit"
                  className="btn btn-primary edit-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? '⏳ Saving...'
                    : '💾 Save Changes'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary edit-cancel-btn"
                  onClick={() =>
                    navigate('/admin-menu')
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

      {/* =========================
          RESPONSIVE STYLES
      ========================== */}

      <style>{`

        .edit-menu-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .edit-menu-wrapper {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
        }

        .edit-menu-header {
          width: 100%;
        }

        .edit-menu-eyebrow {
          display: block;
          color: #0d6efd;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .edit-menu-header h1 {
          font-size: clamp(
            1.7rem,
            3vw,
            2.4rem
          );
        }

        .edit-menu-header p {
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .edit-back-btn {
          border-radius: 10px;
          font-weight: 600;
        }

        .edit-menu-alert {
          border-radius: 12px;
          overflow-wrap: anywhere;
        }

        .edit-menu-card {
          background: #ffffff;
          border-radius: 16px;
          border: 0;
          box-shadow:
            0 5px 24px
            rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .edit-menu-card-body {
          padding: clamp(
            20px,
            4vw,
            40px
          );
        }

        .edit-menu-input {
          min-height: 46px;
          border-radius: 9px;
        }

        .price-symbol {
          min-width: 45px;
          justify-content: center;
          background: #f8f9fa;
          font-weight: 700;
        }

        .image-help-text {
          display: block;
          margin-top: 6px;
          line-height: 1.4;
        }

        .image-preview-section {
          padding-top: 5px;
        }

        .image-preview-wrapper {
          width: 100%;
          max-width: 420px;
          height: 260px;
          border-radius: 14px;
          overflow: hidden;
          background: #f1f3f5;
          border: 1px solid #e9ecef;
        }

        .edit-menu-image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .image-preview-error {
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          color: #6c757d;
          font-size: 2.5rem;
        }

        .image-preview-error span {
          font-size: 0.85rem;
        }

        .price-preview-card {
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 14px;
          background: #f8f9fa;
        }

        .price-preview-title {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 15px;
        }

        .price-preview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .price-preview-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 14px;
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 11px;
        }

        .price-preview-item > span {
          font-size: 1.5rem;
        }

        .price-preview-item div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .price-preview-item small {
          color: #6c757d;
          font-size: 0.75rem;
        }

        .price-preview-item strong {
          font-size: 1.05rem;
        }

        .edit-menu-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .edit-save-btn,
        .edit-cancel-btn {
          min-height: 45px;
          border-radius: 9px;
          font-weight: 650;
          padding-left: 22px;
          padding-right: 22px;
        }

        .edit-menu-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* =========================
           HALF SCREEN
        ========================== */

        @media (max-width: 900px) {

          .edit-menu-page {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .image-preview-wrapper {
            max-width: 380px;
            height: 230px;
          }

        }

        /* =========================
           TABLET / MOBILE
        ========================== */

        @media (max-width: 767.98px) {

          .edit-menu-page {
            padding-top: 20px !important;
          }

          .edit-menu-header h1 {
            line-height: 1.2;
          }

          .edit-menu-header p {
            font-size: 0.88rem;
          }

          .edit-back-btn {
            width: 100%;
          }

          .edit-menu-card-body {
            padding: 20px 17px;
          }

          .image-preview-wrapper {
            width: 100%;
            max-width: none;
            height: 230px;
          }

          .price-preview-grid {
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .edit-menu-actions {
            flex-direction: column;
          }

          .edit-save-btn,
          .edit-cancel-btn {
            width: 100%;
          }

        }

        /* =========================
           SMALL PHONES
        ========================== */

        @media (max-width: 479.98px) {

          .edit-menu-page {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .edit-menu-card-body {
            padding: 17px 14px;
          }

          .edit-menu-header h1 {
            font-size: 1.55rem;
          }

          .edit-menu-header p {
            font-size: 0.82rem;
          }

          .edit-menu-input {
            min-height: 44px;
            font-size: 14px;
          }

          .form-label {
            font-size: 0.88rem;
          }

          .image-preview-wrapper {
            height: 190px;
          }

          .price-preview-card {
            padding: 15px;
          }

          .price-preview-item {
            padding: 12px;
          }

          .price-preview-item > span {
            font-size: 1.25rem;
          }

          .price-preview-item strong {
            font-size: 0.95rem;
          }

        }

      `}</style>

    </div>
  );
};

export default EditMenu;