import { useState, useEffect } from 'react';
import apiAxios from "../lib/apiAxios"
import { ApiError } from '@/lib/ApiError';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface SignUpProps {
  goToLogin : () => void
}

const SignupForm = ({goToLogin} : SignUpProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username : ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호와 비밀번호 확인 필드를 실시간으로 검증하는 Hook
  useEffect(() => {
    if (formData.password && confirmPassword && formData.password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }
  }, [formData.password, confirmPassword]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await apiAxios.post("/auth/sign-up", formData);
      console.log("회원가입 성공:", response);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      
      // 상태 초기화
      setFormData({ email: '', password: '', username: '' });
      setConfirmPassword('');

      goToLogin();

    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
        console.error('API Error Occurred:', error);
      } else {
        console.error('An unknown error occurred:', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 버튼 비활성화 조건
  const isButtonDisabled = 
    !formData.email || 
    !formData.username || 
    !formData.password || 
    !confirmPassword || 
    !!passwordError || // passwordError가 있으면 비활성화
    isLoading;

  return (
    <> 
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
          <Lock className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
        <p className="text-muted-foreground mt-2">생산성을 높이는 할일 관리</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 계정 만들기</CardTitle>
          <CardDescription>이메일 인증을 통해 안전하게 가입하세요</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">이름</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={isButtonDisabled}
              size="lg"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  처리중...
                </>
              ) : (
                '인증요청'
              )}
            </Button>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>회원가입 절차:</strong>
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">1. 정보입력</Badge>
              <Badge variant="outline">2. 이메일 인증</Badge>
              <Badge variant="outline">3. 가입완료</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SignupForm;
