package knu_24_1_team10.domain;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class PlantEnvironment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "proper_water_value", nullable = false)
  private float properWaterValue;

  @Column(name = "proper_water_range", nullable = false)
  private float properWaterRange;

  @Column(name = "proper_light_value", nullable = false)
  private float properLightValue;

  @Column(name = "proper_light_range", nullable = false)
  private float properLightRange;

  @Column(name = "proper_temperature_value", nullable = false)
  private float properTemperatureValue;

  @Column(name = "proper_temperature_range", nullable = false)
  private float properTemperatureRange;

  @Column(name = "proper_humidity_value", nullable = false)
  private float properHumidityValue;

  @Column(name = "proper_humidity_range", nullable = false)
  private float properHumidityRange;

  // Getters
  public float getProperWaterValue() {
		return this.properWaterValue;
	}

  public float getProperWaterRange() {
		return this.properWaterRange;
	}

  public float getProperLightValue() {
		return this.properLightValue;
	}

  public float getProperLightRange() {
		return this.properLightRange;
	}

  public float getProperTemperatureValue() {
		return this.properTemperatureValue;
	}

  public float getProperTemperatureRange() {
		return this.properTemperatureRange;
	}

  public float getProperHumidityValue() {
		return this.properHumidityValue;
	}

  public float getProperHumidityRange() {
		return this.properHumidityRange;
	}
}
