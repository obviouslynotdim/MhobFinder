// src/components/FavoriteButton.jsx
import { useUser } from "../context/UserProvider.jsx";
import { addFavorite, removeFavorite } from "../services/api/favorite.service.js";

export default function FavoriteButton({ foodId }) {
  const { user } = useUser();

  const handleClick = async () => {
    if (!user) {
      alert("Please login to save favorites");
      return;
    }
    try {
      await addFavorite(user.id, foodId);
      alert("Added to favorites!");
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert("Failed to add to favorites");
    }
  };

  return (
    <button onClick={handleClick}>
      ❤️ Favorite
    </button>
  );
}