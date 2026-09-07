import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMenu,
  addMenu,
  updateMenu,
  deleteMenu,
  toggleMenuAvailability,
} from "../services/api";

import MenuForm from "../components/MenuForm";

function AdminMenu() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);

  const [formData, setFormData] = useState({
    foodName: "",
    halfPrice: "",
    fullPrice: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD MENU
  // =========================

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);

      const data = await getMenu();

      setMenuItems(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Admin menu loading error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load menu."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      foodName: "",
      halfPrice: "",
      fullPrice: "",
      image: "",
    });
  };

  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.foodName.trim() ||
      formData.halfPrice === "" ||
      formData.fullPrice === ""
    ) {
      alert(
        "Please enter food name, Half Price and Full Price."
      );

      return;
    }

    try {
      const menuData = {
        foodName:
          formData.foodName.trim(),

        halfPrice:
          Number(formData.halfPrice),

        fullPrice:
          Number(formData.fullPrice),

        image:
          formData.image?.trim() || "",
      };

      if (editingId) {
        await updateMenu(
          editingId,
          menuData
        );

        alert(
          "Menu item updated successfully."
        );
      } else {
        await addMenu(menuData);

        alert(
          "Menu item added successfully."
        );
      }

      resetForm();

      await loadMenu();
    } catch (error) {
      console.error(
        "Menu save error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to save menu item."
      );
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (item) => {
    navigate(
      `/edit-menu/${item._id}`
    );
  };

  // =========================
  // TOGGLE AVAILABILITY
  // =========================

  const handleToggleAvailability = async (
    item
  ) => {
    try {
      await toggleMenuAvailability(
        item._id
      );

      await loadMenu();
    } catch (error) {
      console.error(
        "Availability update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update item availability."
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this food item?"
      );

    if (!confirmed) return;

    try {
      await deleteMenu(id);

      alert(
        "Menu item deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await loadMenu();
    } catch (error) {
      console.error(
        "Delete menu error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete menu item."
      );
    }
  };

  // =========================
  // SORT MENU
  // =========================

  const sortedMenu = [...menuItems].sort(
    (a, b) =>
      (a.foodName || "").localeCompare(
        b.foodName || ""
      )
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-menu-page container-fluid px-3 px-md-4 px-lg-5 py-4">

      {/* =========================
          HEADER
      ========================== */}

      <div className="admin-menu-header mb-4">

        <span className="admin-menu-eyebrow">
          RESTAURANT MANAGEMENT
        </span>

        <h1 className="fw-bold mt-2 mb-2">
          🍽️ Menu Management
        </h1>

        <p className="text-muted mb-0">
          Manage the menu, Half and Full
          prices, food images, and item
          availability.
        </p>

      </div>

      {/* =========================
          ADD MENU FORM
      ========================== */}

      <div className="admin-menu-section-card mb-4 mb-lg-5">

        <div className="card-body">

          <div className="admin-menu-section-heading mb-4">

            <div className="admin-menu-section-icon">
              ➕
            </div>

            <div>
              <h3 className="fw-bold mb-1">
                Add New Menu Item
              </h3>

              <p className="text-muted mb-0">
                Enter one food item with
                separate Half and Full prices.
              </p>
            </div>

          </div>

          <MenuForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            editingId={editingId}
            onCancel={resetForm}
          />

        </div>

      </div>

      {/* =========================
          CURRENT MENU
      ========================== */}

      <div className="admin-menu-section-card">

        <div className="card-body">

          <div className="current-menu-header mb-4">

            <div className="current-menu-title">

              <span className="admin-menu-eyebrow">
                CUSTOMER MENU
              </span>

              <h2 className="fw-bold mb-1 mt-2">
                📋 Current Menu
              </h2>

              <p className="text-muted mb-0">
                These prices, images and
                availability status are shown
                to customers.
              </p>

            </div>

            <button
              type="button"
              className="btn btn-outline-primary admin-menu-refresh-btn"
              onClick={loadMenu}
              disabled={loading}
            >
              {loading
                ? "⏳ Loading..."
                : "🔄 Refresh"}
            </button>

          </div>

          {/* =========================
              LOADING
          ========================== */}

          {loading && (
            <div className="admin-menu-loading text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="text-muted mt-3 mb-0">
                Loading restaurant menu...
              </p>

            </div>
          )}

          {/* =========================
              EMPTY
          ========================== */}

          {!loading &&
            sortedMenu.length === 0 && (
              <div className="admin-menu-empty text-center py-5">

                <div className="admin-menu-empty-icon">
                  🍽️
                </div>

                <h4 className="mt-3">
                  No menu items yet
                </h4>

                <p className="text-muted mb-0">
                  Add your first food item
                  above.
                </p>

              </div>
            )}

          {/* =========================
              MENU ITEMS
          ========================== */}

          {!loading &&
            sortedMenu.length > 0 && (

              <div className="row g-3 g-lg-4">

                {sortedMenu.map(
                  (item) => (

                    <div
                      className="col-12 col-md-6 col-xl-4"
                      key={item._id}
                    >

                      <div
                        className={`admin-food-card h-100 ${
                          item.isAvailable === false
                            ? "admin-food-unavailable"
                            : ""
                        }`}
                      >

                        {/* =========================
                            IMAGE
                        ========================== */}

                        <div className="admin-food-image-wrapper">

                          {item.image ? (

                            <img
                              src={item.image}
                              alt={item.foodName}
                              className="admin-food-image"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";

                                if (
                                  e.currentTarget
                                    .nextElementSibling
                                ) {
                                  e.currentTarget
                                    .nextElementSibling
                                    .style.display =
                                    "flex";
                                }
                              }}
                            />

                          ) : null}

                          <div
                            className="admin-food-image-placeholder"
                            style={{
                              display: item.image
                                ? "none"
                                : "flex",
                            }}
                          >
                            🍽️
                          </div>

                          {/* STATUS */}

                          <span
                            className={`admin-food-status ${
                              item.isAvailable === false
                                ? "status-unavailable"
                                : "status-available"
                            }`}
                          >
                            {item.isAvailable === false
                              ? "Unavailable"
                              : "Available"}
                          </span>

                        </div>

                        {/* =========================
                            BODY
                        ========================== */}

                        <div className="admin-food-body">

                          <div className="admin-food-title-row">

                            <h4 className="admin-food-name">
                              {item.foodName}
                            </h4>

                          </div>

                          {/* =========================
                              PRICES
                          ========================== */}

                          <div className="row g-2 mb-3">

                            <div className="col-6">

                              <div className="admin-price-card">

                                <div className="admin-price-label">
                                  HALF
                                </div>

                                <div className="admin-price-value">
                                  ₹
                                  {Number(
                                    item.halfPrice || 0
                                  ).toFixed(2)}
                                </div>

                              </div>

                            </div>

                            <div className="col-6">

                              <div className="admin-price-card">

                                <div className="admin-price-label">
                                  FULL
                                </div>

                                <div className="admin-price-value">
                                  ₹
                                  {Number(
                                    item.fullPrice || 0
                                  ).toFixed(2)}
                                </div>

                              </div>

                            </div>

                          </div>

                          {/* =========================
                              AVAILABILITY
                          ========================== */}

                          <div className="mb-3">

                            <button
                              type="button"
                              className={`btn admin-availability-btn ${
                                item.isAvailable === false
                                  ? "btn-secondary"
                                  : "btn-success"
                              }`}
                              onClick={() =>
                                handleToggleAvailability(
                                  item
                                )
                              }
                            >
                              {item.isAvailable === false
                                ? "🔴 Unavailable — Click to make available"
                                : "🟢 Available — Click to mark unavailable"}
                            </button>

                          </div>

                          {/* =========================
                              ACTIONS
                          ========================== */}

                          <div className="admin-food-actions">

                            <button
                              type="button"
                              className="btn btn-warning admin-action-btn"
                              onClick={() =>
                                handleEdit(item)
                              }
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger admin-action-btn"
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                            >
                              🗑️ Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </div>

      </div>

      {/* =========================
          RESPONSIVE STYLES
      ========================== */}

      <style>{`

        .admin-menu-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .admin-menu-header,
        .admin-menu-section-card {
          max-width: 1550px;
          margin-left: auto;
          margin-right: auto;
        }

        .admin-menu-eyebrow {
          color: #0d6efd;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .admin-menu-header h1 {
          font-size: clamp(1.7rem, 3vw, 2.45rem);
        }

        .admin-menu-header p {
          font-size: 0.96rem;
        }

        .admin-menu-section-card {
          background: #ffffff;
          border: 0;
          border-radius: 16px;
          box-shadow: 0 5px 22px rgba(0, 0, 0, 0.07);
          overflow: hidden;
        }

        .admin-menu-section-card .card-body {
          padding: clamp(18px, 3vw, 32px);
        }

        .admin-menu-section-heading {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .admin-menu-section-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #f1f3f5;
          font-size: 1.2rem;
        }

        .admin-menu-section-heading h3 {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
        }

        .admin-menu-section-heading p {
          font-size: 0.9rem;
        }

        .current-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .current-menu-title {
          min-width: 0;
        }

        .current-menu-title h2 {
          font-size: clamp(1.5rem, 2.5vw, 2rem);
        }

        .current-menu-title p {
          font-size: 0.9rem;
        }

        .admin-menu-refresh-btn {
          min-width: 110px;
          border-radius: 10px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .admin-menu-loading {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .admin-menu-empty {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .admin-menu-empty-icon {
          font-size: 3.5rem;
        }

        .admin-food-card {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .admin-food-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 25px rgba(0, 0, 0, 0.09);
        }

        .admin-food-unavailable {
          opacity: 0.78;
        }

        .admin-food-image-wrapper {
          position: relative;
          width: 100%;
          height: 210px;
          overflow: hidden;
          background: #f1f3f5;
        }

        .admin-food-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .admin-food-image-placeholder {
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background: #f1f3f5;
        }

        .admin-food-status {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 7px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(5px);
        }

        .status-available {
          color: #0f5132;
          background: rgba(209, 231, 221, 0.95);
        }

        .status-unavailable {
          color: #842029;
          background: rgba(248, 215, 218, 0.95);
        }

        .admin-food-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px;
        }

        .admin-food-title-row {
          min-height: 54px;
          margin-bottom: 10px;
        }

        .admin-food-name {
          font-size: 1.2rem;
          line-height: 1.35;
          font-weight: 750;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .admin-price-card {
          height: 100%;
          padding: 11px 8px;
          text-align: center;
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          background: #fafafa;
        }

        .admin-price-label {
          color: #6c757d;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .admin-price-value {
          margin-top: 3px;
          font-size: 1.05rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .admin-availability-btn {
          width: 100%;
          min-height: 44px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 650;
          line-height: 1.35;
        }

        .admin-food-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: auto;
        }

        .admin-action-btn {
          min-height: 43px;
          border-radius: 10px;
          font-weight: 650;
        }

        @media (max-width: 991.98px) {

          .admin-food-image-wrapper {
            height: 200px;
          }

          .admin-food-body {
            padding: 18px;
          }

        }

        @media (max-width: 767.98px) {

          .admin-menu-page {
            padding-top: 20px !important;
          }

          .admin-menu-header h1 {
            line-height: 1.2;
          }

          .admin-menu-header p {
            font-size: 0.88rem;
            line-height: 1.5;
          }

          .current-menu-header {
            flex-direction: column;
            gap: 15px;
          }

          .admin-menu-refresh-btn {
            width: 100%;
          }

          .admin-food-image-wrapper {
            height: 220px;
          }

          .admin-food-body {
            padding: 18px;
          }

        }

        @media (max-width: 479.98px) {

          .admin-menu-page {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .admin-menu-section-card .card-body {
            padding: 16px 14px;
          }

          .admin-menu-section-heading {
            gap: 9px;
          }

          .admin-menu-section-icon {
            width: 37px;
            height: 37px;
            min-width: 37px;
            border-radius: 10px;
            font-size: 1rem;
          }

          .admin-menu-section-heading h3 {
            font-size: 1.15rem;
          }

          .admin-menu-section-heading p {
            font-size: 0.82rem;
            line-height: 1.45;
          }

          .current-menu-title h2 {
            font-size: 1.4rem;
          }

          .current-menu-title p {
            font-size: 0.82rem;
            line-height: 1.45;
          }

          .admin-food-image-wrapper {
            height: 190px;
          }

          .admin-food-body {
            padding: 15px;
          }

          .admin-food-title-row {
            min-height: auto;
            margin-bottom: 14px;
          }

          .admin-food-name {
            font-size: 1.08rem;
          }

          .admin-price-card {
            padding: 10px 5px;
          }

          .admin-price-value {
            font-size: 0.95rem;
          }

          .admin-availability-btn {
            min-height: 46px;
            font-size: 0.75rem;
            padding: 8px 7px;
          }

          .admin-action-btn {
            min-height: 42px;
            font-size: 0.82rem;
          }

        }

      `}</style>

    </div>
  );
}

export default AdminMenu;