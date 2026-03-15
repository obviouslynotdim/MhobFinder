import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  fetchMyProfile,
  registerUser,
  updateMyProfile,
} from "../services/api/user.service";

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminEmails = normalizeEmailList(
          import.meta.env.VITE_ADMIN_EMAILS || "",
        );
        const email = firebaseUser.email || "";
        const isAdmin = adminEmails.includes(email.toLowerCase());

        let dbProfile = null;
        try {
          const result = await fetchMyProfile();
          dbProfile = result?.user || null;
        } catch (error) {
          // Fallback to Firebase values if backend profile fetch fails.
          console.warn("Failed to load backend profile, using Firebase profile.", error);
        }

        const userData = {
          id: firebaseUser.uid,
          name: dbProfile?.name || firebaseUser.displayName || "User",
          email,
          photoURL: dbProfile?.image_url || firebaseUser.photoURL || "",
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

  const updateUserProfile = async ({ name, imageFile }) => {
    if (!auth.currentUser) {
      throw new Error("Not logged in");
    }

    const nextName = String(name || "").trim();
    const formData = new FormData();

    if (nextName) {
      formData.append("name", nextName);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (!nextName && !imageFile) {
      throw new Error("Please provide a new name or image");
    }

    const apiResult = await updateMyProfile(formData);
    const savedName = apiResult?.user?.name || auth.currentUser.displayName || "User";
    const savedPhotoURL =
      apiResult?.user?.image_url || auth.currentUser.photoURL || "";

    await updateProfile(auth.currentUser, {
      displayName: savedName,
      photoURL: savedPhotoURL,
    });

    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: savedName,
        photoURL: savedPhotoURL,
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        signup,
        loginWithGoogle,
        logout,
        loading,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
