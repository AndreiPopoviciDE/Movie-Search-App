import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Dropdown from '../components/Dropdown';
import { pageSize, releaseDateOptions, ratingOptions } from '../constants/movieConstants';
import { usePagination } from '../hooks/usePagination';
import { useSnackbar } from '../hooks/useSnackbar';
import { searchMovies } from '../api/movieApi';
import debounce from 'lodash.debounce';
import { sanitizeMovie } from '../utils/sanitizing';
import { Movie } from '../types/Movie';
import { Box, CircularProgress, Typography, Alert, Pagination, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';

const Home = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [releaseDate, setReleaseDate] = useState('');
  const [rating, setRating] = useState('');
  const { page, handlePageChange } = usePagination();

  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce(
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
    );

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, []);

  const triggerSearch = useCallback(() => {
    debouncedSearchRef.current?.(query, page, { releaseDate, rating });
  }, [query, page, releaseDate, rating]);

  useEffect(() => {
    handlePageChange({}, 1);
  }, [query, releaseDate, rating, handlePageChange]);

  useEffect(() => {
    triggerSearch();
  }, [triggerSearch]);

  const handleFavoriteAction = useCallback(
    (action: 'added' | 'removed') => {
      showSnackbar(`Movie ${action} ${action === 'added' ? 'to' : 'from'} favorites!`);
    },
    [showSnackbar],
  );

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
            No movies found
            {query && ` for ${query}`}
            {releaseDate && ` in ${releaseDate}`}
            {rating && ` with a rating of ${rating}`}
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
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
