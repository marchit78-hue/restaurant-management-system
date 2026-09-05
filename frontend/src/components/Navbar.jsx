import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const isAdmin = user.role === "admin";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">

                {/* BRAND */}

                <Link
                    to={isAdmin ? "/admin" : "/home"}
                    className="navbar-brand fw-bold"
                >
                    🍽️ arch-restaurant
                </Link>

                {/* NAVIGATION */}

                <div className="d-flex gap-2 align-items-center">

                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin"
                                className="btn btn-outline-light"
                            >
                                📊 Dashboard
                            </Link>

                            <Link
                                to="/admin-menu"
                                className="btn btn-outline-light"
                            >
                                🍽️ Menu
                            </Link>

                            <Link
                                to="/orders"
                                className="btn btn-outline-light"
                            >
                                📋 Orders
                            </Link>

                            <Link
                                to="/reviews"
                                className="btn btn-outline-light"
                            >
                                ⭐ Reviews
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/home"
                                className="btn btn-outline-light"
                            >
                                🏠 Home
                            </Link>

                            <Link
                                to="/menu"
                                className="btn btn-outline-light"
                            >
                                🍽️ Menu
                            </Link>

                            <Link
                                to="/orders"
                                className="btn btn-outline-light"
                            >
                                🧾 My Orders
                            </Link>
                        </>
                    )}

                    {/* USER */}

                    {user.name && (
                        <span
                            className="text-white ms-2 d-none d-lg-inline"
                        >
                            Hi, {user.name}
                        </span>
                    )}

                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;