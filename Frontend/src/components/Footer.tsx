import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <div>© 2024 봉틈이</div>
        <OperatorInfo>
          운영자: 프라벤
          이메일: jun****@naver.com
          웹사이트: praven.kro.kr
        </OperatorInfo>
      </FooterContent>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const OperatorInfo = styled.div`
  margin-top: 10px;
  font-size: 0.8rem;
  line-height: 1.5;
`;

const PolicyLinks = styled.div`
  margin-top: 12px;
  font-size: 0.8rem;

  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.span`
  margin: 0 8px;
  color: #ddd;
`;

export default Footer; 