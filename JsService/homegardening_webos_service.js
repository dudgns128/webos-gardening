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

const service = new Service(pkgInfo.name);
const logHeader = '[' + pkgInfo.name + ']';
const wsurl = 'ws://example.com';

// *************************************** APIs ***************************************
// 임시 API
service.register('getPlantInfos', async function (message) {
  let results = await plantInfoDB.getData();
  message.respond({
    normalImageUrl:
      'https://i.namu.wiki/i/vDpd0CaQ-5cgC_CYSebzG3TK7s7NYZCoYANi7aGQpT2lcq1DBrNUyzsVGB7wBVlN246LzPrf7TdlPHedfWvNHg.webp',
    name: results[0].plantName,
    satisfaction: getRandomInt(0, 100),
    level: 11,
  });
});

// 초기 데이터 등록
service.register('register', function (message) {
  plantInfoDB.putKind();
  plantInfoDB.putPermissions();
  plantInfoDB.replaceData({
    plantId: 123,
    plantName: 'my_plant',
    plantBirthDate: 1716712448,
    scientificName: 'my_plant',
    shortDescription: 'this is my plant',
    maxLevel: 50,
  });
  /*
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
  */
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
  if (!message.payload.light) {
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

// 캘린더 데이터 조회
service.register('calendar', function (message) {
  const year = message.payload.year;
  const month = message.payload.month;

  message.respond({
    success: true,
    isWater: {
      day1: getRandomTF(),
      day2: getRandomTF(),
      day3: getRandomTF(),
      day4: getRandomTF(),
      day5: getRandomTF(),
      day6: getRandomTF(),
      day7: getRandomTF(),
      day8: getRandomTF(),
      day9: getRandomTF(),
      day10: getRandomTF(),
      day11: getRandomTF(),
      day12: getRandomTF(),
      day13: getRandomTF(),
      day14: getRandomTF(),
      day15: getRandomTF(),
      day16: getRandomTF(),
      day17: getRandomTF(),
      day18: getRandomTF(),
      day19: getRandomTF(),
      day20: getRandomTF(),
      day21: getRandomTF(),
      day22: getRandomTF(),
      day23: getRandomTF(),
      day24: getRandomTF(),
      day25: getRandomTF(),
      day26: getRandomTF(),
      day27: getRandomTF(),
      day28: getRandomTF(),
      day29: getRandomTF(),
      day30: getRandomTF(),
      day31: getRandomTF(),
    },
    satisfaction: {
      day1: getRandomInt(1, 100),
      day2: getRandomInt(1, 100),
      day3: getRandomInt(1, 100),
      day4: getRandomInt(1, 100),
      day5: getRandomInt(1, 100),
      day6: getRandomInt(1, 100),
      day7: getRandomInt(1, 100),
      day8: getRandomInt(1, 100),
      day9: getRandomInt(1, 100),
      day10: getRandomInt(1, 100),
      day11: getRandomInt(1, 100),
      day12: getRandomInt(1, 100),
      day13: getRandomInt(1, 100),
      day14: getRandomInt(1, 100),
      day15: getRandomInt(1, 100),
      day16: getRandomInt(1, 100),
      day17: getRandomInt(1, 100),
      day18: getRandomInt(1, 100),
      day19: getRandomInt(1, 100),
      day20: getRandomInt(1, 100),
      day21: getRandomInt(1, 100),
      day22: getRandomInt(1, 100),
      day23: getRandomInt(1, 100),
      day24: getRandomInt(1, 100),
      day25: getRandomInt(1, 100),
      day26: getRandomInt(1, 100),
      day27: getRandomInt(1, 100),
      day28: getRandomInt(1, 100),
      day29: getRandomInt(1, 100),
      day30: getRandomInt(1, 100),
      day31: getRandomInt(1, 100),
    },
  });
});

// 자동제어 ON/OFF
service.register('toggleAutocontrol', function (message) {
  currentState = toggleAutocontrol();
  message.respond({
    success: true,
    currentState,
  });
});

// *************************************** Service 로직 ***************************************
function getRandomInt(min, max) {
  //min ~ max 사이의 임의의 정수 반환
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomTF() {
  if (getRandomInt(1, 100) < 50) return true;
  return false;
}

function checkParamForRegister(param) {
  // 필요한 정보들 다 제대로 들어있나 확인
}

// sensors 조회/제어 관련 함수들
function getSensingDataJSON() {
  // 일단은 dummy data 랜덤으로 생성
  // 추후 실제 센서 연결 후 실제 값 받아오게 변경
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
  return getRandomTF();
  // some task to do
}

// *************************************** Heartbeat ***************************************
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

// *************************************** DB ***************************************
const kindID = 'com.team17.homegardening.plantInfo:1';
const busID = 'com.team17.homegardening.service';

// ***************************** plantInfo *****************************
const plantInfoDB = {
  putKind: function () {
    let url = 'luna://com.webos.service.db/putKind';
    let params = {
      id: kindID,
      owner: busID,
      indexes: [
        {
          name: 'index0',
          props: [{ name: 'plantId' }],
        },
      ],
    };
    service.call(url, params, (msg) => {
      findResult = msg;
    });
  },

  putPermissions: function () {
    let url = 'luna://com.webos.service.db/putPermissions';
    let params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID,
          type: 'db.kind',
          caller: '*',
        },
      ],
    };
    service.call(url, params, (msg) => {});
  },

  replaceData: function (newData) {
    emptyDB();
    let url = 'luna://com.webos.service.db/put';
    let params = {
      objects: [
        {
          _kind: kindID,
          plantId: newData.plantId,
          plantName: newData.plantName,
          plantBirthDate: newData.plantBirthDate,
          scientificName: newData.scientificName,
          shortDescription: newData.shortDescription,
          maxLevel: newData.maxLevel,
        },
      ],
    };
    service.call(url, params, (msg) => {});
  },

  getData: function () {
    let url = 'luna://com.webos.service.db/find';
    let params = {
      query: {
        from: kindID,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        resolve(res.payload.results);
      });
    });
  },

  emptyDB: function () {
    let url = 'luna://com.webos.service.db/del';
    let params = {
      query: {
        from: kindID,
      },
    };
    service.call(url, params, (msg) => {});
  },
};