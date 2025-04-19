import { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Dropdown from '../components/Dropdown';
import { searchMovies } from '../api/mockApi';
import debounce from 'lodash.debounce';
import { sanitizeMovie } from '../utils/sanitizing';
import { Movie } from '../types/Movie';
import { Box, CircularProgress, Typography, Alert, Pagination, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';

const pageSize = 12;

const releaseDateOptions = ['2020s', '2010s', '2000s', '1990s'];
const ratingOptions = ['80+', '70-79', '60-69', '50-59', '40-49', '30-39', '20-29'];

const Home = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [releaseDate, setReleaseDate] = useState('');
  const [rating, setRating] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce(
        async (
          text: string,
          currentPage: number,
          filters: { releaseDate: string; rating: string },
        ) => {
          setLoading(true);
          setError(null);
          try {
            const { results, total } = await searchMovies(text, currentPage, pageSize, filters);
            const sanitizedResults = results.map(sanitizeMovie);
            setMovies(sanitizedResults);
            setTotalResults(total);
          } catch (err) {
            const errorMessage =
              (err as Error).message || 'Failed to fetch movies. Please try again later.';
            setError(errorMessage);
          } finally {
            setLoading(false);
          }
        },
        600,
      ),
    [],
  );

  useEffect(() => {
    setPage(1);
  }, [query, releaseDate, rating]);

  // Trigger search on query, page, or filters change
  useEffect(() => {
    debouncedSearch(query, page, { releaseDate, rating });
  }, [query, page, releaseDate, rating, debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '' });
  };

  const handleFavoriteAction = useCallback((action: 'added' | 'removed') => {
    setSnackbar({
      open: true,
      message: `Movie ${action} ${action === 'added' ? 'to' : 'from'} favorites!`,
    });
  }, []);

  const memoizedMovies = useMemo(
    () =>
      movies.map((movie) => (
        <Grid key={movie.id}>
          <MovieCard movie={movie} onFavoriteAction={handleFavoriteAction} />
        </Grid>
      )),
    [movies, handleFavoriteAction],
  );

  if (!loading && error && movies.length === 0) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
        <SearchBar value={query} onChange={setQuery} />
        <Box
          display="flex"
          flexDirection="row"
          gap={2}
          sx={{
            width: '100%',
            '@media (min-width: 1024px)': { width: '50%' },
          }}
        >
          <Dropdown
            label="Release Date"
            value={releaseDate}
            options={releaseDateOptions}
            onChange={setReleaseDate}
          />
          <Dropdown label="Rating" value={rating} options={ratingOptions} onChange={setRating} />
        </Box>
      </Box>

      {loading && (
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && movies.length === 0 && query && (
        <Box mt={4} display="flex" justifyContent="center">
          <Typography>
            No movies found for "{query}"{releaseDate && ` in ${releaseDate}`}
            {rating && ` with a rating of ${rating}`}.
          </Typography>
        </Box>
      )}

      <Grid container spacing={2} mt={2} justifyContent="center">
        {memoizedMovies}
      </Grid>

      {totalResults > pageSize && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(totalResults / pageSize)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

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
    </Box>
  );
};

export default Home;
