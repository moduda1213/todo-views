import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAxios from "@/lib/apiAxios"
import { ApiError } from '@/lib/ApiError';
import { Separator } from "@/components/ui/separator"
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
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from 'lucide-react';


const LoginForm = () => {
  /**
    훅(Hook)은 "준비 단계"에서 컴포넌트와 React를 연결하는 역할을 합니다. 
    따라서 컴포넌트가 렌더링 될 때 항상 동일한 순서로 호출되어야 하므로,
    함수의 최상위에 위치해야 합니다.
   */
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // const navigate = useNavigate(); (x)
    setIsLoading(true);

    console.log("aldalksmd")

    // 로그인 로직
    try { 
      const response = await apiAxios.post("/auth/login", formData);
      console.log(document.cookie);
      if(response.status == 200) {
        navigate("/");
      }
      
    } catch (error) {
      if(error instanceof ApiError) {
        alert(error.message);
        console.error('API Error Occurred : ', error);
      } else {
        console.error('An unknown error occurred : ', error);
        alert("알 수 없는 오류가 발생했습니다.")
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('구글 로그인 진행중...');
  };

  return (
    <>
      {/* 로고/브랜드 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
          <Lock className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
        <p className="text-muted-foreground mt-2">생산성을 높이는 할일 관리</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            계정에 로그인
          </CardTitle>
          <CardDescription>
            이메일과 비밀번호를 입력해주세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-muted-foreground">로그인 상태 유지</span>
              </label>
              <Button variant="link" size="sm" className="px-0">
                비밀번호 찾기
              </Button>
            </div>

            <Button 
              type="button" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  처리중...
                </>
              ) : (
               '로그인'
              )}
            </Button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  또는
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleGoogleLogin}
                className="w-full"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginForm;
