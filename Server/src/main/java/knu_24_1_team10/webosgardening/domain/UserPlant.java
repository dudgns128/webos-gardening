package knu_24_1_team10.webosgardening.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_plant")
public class UserPlant {
  public UserPlant(User user, PlantInfo plantInfo, String name, LocalDate birthdate, boolean isAutoControl, int level)
  {
    this.user = user;
    this.plantInfo = plantInfo;
    this.name = name;
    this.birthdate = birthdate;
    this.isAutoControl = isAutoControl;
    this.level = level;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(optional = true)
  @JoinColumn(name = "plant_info_id", nullable = false)
  private PlantInfo plantInfo;

  @Column(name = "name", nullable = false, length = 20)
  private String name;

  @Column(name = "birthdate", nullable = false)
  private LocalDate birthdate;

  @Column(name = "is_auto_control", nullable = false)
  private boolean isAutoControl;

  @Column(name = "level", nullable = false)
  private int level;

  // Getters
  public Long getId() {
    return this.id;
  }

  public User getUser() {
    return this.user;
  }

  public PlantInfo getPlantInfo() {
    return this.plantInfo;
  }

  public String getName() {
    return this.name;
  }

  public LocalDate getBirthDate() {
    return this.birthdate;
  }

  public boolean getIsAutoControl() {
    return this.isAutoControl;
  }

  public int getLevel() {
    return this.level;
  }
}
