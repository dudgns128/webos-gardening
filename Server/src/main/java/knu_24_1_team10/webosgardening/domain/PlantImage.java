package knu_24_1_team10.webosgardening.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "plant_image")
public class PlantImage {
  // constructor for test
  public PlantImage(String happyImageUrl, String sadImageUrl, String angryImageUrl,
                    String underWaterImageUrl, String overWaterImageUrl, String underLightImageUrl,
                    String overLightImageUrl, String underTemperatureImageUrl, String overTemperatureImageUrl,
                    String underHumidityImageUrl, String overHumidityImageUrl) {
                      this.happyImageUrl = happyImageUrl;
                      this.sadImageUrl = sadImageUrl;
                      this.angryImageUrl = angryImageUrl;
                      this.underWaterImageUrl = underWaterImageUrl;
                      this.overWaterImageUrl = overWaterImageUrl;
                      this.underLightImageUrl = underLightImageUrl;
                      this.overLightImageUrl = overLightImageUrl;
                      this.underTemperatureImageUrl = underTemperatureImageUrl;
                      this.overTemperatureImageUrl = overTemperatureImageUrl;
                      this.underHumidityImageUrl = underHumidityImageUrl;
                      this.overHumidityImageUrl = overHumidityImageUrl;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "happy_image_url", nullable = false, length = 300)
  private String happyImageUrl;

  @Column(name = "sad_image_url", nullable = false, length = 300)
  private String sadImageUrl;

  @Column(name = "angry_image_url", nullable = false, length = 300)
  private String angryImageUrl;

  @Column(name = "under_water_image_url", nullable = false, length = 300)
  private String underWaterImageUrl;

  @Column(name = "over_water_image_url", nullable = false, length = 300)
  private String overWaterImageUrl;

  @Column(name = "under_light_image_url", nullable = false, length = 300)
  private String underLightImageUrl;

  @Column(name = "over_light_image_url", nullable = false, length = 300)
  private String overLightImageUrl;

  @Column(name = "under_temperature_image_url", nullable = false, length = 300)
  private String underTemperatureImageUrl;

  @Column(name = "over_temperature_image_url", nullable = false, length = 300)
  private String overTemperatureImageUrl;

  @Column(name = "under_humidity_image_url", nullable = false, length = 300)
  private String underHumidityImageUrl;

  @Column(name = "over_humidity_image_url", nullable = false, length = 300)
  private String overHumidityImageUrl;

  // Getters
  public Long getId() {
    return this.id;
  }

  public String getHappyImageUrl() {
		return this.happyImageUrl;
	}

  public String getSadImageUrl() {
		return this.sadImageUrl;
	}

  public String getAngryImageUrl() {
		return this.angryImageUrl;
	}

  public String getUnderWaterImageUrl() {
		return this.underWaterImageUrl;
	}
  public String getOverWaterImageUrl() {
		return this.overWaterImageUrl;
	}

  public String getUnderLightImageUrl() {
		return this.underLightImageUrl;
	}
  public String getOverLightImageUrl() {
		return this.overLightImageUrl;
	}

  public String getUnderTemperatureImageUrl() {
		return this.underTemperatureImageUrl;
	}
  public String getOverTemperatureImageUrl() {
		return this.overTemperatureImageUrl;
	}

  public String getUnderHumidityImageUrl() {
		return this.underHumidityImageUrl;
	}
  public String getOverHumidityImageUrl() {
		return this.overHumidityImageUrl;
	}
}
