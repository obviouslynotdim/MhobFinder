import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./app/layout/AppShell.jsx";
import { AppProvider } from "./app/state/AppProvider.jsx";
import { UserProvider, useUser } from "./app/state/UserProvider.jsx";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";

// Protect routes that require login
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
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </UserProvider>
  );
}
