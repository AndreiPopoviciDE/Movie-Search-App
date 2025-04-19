import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContextUtils';
import { AuthContext } from '../context/AuthContextUtils';
import MovieCard from './MovieCard';

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  release_date: '2023-01-01',
  image: 'test-image.jpg',
  original_title: 'Test Original Title',
  original_title_romanised: 'Test Original Title Romanised',
  movie_banner: 'test-banner.jpg',
  description: 'Test description of the movie.',
  director: 'Test Director',
  producer: 'Test Producer',
  running_time: '120',
  rt_score: '95',
};

const renderWithProviders = (
  ui: React.ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { user, favorites, dispatch }: any,
) => {
  return render(
    <AuthContext.Provider value={{ user, login: vi.fn(), logout: vi.fn() }}>
      <FavoritesContext.Provider value={{ state: { favorites }, dispatch }}>
        <BrowserRouter>{ui}</BrowserRouter>
      </FavoritesContext.Provider>
    </AuthContext.Provider>,
  );
};

describe('MovieCard', () => {
  it('renders movie details correctly', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />, {
      user: null,
      favorites: [],
      dispatch: vi.fn(),
    });

    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.release_date)).toBeInTheDocument();
    expect(screen.getByAltText(`${mockMovie.title} poster`)).toHaveAttribute(
      'src',
      mockMovie.image,
    );
  });

  it('navigates to movie details page on click', () => {
    const { container } = renderWithProviders(<MovieCard movie={mockMovie} />, {
      user: null,
      favorites: [],
      dispatch: vi.fn(),
    });

    const cardActionArea = container.querySelector('.MuiCardActionArea-root');
    expect(cardActionArea).toBeInTheDocument();

    fireEvent.click(cardActionArea!);
    expect(window.location.pathname).toBe(`/movie/${mockMovie.id}`);
  });

  it('shows favorite button if user is logged in', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />, {
      user: { id: 1, name: 'Test User' },
      favorites: [],
      dispatch: vi.fn(),
    });

    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
  });

  it('toggles favorite state on button click', () => {
    const mockDispatch = vi.fn();
    renderWithProviders(<MovieCard movie={mockMovie} />, {
      user: { id: 1, name: 'Test User' },
      favorites: [],
      dispatch: mockDispatch,
    });

    const favoriteButton = screen.getByRole('button', {
      name: /add to favorites/i,
    });
    fireEvent.click(favoriteButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_FAVORITE',
      payload: mockMovie,
    });
  });

  it('removes from favorites if already favorited', () => {
    const mockDispatch = vi.fn();
    renderWithProviders(<MovieCard movie={mockMovie} />, {
      user: { id: 1, name: 'Test User' },
      favorites: [mockMovie],
      dispatch: mockDispatch,
    });

    const favoriteButton = screen.getByRole('button', {
      name: /remove from favorites/i,
    });
    fireEvent.click(favoriteButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REMOVE_FAVORITE',
      payload: mockMovie.id,
    });
  });
});
