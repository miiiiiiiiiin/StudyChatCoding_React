import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // true: 로그인, false: 회원가입
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: ""
  });

  const { login } = useUser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // 로그인 로직
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginId: formData.userId,
            loginPw: formData.password
          }),
        });

        if (res.ok) {
          const data = await res.json();  
          // data.id, data.loginId, data.name 등 받을 수 있음
          login(data);   // Context에 사용자 정보 저장
          toast.success(`${data.name}님 반갑습니다!`);
          navigate("/");
        } else {
          toast.error("아이디 또는 비밀번호가 일치하지 않습니다.");

          //alert("로그인 실패: " + error);
        }
      } catch (err) {
        console.error("로그인 오류:", err);
        toast.error("로그인 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    } else {



      ///////////////// 회원가입 로직 ///////////////////////
      if (formData.password !== formData.confirmPassword) {
        toast.error("비밀번호가 일치하지 않습니다!");
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginId: formData.userId,
            loginPw: formData.password,
            name: formData.name,
            email: formData.email
          }),
        });

        if (res.ok) {
          toast.success("회원가입이 완료되었습니다.");
          setIsLogin(true); // 로그인 화면으로 전환
          
          setFormData({
            userId: "",
            password: "",
            confirmPassword: "",
            email: ""
          });
        } else {
          const error = await res.text();
          alert("회원가입 실패: " + error);
        }
      } catch (err) {
        console.error("회원가입 오류:", err);
        toast.error("회원가입 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      userId: "",
      password: "",
      confirmPassword: "",
      email: ""
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* 로고/타이틀 */}
        <div className="login-header">
          <h1 className="login-title">💻</h1>
          <h2 className="login-subtitle">CodeTalk</h2>
          <p className="login-description">
            {isLogin ? "반갑습니다! 로그인해주세요" : "새로운 계정을 만들어보세요"}
          </p>
        </div>

        {/* 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                required
                disabled={isLoading}
              />
            </div>
          )}
          

          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          
          
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
                disabled={isLoading}
              />
            </div>
          )}
          
          {!isLogin && (
            <div className="input-group">
                <label htmlFor="name">닉네임</label>
                <input
                type="name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                required
                disabled={isLoading}
                />
            </div>
          )}
          


          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "처리 중..." : (isLogin ? "로그인" : "회원가입")}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="login-footer">
          <p>
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            <span className="toggle-link" onClick={toggleMode}>
              {isLogin ? " 회원가입" : " 로그인"}
            </span>
          </p>
        </div>
      </div>

      {/* 배경 장식 */}
      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
}