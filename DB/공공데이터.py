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
                progrmRegistNo, progrmSj, progrmSttusSe, progrmBgnde, progrmEndde,
                actBeginTm, actEndTm, noticeBgnde, noticeEndde, rcritNmpr, actWkdy, srvcClCode,
                adultPosblAt, yngbgsPosblAt, grpPosblAt, mnnstNm, nanmmbyNm, actPlace,
                nanmmbyNmAdmn, telno, fxnum, postAdres, email, progrmCn, sidoCd, gugunCd
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                progrmSj=VALUES(progrmSj),
                progrmSttusSe=VALUES(progrmSttusSe),
                progrmBgnde=VALUES(progrmBgnde),
                progrmEndde=VALUES(progrmEndde),
                actBeginTm=VALUES(actBeginTm),
                actEndTm=VALUES(actEndTm),
                noticeBgnde=VALUES(noticeBgnde),
                noticeEndde=VALUES(noticeEndde),
                rcritNmpr=VALUES(rcritNmpr),
                actWkdy=VALUES(actWkdy),
                srvcClCode=VALUES(srvcClCode),
                adultPosblAt=VALUES(adultPosblAt),
                yngbgsPosblAt=VALUES(yngbgsPosblAt),
                grpPosblAt=VALUES(grpPosblAt),
                mnnstNm=VALUES(mnnstNm),
                nanmmbyNm=VALUES(nanmmbyNm),
                actPlace=VALUES(actPlace),
                nanmmbyNmAdmn=VALUES(nanmmbyNmAdmn),
                telno=VALUES(telno),
                fxnum=VALUES(fxnum),
                postAdres=VALUES(postAdres),
                email=VALUES(email),
                progrmCn=VALUES(progrmCn),
                sidoCd=VALUES(sidoCd),
                gugunCd=VALUES(gugunCd)
            """
            cursor.execute(sql, (
                data['progrmRegistNo'], data['progrmSj'], data['progrmSttusSe'], data['progrmBgnde'], data['progrmEndde'],
                data['actBeginTm'], data['actEndTm'], data['noticeBgnde'], data['noticeEndde'], data['rcritNmpr'], data['actWkdy'], 
                data['srvcClCode'], data['adultPosblAt'], data['yngbgsPosblAt'], data['grpPosblAt'], data['mnnstNm'], 
                data['nanmmbyNm'], data['actPlace'], data['nanmmbyNmAdmn'], data['telno'], data.get('fxnum', None), 
                data['postAdres'], data['email'], data['progrmCn'], data['sidoCd'], data['gugunCd']
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
            'progrmSttusSe': item.findtext('progrmSttusSe', ''),
            'progrmBgnde': item.findtext('progrmBgnde', ''),
            'progrmEndde': item.findtext('progrmEndde', ''),
            'actBeginTm': item.findtext('actBeginTm', ''),
            'actEndTm': item.findtext('actEndTm', ''),
            'noticeBgnde': item.findtext('noticeBgnde', ''),
            'noticeEndde': item.findtext('noticeEndde', ''),
            'rcritNmpr': item.findtext('rcritNmpr', ''),
            'actWkdy': item.findtext('actWkdy', ''),
            'srvcClCode': item.findtext('srvcClCode', ''),
            'adultPosblAt': item.findtext('adultPosblAt', ''),
            'yngbgsPosblAt': item.findtext('yngbgsPosblAt', ''),
            'grpPosblAt': item.findtext('grpPosblAt', ''),
            'mnnstNm': item.findtext('mnnstNm', ''),
            'nanmmbyNm': item.findtext('nanmmbyNm', ''),
            'actPlace': item.findtext('actPlace', ''),
            'nanmmbyNmAdmn': item.findtext('nanmmbyNmAdmn', ''),
            'telno': item.findtext('telno', ''),
            'fxnum': item.findtext('fxnum', ''),
            'postAdres': item.findtext('postAdres', ''),
            'email': item.findtext('email', ''),
            'progrmCn': item.findtext('progrmCn', ''),
            'sidoCd': item.findtext('sidoCd', ''),
            'gugunCd': item.findtext('gugunCd', '')
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
                # detail_data의 progrmRegistNo 앞에 "SYO" 추가
                detail_data[0]['progrmRegistNo'] = 'SYO' + detail_data[0]['progrmRegistNo']
                
                insert_volunteer_data(detail_data[0])  # 상세 데이터 저장
        page_no += 1

# 실행
if __name__ == "__main__":
    process_and_store_volunteer_data()
