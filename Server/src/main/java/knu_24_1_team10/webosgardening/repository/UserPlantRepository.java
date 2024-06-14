package knu_24_1_team10.webosgardening.repository;

import java.util.List;
import java.util.Optional;

import knu_24_1_team10.webosgardening.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import knu_24_1_team10.webosgardening.domain.UserPlant;

@Repository
public interface UserPlantRepository extends JpaRepository<UserPlant, Long> {

    List<UserPlant> findByUser(User user);


}
