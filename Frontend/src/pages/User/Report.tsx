import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BarChart, LineChart, PieChart } from "lucide-react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

interface MonthlyStat {
  month: string;
  count: number;
}

interface VolunteerData {
  totalHours: number;
  totalActivities: number;
  categoryStats: Record<string, number>;
  monthlyStats: MonthlyStat[]; // ✅ 명확한 타입 지정
  recommendedActivities: any[];
}

// Chart.js 플러그인 설정
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const Report: React.FC = () => {
  const [volunteerData, setVolunteerData] = useState<VolunteerData>({
    totalHours: 0,
    totalActivities: 0,
    categoryStats: {},
    monthlyStats: [], // ✅ 빈 배열 기본값 설정
    recommendedActivities: [],
  });
  
  useEffect(() => {
    fetchVolunteerData();
  }, []);

  // ✅ API에서 봉사 데이터 가져오기
  const fetchVolunteerData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/volunteer/stats");
      setVolunteerData({
        ...response.data,
        monthlyStats: response.data.monthlyStats || [], // ✅ null 값 방지
      });
    } catch (error) {
      console.error("Failed to fetch volunteer data:", error);
    }
  };

  // ✅ 봉사 유형별 분포 (파이 차트)
  const categoryLabels = Object.keys(volunteerData.categoryStats);
  const categoryData = Object.values(volunteerData.categoryStats);

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#BA68C8"],
      },
    ],
  };

  // ✅ 월별 봉사 참여 횟수 (막대 차트)
  const monthlyLabels = volunteerData.monthlyStats.map((data) => data.month);
  const monthlyCounts = volunteerData.monthlyStats.map((data) => data.count);

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "월별 봉사 참여 횟수",
        data: monthlyCounts,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <Container>
      <Header>📊 봉사자 활동 분석</Header>
      <StatsContainer>
        <StatBox>
          <BarChart size={32} />
          <h3>총 활동 횟수</h3>
          <p>{volunteerData.totalActivities}회</p>
        </StatBox>
        <StatBox>
          <LineChart size={32} />
          <h3>총 봉사 시간</h3>
          <p>{volunteerData.totalHours}시간</p>
        </StatBox>
      </StatsContainer>

      <ChartContainer>
        <ChartTitle>봉사 유형별 분포</ChartTitle>
        <Pie data={categoryChartData} />
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>월별 봉사 참여 횟수</ChartTitle>
        <Bar data={monthlyChartData} />
      </ChartContainer>

      <RecommendationSection>
        <ChartTitle>📌 AI 추천 봉사 활동</ChartTitle>
        <ul>
          {volunteerData.recommendedActivities.map((activity, index) => (
            <li key={index}>✅ {activity}</li>
          ))}
        </ul>
      </RecommendationSection>
    </Container>
  );
};

export default Report;

// --------------------
// ✅ 스타일 정의
// --------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: calc(100vh - 160px); /* TopBar(60px) + Navbar(60px) */
  overflow-y: auto;
`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 180px;
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
`;

const RecommendationSection = styled.div`
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

