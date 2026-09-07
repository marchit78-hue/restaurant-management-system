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
        <nav className="navbar navbar-dark bg-dark shadow-sm">
            <div className="container-fluid px-3 px-md-4">

                {/* ==================== BRAND ==================== */}

                <Link
                    to={isAdmin ? "/admin" : "/home"}
                    className="navbar-brand fw-bold mb-0"
                    style={{
                        whiteSpace: "nowrap",
                        fontSize:
                            "clamp(1.05rem, 2.5vw, 1.35rem)",
                    }}
                >
                    🍽️ arch-restaurant
                </Link>

                {/* ==================== NAVIGATION ==================== */}

                <div
                    className="d-flex align-items-center justify-content-end flex-wrap gap-2 ms-auto"
                    style={{
                        minWidth: 0,
                    }}
                >

                    {/* ==================== ADMIN ==================== */}

                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin"
                                className="btn btn-outline-light"
                            >
                                📊{" "}
                                <span className="nav-text">
                                    Dashboard
                                </span>
                            </Link>

                            <Link
                                to="/admin-menu"
                                className="btn btn-outline-light"
                            >
                                🍽️{" "}
                                <span className="nav-text">
                                    Menu
                                </span>
                            </Link>

                            <Link
                                to="/orders"
                                className="btn btn-outline-light"
                            >
                                📋{" "}
                                <span className="nav-text">
                                    Orders
                                </span>
                            </Link>

                            <Link
                                to="/admin-carts"
                                className="btn btn-outline-light"
                            >
                                🛒{" "}
                                <span className="nav-text">
                                    Live Carts
                                </span>
                            </Link>

                            <Link
                                to="/reviews"
                                className="btn btn-outline-light"
                            >
                                ⭐{" "}
                                <span className="nav-text">
                                    Reviews
                                </span>
                            </Link>
                        </>
                    ) : (

                        /* ==================== CUSTOMER ==================== */

                        <>
                            <Link
                                to="/home"
                                className="btn btn-outline-light"
                            >
                                🏠{" "}
                                <span className="nav-text">
                                    Home
                                </span>
                            </Link>

                            <Link
                                to="/menu"
                                className="btn btn-outline-light"
                            >
                                🍽️{" "}
                                <span className="nav-text">
                                    Menu
                                </span>
                            </Link>

                            <Link
                                to="/cart"
                                className="btn btn-outline-light cart-nav-button"
                            >
                                🛒{" "}
                                <span className="nav-text">
                                    Cart
                                </span>
                            </Link>

                            <Link
                                to="/orders"
                                className="btn btn-outline-light"
                            >
                                🧾{" "}
                                <span className="nav-text">
                                    My Orders
                                </span>
                            </Link>
                        </>
                    )}

                    {/* ==================== USER NAME ==================== */}

                    {user.name && (
                        <span
                            className="text-white ms-1 d-none d-xl-inline"
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            Hi, {user.name}
                        </span>
                    )}

                    {/* ==================== LOGOUT ==================== */}

                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={handleLogout}
                        style={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        Logout
                    </button>

                </div>
            </div>

            {/* ==================== RESPONSIVE STYLES ==================== */}

            <style>{`

                .navbar .btn {
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .navbar .btn:hover {
                    transform: translateY(-1px);
                }

                .cart-nav-button {
                    position: relative;
                }

                /* ==================== HALF SCREEN ==================== */

                @media (max-width: 1100px) {

                    .navbar .container-fluid {
                        gap: 10px;
                    }

                    .navbar-brand {
                        font-size: 1.15rem !important;
                    }

                    .navbar .btn {
                        font-size: 14px;
                        padding: 7px 10px;
                    }

                }

                /* ==================== TABLET ==================== */

                @media (max-width: 850px) {

                    .navbar .container-fluid {
                        flex-direction: column;
                        align-items: stretch !important;
                        padding-top: 10px;
                        padding-bottom: 10px;
                    }

                    .navbar-brand {
                        text-align: center;
                        width: 100%;
                        margin-bottom: 8px !important;
                    }

                    .navbar .container-fluid > div:last-child {
                        width: 100%;
                        justify-content: center !important;
                        margin-left: 0 !important;
                    }

                }

                /* ==================== MOBILE ==================== */

                @media (max-width: 600px) {

                    .navbar .container-fluid {
                        padding-left: 10px !important;
                        padding-right: 10px !important;
                    }

                    .navbar .btn {
                        flex: 1 1 auto;
                        font-size: 13px;
                        padding: 8px 9px;
                        min-height: 40px;
                    }

                    .nav-text {
                        display: inline;
                    }

                }

                /* ==================== SMALL MOBILE ==================== */

                @media (max-width: 450px) {

                    .navbar .container-fluid > div:last-child {
                        display: grid !important;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                        width: 100%;
                        gap: 7px !important;
                    }

                    .navbar .btn {
                        width: 100%;
                        min-width: 0;
                        font-size: 12px;
                        padding: 8px 5px;
                    }

                    .navbar .btn-warning {
                        grid-column: 1 / -1;
                    }

                }

                /* ==================== VERY SMALL MOBILE ==================== */

                @media (max-width: 350px) {

                    .navbar-brand {
                        font-size: 1rem !important;
                    }

                    .navbar .btn {
                        font-size: 11px;
                        padding: 7px 4px;
                    }

                }

            `}</style>

        </nav>
    );
}

export default Navbar;