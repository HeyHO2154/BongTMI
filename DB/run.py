import time
import asyncio
from API_1365 import process_and_store_volunteer_data
from Crol_VMS import scrape_vms
from Crol_DC import scrape_dcinside
from Image import fetch_and_download
from datetime import datetime

# 크롤링 스크립트 실행 (비동기)
async def run_scraper():
    try:
        await scrape_vms()
    except Exception as e:
        print(f"[ERROR] VMS 크롤링 중 오류 발생: {e}")

async def run_scraper2():
    try:
        await scrape_dcinside()
    except Exception as e:
        print(f"[ERROR] DC 크롤링 중 오류 발생: {e}")

# 전체 작업 실행 (API → 크롤링 → 이미지 다운로드 순서)
def run_all_tasks():
    print(f"=== {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | 데이터 처리 시작 ===")
    
    # 1. API 데이터 처리 및 저장
    try:
        print("[1] API 데이터 가져오기 및 저장 중...")
        process_and_store_volunteer_data()
    except Exception as e:
        print(f"[ERROR] API 데이터 처리 중 오류 발생: {e}")

    # 2. 웹 크롤링 실행 (동기 실행을 위해 이벤트 루프 사용)
    try:
        print("[2] VMS 웹 크롤링 실행 중...")
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run_scraper())
    except Exception as e:
        print(f"[ERROR] VMS 크롤링 실행 중 오류 발생: {e}")
    
    # 3. 이미지 다운로드 실행
    try:
        print("[3] 이미지 다운로드 실행 중...")
        fetch_and_download()
    except Exception as e:
        print(f"[ERROR] 이미지 다운로드 중 오류 발생: {e}")
    
    # 4. 디시 크롤링 실행
    try:
        print("[4] DC 웹 크롤링 실행 중...")
        loop.run_until_complete(run_scraper2())
    except Exception as e:
        print(f"[ERROR] DC 크롤링 실행 중 오류 발생: {e}")
    
    print("=== 모든 작업 완료 ===")

# 무한 반복 실행
while True:
    run_all_tasks()
    print("[INFO] 모든 작업 완료, 즉시 다음 반복 실행")
    time.sleep(3600)  # 60분 대기 후 반복 실행
