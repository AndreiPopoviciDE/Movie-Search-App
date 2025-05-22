import  { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProviderWrapper } from './context/ThemeContext';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const TestComponent = () => {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error('Test error');
  }

  return <button onClick={() => setThrowError(true)}>Click to throw error</button>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <TestComponent />
      <AuthProvider>
        <ThemeProviderWrapper>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <FavoritesProvider>
              <Navbar />
              <AppRouter />
            </FavoritesProvider>
          </BrowserRouter>
        </ThemeProviderWrapper>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
