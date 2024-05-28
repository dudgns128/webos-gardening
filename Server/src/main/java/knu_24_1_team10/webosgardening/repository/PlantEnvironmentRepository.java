package knu_24_1_team10.webosgardening.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.PlantEnvironment;

@Repository
public class PlantEnvironmentRepository {
  private final EntityManager em;

  public PlantEnvironmentRepository(EntityManager em) {
    this.em = em;
  }

  public Optional<PlantEnvironment> findById(Long id) {
    return Optional.ofNullable(em.find(PlantEnvironment.class, id));
  }


}
