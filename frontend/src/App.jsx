import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layouts/user/AppShell.jsx";
import AdminLayout from "./layouts/admin/AdminLayout.jsx";
import { AppProvider } from "./context/AppProvider.jsx";
import { UserProvider, useUser } from "./context/UserProvider.jsx";
import { LanguageProvider } from "./context/LanguageProvider.jsx";

import Start from "./pages/user/Start.jsx";
import Home from "./pages/user/Home.jsx";
import Favorites from "./pages/user/Favorites.jsx";
import About from "./pages/user/About.jsx";
import Login from "./pages/user/Login.jsx";
import Profile from "./pages/user/Profile.jsx";
import EditProfile from "./pages/user/EditProfile.jsx";

import AdminHomePage from "./pages/admin/AdminHomePage.jsx";
import AdminFoodPage from "./pages/admin/AdminFoodPage.jsx";
import AddFood from "./pages/admin/AddFood.jsx";
import EditFood from "./pages/admin/EditFood.jsx";
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
  if (!user.isAdmin) return <Navigate to="/home" replace />;

  return children;
}

export default function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <AppProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Start />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />

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

              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
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
              <Route path="home" element={<AdminHomePage />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="foods" element={<AdminFoodPage />} />
              <Route path="add-food" element={<AddFood />} />
              <Route path="edit-food/:id" element={<EditFood />} />
              <Route path="manage-user" element={<ManageUser />} />
              <Route path="analytical" element={<Analytical />} />
              <Route path="users/:id" element={<UserDetail />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </LanguageProvider>
    </UserProvider>
  );
}
