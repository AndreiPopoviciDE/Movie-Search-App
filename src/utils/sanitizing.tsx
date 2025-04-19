import { Movie } from '../types/Movie';

const sanitizeText = (text: string): string =>
  text.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, '');

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const sanitizeMovie = (movie: Movie): Movie => ({
  ...movie,
  title: sanitizeText(movie.title),
  original_title: sanitizeText(movie.original_title),
  original_title_romanised: sanitizeText(movie.original_title_romanised),
  description: sanitizeText(movie.description),
  director: sanitizeText(movie.director),
  producer: sanitizeText(movie.producer),
  image: isValidUrl(movie.image) ? movie.image : '',
  movie_banner: isValidUrl(movie.movie_banner) ? movie.movie_banner : '',
  release_date: sanitizeText(movie.release_date),
  running_time: sanitizeText(movie.running_time),
  rt_score: sanitizeText(movie.rt_score),
});
