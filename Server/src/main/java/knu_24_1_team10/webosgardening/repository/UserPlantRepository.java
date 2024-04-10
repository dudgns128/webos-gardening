package knu_24_1_team10.webosgardening.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.UserPlant;

@Repository
public class UserPlantRepository {
  private final EntityManager em;

  public UserPlantRepository(EntityManager em) {
    this.em = em;
  }

  public boolean save(UserPlant userPlant) {
    try {
      em.persist(userPlant);
    } catch(Exception e) {
      return false;
    }
    return true;
  }

  public Optional<UserPlant> findById(Long id) {
    return Optional.ofNullable(em.find(UserPlant.class, id));
  }
}
