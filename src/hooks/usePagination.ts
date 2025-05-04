import { useState } from 'react';

export const usePagination = (initialPage: number = 1) => {
  const [page, setPage] = useState(initialPage);

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  return { page, setPage, handlePageChange };
};
