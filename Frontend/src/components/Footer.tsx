import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <div>© 2024 봉틈이</div>
        <OperatorInfo>
          운영자: [실명]
          이메일: [이메일 주소]
          연락처: [전화번호]
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
`;

export default Footer; 