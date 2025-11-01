import React, { useState, useEffect, useRef } from "react";
import "./MainPage.css";
import { useProblem } from "../ProblemContext";
import { useResult } from "../ResultContext";
import CCodeEditor from './CCodeEditor';
import { Routes, Route, Link, useNavigate } from "react-router-dom";

///////메인 채팅창 페이지
export default function MainPage() {
  const navigate = useNavigate();
  const { message, setMessage, response, setResponse } = useProblem();
  const { hint, correct, timer } = useResult(); // 힌트 사용한 횟수,정답 보낸 횟수 ,소요시간 세서 정답 페이지로 보내는 전역변수
  //const [sendCount, setSendCount] = useState(0);//정답 보낸 횟수

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/\\n/g, '\n')
      .replace(/&nbsp;/g, ' ');
  };

  // 정답/오답 판정 useEffect
  useEffect(() => {
    if (response?.reply?.includes("정답입니다")) {
      navigate("/CorrectPage");
      // 답장 횟수가 3번이상이고 답변에 틀렸습니다 키워드가 잇을 때
    } else if (correct.Correctnum >= 3 && response?.reply?.includes("틀렸습니다")) {
      navigate("/WrongPage");
    }
  }, [response, correct.Correctnum, navigate]);

//채팅창 참조(채팅창화면 맨밑에 고정용)
  const chatEndRef = useRef(null);

//말풍선 변수 맨 처음 기본값: 받아온 문제(초기 response값)
  const [Chat, setChat] = useState([
    { type: "left", text: cleanText(response?.reply || JSON.stringify(response, null, 2)) }
  ]);

////// C 코드 인풋창 초기값 입력 
  // 초기 C 코드 템플릿
  const initialCode = `#include <stdio.h>

int main() {
    
    return 0;
}`;

  const [codeText, setCodeText] = useState(initialCode);
  // 초기화 함수
  const handleReset = () => {
    setCodeText(initialCode);
  };

//메시지가 바뀔 때마다 스크롤 맨 아래로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Chat]); 

/////인풋텍스트 글자띄우기
  const handleChange = (e) => setCodeText(e.target.value);

//// 서버에 답장 보내기
  const sendRequest = async (userMessage) => {
    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "username",
          message: userMessage, // 매개변수로 받은 메시지 사용
        }),
      });
      const data = await res.json();
      setResponse(data);//Context response값 업데이트

       // AI 응답을 채팅에 추가
      const aiMessage = { 
        type: "left", 
        text: cleanText(data?.reply || JSON.stringify(data, null, 2))
      };
      setChat(prevChat => [...prevChat, aiMessage]);
      //setSendCount(prev => prev + 1)

    } catch (err) {
      console.error("API 호출 실패:", err);
      const errorMessage = { type: "left", text: "오류가 발생했습니다." };
      setChat(prevChat => [...prevChat, errorMessage]);
    }
  };

//답장 오기 전까지 버튼 누르지 못하게 하는 bool변수
  const [isThinking, setThinking] = useState(false);
// 화면에 대화 출력
  const handleSend = async () => {
    if (codeText.trim() === "") return;
    //내 메시지 먼저 화면에 표시

    if(!isThinking){
      setThinking(true);// true로 만들어서 버튼 눌러도 못들어오게 하기
      const userMessage = codeText;
      
      //내가 보낸 코드를 화면에 표시
      const userChat = { type: "right", text: userMessage };
      setChat(prevChat => [...prevChat, userChat]);
      correct.setCorrectnum(prev => prev + 1);// 답변 횟수 올리기
      
      //서버에 보내고 응답 기다리기
      await sendRequest(userMessage);

      setThinking(false);// 풀어서 버튼 누를 수 잇게
    }
    
  };


///////힌트버튼 눌럿을 때 함수
  //const [a, setA] = useState(1);//힌트 호출 횟수
  const [b, setB] = useState(3);
  const [active, SetActive] = useState(false);//버튼 색 바꾸는용

  const setHint = async () => {
    if (hint.Hintnum > 3 || isThinking) return; // 3회 제한 & 중복 방지

    setThinking(true);
    setB(prevB => {
      const newB = prevB - 1;
      if (newB <= 0) SetActive(true);
      return newB;
    });
    const ShowHintNum = hint.Hintnum + 1;// 전역변수 값이 0이라 힌트 0으로 보내지니까 1을 올려서 보냄
    const userChat = { type: "right", text: `힌트 ${ShowHintNum}` };
    setChat(prev => [...prev, userChat]);
    
    await sendRequest(`힌트 ${ShowHintNum}`);
    hint.setHintnum(prev => prev + 1);//힌트 사용 횟수 올리기
    //setA(prev => prev + 1);
    setThinking(false);
  };


  return (
    <div className="main-wrapper">
      <div className="chat-container">
        {Chat.map((msg, idx) => (
          <div key={idx} className={`Chat-box ${msg.type}`}>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <p>아래에 답을 입력해보세요! </p>
        <CCodeEditor
          value={codeText}
          onChange={handleChange}
          onReset={handleReset}

        />
        <div className="SendBtn">
          <button className= {`HintBtn ${active ? "active" : " "}`} onClick={setHint}>힌트(남은 횟수 {b})</button>
          <button className= "HintBtn" onClick={handleSend}>답 전송</button>
        </div>
        
        
      </div>
    </div>
  );
}