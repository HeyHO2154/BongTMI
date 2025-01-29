import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const NaverCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state");

    if (code) {
      axios
        .post("http://localhost:8080/api/auth/naver/callback", { code, state })
        .then((res) => {
          console.log("User Data:", res.data);
          localStorage.setItem("user", JSON.stringify(res.data)); // 사용자 정보 저장
          navigate("/my-page"); // 로그인 완료 후 홈으로 이동
        })
        .catch((err) => {
          console.error(err);
          alert("네이버 로그인 실패");
          navigate("/user/login");
        });
    }
  }, [location, navigate]);

  return <div>네이버 로그인 처리 중...</div>;
};

export default NaverCallback;
