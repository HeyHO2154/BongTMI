import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // API 호출을 위해 axios 사용
import { useNavigate } from "react-router-dom"; // React Router 사용
import { useLocation } from "react-router-dom"; // useLocation 추가
import config from "../config";
import Loading from "../components/Lodaing";

interface CardData {
  id: string; // 고유 식별자 추가
  label: string;
  region: string;
  type: string;
  date: string;
  imageUrl: string; // 이미지 URL 추가
  from: String;
  remainingDays: number; // 모집 마감일까지 남은 일수 추가
  imageLoaded?: boolean; // 이미지 로딩 상태 추가
}

const SWIPE_THRESHOLD_X = 10; // 스와이프 판정 기준 (px)
const SWIPE_THRESHOLD_Y = 10; // 스와이프 판정 기준 (px)

const Swipe: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // 현재 최상단 카드 인덱스
  const [dragX, setDragX] = useState(0); // X축 드래그 상태
  const [dragY, setDragY] = useState(0); // Y축 드래그 상태
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 여부
  const startX = useRef(0); // 드래그 시작점 X
  const startY = useRef(0); // 드래그 시작점 Y

  const navigate = useNavigate(); // navigate 함수 생성
  const location = useLocation(); // location 객체 가져오기

  // 주소를 간단히 표시하는 함수 추가
  const simplifyAddress = (address: string) => {
    if (!address) return "지역 없음";
    
    // 시/도, 구/군 까지만 추출
    const parts = address.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return address;
  };

  // --------------------
  // API 호출 로직
  // --------------------
  const fetchCardData = async (progrmRegistNo?: string) => {
    try {
      const url = progrmRegistNo
        ? `${config.API_DEV}/api/bong/info?progrmRegistNo=${progrmRegistNo}` // 특정 카드 요청
        : `${config.API_DEV}/api/bong/random`; // 랜덤 카드 요청
      const response = await axios.get(url);
  
      const source = response.data.progrmRegistNo.substring(0, 3); // from 앞글자 3개 추출
      let fromValue = response.data.nanmmbyNmAdmn || "미등록 사용자"; // 기본값
      if (source === "SYO") {
        fromValue = "1365자원봉사";
      } else if (source === "VMS") {
        fromValue = "VMS사회복지";
      }

      const endDate = new Date(response.data.progrmEndde); // 모집 마감일
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 일 단위로 변환

      const newCard: CardData = {
        id: response.data.progrmRegistNo,
        label: response.data.progrmSj || "제목 없음",
        region: simplifyAddress(response.data.postAdres), // 주소 간단화 적용
        type: response.data.srvcClCode || "상세 설명 없음",
        date: `모집마감일: ${new Date(response.data.progrmEndde).toLocaleDateString()}`,
        imageUrl: `${config.API_DEV}/api/bong/image/${response.data.progrmRegistNo}/1`,
        from: fromValue,
        remainingDays: remainingDays > 0 ? remainingDays : 0,
        imageLoaded: false,
      };
  
      return newCard;
    } catch (error) {
      console.error("Failed to fetch card data:", error);
      return null;
    }
  };
  
  const initializeCards = async () => {
    const queryParams = new URLSearchParams(location.search); // 쿼리 파라미터 가져오기
    const progrmRegistNo = queryParams.get("progrmRegistNo");

    const newCards: CardData[] = [];

    // 5장 랜덤 카드 추가
    while (newCards.length < 5) {
      // progrmRegistNo가 있을 경우, 해당 카드를 첫 번째에 추가
      if (newCards.length==4 && progrmRegistNo) {
        const specificCard = await fetchCardData(progrmRegistNo);
        if (specificCard) newCards.push(specificCard);
      }else{
        const card = await fetchCardData();
        if (card) newCards.push(card);
      }
    }
    setCards(newCards);
    setCurrentIndex(newCards.length - 1); // 마지막 카드가 최상단으로 보이게 설정
  };

  // --------------------
  // 초기 데이터 로드
  // --------------------
  useEffect(() => {
    initializeCards();
  }, [location.search]); // location.search 변경 시 다시 초기화

  // --------------------
  // 터치 이벤트 핸들러
  // --------------------
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setDragX(0);
    setDragY(0);
  };  

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
  
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
  
    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;
  
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 좌우 스와이프 처리
      setDragX(deltaX);
      setDragY(0); // 상하 초기화
    } else {
      // 상하 스와이프 처리 (위로만 허용)
      if (deltaY < 0) {
        setDragY(deltaY);
        setDragX(0); // 좌우 초기화
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    checkSwipe();
  };

  // --------------------
  // 마우스 이벤트 핸들러
  // --------------------
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
    setDragX(0);
    setDragY(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    // 좌우 또는 상하 스와이프 처리
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 좌우 스와이프
      setDragX(deltaX);
      setDragY(0); // 상하 초기화
    } else {
      // 상하 스와이프
      if (deltaY < 0) {
        // 위로 스와이프만 허용
        setDragY(deltaY);
        setDragX(0); // 좌우 초기화
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    checkSwipe();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      checkSwipe();
    }
  };

  // --------------------
  // 스와이프 판정 & 처리
  // --------------------
  const checkSwipe = () => {
    if (dragY < -SWIPE_THRESHOLD_Y && currentIndex >= 0) {
        const progrmRegistNo = cards[currentIndex].id;

        // ✅ 모든 카드에 같은 애니메이션 적용
        const allCards = document.querySelectorAll(`[data-index]`);
        allCards.forEach((card) => {
            (card as HTMLElement).style.transition = "transform 3s ease-out";
            (card as HTMLElement).style.transform = "translateY(-150%)"; // 화면 위로 밀기
        });

        setTimeout(() => {
            navigate(`/detail/${progrmRegistNo}`);
        }, 300); // 0.3초 후 이동
    } else if (dragX > SWIPE_THRESHOLD_X) {
        swipe("right");
    } else if (dragX < -SWIPE_THRESHOLD_X) {
        swipe("left");
    }
  };

  const swipe = async (direction: "left" | "right") => {
    console.log("Swiping...", direction);

    const topCard = document.querySelector(`[data-index="${currentIndex}"]`);
    if (!topCard) return;

    const finalX = dragX > 0 ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
    const finalRotate = dragX > 0 ? 30 : -30;

    // 새 카드 데이터를 미리 가져오기 (비동기 실행)
    const newCardPromise = fetchCardData();

    // 트랜지션 시간을 3초에서 0.3초로 수정
    (topCard as HTMLElement).style.transition = "transform 0.3s ease-out";
    (topCard as HTMLElement).style.transform = `translateX(${finalX}px) rotate(${finalRotate}deg)`;

    // ✅ 로그인된 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : null;
    if (!userData) {
        console.warn("User not logged in. Skipping API request.");
    } else {
        // ✅ 공고 ID 가져오기
        const progrmRegistNo = cards[currentIndex]?.id;
        // ✅ 좋아요(1) 또는 싫어요(2) API 호출
        const action = direction === "right" ? 1 : 2;
        try {
            await fetch(`${config.API_DEV}/api/user/like`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    userId: userData.id,
                    bongId: progrmRegistNo.toString(),
                    action: action.toString(),
                }),
            });
            console.log(`✅ ${direction === "right" ? "좋아요" : "싫어요"} 기록됨`);
        } catch (error) {
            console.error("API 요청 실패:", error);
        }
    }

    const newCard = await newCardPromise; // 미리 가져온 데이터 사용
    if (!newCard) return;

    setCards((prevCards) => {
        const updatedCards = [...prevCards];
        updatedCards.pop();
        updatedCards.unshift(newCard);
        return updatedCards;
    });

    // ✅ 초기화 작업 즉시 실행 (setTimeout 없음)
    setDragX(0);
    setDragY(0);
    setCurrentIndex(cards.length - 1);
  };
  
  // 이미지 로딩 완료 핸들러 추가
  const handleImageLoad = (index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], imageLoaded: true };
      return newCards;
    });
  };

  return (
    <Wrapper>
      {[...cards].reverse().map((card, reversedIndex) => {
        // 실제 인덱스 계산 (역순이므로 원래 인덱스로 변환)
        const actualIndex = cards.length - 1 - reversedIndex;
        const isTop = actualIndex === currentIndex;

        return (
          <Card
            key={`${card.id}-${actualIndex}`}
            data-index={actualIndex}
            style={{
              zIndex: actualIndex, // zIndex도 그대로 유지
              backgroundImage: `url(${card.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              transform: isTop
                ? Math.abs(dragX) > Math.abs(dragY)
                  ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`
                  : `translateY(${dragY}px)`
                : `translateY(${dragY}px)`,
              transition: isDragging 
                ? "none" 
                : "transform 0.3s ease, opacity 0.2s ease",
              backgroundColor: isTop
                ? dragX > 0
                  ? `rgba(100, 255, 100, ${Math.min(Math.abs(dragX) / 600, 0.9)})`
                  : `rgba(255, 100, 100, ${Math.min(Math.abs(dragX) / 600, 0.9)})`
                : "transparent",
              opacity: card.imageLoaded ? 1 : 0.3,
            }}
            onTouchStart={isTop ? handleTouchStart : undefined}
            onTouchMove={isTop ? handleTouchMove : undefined}
            onTouchEnd={isTop ? handleTouchEnd : undefined}
            onMouseDown={isTop ? handleMouseDown : undefined}
            onMouseMove={isTop ? handleMouseMove : undefined}
            onMouseUp={handleMouseUp}
            onMouseLeave={isTop ? handleMouseLeave : undefined}
          >
            {/* 이미지 프리로딩을 위한 수정된 방식 */}
            <img 
              src={card.imageUrl} 
              onLoad={() => handleImageLoad(actualIndex)}
              style={{ 
                display: 'none',
                width: 0,
                height: 0
              }}
              alt=""
              loading="eager" // 이미지 즉시 로딩
            />

            <div
              style={{
                position: "absolute",
                top: "20px", // 상단 간격
                left: "20px", // 좌측 간격
                backgroundColor:
                  card.from === "1365자원봉사"
                    ? "rgba(255, 215, 0, 1)" // 노란색 (1365)
                    : card.from === "VMS사회복지"
                    ? "rgba(138, 43, 226, 1)" // 보라색 (VMS)
                    : card.from === "미등록 사용자"
                    ? "rgb(218, 40, 40)" // 적색 (비 로그인)
                    : "rgb(36, 177, 36)", // 녹색 (사용자 정의)
                color:
                  card.from === "1365자원봉사"
                    ? "black" // 글자를 흰색으로 설정 (VMS)
                    : "white", // 기본값은 검정색
                padding: "12px 24px", // 패딩 키워서 크기 조정
                borderRadius: "12px", // 둥글기 유지
                fontSize: "18px", // 폰트 크기 키우기
                fontWeight: "bold",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // 그림자 효과
                height: "auto", // 높이를 자동으로 맞춤
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.from}
            </div>
            <TextContainer>
              <LabelText>{card.label}</LabelText>
              <ContextText>{card.region}</ContextText>
              <ContextText>{card.type}</ContextText>
              <ContextText style={{ display: "flex", alignItems: "center" }}>
                {card.date} {/* 모집 마감일 텍스트 */}
                <span
                  style={{
                    marginLeft: "10px", // 모집 마감일과 간격 조정
                    backgroundColor: "rgb(204, 16, 16)", // 빨간색 배경
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {`D-${card.remainingDays}`}
                </span>
              </ContextText>
            </TextContainer>
          </Card>
        );
      })}

      {currentIndex < 0 && <NoMoreCards><Loading/></NoMoreCards>}
    </Wrapper>
  );

};

export default Swipe;


// --------------------
// 스타일 정의
// --------------------

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px); /* TopBar 높이 제외 */
  position: relative;
`;

const Card = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  user-select: none;
  cursor: grab;
  transition: transform 0.7s ease, opacity 0.7s ease; /* 트랜지션 속도 수정 */
`;

const TextContainer = styled.div`
  position: absolute;
  bottom: 0%;
  left: 0%;
  right: 0%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 추가 */
  padding: 20px 20px 20px 20px; /* 상, 우, 하, 좌 순서로 설정 */
  border-radius: 8px; /* 박스 모서리를 둥글게 */
`;

const LabelText = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff; /* 흰색 텍스트 */
`;

const ContextText = styled.div`
  font-size: 1.2rem;
  color: #ddd; /* 흰색과 대비되는 밝은 회색 */
  margin-top: 2%;
`;

const NoMoreCards = styled.div`
  margin-top: 50%;
  text-align: center;
  color: #888;
`;
