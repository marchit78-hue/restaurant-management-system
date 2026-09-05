import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMenu,
  addMenu,
  updateMenu,
  deleteMenu,
  getOrders,
  getAllCarts,
} from "../services/api";
import MenuForm from "../components/MenuForm";

function Dashboard() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [liveCarts, setLiveCarts] = useState([]);

  const [formData, setFormData] = useState({
    foodName: "",
    sizeCategory: "",
    price: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadLiveCarts();

    const interval = setInterval(() => {
      loadLiveCarts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==================== DASHBOARD ====================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const menuData = await getMenu();
      const orderData = await getOrders();

      setMenuItems(
        Array.isArray(menuData)
          ? menuData
          : []
      );

      setOrderCount(
        Array.isArray(orderData)
          ? orderData.length
          : 0
      );
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      alert(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== LIVE CARTS ====================

  const loadLiveCarts = async () => {
    try {
      setCartLoading(true);

      const data = await getAllCarts();

      setLiveCarts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Live cart error:",
        error
      );
    } finally {
      setCartLoading(false);
    }
  };

  // ==================== FORM ====================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMenu(
          editingId,
          {
            ...formData,
            price: Number(
              formData.price
            ),
          }
        );

        alert(
          "Menu item updated successfully."
        );
      } else {
        await addMenu({
          ...formData,
          price: Number(
            formData.price
          ),
        });

        alert(
          "Menu item added successfully."
        );
      }

      resetForm();
      loadDashboard();
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

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      foodName:
        item.foodName || "",
      sizeCategory:
        item.sizeCategory || "",
      price:
        item.price || "",
      image:
        item.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this menu item?"
      );

    if (!confirmed) return;

    try {
      await deleteMenu(id);

      alert(
        "Menu item deleted successfully."
      );

      loadDashboard();
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

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      foodName: "",
      sizeCategory: "",
      price: "",
      image: "",
    });
  };

  // ==================== LIVE DEMAND SUMMARY ====================

  const demandSummary = {};

  liveCarts.forEach((cart) => {
    cart.items?.forEach((item) => {
      const key =
        `${item.foodItem} - ${item.sizeCategory}`;

      if (!demandSummary[key]) {
        demandSummary[key] = {
          foodItem:
            item.foodItem,
          sizeCategory:
            item.sizeCategory,
          quantity: 0,
        };
      }

      demandSummary[key].quantity +=
        Number(item.quantity || 0);
    });
  });

  const demandItems =
    Object.values(demandSummary);

  const totalLiveCustomers =
    liveCarts.length;

  const totalLiveItems =
    liveCarts.reduce(
      (sum, cart) =>
        sum +
        (cart.items || []).reduce(
          (itemSum, item) =>
            itemSum +
            Number(
              item.quantity || 0
            ),
          0
        ),
      0
    );

  return (
    <div className="container py-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h1 className="fw-bold">
            Admin Dashboard
          </h1>

          <p className="text-muted mb-0">
            Manage arch-restaurant menu and orders
          </p>
        </div>

      </div>

      {/* STAT CARDS */}

      <div className="row g-4 mb-5">

        <div className="col-md-3">

          <div
  className="card bg-primary text-white shadow h-100"
  onClick={() => navigate("/admin-menu")}
  style={{
    cursor: "pointer",
    transition: "transform 0.2s ease",
  }}
>

            <div className="card-body">

              <h5>
                Total Menu Items
              </h5>

              <h1 className="display-5 fw-bold">
                {menuItems.length}
              </h1>

              <p className="mb-0">
                Food and size entries
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div
  className="card bg-success text-white shadow h-100"
  onClick={() => navigate("/orders")}
  style={{
    cursor: "pointer",
    transition: "transform 0.2s ease",
  }}
>

            <div className="card-body">

              <h5>
                Total Orders
              </h5>

              <h1 className="display-5 fw-bold">
                {orderCount}
              </h1>

              <p className="mb-0">
                Orders received
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div
  className="card bg-warning text-dark shadow h-100"
  onClick={() => {
    document
      .getElementById("live-cart-demand")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
  style={{
    cursor: "pointer",
    transition: "transform 0.2s ease",
  }}
>

            <div className="card-body">

              <h5>
                🛒 Live Customers
              </h5>

              <h1 className="display-5 fw-bold">
                {totalLiveCustomers}
              </h1>

              <p className="mb-0">
                Customers currently shopping
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card bg-dark text-white shadow h-100">

            <div className="card-body">

              <h5>
                Restaurant
              </h5>

              <h2 className="fw-bold">
                arch-restaurant
              </h2>

              <p className="mb-0">
                Good Food. Great Moments.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* LIVE CART DEMAND */}

      <div
  id="live-cart-demand"
  className="card shadow-sm mb-5"
>

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <h2 className="mb-1">
                🛒 Live Cart Demand
              </h2>

              <p className="text-muted mb-0">
                See what customers are currently
                considering before they place an order.
              </p>

            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={loadLiveCarts}
            >
              🔄 Refresh
            </button>

          </div>

          {/* LIVE SUMMARY */}

          <div className="row g-3 mb-4">

            <div className="col-md-4">

              <div className="border rounded p-3">

                <small className="text-muted">
                  Active Customers
                </small>

                <h3 className="fw-bold mb-0">
                  {totalLiveCustomers}
                </h3>

              </div>

            </div>

            <div className="col-md-4">

              <div className="border rounded p-3">

                <small className="text-muted">
                  Items in Live Carts
                </small>

                <h3 className="fw-bold mb-0">
                  {totalLiveItems}
                </h3>

              </div>

            </div>

            <div className="col-md-4">

              <div className="border rounded p-3">

                <small className="text-muted">
                  Unique Food/Size Demands
                </small>

                <h3 className="fw-bold mb-0">
                  {demandItems.length}
                </h3>

              </div>

            </div>

          </div>

          {cartLoading ? (

            <div className="text-center py-4">
              <p className="text-muted">
                Loading live cart demand...
              </p>
            </div>

          ) : liveCarts.length === 0 ? (

            <div className="text-center py-5">

              <div
                style={{
                  fontSize: "3rem",
                }}
              >
                🛒
              </div>

              <h4>
                No active customer carts
              </h4>

              <p className="text-muted">
                Live cart demand will appear here
                when customers add items to their carts.
              </p>

            </div>

          ) : (

            <>

              {/* DEMAND TABLE */}

              <h5 className="fw-bold mb-3">
                📊 Combined Demand
              </h5>

              <div className="table-responsive mb-5">

                <table className="table table-hover align-middle">

                  <thead>

                    <tr>
                      <th>Food Item</th>
                      <th>Size</th>
                      <th>Quantity</th>
                    </tr>

                  </thead>

                  <tbody>

                    {demandItems.map(
                      (item, index) => (

                        <tr key={index}>

                          <td>
                            <strong>
                              {item.foodItem}
                            </strong>
                          </td>

                          <td>
                            {item.sizeCategory}
                          </td>

                          <td>

                            <span className="badge bg-warning text-dark fs-6">
                              {item.quantity}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* CUSTOMER CARTS */}

              <h5 className="fw-bold mb-3">
                👥 Customer Carts
              </h5>

              <div className="row g-4">

                {liveCarts.map(
                  (cart) => (

                    <div
                      className="col-lg-6"
                      key={cart._id}
                    >

                      <div className="border rounded p-4 h-100">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                          <div>

                            <h5 className="fw-bold mb-1">
                              👤 {cart.customerName}
                            </h5>

                            <small className="text-muted">
                              Cart updated{" "}
                              {new Date(
                                cart.updatedAt
                              ).toLocaleTimeString()}
                            </small>

                          </div>

                          <span className="badge bg-primary">
                            {cart.items?.length || 0} items
                          </span>

                        </div>

                        {cart.items?.map(
                          (item, index) => (

                            <div
                              key={index}
                              className="d-flex justify-content-between border-top py-2"
                            >

                              <div>

                                <strong>
                                  {item.foodItem}
                                </strong>

                                <small className="text-muted d-block">
                                  {item.sizeCategory}
                                </small>

                              </div>

                              <div className="text-end">

                                <strong>
                                  ×{item.quantity}
                                </strong>

                                <small className="text-muted d-block">
                                  ₹
                                  {Number(
                                    item.totalPrice || 0
                                  ).toFixed(2)}
                                </small>

                              </div>

                            </div>

                          )
                        )}

                        <div className="border-top pt-3 mt-2 d-flex justify-content-between">

                          <strong>
                            Cart Subtotal
                          </strong>

                          <strong>
                            ₹
                            {Number(
                              cart.subtotal || 0
                            ).toFixed(2)}
                          </strong>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </div>

      </div>

      {/* MENU MANAGEMENT */}

      <div className="card shadow-sm mb-5">

        <div className="card-body">

          <h2 className="mb-1">
            🍽️ Menu Management
          </h2>

          <p className="text-muted">
            Add food, prices, sizes and individual
            food images.
          </p>

          <MenuForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            editingId={editingId}
            onCancel={resetForm}
          />

        </div>

      </div>

      {/* MENU TABLE */}

      <div className="card shadow-sm">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>

              <h2 className="mb-1">
                Current Menu
              </h2>

              <p className="text-muted mb-0">
                Manage items displayed to customers.
              </p>

            </div>

          </div>

          {loading ? (

            <p>
              Loading menu...
            </p>

          ) : menuItems.length === 0 ? (

            <div className="text-center py-5">

              <h4>
                No menu items yet
              </h4>

              <p className="text-muted">
                Add your first food item above.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>
                    <th>Image</th>
                    <th>Food Name</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {menuItems.map(
                    (item) => (

                      <tr
                        key={item._id}
                      >

                        <td>

                          {item.image ? (

                            <img
                              src={item.image}
                              alt={item.foodName}
                              style={{
                                width:
                                  "70px",
                                height:
                                  "55px",
                                objectFit:
                                  "cover",
                                borderRadius:
                                  "8px",
                              }}
                            />

                          ) : (

                            <span className="text-muted">
                              No image
                            </span>

                          )}

                        </td>

                        <td>
                          <strong>
                            {item.foodName}
                          </strong>
                        </td>

                        <td>
                          {item.sizeCategory}
                        </td>

                        <td>
                          ₹{item.price}
                        </td>

                        <td>

                          <div className="d-flex gap-2">

                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;