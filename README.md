# 🎥 Movie Explorer

Movie Explorer is a web application built with modern web technologies to allow users to search, explore, and manage their favorite movies. It features a responsive design, user authentication, and state management for a seamless user experience.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A fast build tool and development server for modern web projects.
- **Material-UI (MUI)**: A React component library for building responsive and accessible user interfaces.
- **React Router**: For client-side routing and navigation.
- **Axios**: For making HTTP requests to external APIs.

### State Management

- **React Context API**: Used for managing global state, including:
  - **FavoritesContext**: To manage the user's favorite movies.
  - **ThemeContext**: To toggle between light and dark themes.
  - **AuthContext**: To manage user authentication state.

### Authentication

- **Firebase Authentication**: Used for Google-based user authentication.

### API Integration

- **Studio Ghibli API**: Used to fetch movie data.
- **Custom API Utilities**: Functions for searching and filtering movies, and fetching movie details.

### Testing

- **Vitest**: A fast unit testing framework.
- **React Testing Library**: For testing React components.
- **JSDOM**: For simulating a browser environment during tests.

### Build and Deployment

- **Vite**: For building the production-ready application.
- **Husky**: For managing Git hooks (e.g., pre-commit hooks for linting and formatting).
- **Prettier**: For code formatting.
- **ESLint**: For enforcing coding standards and best practices.

### Performance Optimization

- **vite-plugin-compression**: For generating Gzip and Brotli-compressed assets.
- **Lazy Loading**: React's `React.lazy` and `Suspense` are used to load components on demand.

### Security

- **Sanitization**: Custom utilities to sanitize user inputs and API responses to prevent XSS attacks.
- **Environment Variables**: Sensitive data like Firebase API keys are stored in `.env` files.
- **Data Storage**: Favorite movies are securely stored in an encoded format within `localStorage` to ensure persistence across sessions, while theme settings are stored in plain text.

### Responsive Design

- **Material-UI Breakpoints**: Used to ensure the application is mobile-friendly and responsive.

### Accessibility

- **ARIA Attributes**: Added to improve accessibility for screen readers.
- **eslint-plugin-jsx-a11y**: Enforces accessibility best practices in JSX.

### Additional Features

- **Favorites Management**: Users can add or remove movies from their favorites list, which is persisted in `localStorage`.
- **Theme Switching**: Users can toggle between light and dark themes.
- **Snackbar Notifications**: Feedback is provided to users for actions like adding/removing favorites.
- **Pagination**: For navigating through large datasets of movies.

## Project Structure

The project is organized as follows:

- **`src/components`**: Reusable UI components like `Navbar`, `SearchBar`, and `MovieCard`.
- **`src/context`**: Context providers and utilities for global state management.
- **`src/pages`**: Page components like `Home`, `Favorites`, and `MovieDetails`.
- **`src/api`**: API utilities for fetching and filtering movie data.
- **`src/utils`**: Helper functions like sanitization utilities.
- **`src/types`**: TypeScript interfaces and types.
- **`src/routes`**: Application routing logic.

## How to Run the Project

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd movie-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build the project for production:

   ```bash
   npm run build
   ```

6. Run tests:
   ```bash
   npm run test
   ```
