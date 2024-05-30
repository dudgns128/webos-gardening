//package knu_24_1_team10.webosgardening.controller;
//
//import jakarta.transaction.Transactional;
//import knu_24_1_team10.webosgardening.domain.PlantInfo;
//import knu_24_1_team10.webosgardening.domain.User;
//import knu_24_1_team10.webosgardening.domain.UserPlant;
//import knu_24_1_team10.webosgardening.repository.PlantImageRepository;
//import knu_24_1_team10.webosgardening.repository.PlantInfoRepository;
//import knu_24_1_team10.webosgardening.repository.UserPlantRepository;
//import knu_24_1_team10.webosgardening.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.time.LocalDate;
//import java.util.Optional;
//
//
//@Controller
//@Transactional
//public class MyWebSocketHandler extends TextWebSocketHandler {
//
//    @Autowired
//    UserRepository userRepository; // JPA Repositor;
//
//    @Autowired
//    UserPlantRepository userplantRepository;
//
//    @Autowired
//    PlantInfoRepository plantinfoRepository;
//
//    @Autowired
//    PlantImageRepository plantimageRepository;
//
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String clientMessage = message.getPayload();
//        System.out.println("Received message: " + clientMessage);
//        session.sendMessage(new TextMessage("Echo: " + clientMessage));
//
//        String[] info = clientMessage.split(" "); //메시지를 공백 구분으로 파싱 ( 메시지 정보 형태를 공백으로 받아야됨 )
//
//
//        // 회원 정보 저장
//        if (info[0].equals("0"))
//        {
//
//            User member = new User(info[1],info[2]);
//            member = userRepository.save(member);
//        }
//        //식물 정보 저장
//        else if (info[0].equals("1"))
//        {
//            Long id = Long.valueOf(info[1]);
//            Optional<User> member = userRepository.findById(id);
//            User user=member.get();
//
//            Long plantid=Long.valueOf(info[2]);
//            Optional<PlantInfo> plantinfo=plantinfoRepository.findById(plantid);
//            PlantInfo plant=plantinfo.get();
//
//            LocalDate localDate = LocalDate.parse(info[4]);
//
//            boolean bool = Boolean.valueOf(info[5]);
//
//            int k = Integer.valueOf(info[6]);
//
//
//            UserPlant userplant = new UserPlant(user,plant,info[3],localDate,bool,k);
//
//            userplantRepository.save(userplant);
//
//        }
//
//        else if (info[0].equals("2")){
//
//        }
//    }
//}