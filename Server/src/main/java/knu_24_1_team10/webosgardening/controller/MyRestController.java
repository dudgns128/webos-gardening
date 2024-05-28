package knu_24_1_team10.webosgardening.controller;

import knu_24_1_team10.webosgardening.domain.PlantInfo;
import knu_24_1_team10.webosgardening.domain.User;
import knu_24_1_team10.webosgardening.domain.UserPlant;
import knu_24_1_team10.webosgardening.repository.PlantInfoRepository;
import knu_24_1_team10.webosgardening.repository.UserPlantRepository;
import knu_24_1_team10.webosgardening.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MyRestController {

    @Autowired
    private UserRepository userRepository;  // UserRepository 클래스가 필요합니다.

    @Autowired
    UserPlantRepository userPlantRepository;

    @Autowired
    private PlantInfoRepository plantInfoRepository;  // PlantInfoRepository 클래스가 필요합니다.

    // 클라이언트로부터 회원가입 정보를 받아 디비에 등록하는 기능
    @PostMapping("/user")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        System.out.println(user.getName());

        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }
    @PostMapping("/userplant")
    public ResponseEntity<String> registerUserPlant(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam Long plantInfoId,
            @RequestParam String name,
            @RequestParam String birthDate,
            @RequestParam boolean isAutoControl,
            @RequestParam int level
    ) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (password.equals(user.getPassword())){
            return new ResponseEntity<>("User or PlantInfo not found",HttpStatus.BAD_REQUEST);
        }



        PlantInfo plantInfo = plantInfoRepository.findById(plantInfoId).orElse(null);

        if (user == null || plantInfo == null) {
            return new ResponseEntity<>("User or PlantInfo not found", HttpStatus.NOT_FOUND);
        }


        UserPlant userPlant = new UserPlant(user, plantInfo, name, birthDate, isAutoControl, level);
        userPlantRepository.save(userPlant);

        return new ResponseEntity<>("UserPlant registered successfully", HttpStatus.CREATED);
    }

    // 클라이언트에게 모든 식물 정보를 조회하여 보내는 기능
    @GetMapping("/plantinfo")
    public ResponseEntity<List<PlantInfo>> getAllPlantInfo() {
        List<PlantInfo> plantInfoList = plantInfoRepository.findAll();
        return new ResponseEntity<>(plantInfoList, HttpStatus.OK);
    }
}

