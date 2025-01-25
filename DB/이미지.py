import os
import time
import pymysql
from bing_image_downloader import downloader

# MySQL 데이터베이스 연결 설정
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1013',
    'database': 'hsj',
    'charset': 'utf8mb4',
    'autocommit': True
}

# 이미지 저장 경로
base_path = r"C:\Users\PRO\Desktop\GitDesktop\BongTMI\DB\Image"

# 이미지 다운로드 함수
def download_images(query, save_path, num_images=1):
    try:
        # Bing Image Downloader 실행
        downloader.download(
            query,
            limit=num_images,
            output_dir=save_path,
            adult_filter_off=True,
            force_replace=False,
            timeout=60
        )
        print(f"'{query}'에 대한 이미지가 저장되었습니다.")
    except Exception as e:
        print(f"'{query}'에 대한 이미지 다운로드 중 오류 발생: {e}")

# 데이터베이스에서 검색어 가져오기 및 이미지 다운로드
def fetch_and_download():
    # MySQL 연결
    connection = pymysql.connect(**db_config)
    try:
        with connection.cursor() as cursor:
            # Bong 테이블에서 mnnstNm 컬럼 데이터 가져오기
            query = "SELECT mnnstNm FROM Bong"
            cursor.execute(query)
            rows = cursor.fetchall()

            for row in rows:
                query_word = row[0]  # 검색어
                print(f"현재 검색어: {query_word}")
                download_images(query_word, base_path)  # 이미지 다운로드

                # 딜레이 (3초~5초 사이 랜덤 딜레이)
                time.sleep(3 + (2 * os.urandom(1)[0] / 255))
    finally:
        connection.close()

if __name__ == "__main__":
    fetch_and_download()
