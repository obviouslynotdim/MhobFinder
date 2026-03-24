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
        const isAdminByEnv = adminEmails.includes(email.toLowerCase());

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
          firebaseUid: firebaseUser.uid,
          dbUserId:
            Number.isInteger(Number(dbProfile?.user_id)) && Number(dbProfile?.user_id) > 0
              ? Number(dbProfile.user_id)
              : null,
          name: dbProfile?.name || firebaseUser.displayName || "User",
          email,
          photoURL: dbProfile?.image_url || firebaseUser.photoURL || "",
          isAdmin:
            typeof dbProfile?.isAdmin === "boolean"
              ? dbProfile.isAdmin
              : isAdminByEnv,
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
      // Do not open Google popup again if there is already an active Firebase session.
      if (auth.currentUser) {
        setLoading(false);
        throw new Error("You are already signed in. Please log out first to switch account.");
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Log Firebase user data for debugging
      console.debug("Firebase user logged in:", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified,
      });
      
      // Register user in backend if new
      try {
        // Use email prefix as fallback if display name is missing
        const name = (firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'User').trim();
        
        const registerPayload = {
          name,
          email: firebaseUser.email,
          password: "", // Send empty string instead of null
        };
        
        console.debug("Attempting registration with:", registerPayload);
        
        await registerUser(registerPayload);
        console.debug("Registration successful");
      } catch (registerError) {
        // Check if it's a 400 error (likely "Email already registered")
        if (registerError?.response?.status === 400) {
          // User already exists - this is expected for returning users
          console.debug("User already registered, proceeding with login");
        } else {
          // Unexpected error
          console.warn("User registration error:", {
            status: registerError?.response?.status,
            error: registerError?.response?.data?.error,
            message: registerError.message,
          });
        }
      }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
