import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell.jsx";
import { AppProvider } from "./state/AppProvider.jsx";
import { UserProvider, useUser } from "./state/UserProvider.jsx";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import AddFood from "./pages/admin/AddFood.jsx";
import ManageUser from "./pages/admin/ManageUser.jsx";
import UserDetail from "./pages/admin/UserDetail.jsx";
import Analytical from "./pages/admin/Analytical.jsx";

function ProtectedRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <UserProvider>
      <AppProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/add-food"
              element={
                <ProtectedRoute>
                  <AddFood />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/manage-user"
              element={
                <ProtectedRoute>
                  <ManageUser />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/manage-user/:id"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/analytical"
              element={
                <ProtectedRoute>
                  <Analytical />
                </ProtectedRoute>
              }
            />

            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </UserProvider>
  );
}