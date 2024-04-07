package knu_24_1_team10.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class UserPlant {
  public UserPlant(User user, PlantInfo plantInfo, String name, LocalDate birthdate, boolean isAutoControl, int level) {
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
}
