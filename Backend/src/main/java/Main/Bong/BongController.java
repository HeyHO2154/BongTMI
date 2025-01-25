package Main.Bong;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/bong")
public class BongController {

    @Autowired
    private BongService bongService;
 
    @GetMapping("/random")
    public Bong getRandomBong() {
        return bongService.getRandomBong();
    }
    
    @GetMapping("/image/{bongName}/{imageIndex}")
    public ResponseEntity<Resource> getImage(
            @PathVariable String bongName,
            @PathVariable int imageIndex
    ) {
        try {
            // 이미지 경로 설정
            String basePath = "C:\\Users\\PRO\\Desktop\\GitDesktop\\BongTMI\\DB\\Image";
            String fileName = "Image_" + imageIndex + ".jpg"; // 또는 .png
            Path imagePath = Paths.get(basePath, bongName, fileName);

            // 이미지 리소스를 로드
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                // 이미지 파일을 ResponseEntity로 반환
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // PNG라면 MediaType.IMAGE_PNG
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
