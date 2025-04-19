export const getNavLinks = (user: unknown | null) => [
  { label: 'Home', path: '/' },
  ...(user ? [{ label: 'Favorites', path: '/favorites' }] : []),
];
