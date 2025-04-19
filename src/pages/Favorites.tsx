import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContextUtils';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Favorites = () => {
  const { state, dispatch } = useFavorites();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '' });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
    setSnackbar({ open: true, message: 'Movie removed from favorites!' });
  };

  const renderEmptyState = () => (
    <Box p={4} display="flex" justifyContent="center" alignItems="center">
      <Typography variant="h6" textAlign="center" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
        You haven't added any favorites yet.
      </Typography>
    </Box>
  );

  const renderMovieCard = ({
    id,
    image,
    title,
    release_date,
  }: {
    id: string;
    image: string;
    title: string;
    release_date: string;
  }) => (
    <Grid key={id}>
      <Card
        sx={{
          width: { xs: '90%', sm: '230px' },
          height: '100%',
          position: 'relative',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <CardActionArea
          onClick={() => navigate(`/movie/${id}`)}
          aria-label={`View details of ${title}`}
        >
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{ height: 345, objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {release_date}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={() => handleRemove(id)}
          aria-label={`Remove ${title} from favorites`}
        >
          Remove
        </Button>
      </Card>
    </Grid>
  );

  if (state.favorites.length === 0) {
    return renderEmptyState();
  }

  return (
    <>
      <Box p={4}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          sx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" mb={3}>
            Your Favorite Movies
          </Typography>
        </Box>
        <Grid container spacing={2} mt={2} justifyContent="center">
          {state.favorites.map(renderMovieCard)}
        </Grid>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Favorites;
