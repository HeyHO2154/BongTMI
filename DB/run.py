import schedule
import time
import asyncio
from api import process_and_store_volunteer_data
from crol import scrape_vms
from image import fetch_and_download
from datetime import datetime

# 크롤링 스크립트 실행 (비동기)
async def run_scraper():
    await scrape_vms()

# 전체 작업 실행 (API → 크롤링 → 이미지 다운로드 순서)
def run_all_tasks():
    print(f"=== {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | 데이터 처리 시작 ===")
    
    # 1. API 데이터 처리 및 저장
    print("[1] API 데이터 가져오기 및 저장 중...")
    process_and_store_volunteer_data()

    # 2. 웹 크롤링 실행 (동기 실행을 위해 asyncio.run 사용)
    print("[2] 웹 크롤링 실행 중...")
    asyncio.run(run_scraper())  # 크롤링이 끝날 때까지 대기

    # 3. 이미지 다운로드 실행
    print("[3] 이미지 다운로드 실행 중...")
    fetch_and_download()
    
    print("=== 모든 작업 완료 ===")

# ✅ 현재 시간이 23:59이 지났는지 확인 후 실행 (datetime 객체 비교)
current_time = datetime.now()
scheduled_time = current_time.replace(hour=23, minute=59, second=0, microsecond=0)
if current_time >= scheduled_time:
    run_all_tasks()

# ✅ 매일 밤 23:59시에 실행 설정
schedule.every().day.at("23:59").do(run_all_tasks)

print("스케줄러 실행 중... (매일 밤 23:59에 실행)")
while True:
    schedule.run_pending()
    time.sleep(30)  # 30초 단위로 확인하여 불필요한 CPU 사용 방지  
