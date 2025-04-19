import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<Props> = ({ value, onChange, placeholder = 'Search Movies' }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputProps={{ 'aria-label': 'search-input' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon data-testid="SearchIcon" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
