import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import os
from datetime import datetime

def calculate_duration(start_date, end_date):
    start = datetime.strptime(start_date.strip(), "%Y-%m-%d")
    end = datetime.strptime(end_date.strip(), "%Y-%m-%d")
    return (end - start).days + 1

async def scrape_volunteer_info():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 사이트 열기
        await page.goto("https://www.1365.go.kr/vols/1572247904127/partcptn/timeCptn.do")
        await page.wait_for_selector("li")  # 리스트 항목 로드 대기

        data = []
        page_num = 1  # 페이지 번호 추적
        max_pages = 500  # 테스트를 위해 최대 페이지만 크롤링

        # 페이지 순회
        while page_num <= max_pages:
            print(f"Processing page {page_num}...")  # 현재 페이지 출력

            # 공고 정보 크롤링
            announcements = await page.query_selector_all("li")
            for announcement in announcements:
                try:
                    # 봉사기간 추출
                    service_period = await announcement.query_selector("dt:has-text('[봉사기간]') + dd")
                    if service_period:
                        service_dates = await service_period.inner_text()
                        start_date, end_date = service_dates.split("~")
                        duration = calculate_duration(start_date, end_date)
                    else:
                        duration = None

                    # 등록기관 추출
                    registration_org = await announcement.query_selector("dt:has-text('[등록기관]') + dd")
                    registration_org = await registration_org.inner_text() if registration_org else None

                    # 봉사시간 추출
                    service_time = await announcement.query_selector("dt:has-text('[봉사시간]') + dd")
                    service_time = await service_time.inner_text() if service_time else None

                    # 인정시간 추출
                    recognition_time = await announcement.query_selector("dt:has-text('[인정시간]') + dd")
                    if recognition_time:
                        recognition_time = await recognition_time.inner_text()
                        recognition_hours = recognition_time.split("최대 ")[1].split("시간")[0].strip()
                    else:
                        recognition_hours = None

                    # 봉사내용 추출
                    content_title = await announcement.query_selector(".tit_board_list")
                    content_title = await content_title.inner_text() if content_title else None

                    # 링크 추출
                    link_element = await announcement.query_selector("a.list")
                    if link_element:
                        javascript_call = await link_element.get_attribute("href")
                        progrm_regist_no = javascript_call.split("(")[-1].split(")")[0]
                        link = f"https://www.1365.go.kr/vols/1572247904127/partcptn/timeCptn.do?type=show&progrmRegistNo={progrm_regist_no}"
                    else:
                        link = None

                    # 데이터 저장 (빈 값이 아닌 경우만 추가)
                    if duration and registration_org and service_time and recognition_hours and content_title and link:
                        data.append({
                            "봉사기간": duration,
                            "등록기관": registration_org,
                            "봉사시간": service_time,
                            "인정시간": recognition_hours,
                            "봉사내용": content_title,
                            "링크": link,
                        })
                except Exception as e:
                    print(f"Error processing an announcement: {e}")

            # 다음 페이지로 이동
            next_button = await page.query_selector("a.btn_next")
            if next_button and await next_button.is_enabled():
                await next_button.click()
                print(f"Moving to page {page_num + 1}...")  # 다음 페이지 이동 출력
                await page.wait_for_selector("li")  # 데이터가 새로 로드될 때까지 대기
                page_num += 1
            else:
                print("No more pages to process. Exiting...")
                break

        # 브라우저 닫기
        await browser.close()

        # 데이터프레임 생성 및 공백 제거
        df = pd.DataFrame(data)
        df = df.dropna(how="any")  # 빈 값이 있는 행 제거
        output_path = os.path.join("C:\\Users\\PRO\\Desktop", "volunteer_announcements.xlsx")
        df.to_excel(output_path, index=False)
        print(f"Data saved to {output_path}")

# 실행
asyncio.run(scrape_volunteer_info())
