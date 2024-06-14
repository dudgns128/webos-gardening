package knu_24_1_team10.webosgardening.DTO;

public class AutoControl extends Mainserver {
    boolean isAutoControl;

    public boolean isAutoControl() {
        return isAutoControl;
    }

    public void setAutoControl(boolean autoControl) {
        isAutoControl = autoControl;
    }

    public AutoControl(int method, long userplantId, boolean isAutoControl) {
        super(method,userplantId);
        this.isAutoControl=isAutoControl;
    }
}
