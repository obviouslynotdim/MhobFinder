export const toSafeUser = (user) => {
  if (!user) return null;

  const source = typeof user.get === "function" ? user.get({ plain: true }) : user;

  return {
    user_id: source.user_id,
    name: source.name,
    email: source.email,
    image_url: source.image_url || null,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};