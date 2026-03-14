import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { registerUser } from "../services/api/user.service";

const UserContext = createContext();

function normalizeEmailList(value = "") {
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const adminEmails = normalizeEmailList(
          import.meta.env.VITE_ADMIN_EMAILS || "",
        );
        const email = firebaseUser.email || "";
        const isAdmin = adminEmails.includes(email.toLowerCase());

        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email,
          photoURL: firebaseUser.photoURL || "",
          isAdmin,
        };

        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      // Register user in backend if new
      await registerUser({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        password: null,
        is_oauth: true,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const login = async () => {
    throw new Error("Please use Google sign in");
  };

  const signup = async () => {
    throw new Error("Please use Google sign in");
  };

  return (
    <UserContext.Provider
      value={{ user, login, signup, loginWithGoogle, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
