package knu_24_1_team10.webosgardening.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "plant_environment")
public class PlantEnvironment {
  // constructor for test
  public PlantEnvironment(float properWaterValue, float properWaterRange, float properLightValue,
                          float properLightRange, float properTemperatureValue, float properTemperatureRange,
                          float properHumidityValue, float properHumidityRange) {
                            this.properWaterValue = properWaterValue;
                            this.properWaterRange = properWaterRange;
                            this.properLightValue = properLightValue;
                            this.properLightRange = properLightRange;
                            this.properTemperatureValue = properTemperatureValue;
                            this.properTemperatureRange = properTemperatureRange;
                            this.properHumidityValue = properHumidityValue;
                            this.properHumidityRange = properHumidityRange;
  }

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
  public Long getId() {
    return this.id;
  }

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
