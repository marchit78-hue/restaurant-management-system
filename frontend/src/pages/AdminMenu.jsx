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
    <div className="container py-4">

      {/* =========================
          HEADER
      ========================== */}

      <div className="mb-4">

        <span className="text-primary fw-bold">
          RESTAURANT MANAGEMENT
        </span>

        <h1 className="fw-bold mt-1">
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

      <div className="card shadow-sm mb-5">

        <div className="card-body p-4">

          <div className="mb-4">

            <h3 className="mb-1">
              ➕ Add New Menu Item
            </h3>

            <p className="text-muted mb-0">
              Enter one food item with
              separate Half and Full prices.
            </p>

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

      <div className="card shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <span className="text-primary fw-bold">
                CUSTOMER MENU
              </span>

              <h2 className="fw-bold mb-1">
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
              className="btn btn-outline-primary"
              onClick={loadMenu}
            >
              🔄 Refresh
            </button>

          </div>


          {/* =========================
              LOADING
          ========================== */}

          {loading && (
            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="text-muted mt-3">
                Loading restaurant menu...
              </p>

            </div>
          )}


          {/* =========================
              EMPTY
          ========================== */}

          {!loading &&
            sortedMenu.length === 0 && (
              <div className="text-center py-5">

                <div
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  🍽️
                </div>

                <h4>
                  No menu items yet
                </h4>

                <p className="text-muted">
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

              <div className="row g-4">

                {sortedMenu.map(
                  (item) => (

                    <div
                      className="col-12 col-md-6 col-lg-4"
                      key={item._id}
                    >

                      <div
                        className={`card h-100 border shadow-sm ${
                          item.isAvailable === false
                            ? "opacity-75"
                            : ""
                        }`}
                      >

                        {/* =========================
                            IMAGE
                        ========================== */}

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.foodName}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{
                              height: "200px",
                              fontSize: "4rem",
                            }}
                          >
                            🍽️
                          </div>

                        )}


                        {/* =========================
                            BODY
                        ========================== */}

                        <div className="card-body">

                          <div className="d-flex justify-content-between align-items-start gap-2">

                            <h4 className="fw-bold">
                              {item.foodName}
                            </h4>

                            {/* STATUS BADGE */}

                            <span
                              className={`badge ${
                                item.isAvailable === false
                                  ? "bg-danger"
                                  : "bg-success"
                              }`}
                            >
                              {item.isAvailable === false
                                ? "Unavailable"
                                : "Available"}
                            </span>

                          </div>


                          {/* =========================
                              PRICES
                          ========================== */}

                          <div className="row g-2 mb-3">

                            <div className="col-6">

                              <div className="border rounded-3 p-3 text-center">

                                <div className="small text-muted">
                                  HALF
                                </div>

                                <div className="fs-5 fw-bold">
                                  ₹
                                  {Number(
                                    item.halfPrice || 0
                                  ).toFixed(2)}
                                </div>

                              </div>

                            </div>


                            <div className="col-6">

                              <div className="border rounded-3 p-3 text-center">

                                <div className="small text-muted">
                                  FULL
                                </div>

                                <div className="fs-5 fw-bold">
                                  ₹
                                  {Number(
                                    item.fullPrice || 0
                                  ).toFixed(2)}
                                </div>

                              </div>

                            </div>

                          </div>


                          {/* =========================
                              AVAILABILITY BUTTON
                          ========================== */}

                          <div className="mb-3">

                            <button
                              type="button"
                              className={`btn w-100 ${
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

                          <div className="d-flex gap-2">

                            <button
                              type="button"
                              className="btn btn-warning flex-grow-1"
                              onClick={() =>
                                handleEdit(item)
                              }
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger flex-grow-1"
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

    </div>
  );
}

export default AdminMenu;