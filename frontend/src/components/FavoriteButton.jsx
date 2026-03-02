// src/components/FavoriteButton.jsx
import { useUser } from "../context/UserProvider.jsx";

export default function FavoriteButton({ foodId }) {
  const { user, login } = useUser();

  const handleClick = async () => {
    if (!user) {
      // trigger login modal
      alert("Please login to save favorites");
      return;
    }
    // call backend to save favorite
    console.log("Saving favorite for user:", user, "food:", foodId);
  };

  return (
    <button onClick={handleClick}>
      ❤️ Favorite
    </button>
  );
}