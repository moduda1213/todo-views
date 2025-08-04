import axios, { isAxiosError} from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiError } from './ApiError';

//API 요청을 보내기 위한 설정/도구

const apiAxios = axios.create({
  baseURL: 'http://localhost:8000', // 변경 전 : 'http://127.0.0.1:8000'
  timeout: 10000,
  withCredentials:true // 다른 출처로 쿠키를 보내고 받기 위한 설정
});

// 요청 인터셉터: 인증 토큰 추가
apiAxios.interceptors.request.use(
  (config) => {

    // const token = document.cookie;
    // if (token) {
    //   let value = token.replace("access_token=", "")
    //   config.headers.Authorization = `Bearer ${value}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 데이터에서 비밀번호를 안전하게 제거하는 헬퍼 함수
const sanitizeConfigData = (config?: AxiosRequestConfig) => {
  if (config?.data && typeof config.data === 'string') {
    try {
      const data = JSON.parse(config.data);
      if (data.password) {
        delete data.password;
        config.data = JSON.stringify(data);
      }
    } catch (e) {
      // 데이터가 유효한 JSON이 아니면 무시
    }
  }
};

// 응답 인터셉터: 중앙 에러 처리 및 비밀번호 로깅 방지
apiAxios.interceptors.response.use(
  (response) => {
    // 성공 응답에서도 요청 정보를 로그로 남길 경우를 대비해 비밀번호 제거
    sanitizeConfigData(response.config);
    return response;
  },
  (error: AxiosError) => {
    // 에러 발생 시에도 요청 정보에서 비밀번호 제거
    sanitizeConfigData(error.config);

    if (isAxiosError(error)) {
      // 서버 응답에서 detail 메시지를 우선적으로 사용, 없으면 axios의 기본 에러 메시지 사용
      // response?.data : 옵셔널 체이닝
      const message = (error.response?.data as any)?.detail || error.message;
      const statusCode = error.response?.status;
      
      // 모든 정보를 담은 커스텀 ApiError를 reject
      return Promise.reject(new ApiError(message, statusCode, error));
    }
    
    // Axios 에러가 아닌 경우
    return Promise.reject(new ApiError('An unexpected error occurred.'));
  }
);

export default apiAxios;
