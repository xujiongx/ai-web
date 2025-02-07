import axios from 'axios';
import { Toast } from 'antd-mobile';

const request = axios.create({
  baseURL: 'http://192.168.1.63:3001',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      Toast.show({
        content: '登录已过期，请重新登录',
        afterClose: () => {
          window.location.href = '/login';
        },
      });
    } else {
      Toast.show({
        content: error.response?.data?.message || '请求失败',
      });
    }
    return Promise.reject(error);
  }
);

export default request;
