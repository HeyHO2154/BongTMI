
/*

    지금 여기 URL에는 client_id가 그대로 노출되어있어서 위험함
    원래는 .env라는 파일에 따로 빼서 해야하는데, 당장은 임시로 이렇게 해둔거임 [추후 수정 필수!!]

*/

import React from 'react';

const handleKakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=aa593063067708935c526eedf855bc6e&redirect_uri=http://localhost:5173/auth/callback/kakao`;
  window.location.href = kakaoAuthUrl;
};

const Login: React.FC = () => {
  return (
    <div>
      <h1>Login</h1>
      {/* 버튼 대신 이미지 */}
      <img
        src="/src/assets/kakao_login_medium.png"
        alt="Login with Kakao"
        style={{ cursor: 'pointer' }}
        onClick={handleKakaoLogin}
      />
    </div>
  );
};

export default Login;
