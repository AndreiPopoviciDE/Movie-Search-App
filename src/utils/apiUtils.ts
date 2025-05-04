import axios from 'axios';

export const apiRequest = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.statusText || error.message
      : 'An unknown error occurred';
    console.error('API Error:', errorMessage);
    throw new Error(`Failed to fetch data: ${errorMessage}`);
  }
};
