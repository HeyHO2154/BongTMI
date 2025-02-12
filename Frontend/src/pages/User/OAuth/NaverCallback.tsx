import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import config from "../../../config";
import Loading from "../../../components/Lodaing";

const NaverCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state");

    if (code) {
      // 백엔드 요청 전에 콘솔에 로그 추가
      console.log("Sending request to backend with code:", code);
      
      axios
        .post(`${config.API_DEV}/api/auth/naver/callback`, { code, state })
        .then((res) => {
          console.log("Login success:", res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          // 명시적으로 window.location 사용
          window.location.href = "/my-page";
        })
        .catch((err) => {
          console.error("Login failed:", err);
          alert("네이버 로그인 실패");
          window.location.href = "/user/login";
        });
    }
  }, [location]);

  // 로딩 컴포넌트로 변경
  return (
    <div>
      <Loading fullScreen={true} />
    </div>
  );
};

export default NaverCallback;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 40px 20px;
  overflow-y: auto;
  height: calc(100vh - 160px); /* TopBar 높이 제외 */
`;