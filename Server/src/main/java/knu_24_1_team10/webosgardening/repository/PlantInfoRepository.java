package knu_24_1_team10.webosgardening.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.PlantInfo;

@Repository
public interface PlantInfoRepository extends JpaRepository<PlantInfo,Long> {


}
