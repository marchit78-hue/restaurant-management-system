import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import AdminMenu from './pages/AdminMenu';
import EditMenu from './pages/EditMenu';
import Reviews from './pages/Reviews';

function App() {
  return (
    <>
      <Routes>

        {/* ==================== LOGIN ==================== */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ==================== REGISTER ==================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================== CUSTOMER HOME ==================== */}

        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* ==================== ADMIN DASHBOARD ==================== */}

        <Route
          path="/admin"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />

        {/* ==================== CUSTOMER MENU ==================== */}

        <Route
          path="/menu"
          element={
            <>
              <Navbar />
              <Menu />
            </>
          }
        />

        {/* ==================== ADMIN MENU ==================== */}

        <Route
          path="/admin-menu"
          element={
            <>
              <Navbar />
              <AdminMenu />
            </>
          }
        />

        {/* ==================== EDIT MENU ==================== */}

        <Route
          path="/edit-menu/:id"
          element={
            <>
              <Navbar />
              <EditMenu />
            </>
          }
        />

        {/* ==================== ORDERS ==================== */}

        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <Orders />
            </>
          }
        />

        {/* ==================== ADMIN REVIEWS ==================== */}

        <Route
          path="/reviews"
          element={
            <>
              <Navbar />
              <Reviews />
            </>
          }
        />

      </Routes>
    </>
  );
}

export default App;