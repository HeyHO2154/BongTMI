import requests
import pymysql
import xml.etree.ElementTree as ET
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

# API 설정
BASE_URL = "http://openapi.1365.go.kr/openapi/service/rest/VolunteerPartcptnService"
SERVICE_KEY = "YOUR_API_KEY"  # 공공데이터 포털에서 발급받은 API 키

# MySQL 연결 함수
def get_db_connection():
    return pymysql.connect(**db_config)

# MySQL에 봉사 공고 저장 함수
def insert_volunteer_data(data):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO Bong (
                progrmRegistNo, progrmSj, nanmmbyNm, progrmBgnde, progrmEndde, progrmSttusSe,
                actPlace, telno, progrmCn
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                progrmSj=VALUES(progrmSj),
                nanmmbyNm=VALUES(nanmmbyNm),
                progrmBgnde=VALUES(progrmBgnde),
                progrmEndde=VALUES(progrmEndde),
                progrmSttusSe=VALUES(progrmSttusSe),
                actPlace=VALUES(actPlace),
                telno=VALUES(telno),
                progrmCn=VALUES(progrmCn)
            """
            cursor.execute(sql, (
                data['progrmRegistNo'], data['progrmSj'], data['nanmmbyNm'],
                data['progrmBgnde'], data['progrmEndde'], data['progrmSttusSe'],
                data['actPlace'], data['telno'], data['progrmCn']
            ))
        connection.commit()
    finally:
        connection.close()

# 봉사 공고 목록 가져오기
def fetch_all_volunteer_data(page_no=1):
    params = {
        'ServiceKey': SERVICE_KEY,
        'numOfRows': 10,
        'pageNo': page_no,
    }
    url = f"{BASE_URL}/getVltrSearchWordList"
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.text  # XML로 반환

# 봉사 공고 상세 데이터 가져오기
def fetch_volunteer_detail(progrmRegistNo):
    params = {
        'ServiceKey': SERVICE_KEY,
        'progrmRegistNo': progrmRegistNo
    }
    url = f"{BASE_URL}/getVltrPartcptnItem"
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.text  # XML로 반환

# XML 데이터를 파싱하여 딕셔너리로 변환
def parse_xml_to_dict(xml_data):
    root = ET.fromstring(xml_data)
    items = root.find('.//items')
    if items is None:
        return []

    parsed_data = []
    for item in items.findall('item'):
        parsed_data.append({
            'progrmRegistNo': item.findtext('progrmRegistNo', ''),
            'progrmSj': item.findtext('progrmSj', ''),
            'nanmmbyNm': item.findtext('nanmmbyNm', ''),
            'progrmBgnde': item.findtext('progrmBgnde', ''),
            'progrmEndde': item.findtext('progrmEndde', ''),
            'progrmSttusSe': item.findtext('progrmSttusSe', ''),
            'actPlace': item.findtext('actPlace', ''),
            'telno': item.findtext('telno', ''),
            'progrmCn': item.findtext('progrmCn', '')
        })
    return parsed_data

# 데이터 저장 프로세스
def process_and_store_volunteer_data():
    page_no = 1
    while True:
        xml_data = fetch_all_volunteer_data(page_no)
        volunteer_list = parse_xml_to_dict(xml_data)
        if not volunteer_list:
            break

        for item in volunteer_list:
            # 상세 데이터 가져오기
            detail_xml = fetch_volunteer_detail(item['progrmRegistNo'])
            detail_data = parse_xml_to_dict(detail_xml)
            if detail_data:
                insert_volunteer_data(detail_data[0])  # 상세 데이터 저장
        page_no += 1

# 실행
if __name__ == "__main__":
    process_and_store_volunteer_data()
