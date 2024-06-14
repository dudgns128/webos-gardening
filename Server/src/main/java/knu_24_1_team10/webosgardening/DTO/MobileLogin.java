package knu_24_1_team10.webosgardening.DTO;

import knu_24_1_team10.webosgardening.domain.UserPlant;

import java.util.List;

public class MobileLogin extends Mainserver{
    String email;
    String password;

    List<UserPlant> plants;

    public List<UserPlant> getPlants() {
        return plants;
    }

    public void setPlants(List<UserPlant> plants) {
        this.plants = plants;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public MobileLogin(int method, Long userplant_id, String email, String password, List<UserPlant> plants) {
        super(method, userplant_id);
        this.email = email;
        this.password = password;
        this.plants=plants;

    }
}