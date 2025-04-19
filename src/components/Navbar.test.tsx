import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ThemeContext } from '../context/ThemeContextUtils';
import { AuthContext } from '../context/AuthContextUtils';
import Navbar from './Navbar';

// Mock useMediaQuery to simulate mobile view
vi.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => true, // Always return true to simulate mobile view
}));

const renderWithProviders = (
  ui: React.ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { user, toggleTheme, mode, login = vi.fn(), logout = vi.fn() }: any,
) => {
  return render(
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ toggleTheme, mode }}>
        <BrowserRouter>{ui}</BrowserRouter>
      </ThemeContext.Provider>
    </AuthContext.Provider>,
  );
};

describe('Navbar', () => {
  it('renders the title correctly', () => {
    renderWithProviders(<Navbar />, {
      user: null,
      toggleTheme: vi.fn(),
      mode: 'light',
    });
    expect(screen.getByText('🎥 Movie Explorer')).toBeInTheDocument();
  });

  it('renders navigation links correctly for logged-out users', () => {
    renderWithProviders(<Navbar />, {
      user: null,
      toggleTheme: vi.fn(),
      mode: 'light',
    });
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /favorites/i })).not.toBeInTheDocument();
  });

  it('renders navigation links correctly for logged-in users', () => {
    renderWithProviders(<Navbar />, {
      user: { id: 1, name: 'Test User' },
      toggleTheme: vi.fn(),
      mode: 'light',
    });
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument();
  });

  it('calls login function when login button is clicked', async () => {
    const mockLogin = vi.fn();
    renderWithProviders(<Navbar />, {
      user: null,
      toggleTheme: vi.fn(),
      mode: 'light',
      login: mockLogin,
    });
    const loginButton = screen.getByRole('button', { name: /login/i });
    await act(async () => {
      fireEvent.click(loginButton);
    });
    expect(mockLogin).toHaveBeenCalled();
  });

  it('calls logout function when logout button is clicked', async () => {
    const mockLogout = vi.fn();
    renderWithProviders(<Navbar />, {
      user: { id: 1, name: 'Test User' },
      toggleTheme: vi.fn(),
      mode: 'light',
      logout: mockLogout,
    });
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalled();
  });

  it('toggles theme when theme button is clicked', async () => {
    const mockToggleTheme = vi.fn();
    renderWithProviders(<Navbar />, {
      user: null,
      toggleTheme: mockToggleTheme,
      mode: 'light',
    });
    const themeButton = screen.getByLabelText(/toggle theme/i);
    await act(async () => {
      fireEvent.click(themeButton);
    });
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
