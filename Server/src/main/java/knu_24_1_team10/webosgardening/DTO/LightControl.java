package knu_24_1_team10.webosgardening.DTO;

public class LightControl extends Mainserver{
    private int light;

    public int getLight() {
        return light;
    }

    public void setLight(int light) {
        this.light = light;
    }

    public LightControl(int method, Long userplant_id, int light) {
        super(method, userplant_id);
        this.light=light;

    }
}
