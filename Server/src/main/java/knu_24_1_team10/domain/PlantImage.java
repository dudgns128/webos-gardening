package knu_24_1_team10.domain;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class PlantImage {
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
