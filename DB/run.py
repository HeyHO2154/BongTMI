import schedule
import time
import asyncio
from API_1365 import process_and_store_volunteer_data
from Crol_VMS import scrape_vms
from Crol_DC import scrape_dcinside
from Image import fetch_and_download
from datetime import datetime

# 크롤링 스크립트 실행 (비동기)
async def run_scraper():
    await scrape_vms()
async def run_scraper2():
    await scrape_dcinside()

# 전체 작업 실행 (API → 크롤링 → 이미지 다운로드 순서)
def run_all_tasks():
    print(f"=== {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | 데이터 처리 시작 ===")
    
    # 1. API 데이터 처리 및 저장
    print("[1] API 데이터 가져오기 및 저장 중...")
    process_and_store_volunteer_data()

    # 2. 웹 크롤링 실행 (동기 실행을 위해 이벤트 루프 사용)
    print("[2] 웹 크롤링 실행 중...")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_scraper())  # 크롤링이 끝날 때까지 대기

    # 3. 이미지 다운로드 실행
    print("[3] 이미지 다운로드 실행 중...")
    fetch_and_download()

    # 4. 디시 이미지 포함 크롤링
    print("[2] 웹 크롤링 실행 중...")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_scraper2())  # 크롤링이 끝날 때까지 대기
    
    print("=== 모든 작업 완료 ===")

# ✅ 매일 밤 23:59에 실행 설정
schedule.every().day.at("16:06").do(run_all_tasks)

print("스케줄러 실행 중... (매일 밤 23:59에 실행)")
while True:
    schedule.run_pending()
    time.sleep(schedule.idle_seconds() or 1)  # 남은 시간 동안 대기 (최소 1초)
