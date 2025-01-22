import asyncio
from playwright.async_api import async_playwright
import pymysql
from datetime import datetime

# MySQL 데이터베이스 연결 설정
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1013',
    'database': 'hsj',
    'charset': 'utf8mb4',
    'autocommit': True
}

# MySQL에 데이터 저장 함수
def save_to_mysql(Bong, BongData, BongPlace):
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO Bong (UserID, context, BongStart, BongEnd, EndDate, createTime, link)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.executemany(sql, Bong)

            sql = """
            INSERT INTO BongData (title, StartHour, EndHour, region, verified)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.executemany(sql, BongData)

            sql = """
            INSERT INTO BongPlace (name, latitude, longitude)
            VALUES (%s, %s, %s)
            """
            cursor.executemany(sql, BongPlace)

        print(f"Saved Bong's Data to MySQL.")
    except Exception as e:
        print(f"Error saving to MySQL: {e}")
    finally:
        connection.close()

# 크롤링 및 데이터 저장
async def scrape_volunteer_fields():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 사이트 열기
        await page.goto("https://www.1365.go.kr/vols/1572247904127/partcptn/timeCptn.do")
        await page.wait_for_selector("li")  # 목록 항목 로드 대기

        Bong = []
        BongData = []
        BongPlace = []
        max_pages = 2  # 최대 페이지 순회

        for page_num in range(1, max_pages + 1):
            print(f"Processing page {page_num}...")

            # 목록 페이지에서 상세 페이지 링크 수집
            announcements = await page.query_selector_all("li a.list")
            links = []
            for link_element in announcements:
                javascript_call = await link_element.get_attribute("href")
                if javascript_call:
                    progrm_regist_no = javascript_call.split("(")[-1].split(")")[0]
                    link = f"https://www.1365.go.kr/vols/1572247904127/partcptn/timeCptn.do?type=show&progrmRegistNo={progrm_regist_no}"
                    links.append(link)

            # 상세 페이지로 이동 후 데이터 추출
            for link in links:
                try:
                    await page.goto(link)
                    print(f"Navigated to detail page: {link}")
                    await page.wait_for_selector("body")

                    # UserID
                    user_id = -1  # 기관 ID를 -1로 설정

                    # Context
                    context_element = await page.query_selector("div.board_body > div.bb_txt > pre")
                    context = await context_element.inner_text() if context_element else "N/A"

                    # 봉사기간 (start_date와 end_date 추출)
                    volunteer_period_element = await page.query_selector("dt:has-text('봉사기간') + dd")
                    volunteer_period_text = await volunteer_period_element.inner_text() if volunteer_period_element else "N/A"

                    if "~" in volunteer_period_text:
                        BongStart, BongEnd = [date.strip() for date in volunteer_period_text.split("~")]
                    else:
                        BongStart, BongEnd = "N/A", "N/A"

                    # EndDate
                    end_date_element = await page.query_selector("dt:has-text('모집기간') + dd")
                    end_date_text = await end_date_element.inner_text() if end_date_element else "N/A"
                    end_date = end_date_text.split("~")[-1].strip() if "~" in end_date_text else "N/A"

                    # createTime
                    create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                    # Title
                    title_element = await page.query_selector("div.board_view.type2 > h3.tit_board_view > input#progrmSj")
                    title = await title_element.get_attribute("value") if title_element else "N/A"
                    
                    # StartHour와 EndHour 추출 및 변환
                    time_element = await page.query_selector("dl:has(dt:has-text('봉사시간')) > dd")
                    time_text = await time_element.inner_text() if time_element else "N/A"

                    if time_text != "N/A" and "~" in time_text:
                        start_time, end_time = [time.strip() for time in time_text.split("~")[:2]]
                        end_time = end_time.split("(")[0].strip()  # 뒤쪽 괄호로 시작하는 부분 제거
                        # 시간 문자열을 분 단위로 변환
                        def time_to_minutes(time_str):
                            try:
                                hours, minutes = map(int, time_str.replace("시", "").replace("분", "").split())
                                return hours * 60 + minutes
                            except ValueError:
                                return -1  # 변환 실패 시 기본값
                        
                        StartHour = time_to_minutes(start_time)
                        EndHour = time_to_minutes(end_time)
                    else:
                        StartHour, EndHour = -1, -1  # 기본값

                    # Region 추출
                    region_element = await page.query_selector("dl:has(dt:has-text('등록기관')) > dd")
                    region = await region_element.inner_text() if region_element else "N/A"

                    # Verified 값 설정
                    verified = True

                    # name 추출
                    name_element = await page.query_selector("dl:has(dt:has-text('봉사장소')) > dd")
                    name = await name_element.inner_text() if region_element else "N/A"

                    # Latitude와 Longitude 추출
                    latitude, longitude = -1, -1

                    # HTML 내 숨겨진 input 태그에서 값 추출
                    try:
                        # <input id="lalo1" name="lalo1" value="34.8049037567584,126.461712203019">
                        lalo1_element = await page.query_selector("input#lalo1")
                        lalo1_value = await lalo1_element.get_attribute("value") if lalo1_element else None

                        if lalo1_value:
                            lat_lng = lalo1_value.split(",")
                            latitude = float(lat_lng[0])
                            longitude = float(lat_lng[1])

                    except Exception as e:
                        print(f"Error extracting lalo1 input value: {e}")

                    # 데이터 추가
                    Bong.append((user_id, context, BongStart, BongEnd, end_date, create_time, link))
                    BongData.append((title, StartHour, EndHour, region, verified))
                    BongPlace.append((name, latitude, longitude))


                    # 상세 페이지에서 목록 페이지로 복귀
                    await page.go_back()

                except Exception as e:
                    print(f"Error processing detail page: {e}")

            # 다음 페이지로 이동
            try:
                next_button = await page.query_selector("a.btn_next")
                if next_button and await next_button.is_enabled():
                    await next_button.click()
                    print(f"Moving to page {page_num + 1}...")
                    await page.wait_for_timeout(3000)
                    await page.wait_for_selector("li")
                else:
                    print(f"No more pages or 'Next' button not found on page {page_num}. Exiting...")
                    break
            except Exception as e:
                print(f"Error moving to the next page: {e}")
                break

        # MySQL에 데이터 저장
        if Bong and BongData and BongPlace:
            save_to_mysql(Bong, BongData, BongPlace)

        # 브라우저 닫기
        await browser.close()

# 실행
asyncio.run(scrape_volunteer_fields())
