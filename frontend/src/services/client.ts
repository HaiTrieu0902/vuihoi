import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { KEY_LOCALSTORAGE_SYNC } from '@/constants';
import { EHTTPS_STATUS_CODE } from '@/constants/enum';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const client = axios.create({
  baseURL: baseURL || 'http://localhost:8000',
  timeout: 300000,
  maxContentLength: 150 * 1024 * 1024,
  maxBodyLength: 150 * 1024 * 1024,
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
      };
    }
    const accessToken =
      localStorage.getItem(KEY_LOCALSTORAGE_SYNC.token) || sessionStorage.getItem(KEY_LOCALSTORAGE_SYNC.token);
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
      console.log(' Access Token attached:', config.headers.get('Authorization'));
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* handle config when error with 401 */
const responseErrorHandler = async (error: any) => {
  const originalRequest = error?.config;
  if (
    error?.response?.status === EHTTPS_STATUS_CODE.Unauthorized ||
    error?.status === EHTTPS_STATUS_CODE.Unauthorized
  ) {
    try {
    } catch (error: any) {}
  } else if (
    error?.response?.status === EHTTPS_STATUS_CODE.Forbidden ||
    error?.status === EHTTPS_STATUS_CODE.Forbidden
  ) {
  }
  return Promise.reject(error.response.data);
};

client.interceptors.response.use(
  (response) => response,
  (error) => responseErrorHandler(error),
);

export default client;
