package knu_24_1_team10.webosgardening.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import knu_24_1_team10.webosgardening.DTO.*;
import knu_24_1_team10.webosgardening.domain.*;
import knu_24_1_team10.webosgardening.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;


@Controller
@Transactional
public class MyWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    UserRepository userRepository; // JPA Repositor;

    @Autowired
    UserPlantRepository userplantRepository;

    @Autowired
    PlantInfoRepository plantinfoRepository;

    @Autowired
    PlantImageRepository plantimageRepository;


    @Autowired
    InfluxDBRepository influxDBrepository;


    private final CopyOnWriteArrayList<CustomWebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 예시: 연결 시 초기 데이터를 설정
        Long userplantId = 0L; // 실제 데이터로 교체
        boolean jsNum = true;    // 실제 데이터로 교체

        CustomWebSocketSession customSession = new CustomWebSocketSession(session, userplantId, jsNum);
        sessions.add(customSession);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        for (CustomWebSocketSession customSession : sessions) {
            System.out.println(customSession.getUserplant_id());

        }
        sessions.removeIf(customSession -> customSession.getSession().getId().equals(session.getId()));


        for (CustomWebSocketSession customSession : sessions) {
            System.out.println(customSession.getUserplant_id());



        }
    }



    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String clientMessage = message.getPayload();
        System.out.println("Received message: " + clientMessage);



        // JSON 형식으로 파
        JsonNode jsonMap = objectMapper.readTree(clientMessage);
        JsonNode dataNode= jsonMap.get("data");
        int method=jsonMap.get("method").asInt();
        long userplantId=jsonMap.get("userPlant").asLong();


        //커스텀 웹소켓 세션 초기화 부분 작성

        //JS service and Mobile websocket connection
        if (method==30)
        {
            System.out.println("success");
            for (CustomWebSocketSession customSession : sessions) {
                if (customSession.getSession().getId().equals(session.getId())) {
                    customSession.setUserplant_id(userplantId);
                    customSession.setJSnum(dataNode.get("JSnum").asBoolean());

                    System.out.println(customSession.isJSnum());
                    System.out.println(customSession.getUserplant_id());


                    break;
                }
            }

        }






        else if (method==0) {


            String plantname = dataNode.get("plantName").asText();
            double water = dataNode.get("water").asDouble();
            double light = dataNode.get("light").asDouble();
            double temperature = dataNode.get("temperature").asDouble();
            double humidity = dataNode.get("humidity").asDouble();
            double satisfaction = dataNode.get("satisfaction").asInt();
            int level = dataNode.get("level").asInt();
            double exp = dataNode.get("exp").asInt();
            String imageUrl = dataNode.get("imageUrl").asText();




            UserPlant userplant=userplantRepository.findById(userplantId).orElse(null);


            influxDBrepository.saveHumidityValue(userplant.getUser().getId(),userplantId, (float) humidity,System.currentTimeMillis() / 1000L);
            influxDBrepository.saveTemperatureValue(userplant.getUser().getId(),userplantId, (float) temperature,System.currentTimeMillis() / 1000L);
            influxDBrepository.saveLightValue(userplant.getUser().getId(),userplantId, (float) light,System.currentTimeMillis() / 1000L);
            influxDBrepository.saveWaterValue(userplant.getUser().getId(),userplantId, (float) water,System.currentTimeMillis() / 1000L);


            String jsonResponse=objectMapper.writeValueAsString(new SensingData(13,userplantId,plantname,satisfaction,level,exp,imageUrl,water,light,temperature,humidity));

            for (CustomWebSocketSession customSession : sessions) {

                if (customSession.getUserplant_id().equals(userplantId)&&!customSession.isJSnum()) {

                    customSession.getSession().sendMessage(new TextMessage(jsonResponse));

                    break;
                }
            }

        }
            //모바일 웹 페이지 로그인
        else if (method==10) {

            String email = dataNode.get("email").asText();
            String password = dataNode.get("password").asText();


            User user = userRepository.findByEmail(email).orElse(null);
            System.out.println(password);
            System.out.println(user.getPassword());





            //password 불일치
            if (!password.equals(user.getPassword())) {
                System.out.println("비밀번호 불일치");
                return;
            }

            System.out.println(user.getName());


            List<UserPlant> allById = userplantRepository.findByUser(user);




            MobileLogin mobilelogin = new MobileLogin(11,userplantId,email,password,allById);


            String jsonResponse= objectMapper.writeValueAsString(mobilelogin);

            session.sendMessage(new TextMessage(jsonResponse));



        }


            //Web Page 메인페이지에 필요한 데이터를 보낸다. 이 때 모바일 세션 연결의 커스텀 세션 초기화
        else if (method==12) {

            Long selected_plant_id = dataNode.get("selectedPlantId").asLong();


            //메시지가 온 세션 아이디와 똑같은 곳에 userplant_id 초기화


            for (CustomWebSocketSession customSession : sessions) {
                if (customSession.getSession().getId().equals(session.getId())) {
                    customSession.setUserplant_id(selected_plant_id);
                    customSession.setJSnum(false);
                    break;
                }
            }








        }

            //워터펌프 제어
        else if (method==14) {

            String jsonResponse= objectMapper.writeValueAsString(new Mainserver(1,userplantId));

            for (CustomWebSocketSession customSession : sessions) {

                if (customSession.getUserplant_id().equals(userplantId)&&customSession.isJSnum()) {

                    customSession.getSession().sendMessage(new TextMessage(jsonResponse));


                    break;
                }
            }



        }

            //mobilepage -> 서버에서 광량을 제어하기 위한 메시지를 보낸다.

        else if (method==15) {

            int light = dataNode.get("light").asInt();


            String jsonResponse= objectMapper.writeValueAsString(new LightControl(2,userplantId,light));

            for (CustomWebSocketSession customSession : sessions) {

                if (customSession.getUserplant_id().equals(userplantId)&&customSession.isJSnum()) {

                    customSession.getSession().sendMessage(new TextMessage(jsonResponse));

                    break;
                }
            }

        }

            //자동제어 ON/OFF 여부를 서로 주고 받는다.

        else if (method==16) {

            boolean isAutoControl=dataNode.get("isAutoControl").asBoolean();

            String jsonResponse= objectMapper.writeValueAsString(new AutoControl(16,userplantId,isAutoControl));

            for (CustomWebSocketSession customSession : sessions) {

                if (customSession.getUserplant_id().equals(userplantId)&&customSession.isJSnum()) {
                    customSession.getSession().sendMessage(new TextMessage(jsonResponse));

                    break;
                }
            }
        }

        else if (method==3) {

            boolean isAutoControl=dataNode.get("isAutoControl").asBoolean();

            String jsonResponse= objectMapper.writeValueAsString(new AutoControl(3,userplantId,isAutoControl));

            for (CustomWebSocketSession customSession : sessions) {

                if (customSession.getUserplant_id().equals(userplantId)&&!customSession.isJSnum()) {
                    customSession.getSession().sendMessage(new TextMessage(jsonResponse));

                    break;
                }
            }
        }



    }
}
