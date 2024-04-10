package knu_24_1_team10.webosgardening;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import knu_24_1_team10.webosgardening.domain.PlantEnvironment;
import knu_24_1_team10.webosgardening.domain.PlantImage;
import knu_24_1_team10.webosgardening.domain.PlantInfo;
import knu_24_1_team10.webosgardening.domain.User;
import knu_24_1_team10.webosgardening.domain.UserPlant;
import knu_24_1_team10.webosgardening.repository.PlantEnvironmentRepository;
import knu_24_1_team10.webosgardening.repository.PlantImageRepository;
import knu_24_1_team10.webosgardening.repository.PlantInfoRepository;
import knu_24_1_team10.webosgardening.repository.UserPlantRepository;
import knu_24_1_team10.webosgardening.repository.UserRepository;

// Mysql Repository 코드 짠거 잘 돌아가는지 그냥 간단하게 테스트..

@SpringBootTest
@Transactional
class simpleMysqlTest {

	// PlantInfo, PlantImage, PlantEnvironment는 우리가 직접 데이터를 구해서 넣어야해서 별도의 save로직이 없으므로 테스트를 위해 EntityManager 사용
	@Autowired EntityManager testEm;
  @Autowired UserRepository userRepository;
  @Autowired UserPlantRepository userPlantRepository;
	@Autowired PlantInfoRepository plantInfoRepository;
	@Autowired PlantImageRepository plantImageRepository;
	@Autowired PlantEnvironmentRepository plantEnvironmentRepository;


	@Test
	public void userInsert() {
		User user = new User("parkJH", "male", "hwani", LocalDate.now());
		User insertedUser = userRepository.save(user);

		Optional<User> findUser_Optional = userRepository.findById(insertedUser.getId());
		User findUser = findUser_Optional.get();
		assertEquals(user.getUsername(), findUser.getUsername());
	}

	@Test
	public void userPlantInsert() {
		PlantImage samplePlantImage = new PlantImage("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11");
		PlantEnvironment samplePlantEnvironment = new PlantEnvironment(1, 21, 2, 3, 4, 5, 10, 8);
		PlantInfo samplePlantInfo = new PlantInfo(samplePlantImage, samplePlantEnvironment, "scHwani", "It is very tall", 100);
		User user = new User("parkJH", "male", "hwani", LocalDate.now());
		User insertedUser = userRepository.save(user);
		testEm.persist(samplePlantImage);
		testEm.persist(samplePlantEnvironment);
		testEm.persist(samplePlantInfo);
		UserPlant sampleUserPlant = new UserPlant(insertedUser, samplePlantInfo, "myFirstPlant", LocalDate.now(), false, 1);
		userPlantRepository.save(sampleUserPlant);

		assertEquals(sampleUserPlant.getPlantInfo().getScientificName(), "scHwani");

		PlantEnvironment findPlantEnvironment = plantEnvironmentRepository.findById(samplePlantEnvironment.getId()).get();
		assertEquals(findPlantEnvironment.getProperHumidityValue(), samplePlantEnvironment.getProperHumidityValue());
	}
}