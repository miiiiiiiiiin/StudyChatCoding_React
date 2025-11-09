import React from "react";
import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./MainPage.css";
import { useProblem } from "../ProblemContext";
import { useResult } from "../ResultContext";
/////////////////////////////// 틀림 페이지 //////////////
export default function Wrong() {
const navigate = useNavigate();
  const { message, setMessage, response, setResponse } = useProblem();// 답변, 문제
  const { hint, correct, timer, level, resetAll, selectedLevel, setSelectedLevel} = useResult(); // 힌트 사용한 횟수,정답 보낸 횟수 ,소요시간 세서 정답 페이지로 보내는 전역변수

  
  const username = "testuser";
  // 레벨 기반 문제 출제 (세션ID를 응답 헤더로 수신)
  const fetchProblemByLevel = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/problems/random-by-level?level=${selectedLevel}&username=${encodeURIComponent(username)}`
      );

      if (res.status === 204) {
        setResponse({ reply: "선택한 레벨에 문제가 없습니다.", isProblem: true });
        navigate("/main");
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        setResponse({ reply: `문제 로드 실패: ${txt}`, isProblem: true });
        navigate("/main");
        return;
      }

      // 세션ID 저장 (힌트/시도/정답 기록에 사용)
      const sid = res.headers.get("X-Session-Id");
      if (sid) {
        sessionStorage.setItem("sessionId", sid);
      }

      const text = await res.text(); // 문제 표시 문자열
      setResponse({ reply: text, isProblem: true });
      console.log("보내는 username:", username);
      resetAll(); // 전역 상태 초기화
      navigate("/main");
    } catch (err) {
      console.error(err);
      setResponse({ reply: "문제 로드 실패(네트워크 오류)", isProblem: true });
      navigate("/main");
    }
  };

  ///버튼 누르면 다음 문제. (변수 숫자 모두 초기화)
  const NextLevel = async () => {
    //필요 변수 모두 초기화
    resetAll();
    //다음 문제 가져오기(일단 링크로 대체)
    await fetchProblemByLevel();
    navigate("/main");
  }
  const [min, setMin] = useState(0);//분
  const [sec, setSec] = useState(0);//초
  
  useEffect( () =>{
    if(timer.몇초 >= 60){
      setMin(Math.trunc(timer.몇초 / 60));
      setSec(timer.몇초%60);
    }else setSec(timer.몇초);
  }, [timer.몇초]);
  
  return (
        <div className="Maincontainer">
            <div className="mainText"> 
              <h1>틀렸습니다...</h1> 
              <p> {response} </p>
              <p> 힌트 사용 횟수: {hint.Hintnum} &nbsp;&nbsp;&nbsp;&nbsp;  걸린 시간: {min}분 {sec}초 </p>
              
              <button className="EnterBtn" onClick={NextLevel}> 다른 문제 (Level {selectedLevel})</button>

            </div>

        {/* 첫 화면 */}
        
    </div>
  );
}