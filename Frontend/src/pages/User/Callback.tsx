import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
        axios
        .post(
          'http://localhost:8080/api/auth/kakao/callback',
          { code },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          console.log('Login successful:', response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/');
        })
        .catch((error) => {
          console.error('Login failed:', error);
          alert('로그인에 실패했습니다.');
          navigate('/user/login');
        });
      
      
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default Callback;
