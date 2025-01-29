package Main.Bong;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BongService {

    @Autowired
    private BongRepository bongRepository;

    public Bong getRandomBong() {
        Bong bong = bongRepository.findRandomBong();
        if (bong == null) {
            throw new RuntimeException("랜덤으로 선택된 공고가 없습니다.");
        }

        return bong;
    }

	public ResponseEntity<Bong> getInfoBong(String progrmRegistNo) {
		Optional<Bong> bong = bongRepository.findById(progrmRegistNo);
        if (bong.isPresent()) {
            return ResponseEntity.ok(bong.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
	}
	
    public Bong saveBong(Bong bongDto) {
        Bong bong = new Bong();
        bong.setProgrmRegistNo(bongDto.getProgrmRegistNo());
        bong.setProgrmSj(bongDto.getProgrmSj());
        bong.setProgrmSttusSe(bongDto.getProgrmSttusSe());
        bong.setProgrmBgnde(bongDto.getProgrmBgnde());
        bong.setProgrmEndde(bongDto.getProgrmEndde());
        bong.setActBeginTm(bongDto.getActBeginTm());
        bong.setActEndTm(bongDto.getActEndTm());
        bong.setNoticeBgnde(bongDto.getNoticeBgnde());
        bong.setNoticeEndde(bongDto.getNoticeEndde());
        bong.setRcritNmpr(bongDto.getRcritNmpr());
        bong.setActWkdy(bongDto.getActWkdy());
        bong.setSrvcClCode(bongDto.getSrvcClCode());
        bong.setAdultPosblAt(bongDto.getAdultPosblAt());
        bong.setYngbgsPosblAt(bongDto.getYngbgsPosblAt());
        bong.setGrpPosblAt(bongDto.getGrpPosblAt());
        bong.setMnnstNm(bongDto.getMnnstNm());
        bong.setNanmmbyNm(bongDto.getNanmmbyNm());
        bong.setActPlace(bongDto.getActPlace());
        bong.setNanmmbyNmAdmn(bongDto.getNanmmbyNmAdmn());
        bong.setTelno(bongDto.getTelno());
        bong.setFxnum(bongDto.getFxnum());
        bong.setPostAdres(bongDto.getPostAdres());
        bong.setEmail(bongDto.getEmail());
        bong.setProgrmCn(bongDto.getProgrmCn());
        bong.setSidoCd(bongDto.getSidoCd());
        bong.setGugunCd(bongDto.getGugunCd());
        return bongRepository.save(bong);
    }
}

