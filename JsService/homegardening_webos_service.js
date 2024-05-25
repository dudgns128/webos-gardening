/*
 * Copyright (c) 2020-2024 LG Electronics Inc.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// helloworld_webos_service.js
// is simple service, based on low-level luna-bus API

// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');
// const WebSocket = require('ws');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = '[' + pkgInfo.name + ']';
const wsurl = 'ws://example.com';

// ***************************** APIs *****************************
// 임시 API
service.register('getPlantInfos', function (message) {
  message.respond({
    normalImageUrl:
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5f4bd7a6-f763-4518-9b81-bdfd40ce3fc9/d26yer1-421bb5b8-9fc2-4d5a-b2d1-1e1f81b26b82.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzVmNGJkN2E2LWY3NjMtNDUxOC05YjgxLWJkZmQ0MGNlM2ZjOVwvZDI2eWVyMS00MjFiYjViOC05ZmMyLTRkNWEtYjJkMS0xZTFmODFiMjZiODIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.p5vfqGmq9kIylfG3glHGa20CAPUtoWlAxKEGpIvGOi8',
    name: 'My Lovely Plant',
    satisfaction: getRandomInt(0, 100),
    level: 11,
  });
});

// 초기 데이터 등록
service.register('register', function (message) {
  if (!checkParamForRegister(message.payload)) {
    message.respond({
      success: false,
    });
    return;
  }
  plantInfos = message.payload;
  message.respond({
    success: true,
  });
});

// 백그라운드 작업 시작
service.register('startSensing', function (message) {
  // 이전에 register로 필요한 정보 등록됐는지 확인

  // heartbeat 구독
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  sub.addListener('response', function (msg) {
    console.log(JSON.stringify(msg.payload));
  });

  // Websocket 관련 codes
  const connection = new WebSocket(wsurl);

  // 연결 성공
  connection.onopen = () => {
    console.log('WebSocket 연결 성공');
  };

  // 연결 종료
  connection.onclose = () => {
    console.log('WebSocket 연결 종료');
  };

  // 연결 중 에러 발생
  connection.onerror = (error) => {
    console.error('WebSocket 에러 발생:', error);
  };

  // 메시지 수신 (제어하는 경우)
  connection.onmessage = (wMessage) => {
    console.log('제어 명령 수신 : ', wMessage);
    controlLight();
    controlWater();
  };

  // 5초 주기로 센싱 데이터 전송
  const intervalId = setInterval(function () {
    connection.send(
      JSON.stringify({ plantId: plantId, data: getSensingDataJSON() })
    );
  }, 5000);

  message.respond({
    success: true,
  });
});

// 최근 센싱 데이터 가져오기
service.register('getSensingData', function (message) {
  message.respond(getSensingDataJSON());
});

// 식물 기본 정보 조회(캐릭터 이미지 url, 이름)
service.register('getPlantInfo', function (message) {
  message.respond({
    normalImageUrl: 'example.image.url',
    name: 'example name',
  });
});

// 식물 만족도 조회하기
service.register('getPlantSatisfaction', function (message) {
  message.respond({
    satisfaction: 50,
  });
});

// 식물 레벨 조회하기
service.register('getPlantLevel', function (message) {
  message.respond({
    level: 11,
  });
});

// 광량 제어하기
service.register('controlLight', function (message) {
  if (!light) {
    message.respond({
      success: false,
    });
    return;
  }
  light = Number(message.payload.light);
  controlLight(light);
  message.respond({
    success: true,
  });
});

// 물 제어하기
service.register('controlWater', function (message) {
  controlWater();
  message.respond({
    success: true,
  });
});

// 자동제어 ON/OFF
service.register('toggleAutocontrol', function (message) {
  toggleAutocontrol();
  message.respond({
    success: true,
  });
});

// ***************************** Service 로직 *****************************
function checkParamForRegister(param) {
  // 필요한 정보들 다 제대로 들어있나 확인
}
// sensors 조회/제어 관련 함수들
function getSensingDataJSON() {
  // 일단은 dummy data 랜덤으로 생성
  // 추후 실제 센서 연결 후 실제 값 받아오게 변경
  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  return {
    water: getRandomInt(1, 100),
    light: getRandomInt(1, 100),
    temperature: getRandomInt(1, 100),
    humidity: getRandomInt(1, 100),
  };
}
function controlLight(lightValue) {
  // [light 제어 api 사용하기]
  console.log(`adjust light value to ${lightValue}!!`);
}
function controlWater() {
  // [water 제어 api 사용하기]
  console.log(`adjust water value!!`);
}
function toggleAutocontrol() {
  // some task to do
}

// ***************************** Heartbeat *****************************
// heart beat가 어떤 외부 서비스가 아닌, 특정 구독자에게 신호를 줘서 꺼지지 않도록 하는 걸 말하는 듯
const heartbeat2 = service.register('heartbeat');
heartbeat2.on('request', function (message) {
  console.log(logHeader, 'SERVICE_METHOD_CALLED:/heartbeat/request');
  console.log('heartbeat callback');
  message.respond({ event: 'beat' });
  if (message.isSubscription) {
    subscriptions[message.uniqueToken] = message;
    if (!interval) {
      createInterval();
    }
  }
});
heartbeat2.on('cancel', function (message) {
  console.log(logHeader, 'SERVICE_METHOD_CALLED:/heartbeat/cancel');
  console.log('Canceled ' + message.uniqueToken);
  delete subscriptions[message.uniqueToken];
  const keys = Object.keys(subscriptions);
  if (keys.length === 0) {
    console.log('no more subscriptions, canceling interval');
    clearInterval(interval);
    interval = undefined;
  }
});
// send responses to each subscribed client
function sendResponses() {
  // console.log(logHeader, "send_response");
  // console.log("Sending responses, subscription count=" + Object.keys(subscriptions).length);
  for (const i in subscriptions) {
    if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
      const s = subscriptions[i];
      s.respond({
        returnValue: true,
        event: 'beat ' + x,
      });
    }
  }
  x++;
}
// handle subscription requests
const subscriptions = {};
let interval;
let x = 1;
function createInterval() {
  if (interval) {
    return;
  }
  console.log(logHeader, 'create_interval');
  console.log('create new interval');
  interval = setInterval(function () {
    sendResponses();
  }, 1000);
}
