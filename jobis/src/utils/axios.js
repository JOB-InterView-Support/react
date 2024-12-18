import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // .env 파일의 변수 사용
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
