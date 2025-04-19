import React, { useReducer, useEffect, ReactNode } from 'react';
import { encrypt, FavoritesContext, getInitialState } from './FavoritesContextUtils'; 
import { Movie } from '../types/Movie';

type State = {
  favorites: Movie[];
};

type Action =
  | { type: 'ADD_FAVORITE'; payload: Movie }
  | { type: 'REMOVE_FAVORITE'; payload: string };

const initialState: State = {
  favorites: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.favorites.some((m) => m.id === action.payload.id)) return state;
      return { favorites: [...state.favorites, action.payload] };

    case 'REMOVE_FAVORITE':
      return {
        favorites: state.favorites.filter((m) => m.id !== action.payload),
      };

    default:
      return state;
  }
};

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, getInitialState);

  useEffect(() => {
    localStorage.setItem('favorites', encrypt(JSON.stringify(state.favorites)));
  }, [state.favorites]);

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>{children}</FavoritesContext.Provider>
  );
};
