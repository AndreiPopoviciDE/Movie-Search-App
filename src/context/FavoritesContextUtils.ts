import { createContext, useContext } from 'react';
import { Movie } from '../types/Movie';

type State = {
  favorites: Movie[];
};

type Action =
  | { type: 'ADD_FAVORITE'; payload: Movie }
  | { type: 'REMOVE_FAVORITE'; payload: string };

export const FavoritesContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const encrypt = (data: string) => btoa(unescape(encodeURIComponent(data))); // Handle Unicode characters
export const decrypt = (data: string) => decodeURIComponent(escape(atob(data))); // Handle Unicode characters

export const getInitialState = (): State => {
  try {
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage is not available');
    }
    const local = localStorage.getItem('favorites');
    return local ? { favorites: JSON.parse(decrypt(local)) } : { favorites: [] };
  } catch (error) {
    console.error('Failed to get initial state from localStorage:', error);
    return { favorites: [] }; // Fallback to an empty state
  }
};
