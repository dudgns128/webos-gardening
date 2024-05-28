package knu_24_1_team10.webosgardening.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.User;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class UserRepository {
  private final EntityManager em;

  public UserRepository(EntityManager em) {
    this.em = em;
  }

  public User save(User user) {
    em.persist(user);
    return user;
  }

  public Optional<User> findById(Long id) {
    return Optional.ofNullable(em.find(User.class, id));
  }

  public Optional<User> findByEmail(String email) {
    List<User> users = em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
            .setParameter("email", email)
            .getResultList();
    return users.stream().findFirst();
  }



}
