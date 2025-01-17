from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 웹페이지 접속
    page.goto("https://www.1365.go.kr/vols/1572247904127/partcptn/timeCptn.do")
    page.wait_for_timeout(5000)  # 페이지 로드 대기

    # 봉사활동 리스트 추출
    items = page.locator("li > a.list")
    count = items.count()
    
    for i in range(count):
        item = items.nth(i)
        
        # 데이터 추출
        title = item.locator(".tit_board_list").inner_text()
        모집기간 = item.locator("dt:has-text('[모집기간]') + dd").inner_text()
        봉사기간 = item.locator("dt:has-text('[봉사기간]') + dd").inner_text()
        봉사시간 = item.locator("dt:has-text('[봉사시간]') + dd").inner_text()
        등록기관 = item.locator("dt:has-text('[등록기관]') + dd").inner_text()
        모집기관 = item.locator("dt:has-text('[모집기관]') + dd").inner_text()
        인정시간 = item.locator("dt:has-text('[인정시간]') + dd").inner_text()
        
        # 출력
        print(f"제목: {title}")
        print(f"모집기간: {모집기간}")
        print(f"봉사기간: {봉사기간}")
        print(f"봉사시간: {봉사시간}")
        print(f"등록기관: {등록기관}")
        print(f"모집기관: {모집기관}")
        print(f"인정시간: {인정시간}")
        print("-" * 30)
    
    browser.close()
