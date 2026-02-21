export const mockUsers = [
  { id: 1, name: "Dim Dom", email: "dimdom@example.com", password: "123456" },
  { id: 2, name: "Jane Doe", email: "jane@example.com", password: "abcdef" },
];

export const loginUser = async (email, password) => {
  await new Promise(res => setTimeout(res, 500)); // simulate network
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  return { id: user.id, name: user.name, email: user.email };
};