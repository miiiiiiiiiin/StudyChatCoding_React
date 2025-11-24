import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import CorrectPage from './Pages/Correct';
import WrongPage from './Pages/Wrong';
import MainPage from "./Pages/MainPage";
import RecordPage from "./Pages/RecordPage";
import LoginPage from "./Pages/LoginPage";
import PresentPage from "./Pages/CodeTalkPresent.js"
import { ProblemProvider, useProblem } from "./ProblemContext";
import { ResultProvider, useResult } from "./ResultContext";
import { UserProvider, useUser } from "./UserContext.js";
import menuIcon from "./Icon/menu.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppWrapper() {
  return (
    <UserProvider>
      <ProblemProvider>
        <ResultProvider>
          <App />
        </ResultProvider>
      </ProblemProvider>
    </UserProvider>
  );
}

function App() {
  const API_URL = "https://codetalk-backendhost.onrender.com";
  const navigate = useNavigate();
  const { setResponse } = useProblem();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { resetAll, selectedLevel, setSelectedLevel } = useResult();
  const { user, isLoggedIn, logout } = useUser();

  const userId = user?.id;

  // 앱 처음 로딩 시 사용자 레벨 가져오기
  useEffect(() => {
    if (!userId) return;

    const loadUserLevel = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}/level`);
        if (!res.ok) {
          console.error("레벨 조회 실패:", res.status);
          return;
        }
        const level = await res.json();
        setSelectedLevel(level);
      } catch (e) {
        console.error("레벨 로드 중 오류:", e);
        toast.error("사용자 레벨 로드 실패");
      }
    };

    loadUserLevel();
  }, [userId, setSelectedLevel]);

  const toggleSidebar = () => setIsSidebarOpen(v => !v);

  // 레벨 기반 문제 출제
  const fetchProblemByLevel = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/problems/random-by-level?level=${selectedLevel}&userId=${userId}`
      );

      if (res.status === 204) {
        toast.info("선택한 레벨에 문제가 없습니다.");
        setResponse({ reply: "선택한 레벨에 문제가 없습니다.", isProblem: true });
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        navigate("/LoginPage"); // 로그인 문제
        setResponse({ reply: `문제 로드 실패: ${txt}`, isProblem: true });
        return;
      }

      // 세션ID 저장
      const sid = res.headers.get("X-Session-Id");
      if (sid) {
        sessionStorage.setItem("sessionId", sid);
      }

      const text = await res.text();
      setResponse({ reply: text, isProblem: true });
      toast.success("문제 로드 성공!");
      navigate("/main");
      resetAll();

    } catch (err) {
      console.error(err);
      toast.error("문제 로드 실패(네트워크 오류)");
      setResponse({ reply: "문제 로드 실패(네트워크 오류)", isProblem: true });
    }
  };


  // 로그아웃 이벤트
  const LogoutEvent = () => {
    logout();
    navigate("/");
    toast.info("로그아웃 되었습니다.");
  };

  return (
    <div className="app-container">
      <header className="header">
        <img
          src={menuIcon}
          alt="아이콘"
          className="menu-icon"
          onClick={toggleSidebar}
        />
        <Link to="/" className="mainLink">CodeTalk 코드톡</Link>
        {!isLoggedIn && (
          <div className="nav">
            <Link to="/LoginPage" className="loginHeader">로그인</Link>
          </div>
        )}
        {isLoggedIn && (
          <div className="nav">
            <h3 className="username">{user?.name} 님</h3>
            <button className="logout-btn" onClick={LogoutEvent}>로그아웃</button>
          </div>
        )}
      </header>

      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-item">
          <Link to="/PresentPage" className="subLink" onClick={toggleSidebar}>코드톡 소개</Link>
        </div>
        <div className="sidebar-item">
          <Link to="/RecordPage" className="subLink" onClick={toggleSidebar}>기록</Link>
        </div>
        {/* <div className="sidebar-item">
          <Link to="/CorrectPage" className="subLink" onClick={toggleSidebar}>정답입니다</Link>
        </div>
        <div className="sidebar-item">
          <Link to="/WrongPage" className="subLink" onClick={toggleSidebar}>틀렸습니다</Link>
        </div>*/}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <main className="Maincontainer">
              <div className="mainText">
                <h1>AI와 함께하는 인터랙티브 코딩 챌린지</h1>
                <p>대화로 배우는 코딩, AI와 함께 성장하세요</p>
                <div className="M_input-area">
                  <label>
                    문제 난이도 선택:&nbsp;
                    <select
                      name="Level"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(Number(e.target.value))}
                    >
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          레벨 {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="EnterBtn" onClick={fetchProblemByLevel}>
                  문제 풀이
                </button>
              </div>
            </main>
          }
        />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<div>마이페이지</div>} />
        <Route path="/CorrectPage" element={<CorrectPage />} />
        <Route path="/WrongPage" element={<WrongPage />} />
        <Route path="/RecordPage" element={<RecordPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/PresentPage" element={<PresentPage />}/>
      </Routes>

      {/* Toast 메시지 컨테이너 */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default AppWrapper;
