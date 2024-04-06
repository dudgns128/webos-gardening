package knu_24_1_team10.domain;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public class PlantInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @OneToOne
  @JoinColumn(name = "plant_image_id", nullable = false)
  private PlantImage plantImage;

  @OneToOne
  @JoinColumn(name = "plant_environment_id", nullable = false)
  private PlantEnvironment plantEnvironment;

  @Column(name = "scientific_name", nullable = false, length = 50)
  private String scientificName;

  @Column(name = "short_description", nullable = false, length = 250)
  private String shortDescription;

  @Column(name = "max_level", nullable = false)
  private int maxLevel;

  // Getters
  public String getScientificName() {
		return this.scientificName;
	}

  public String getShortDescription() {
		return this.shortDescription;
	}

  public int getMaxLevel() {
		return this.maxLevel;
	}
}
