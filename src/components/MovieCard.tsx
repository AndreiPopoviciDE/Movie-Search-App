import React, { useMemo, useCallback } from 'react';
import { Movie } from '../types/Movie';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContextUtils';
import { useAuth } from '../context/AuthContextUtils';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const cardStyles = {
  width: 230,
  height: '100%',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': { transform: 'scale(1.03)' },
};

interface MovieCardProps {
  movie: Movie;
  onFavoriteAction?: (action: 'added' | 'removed') => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onFavoriteAction }) => {
  const { user } = useAuth(); // Get the current user
  const navigate = useNavigate();
  const { state, dispatch } = useFavorites();

  // Memoize the check for whether the movie is in favorites to prevent recalculations
  const isFavorite = useMemo(
    () => state.favorites.some((fav) => fav.id === movie.id),
    [state.favorites, movie.id],
  );

  const toggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isFavorite && user) {
        dispatch({ type: 'REMOVE_FAVORITE', payload: movie.id });
        onFavoriteAction?.('removed');
      } else if (user) {
        dispatch({ type: 'ADD_FAVORITE', payload: movie });
        onFavoriteAction?.('added');
      }
    },
    [isFavorite, user, dispatch, movie, onFavoriteAction],
  );

  return (
    <Card sx={cardStyles}>
      <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)}>
        <CardMedia
          component="img"
          image={movie.image}
          alt={`${movie.title} poster`}
          sx={{ height: 345, objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h6" noWrap>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.release_date}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Favorite Button */}
      {user && (
        <Box position="absolute" top={8} right={8} zIndex={1}>
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton onClick={toggleFavorite} size="small" color="error">
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default MovieCard;
