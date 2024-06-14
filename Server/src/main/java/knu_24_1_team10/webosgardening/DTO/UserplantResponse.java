package knu_24_1_team10.webosgardening.DTO;



public class UserplantResponse {
    String message;
    Long id;

    public UserplantResponse(String message, Long id) {
        this.message = message;
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public Long getId() {
        return id;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
