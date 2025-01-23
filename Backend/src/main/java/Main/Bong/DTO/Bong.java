package Main.Bong.DTO;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Bong {

    @Id
    private String progrmRegistNo;

    private String progrmSj;
    private String nanmmbyNm;
    private Date progrmBgnde;
    private Date progrmEndde;
    private int progrmSttusSe;
    private String actPlace;
    private String telno;
    private String email;
    private String progrmCn;

    // Getters and Setters
    public String getProgrmRegistNo() {
        return progrmRegistNo;
    }

    public void setProgrmRegistNo(String progrmRegistNo) {
        this.progrmRegistNo = progrmRegistNo;
    }

    public String getProgrmSj() {
        return progrmSj;
    }

    public void setProgrmSj(String progrmSj) {
        this.progrmSj = progrmSj;
    }

    public String getNanmmbyNm() {
        return nanmmbyNm;
    }

    public void setNanmmbyNm(String nanmmbyNm) {
        this.nanmmbyNm = nanmmbyNm;
    }

    public Date getProgrmBgnde() {
        return progrmBgnde;
    }

    public void setProgrmBgnde(Date progrmBgnde) {
        this.progrmBgnde = progrmBgnde;
    }

    public Date getProgrmEndde() {
        return progrmEndde;
    }

    public void setProgrmEndde(Date progrmEndde) {
        this.progrmEndde = progrmEndde;
    }

    public int getProgrmSttusSe() {
        return progrmSttusSe;
    }

    public void setProgrmSttusSe(int progrmSttusSe) {
        this.progrmSttusSe = progrmSttusSe;
    }

    public String getActPlace() {
        return actPlace;
    }

    public void setActPlace(String actPlace) {
        this.actPlace = actPlace;
    }

    public String getTelno() {
        return telno;
    }

    public void setTelno(String telno) {
        this.telno = telno;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProgrmCn() {
        return progrmCn;
    }

    public void setProgrmCn(String progrmCn) {
        this.progrmCn = progrmCn;
    }
}
