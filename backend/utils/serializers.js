export const toSafeUser = (user) => {
  if (!user) return null;

  const source = typeof user.get === "function" ? user.get({ plain: true }) : user;

  return {
    user_id: source.user_id,
    name: source.name,
    email: source.email,
    image_url: source.image_url || null,
    image_public_id: source.image_public_id || null,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};