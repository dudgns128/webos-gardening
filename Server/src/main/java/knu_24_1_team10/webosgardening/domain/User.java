package knu_24_1_team10.webosgardening.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {
  public User(String name, String gender, String username, LocalDate birthdate) {
    this.name = name;
    this.gender = gender;
    this.username = username;
    this.birthdate = birthdate;
    this.email = null;
    this.password = null;
  }

  public User(String name, String gender, String username, LocalDate birthdate, String email, String password) {
    this.name = name;
    this.gender = gender;
    this.username = username;
    this.birthdate = birthdate;
    this.email = email;
    this.password = password;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "name", nullable = false, length = 20)
  private String name;

  @Column(name = "gender", nullable = false, length = 6)
  private String gender;

  @Column(name = "username", nullable = false, length = 20)
  private String username;

  @Column(name = "birthdate", nullable = false)
  private LocalDate birthdate;

  @Column(name = "email", nullable = true, length = 50)
  private String email;

  @Column(name = "password", nullable = true, length = 20)
  private String password;

  // Getters
  public Long getId() {
		return this.id;
	}

  public String getName() {
		return this.name;
	}

  public String getGender() {
		return this.gender;
	}

  public String getUsername() {
		return this.username;
	}

  public LocalDate getBirthdate() {
		return this.birthdate;
	}

  public String getEmail() {
		return this.email;
	}

  public String getPassword() {
		return this.password;
	}
}
