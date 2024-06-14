package knu_24_1_team10.webosgardening.controller;
import org.springframework.web.socket.WebSocketSession;

public class CustomWebSocketSession {
    private final WebSocketSession session;

    private Long userplant_id;

    private boolean JSnum;

    public CustomWebSocketSession(WebSocketSession session, Long userplant_id, boolean JSnum) {
        this.session = session;
        this.userplant_id = userplant_id;
        this.JSnum = JSnum;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public Long getUserplant_id() {
        return userplant_id;
    }

    public void setUserplant_id(Long userplant_id) {
        this.userplant_id = userplant_id;
    }

    public boolean isJSnum() {
        return JSnum;
    }

    public void setJSnum(boolean JSnum) {
        this.JSnum = JSnum;
    }
}
