import asyncio
from playwright.async_api import async_playwright
import pymysql
from datetime import datetime
import re

# MySQL 데이터베이스 설정
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '1013',
    'database': 'hsj',
    'charset': 'utf8mb4',
    'autocommit': True
}

# MySQL 데이터 저장 함수
def save_to_mysql(data):
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO Bong (
                progrmRegistNo, progrmSj, progrmSttusSe, progrmBgnde, progrmEndde, actBeginTm, actEndTm,
                noticeBgnde, noticeEndde, rcritNmpr, actWkdy, srvcClCode, adultPosblAt, yngbgsPosblAt, grpPosblAt,
                mnnstNm, nanmmbyNm, actPlace, nanmmbyNmAdmn, telno, fxnum, postAdres, email, progrmCn, sidoCd, gugunCd
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
            cursor.executemany(sql, data)
        print(f"Saved {len(data)} records to MySQL.")
    except Exception as e:
        print(f"Error saving to MySQL: {e}")
    finally:
        connection.close()

# 크롤링 함수
async def scrape_vms():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 목록 페이지 열기
        await page.goto("https://www.vms.or.kr/partspace/recruit.do?sttdte=2025-01-01&enddte=2025-12-31&page=1")
        await page.wait_for_selector("ul.list_wrap li a", timeout=60000)
        records = []
        #max_pages = int(int(await page.locator("#rightArea > div.con > div.searchForm.searchFormTop.clear > p > span").first.text_content())/15)  # 최대 페이지 설정
        #개발할떄는 용량 최소화를 위해 1페이지만
        max_pages = 1

        for page_num in range(max_pages):

            # 목록 페이지 열기
            await page.goto("https://www.vms.or.kr/partspace/recruit.do?sttdte=2025-01-01&enddte=2025-12-31&page="+str(page_num+1))
            await page.wait_for_selector("ul.list_wrap li a", timeout=60000)

            # 목록에서 seq 값 추출
            links = await page.locator("ul.list_wrap li a").all()
            seq_values = [
                (await link.get_attribute("href")).split("seq=")[-1].split("&")[0]
                for link in links if "seq=" in (await link.get_attribute("href"))
            ]

            # 각 seq 값으로 상세 페이지 데이터 수집 (F12에서 영역 클릭 후 copy selector 하면 경로 나오는데 
            # await page.locator("#rightArea > div.con > div.bbs_view > div.viewTitle > div > span:nth-child(1)").first.text_content() or "N/A")로 하면 됨
            for seq in seq_values:
                try:
                    detail_url = f"https://www.vms.or.kr/partspace/recruitView.do?seq={seq}"

                    # 상세 페이지 열기
                    await page.goto(detail_url)
                    await page.wait_for_selector("div.bbs_view")

                    # 데이터 수집
                    progrmRegistNo = "VMS"+seq
                    progrmSj = await page.locator("#rightArea > div.con > div.bbs_view > div.viewTitle > p").first.text_content() or "N/A"
                    progrmSttusSe_temp = await page.locator("#rightArea > div.con > div.bbs_view > div.viewTitle > div > span:nth-child(1)").first.text_content() or "N/A"
                    if progrmSttusSe_temp == "[모집중]": 
                        progrmSttusSe = 2
                    else: 
                        progrmSttusSe = 3

                    # 봉사기간
                    date_range = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(2) > dl:nth-child(1) > dd").first.text_content() or "N/A"
                    if date_range and "~" in date_range:
                        progrmBgnde, progrmEndde = [d.strip() for d in date_range.split("~")]
                    else:
                        progrmBgnde, progrmEndde = "N/A", "N/A"

                    # 봉사시간(없음)
                    actBeginTm, actEndTm = 0, 23

                    # 나머지 데이터
                    noticeBgnde, noticeEndde = progrmBgnde, progrmEndde

                    rcritNmpr_temp = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(5) > dl:nth-child(2) > dd").text_content() or 0
                    rcritNmpr = int(re.findall(r'\d+', rcritNmpr_temp)[0])

                    actWkdy = "1111111"
                    srvcClCode = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(2) > dl:nth-child(2) > dd").first.text_content() or "N/A"
                    adultPosblAt = 'Y'
                    yngbgsPosblAt = 'Y'
                    grpPosblAt = 'Y'
                    mnnstNm = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(3) > dl:nth-child(1) > dd").first.text_content() or "N/A"
                    nanmmbyNm = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(3) > dl:nth-child(1) > dd").first.text_content() or "N/A"
                    actPlace = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(4) > dl:nth-child(2) > dd").first.text_content() or "N/A"
                    nanmmbyNmAdmn = await page.locator("#rightArea > div.con > div.personInfo > dl:nth-child(1) > dd").first.text_content() or "N/A"
                    telno = await page.locator("#rightArea > div.con > div.personInfo > dl:nth-child(3) > dd").first.text_content() or "N/A"
                    fxnum = "없음"

                    postAdres_temp = await page.locator("#rightArea > div.con > div.bbs_view > div:nth-child(4) > dl:nth-child(1) > dd").text_content() or "N/A"
                    postAdres = re.sub(r"\[.*?\]\s*", "", postAdres_temp)

                    email = await page.locator("#rightArea > div.con > div.personInfo > dl:nth-child(2) > dd").first.text_content() or "N/A"
                    progrmCn = await page.locator("#rightArea > div.con > table > tbody > tr:nth-child(6) > td > div").text_content() or "N/A"
                    sidoCd, gugunCd = "00", "00"
                    # 데이터 저장
                    records.append((
                        progrmRegistNo, progrmSj, progrmSttusSe, progrmBgnde, progrmEndde, actBeginTm, actEndTm,
                        noticeBgnde, noticeEndde, rcritNmpr, actWkdy, srvcClCode, adultPosblAt, yngbgsPosblAt, grpPosblAt,
                        mnnstNm, nanmmbyNm, actPlace, nanmmbyNmAdmn, telno, fxnum, postAdres, email, progrmCn, sidoCd, gugunCd
                    ))
                    print("저장됨: "+progrmRegistNo)
                except Exception as e:
                    print(f"Error processing detail page for seq {seq}: {e}")

        # MySQL에 저장
        if records:
            save_to_mysql(records)

        await browser.close()

# 실행
asyncio.run(scrape_vms())
