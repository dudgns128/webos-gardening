package knu_24_1_team10.webosgardening.DTO;

public class SensingData extends Mainserver{

    String plantName;
    Double satisfaction;
    int level;
    Double exp;

    String imageUrl;
    Double water;
    Double light;
    Double temperature;
    Double humidity;

    public String getPlantName() {
        return plantName;
    }

    public void setPlantName(String plantName) {
        this.plantName = plantName;
    }

    public Double getSatisfaction() {
        return satisfaction;
    }

    public void setSatisfaction(Double satisfaction) {
        this.satisfaction = satisfaction;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public Double getExp() {
        return exp;
    }

    public void setExp(Double exp) {
        this.exp = exp;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getWater() {
        return water;
    }

    public void setWater(Double water) {
        this.water = water;
    }

    public Double getLight() {
        return light;
    }

    public void setLight(Double light) {
        this.light = light;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public SensingData(int method, Long userplant_id, String plantName, Double satisfaction, int level, Double exp, String imageUrl, Double water, Double light, Double temperature, Double humidity) {
        super(method, userplant_id);
        this.plantName = plantName;
        this.satisfaction = satisfaction;
        this.level = level;
        this.exp = exp;
        this.imageUrl = imageUrl;
        this.water = water;
        this.light = light;
        this.temperature = temperature;
        this.humidity = humidity;
    }
}
