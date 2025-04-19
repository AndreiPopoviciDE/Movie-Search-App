import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContextUtils';
import { useAuth } from '../context/AuthContextUtils';
import { getNavLinks } from '../utils/navLinks';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontWeight: 'bold',
  borderBottom: '2px solid transparent',
  borderRadius: 0,
};

const activeStyle = {
  borderBottom: '2px solid #fff',
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const navLinks = getNavLinks(user);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🎥 Movie Explorer
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-label="menu"
              data-testid="menu-button"
            >
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {navLinks.map(({ label, path }) => (
                <MenuItem
                  key={path}
                  component={RouterLink}
                  to={path}
                  onClick={handleMenuClose}
                  selected={location.pathname === path}
                >
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={2}>
            {navLinks.map(({ label, path }) => {
              const isActive = location.pathname === path;

              return (
                <RouterLink
                  key={path}
                  to={path}
                  style={{ ...linkStyle, ...(isActive && activeStyle) }}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                >
                  {label}
                </RouterLink>
              );
            })}
          </Stack>
        )}

        <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ ml: 2 }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={user ? 'Logout' : 'Login'}>
          <Button color="inherit" onClick={user ? handleLogout : login}>
            {user ? <LogoutIcon /> : <LoginIcon />}
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
