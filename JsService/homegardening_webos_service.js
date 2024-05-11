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
const WebSocket = require('ws');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = '[' + pkgInfo.name + ']';
const wsurl = 'ws://example.com';

// 이 홈 가드닝 키트에서 관리중인 식물의 plant id
let plantId;

// 관리할 plant id 등록
service.register('registerPlantId', function (message) {
  if (!message.payload.plantId) {
    message.respond({
      success: false,
    });
  } else {
    plantId = message.payload.plantId;
    message.respond({
      success: true,
    });
  }
});

// 관리 중인 plant id 조회
service.register('inquiryPlantId', function (message) {
  if (plantId) {
    message.respond({
      success: true,
      plantId: plantId,
    });
  } else {
    message.respond({
      success: false,
      plantId: null,
    });
  }
});

// 등록된 plant id 삭제
service.register('deletePlantId', function (message) {
  plantId = null;
  message.respond({
    success: true,
  });
});

// 식물 ID 등록 후 -> startSensing 호출로 서버에 센싱 데이터 전송 시작
service.register('startSensing', function (message) {
  if (!plantId) {
    message.respond({
      success: false,
    });
    return;
  }
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
    connection.send({ plantId: plantId, data: getSensingDataJSON });
  }, 5000);

  message.respond({
    success: true,
  });
});

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
function controlLight() {}
function controlWater() {}

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
