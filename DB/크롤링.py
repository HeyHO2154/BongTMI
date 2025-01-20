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
def save_to_mysql(data):
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO Bong (UserID, context, EndDate, createTime, link)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.executemany(sql, data)
        print(f"Saved {len(data)} rows to MySQL.")
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

        all_data = []
        max_pages = 3  # 최대 3페이지 순회

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

                    # EndDate
                    end_date_element = await page.query_selector("dt:has-text('모집기간') + dd")
                    end_date_text = await end_date_element.inner_text() if end_date_element else "N/A"
                    end_date = end_date_text.split("~")[-1].strip() if "~" in end_date_text else "N/A"

                    # createTime
                    create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                    # 데이터 추가
                    all_data.append((user_id, context, end_date, create_time, link))
                    print(f"Context: {context}, End Date: {end_date}")

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
        if all_data:
            save_to_mysql(all_data)

        # 브라우저 닫기
        await browser.close()

# 실행
asyncio.run(scrape_volunteer_fields())
