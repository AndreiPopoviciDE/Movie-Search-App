import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContextUtils';
import { fetchMovieDetails } from '../api/movieApi';
import { Movie } from '../types/Movie';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Button,
} from '@mui/material';

const MovieDetails = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useFavorites();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isFavorite = useMemo(() => {
    return movie ? !!state.favorites.find((fav) => fav.id === movie.id) : false;
  }, [movie, state.favorites]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    // Check if the movie is already a favorite
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: movie.id });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: movie });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch movie details. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4, padding: 2, fontWeight: 'bold' }}>
        {error || 'An unexpected error occurred. Please try again later.'}
      </Alert>
    );
  }

  if (!movie) return null;

  return (
    <Box p={2}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(-1)} // Navigate back
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          padding: 2,
        }}
      >
        <CardMedia
          component="img"
          image={movie.movie_banner}
          alt={movie.title}
          sx={{
            width: { xs: '100%', sm: 250 },
            height: 'auto',
          }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Original Title: {movie.original_title} ({movie.original_title_romanised})
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Released: {movie.release_date}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Running Time: {movie.running_time} minutes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Rating: {movie.rt_score}
          </Typography>
          <Typography mt={2} fontWeight="bold">
            Description:
          </Typography>
          <Typography>{movie.description}</Typography>

          <Typography mt={3} fontWeight="bold">
            Director:
          </Typography>
          <Typography>{movie.director}</Typography>

          <Typography mt={3} fontWeight="bold">
            Producer:
          </Typography>
          <Typography>{movie.producer}</Typography>

          <Button
            variant={isFavorite ? 'outlined' : 'contained'}
            color="primary"
            sx={{ mt: 4, width: { xs: '100%', sm: 'auto' } }}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MovieDetails;
