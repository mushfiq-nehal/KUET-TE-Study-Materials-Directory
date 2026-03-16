const rawApiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
