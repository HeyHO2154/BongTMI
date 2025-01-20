package Main.DTO;

import com.microsoft.playwright.*;
import org.springframework.stereotype.Service;

@Service
public class BongService {

    public void scrapeAndSaveVolunteerData() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            try {
                // 사이트 접속
                page.navigate("https://example-volunteer-site.com");

                // DOM 요소 선택 및 데이터 가져오기
                ElementHandle element = page.querySelector("div.announcement");
                if (element != null) {
                    String announcement = element.textContent();
                    System.out.println("Announcement: " + announcement);

                    // 데이터 저장 로직 (예시)
                    saveAnnouncementToDatabase(announcement);
                } else {
                    System.err.println("No announcement found on the page.");
                }

            } catch (PlaywrightException e) {
                System.err.println("Playwright error during scraping: " + e.getMessage());
                e.printStackTrace();
            } finally {
                context.close();
                browser.close();
            }

        } catch (Exception e) {
            System.err.println("Error initializing Playwright: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void saveAnnouncementToDatabase(String announcement) {
        // 데이터베이스 저장 로직
        System.out.println("Saving announcement to database: " + announcement);
    }
}
