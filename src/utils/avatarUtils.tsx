export const avatarUrl = (userId: string | null) => {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}`;
};
