import axios from 'axios';

// 1. 기본 설정을 포함한 axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: '', // API 기본 주소
    timeout: 10000, // 요청 타임아웃
});

// 2. 응답 인터셉터 (Response Interceptor) 설정
apiClient.interceptors.response.use(
    // 2-1. 성공적인 응답은 그대로 통과시킴
    (response) => {
        // response.config가 있고, 그 안에 data가 있는지 확인
        if (response.config && response.config.data) {
            try {
                // config.data는 보통 JSON 문자열이므로 파싱
                const requestData = JSON.parse(response.config.data);

                // 'password' 필드가 있다면 삭제
                if (requestData.password) {
                    delete requestData.password;
                }

                // 수정된 데이터를 다시 JSON 문자열로 만들어 할당
                response.config.data = JSON.stringify(requestData);

            } catch (e) {
                // 파싱 실패 등 예외 상황에서는 아무것도 하지 않음
                console.error("Error parsing request data in interceptor", e);
            }
        }
        // 수정된 error 객체를 원래의 catch 블록으로 전달
        return Promise.reject(response);
    },

    // 2-2. 실패한 응답(에러)을 catch 블록으로 보내기 전에 가로챔
    (error) => {
        // error.config가 있고, 그 안에 data가 있는지 확인
        if (error.config && error.config.data) {
            try {
                // config.data는 보통 JSON 문자열이므로 파싱
                const requestData = JSON.parse(error.config.data);

                // 'password' 필드가 있다면 삭제
                if (requestData.password) {
                    delete requestData.password;
                }

                // 수정된 데이터를 다시 JSON 문자열로 만들어 할당
                error.config.data = JSON.stringify(requestData);

            } catch (e) {
                // 파싱 실패 등 예외 상황에서는 아무것도 하지 않음
                console.error("Error parsing request data in interceptor", e);
            }
        }
        // 수정된 error 객체를 원래의 catch 블록으로 전달
        return Promise.reject(error);
    }
);
export default apiClient;