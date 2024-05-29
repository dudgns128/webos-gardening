package knu_24_1_team10.webosgardening.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
public class User {

    public User() {
    }

    public User(String email, String password, String name, String nickname, boolean gender, String birth) {
    this.email = email;
    this.password = password;
    this.name=name;
    this.nickname=nickname;
    this.gender=gender;
    this.birth=birth;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;



    @Column(name = "email", unique=true, nullable = false, length = 50)
    private String email;

    @Column(name = "password", nullable = true, length = 20)
    private String password;

    @Column(name = "name", nullable = true, length = 20)
    private String name;


    @Column(name = "nickname", nullable = true, length = 20)
    private String nickname;


    @Column(name = "gender", nullable = false)
    private boolean gender;


    @Column(name = "birth", nullable = true, length = 20)
    private String birth;


    public Long getId() {
        return id;
    }

    public String getBirth() {
        return birth;
    }

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }

    public String getPassword() {
        return password;
    }
    public String getName() {
        return name;
    }



}
