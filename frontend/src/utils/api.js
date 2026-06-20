const RAW_API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "").replace(
  /\/api$/,
  "",
);

export const apiUrl = (path) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}/api${cleanPath}`;
};

export const documentDownloadUrl = (docType) => apiUrl(`/files/${docType}`);
