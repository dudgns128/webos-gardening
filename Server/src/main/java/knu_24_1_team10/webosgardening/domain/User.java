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
  public User(String email, String password) {
    this.email = email;
    this.password = password;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "email", nullable = true, length = 50)
  private String email;

  @Column(name = "password", nullable = true, length = 20)
  private String password;

  // Getters
  public Long getId() {
		return this.id;
	}

  public String getEmail() {
		return this.email;
	}

  public String getPassword() {
		return this.password;
	}
}
