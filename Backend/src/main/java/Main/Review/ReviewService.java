package Main.Review;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import com.microsoft.playwright.*;

@Service
public class ReviewService {

    public List<String> scrapeReviews() {
        List<String> reviews = new ArrayList<>();

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false)); // headless 모드 해제하여 디버깅 가능
            Page page = browser.newPage();

            // User-Agent 변경 (크롤링 차단 방지)

            // 네이버 검색 페이지 이동
            page.navigate("https://search.naver.com/search.naver?query=봉사 후기");

            // 블로그 결과가 로드될 때까지 대기 (최대 5초)
            page.waitForSelector("div.total_area > a[href*='blog.naver.com']", new Page.WaitForSelectorOptions().setTimeout(5000));

            // 네이버 블로그 후기만 가져오기
            List<ElementHandle> elements = page.querySelectorAll("div.total_area > a[href*='blog.naver.com']");

            for (ElementHandle element : elements) {
                String title = element.innerText();
                String link = element.getAttribute("href"); // 블로그 링크 가져오기
                reviews.add(title + " - " + link); // 제목 + 링크 조합
            }

            browser.close();
        } catch (Exception e) {
            e.printStackTrace(); // 오류 발생 시 로그 출력
        }

        return reviews;
    }
}
