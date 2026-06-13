import axios from 'axios';

// Create a configured Axios instance
const axiosClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Configure Request Interceptor to log requests and perform pre-request setups
axiosClient.interceptors.request.use(
  (config) => {
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} -> ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// Configure Response Interceptor to centralize error parsing and debug logging
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`[HTTP Response] ${response.status} <- ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[HTTP Response Error]', error);

    let parsedErrorMessage = 'High latency or server error. Check connection.';

    if (error.response) {
      // Server returned a response outside of the 2xx status range
      parsedErrorMessage = error.response.data?.error || error.response.data?.message || `Server responded with status code: ${error.response.status}`;
    } else if (error.request) {
      // Request was sent but no response was received
      parsedErrorMessage = 'Central gateway timeout. Our database or AI microservice is not responding.';
    } else {
      // Something went wrong setting up the request
      parsedErrorMessage = error.message;
    }

    return Promise.reject(new Error(parsedErrorMessage));
  }
);

export default axiosClient;
