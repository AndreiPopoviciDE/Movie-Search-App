import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextUtils';
import { CircularProgress } from '@mui/material';

const Home = React.lazy(() => import('../pages/Home'));
const MovieDetails = React.lazy(() => import('../pages/MovieDetails'));
const Favorites = React.lazy(() => import('../pages/Favorites'));

const AppRouter = () => {
  const { user } = useAuth(); // Get the current user

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '5%',
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
