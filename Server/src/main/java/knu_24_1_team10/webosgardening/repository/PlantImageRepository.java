package knu_24_1_team10.webosgardening.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.PlantImage;

@Repository
public class PlantImageRepository {
  private final EntityManager em;

  public PlantImageRepository(EntityManager em) {
    this.em = em;
  }

  public Optional<PlantImage> findById(Long id) {
    return Optional.ofNullable(em.find(PlantImage.class, id));
  }
}
