import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(false);

  // Mock login (replace later with Google OAuth)
  const login = async (email) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500)); // simulate server
    const mockUser = { id: 1, name: "Dim Dom", email };
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);