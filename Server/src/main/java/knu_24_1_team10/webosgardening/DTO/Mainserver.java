package knu_24_1_team10.webosgardening.DTO;

public class Mainserver {
    int method;
    Long userplant_id;

    public int getMethod() {
        return method;
    }

    public void setMethod(int method) {
        this.method = method;
    }

    public Long getUserplant_id() {
        return userplant_id;
    }

    public void setUserplant_id(Long userplant_id) {
        this.userplant_id = userplant_id;
    }

    public Mainserver(int method, Long userplant_id) {
        this.method = method;
        this.userplant_id = userplant_id;
    }
}
