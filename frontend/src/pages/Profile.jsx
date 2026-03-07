import { useUser } from "../context/UserProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-info">
        {user.photoURL && (
          <img src={user.photoURL} alt="Profile" className="profile-photo" />
        )}
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}
