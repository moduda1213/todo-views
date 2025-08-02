import { useState } from 'react';
import LoginForm from "@/components/login-form";
import SignupForm from "@/components/signup-form";

export default function Login() {
  const [showLogin, setShowLogin] = useState(true);

  // 자식 컴포넌트에서 호출할 함수 (Lifting State Up)
  const toggleForm = () => {
    setShowLogin((prev) => !prev);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showLogin ? <LoginForm /> : <SignupForm goToLogin={toggleForm} />}
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          {showLogin ? '계정이 없으신가요?' : '계정이 이미 있으신가요?'}{' '}
          <button
            className="font-medium text-primary hover:underline"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
}