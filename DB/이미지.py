import os
import time
import shutil
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
def download_images(query, save_path, num_images=3):
    temp_path = os.path.join(base_path, "temp")  # 임시 폴더
    os.makedirs(temp_path, exist_ok=True)  # 임시 폴더 생성
    
    try:
        # Bing Image Downloader 실행 (임시 폴더에 저장)
        downloader.download(
            query.strip(),  # 검색어에서 불필요한 공백 제거
            limit=num_images,
            output_dir=temp_path,
            adult_filter_off=True,
            force_replace=False,
            timeout=60
        )
        
        # 임시 폴더의 모든 이미지 파일을 `save_path`로 이동
        for root, dirs, files in os.walk(temp_path):
            for file_name in files:
                source_file = os.path.join(root, file_name)
                destination_file = os.path.join(save_path, file_name)
                shutil.move(source_file, destination_file)

        print(f"'{query}'에 대한 이미지가 '{save_path}'에 저장되었습니다.")
    except Exception as e:
        print(f"'{query}'에 대한 이미지 다운로드 중 오류 발생: {e}")
    finally:
        # 임시 폴더 삭제
        shutil.rmtree(temp_path, ignore_errors=True)

# 데이터베이스에서 검색어 가져오기 및 이미지 다운로드
def fetch_and_download():
    # MySQL 연결
    connection = pymysql.connect(**db_config)
    try:
        with connection.cursor() as cursor:
            # Bong 테이블에서 progrmRegisNo와 mnnstNm 컬럼 데이터 가져오기
            query = "SELECT progrmRegistNo, mnnstNm FROM Bong"
            cursor.execute(query)
            rows = cursor.fetchall()

            total = len(rows)  # 전체 데이터 개수
            for index, row in enumerate(rows, start=1):
                progrmRegisNo = str(row[0])  # 폴더명 (progrmRegisNo)
                query_word = row[1]  # 검색어 (mnnstNm)

                # 저장할 폴더 경로
                save_path = os.path.join(base_path, progrmRegisNo)
                os.makedirs(save_path, exist_ok=True)  # 폴더 생성
                
                print(f"({index}/{total}) 현재 검색어: {query_word} (폴더: {progrmRegisNo})")
                download_images(query_word, save_path)  # 이미지 다운로드

                # 딜레이 (3초~5초 사이 랜덤 딜레이)
                #time.sleep(3 + (2 * os.urandom(1)[0] / 255))
    finally:
        connection.close()

if __name__ == "__main__":
    fetch_and_download()
