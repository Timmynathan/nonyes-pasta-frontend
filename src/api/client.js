import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Render's free tier can take ~50s to wake from sleep — allow for it
  timeout: 60000,
});

// Automatically retry requests that fail because the backend is cold/waking.
// Retries on network errors and 5xx responses, with a short backoff.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    const status = error.response?.status;
    const isColdStart = !error.response || status === 502 || status === 503 || status === 504;

    config._retryCount = config._retryCount || 0;
    const maxRetries = 4;

    if (isColdStart && config._retryCount < maxRetries) {
      config._retryCount += 1;
      // 1.5s, 3s, 4.5s, 6s
      await new Promise((r) => setTimeout(r, config._retryCount * 1500));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
