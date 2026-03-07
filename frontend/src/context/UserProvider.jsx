import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to our user object
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google sign in
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // User is set via onAuthStateChanged
    } catch (error) {
      console.error("Google sign in error:", error);
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Keep old login/signup for backward compatibility or remove if not needed
  const login = async (email, password) => {
    // For now, just throw error since we're using Firebase
    throw new Error("Please use Google sign in");
  };

  const signup = async (email, password) => {
    throw new Error("Please use Google sign in");
  };

  return (
    <UserContext.Provider value={{ user, login, signup, loginWithGoogle, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);