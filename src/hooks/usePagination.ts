import { useState, useCallback } from 'react';

export const usePagination = () => {
  const [page, setPage] = useState(1);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  return { page, handlePageChange, setPage };
};
