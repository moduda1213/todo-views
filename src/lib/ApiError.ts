import { AxiosError } from 'axios';

/**
 * API 요청에서 발생한 에러를 나타내는 커스텀 에러 클래스입니다.
 * 사용자에게 보여줄 메시지, HTTP 상태 코드, 그리고 디버깅을 위한 원본 에러 객체를 포함합니다.
 */
export class ApiError extends Error {
  readonly statusCode?: number;
  readonly originalError?: AxiosError;

  constructor(message: string, statusCode?: number, originalError?: AxiosError) {
    super(message); // 'message' 프로퍼티를 설정하기 위해 부모 생성자 호출
    this.name = 'ApiError'; // 에러 이름 설정
    this.statusCode = statusCode;
    this.originalError = originalError;

    // TypeScript에서 커스텀 에러를 확장할 때 필요한 설정
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
