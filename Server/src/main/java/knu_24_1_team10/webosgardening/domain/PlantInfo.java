package knu_24_1_team10.webosgardening.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "plant_info")
public class PlantInfo {
  // constructor for test
  public PlantInfo(PlantImage plantImage, PlantEnvironment plantEnvironment, String scientificName, String shortDescription, int maxLevel) {
    this.plantImage = plantImage;
    this.plantEnvironment = plantEnvironment;
    this.scientificName = scientificName;
    this.shortDescription = shortDescription;
    this.maxLevel = maxLevel;
  }

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
  public Long getId(){
    return this.id;
  }
  
  public PlantImage getPlantImage() {
    return this.plantImage;
  }

  public PlantEnvironment getPlantEnvironment() {
    return this.plantEnvironment;
  }

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
