package knu_24_1_team10.webosgardening.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.PlantInfo;

@Repository
public class PlantInfoRepository {
  private final EntityManager em;

  public PlantInfoRepository(EntityManager em) {
    this.em = em;
  }

  public Optional<PlantInfo> findById(Long id) {
    return Optional.ofNullable(em.find(PlantInfo.class, id));
  }

  public List<PlantInfo> findAll() {

      return null;
  }

}
