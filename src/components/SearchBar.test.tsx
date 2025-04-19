import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders the search bar with the correct placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="Search..." />);
    const inputElement = screen.getByPlaceholderText('Search...');
    expect(inputElement).toBeInTheDocument();
  });

  it('displays the correct value in the input field', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    const inputElement = screen.getByDisplayValue('test');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls the onChange handler when the input value changes', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('renders the search icon inside the input field', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    const searchIcon = screen.getByTestId('SearchIcon');
    expect(searchIcon).toBeInTheDocument();
  });
});
