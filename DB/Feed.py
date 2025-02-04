import asyncio
import os
import requests
from playwright.async_api import async_playwright
import pymysql
import re
from datetime import datetime
from bs4 import BeautifulSoup

# 🔹 이미지 저장 폴더 설정
IMAGE_SAVE_PATH = r"C:\Users\PRO\Desktop\GitDesktop\BongTMI\DB\Image"

# 폴더가 없으면 생성
if not os.path.exists(IMAGE_SAVE_PATH):
    os.makedirs(IMAGE_SAVE_PATH)

# 🔹 이미지 다운로드 함수
def download_image(image_url, feed_id):
    try:
        headers = {
            "Referer": "https://gall.dcinside.com/"  # ✅ 디시인사이드 Referer 추가
        }
        response = requests.get(image_url, headers=headers, stream=True)

        if response.status_code == 200:
            # ✅ 개별 게시글 폴더 생성 (FeedID 폴더)
            post_folder = os.path.join(IMAGE_SAVE_PATH, feed_id)
            if not os.path.exists(post_folder):
                os.makedirs(post_folder)

            # ✅ 저장 경로 지정 (FeedID 폴더 내 저장)
            file_path = os.path.join(post_folder, f"{feed_id}.jpg")

            # 이미지 저장
            with open(file_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)

            print(f"✅ 이미지 저장 완료: {file_path}")
            return file_path  # 저장된 이미지 경로 반환
        else:
            print(f"❌ 이미지 다운로드 실패: {image_url} (HTTP {response.status_code})")
            return None
    except Exception as e:
        print(f"❌ 이미지 다운로드 중 오류 발생: {e}")
        return None
    
# 🔹 MySQL 데이터베이스 설정
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '1013',
    'database': 'hsj',
    'charset': 'utf8mb4',
    'autocommit': True
}

# 🔹 MySQL 데이터 저장 함수
def save_to_mysql(data):
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO Feed (
                FeedID, title, author, content, likes, views
            ) VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                title=VALUES(title),
                author=VALUES(author),
                content=VALUES(content),
                views=VALUES(views)
            """
            cursor.executemany(sql, data)
        print(f"✅ {len(data)}개의 게시글을 MySQL에 저장 완료!")
    except Exception as e:
        print(f"❌ MySQL 저장 중 오류 발생: {e}")
    finally:
        connection.close()

# 🔹 크롤링 함수
async def scrape_dcinside():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # headless=False로 변경하여 크롤링 화면 확인 가능
        page = await browser.new_page()

        all_post_urls = []  # 🔹 모든 게시물 URL 저장
        max_pages = 1  # 검색 결과 페이지 최대 2페이지 크롤링

        # ✅ 1. 검색 결과 페이지 크롤링 (게시물 목록만 수집)
        for page_num in range(1, max_pages + 1):
            print(f"🔎 검색 페이지 {page_num} 크롤링 중...")

            # ✅ 페이지 이동 URL 수정
            page_url = f"https://search.dcinside.com/post/p/{page_num}/q/.EB.B4.89.EC.82.AC"
            await page.goto(page_url)
            await page.wait_for_selector("div.integrate_cont.sch_result.result_all", timeout=60000)

             # ✅ 게시물 링크 수집 (빠르고 안정적인 방식 적용)
            post_urls = await page.evaluate(
                """() => Array.from(document.querySelectorAll("div.integrate_cont.sch_result.result_all ul li a"))
                .map(el => el.href)"""
            )

            # ✅ 상세 게시글 링크만 필터링 (갤러리 목록 URL 제거)
            post_urls = [url for url in post_urls if "view/?id=" in url]

            print(f"📌 {len(post_urls)}개의 게시물 링크를 수집 완료!")
            all_post_urls.extend(post_urls)

        # ✅ 2. 게시물 상세 페이지 크롤링 (수집한 URL을 하나씩 방문)
        records = []
        
        for post_url in all_post_urls:
            try:
                await page.goto(post_url)
                await page.wait_for_load_state("networkidle")  # ✅ 네트워크 로딩이 끝날 때까지 대기
                await page.wait_for_selector("div.view_content_wrap", timeout=5000)

                # ✅ 디버깅을 위해 현재 크롤링 중인 URL 출력
                print(f"📌 현재 크롤링 중인 게시물: {post_url}")

                # ✅ FeedID 생성 (게시물 고유번호 추출)
                post_id_match = re.search(r"no=(\d+)", post_url)
                FeedID = f"DCI{post_id_match.group(1)}"

                # ✅ 크롤링
                title = await page.locator("#container > section > article:nth-child(3) > div.view_content_wrap > header > div > h3 > span.title_subject").text_content() or "N/A"

                # ✅ 본문 HTML 가져오기
                content_html = await page.locator("div.write_div").inner_html()
                # ✅ BeautifulSoup 사용하여 HTML 파싱
                soup = BeautifulSoup(content_html, "html.parser")
                # ✅ 텍스트만 추출 (HTML 태그 제거)
                for tag in soup(["script", "style"]):  # 광고, 스크립트 제거
                    tag.decompose()
                content = soup.get_text(separator="\n", strip=True)  # 줄바꿈 유지
                
                # ✅ 첫 번째 이미지 URL 추출
                first_image_tag = soup.find("img")
                image_url = first_image_tag["src"] if first_image_tag else None  # 첫 번째 이미지 URL 저장
                # ✅ 이미지가 있으면 다운로드 실행
                if image_url:
                    download_image(image_url, FeedID)

                author = "디시인사이드"
                
                # ✅ 좋아요, 조회수 기본값 0
                views = 0
                likes = 0  

                # ✅ 데이터 저장
                records.append((FeedID, title, author, content, likes, views))
                print(f"✅ 저장됨: {title}")

            except Exception as e:
                print(f"❌ 게시물 크롤링 중 오류 발생: {e}")

        # ✅ 3. MySQL에 저장
        if records:
            save_to_mysql(records)

        await browser.close()

# 🔥 실행
if __name__ == "__main__":
    asyncio.run(scrape_dcinside())
