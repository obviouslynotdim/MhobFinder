import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layouts/AppShell.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import { AppProvider } from "./context/AppProvider.jsx";
import { UserProvider, useUser } from "./context/UserProvider.jsx";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";

import AdminHome from "./pages/admin/AdminHome.jsx";
import AddFood from "./pages/admin/AddFood.jsx";
import ManageUser from "./pages/admin/ManageUser.jsx";
import Analytical from "./pages/admin/Analytical.jsx";
import UserDetail from "./pages/admin/UserDetail.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <UserProvider>
      <AppProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="add-food" element={<AddFood />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="analytical" element={<Analytical />} />
            <Route path="users/:id" element={<UserDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </UserProvider>
  );
}