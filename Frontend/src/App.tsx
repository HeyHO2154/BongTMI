// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import TopBar from "./components/TopBar"; // TopBar 컴포넌트 경로
import NavBar from "./components/NavBar";
import Swipe from "./pages/Swipe";
import Search from "./pages/Search";
import AddBong from "./pages/BongAdd";
import Feed from "./pages/Feed";
import FeedAdd from "./pages/Feed/FeedAdd";

import MyPage from "./pages/MyPage";

import BongDetail from "./pages/Bong/BongDetail";
import FeedDetail from "./pages/Feed/FeedDetail";

import Login from "./pages/User/UserLogin";
import KakaoCallback from "./pages/User/OAuth/KakaoCallback";
import NaverCallback from "./pages/User/OAuth/NaverCallback";
import FindAccount from "./pages/User/UserFind";
import Register from "./pages/User/UserRegister";

import Alarm from "./pages/Bong/Alarm";

import Report from "./pages/User/Report";
import Shop from "./pages/Bong/Shop";
import AdBanner from "./components/AdBanner";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [isTouching, setIsTouching] = useState(false);
  isTouching;

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);

    return () => {
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);

  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouching(true);
    };

    const handleTouchEnd = () => {
      setTimeout(() => setIsTouching(false), 2000); // 2초 후 다시 전체화면으로 복귀
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    // 모바일 기기 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    const initAdFit = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      
      // 스크립트 로드 완료 후 처리
      script.onload = () => {
        if (window.kakaoAdFit?.cmd) {
          window.kakaoAdFit.cmd.push(() => {
            console.log('AdFit 초기화 완료', isMobile ? '모바일' : 'PC');
          });
        }
      };

      // 에러 처리
      script.onerror = (error) => {
        console.error('AdFit 스크립트 로드 실패:', error);
      };

      document.body.appendChild(script);
    };

    // 약간의 지연 후 초기화 시도
    setTimeout(initAdFit, 1000);

    return () => {
      // cleanup: 기존 스크립트 제거
      const existingScript = document.querySelector('script[src*="ba.min.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <AdBanner />
      <Router basename="/">
        <div className="app-container">
          <TopBar />
          <Routes>
            <Route path="/" element={<Swipe />} />
            <Route path="/search" element={<Search />} />
            <Route path="/add-bong" element={<AddBong />} />

            <Route path="/feed" element={<Feed />} />
            <Route path="/feed-write" element={<FeedAdd />} />

            <Route path="/my-page" element={<MyPage />} />

            <Route path="/detail/:progrmRegistNo" element={<BongDetail />} />
            <Route path="/feed/:feedID" element={<FeedDetail />} />

            <Route path="/user/login" element={<Login />} />
            <Route path="/auth/callback/kakao" element={<KakaoCallback />} />
            <Route path="/auth/callback/naver" element={<NaverCallback />} />
            <Route path="/user/find-account" element={<FindAccount />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/user/report" element={<Report />} />

            <Route path="/bong/alarm" element={<Alarm />} />
            <Route path="/bong/shop" element={<Shop />} />
          </Routes>
          <Footer />
          <NavBar />
        </div>
      </Router>
    </>
  );
};

export default App;
