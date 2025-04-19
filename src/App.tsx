import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProviderWrapper } from './context/ThemeContext';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
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
  );
};

export default App;
