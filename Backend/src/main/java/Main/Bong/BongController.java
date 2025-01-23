package Main.Bong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Main.Bong.DTO.Bong;

@RestController
@RequestMapping("/api/bong")
public class BongController {

    @Autowired
    private BongService bongService;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/random")
    public Bong getRandomBong() {
        return bongService.getRandomBong();
    }
}
