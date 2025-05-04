import { Movie, FilterOptions } from '../types/Movie';
import { parseDecade, parseRating } from '../utils/parseFn';
import { apiRequest } from '../utils/apiUtils';

const BASE_URL = 'https://ghibliapi.vercel.app/films';

let cachedMovies: Movie[] | null = null;

const getCachedMovies = async (): Promise<Movie[]> => {
  if (cachedMovies) return cachedMovies;
  try {
    cachedMovies = await apiRequest<Movie[]>(BASE_URL);
    return cachedMovies;
  } catch (error) {
    console.error('Error fetching cached movies:', error);
    throw new Error('Failed to load movies from cache or API.');
  }
};

export const searchMovies = async (
  query: string,
  page: number = 1,
  pageSize: number = 12,
  filters: FilterOptions = {},
): Promise<{ results: Movie[]; total: number }> => {
  try {
    const movies = await getCachedMovies();

    let filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.trim().toLowerCase()),
    );

    if (filters.releaseDate) {
      const decade = parseDecade(filters.releaseDate);
      if (decade !== null) {
        filteredMovies = filteredMovies.filter((movie) => {
          const year = parseInt(movie.release_date, 10);
          return year >= decade && year < decade + 10;
        });
      }
    }

    if (filters.rating) {
      const { min, max } = parseRating(filters.rating);
      filteredMovies = filteredMovies.filter((movie) => {
        const score = parseInt(movie.rt_score, 10);
        return !isNaN(score) && (min ? score >= min : true) && (max ? score <= max : true);
      });
    }

    const start = (page - 1) * pageSize;
    return {
      results: filteredMovies.slice(start, start + pageSize),
      total: filteredMovies.length,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Something went wrong while fetching movies, try again later.');
  }
};

export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  try {
    return await apiRequest<Movie>(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error fetching movie details for ID: ${id}`, error);
    throw new Error('Failed to fetch movie details');
  }
};
