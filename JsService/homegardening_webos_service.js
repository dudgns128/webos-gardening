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
  let plantName = await plantInfoDB.getPlantName();
  message.respond({
    normalImageUrl:
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5f4bd7a6-f763-4518-9b81-bdfd40ce3fc9/d26yer1-421bb5b8-9fc2-4d5a-b2d1-1e1f81b26b82.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzVmNGJkN2E2LWY3NjMtNDUxOC05YjgxLWJkZmQ0MGNlM2ZjOVwvZDI2eWVyMS00MjFiYjViOC05ZmMyLTRkNWEtYjJkMS0xZTFmODFiMjZiODIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.p5vfqGmq9kIylfG3glHGa20CAPUtoWlAxKEGpIvGOi8',
    name: plantName,
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
const busID = 'com.team17.homegardening.service';

///////////////////////// DB: plantInfo
const kindID_plantInfo = 'com.team17.homegardening.plantInfo:1';
const plantInfoDB = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_plantInfo,
      owner: busID,
    };
    service.call(url, params, (res) => {});
  },
  putPermissions: function () {
    const url = 'luna://com.webos.service.db/putPermissions';
    const params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID_plantInfo,
          type: 'db.kind',
          caller: busID,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: function (newData) {
    emptyDB();
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_plantInfo,
          plantId: newData.plantId,
          plantName: newData.plantName,
          plantBirthDate: newData.plantBirthDate,
          scientificName: newData.scientificName,
          shortDescription: newData.shortDescription,
          maxLevel: newData.maxLevel,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  getPlantName: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].plantName);
        else reject();
      });
    });
  },
  emptyDB: function () {
    const url = 'luna://com.webos.service.db/del';
    const params = {
      query: {
        from: kindID_plantInfo,
      },
    };
    service.call(url, params, (res) => {});
  },
};

///////////////////////// DB: plantCurrentInfo
const kindID_plantCurrentInfo = 'com.team11.homegardening.plantCurrentInfo:1';
const plantCurrentInfo = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_plantCurrentInfo,
      owner: busID,
    };
    service.call(url, params, (res) => {});
  },
  putPermissions: function () {
    const url = 'luna://com.webos.service.db/putPermissions';
    const params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID_plantCurrentInfo,
          type: 'db.kind',
          caller: busID,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  updateCurrentLevel: function (currentLevel) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
      props: {
        currentLevel,
      },
    };
    service.call(url, params, (res) => {});
  },
  updateIsAutoControl: function (isAutoControl) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
      props: {
        isAutoControl,
      },
    };
    service.call(url, params, (res) => {});
  },
  updateSatisfaction: function (satisfaction) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
      props: {
        satisfaction,
      },
    };
    service.call(url, params, (res) => {});
  },
  replaceData: function (newData) {
    emptyDB();
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_plantCurrentInfo,
          currentLevel: newData.currentLevel,
          isAutoControl: newData.isAutoControl,
          satisfaction: newData.satisfaction,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  getCurrentLevel: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].currentLevel);
        else reject();
      });
    });
  },
  getIsAutoControl: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].isAutoControl);
        else reject();
      });
    });
  },
  getSatisfaction: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].satisfaction);
        else reject();
      });
    });
  },
  emptyDB: function () {
    const url = 'luna://com.webos.service.db/del';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    service.call(url, params, (res) => {});
  },
};

///////////////////////// DB: imageUrl
const kindID_imageUrl = 'com.team11.homegardening.imageUrl:1';
const imageUrl = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_imageUrl,
      owner: busID,
    };
    service.call(url, params, (res) => {});
  },
  putPermissions: function () {
    const url = 'luna://com.webos.service.db/putPermissions';
    const params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID_imageUrl,
          type: 'db.kind',
          caller: busID,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: function (newData) {
    emptyDB();
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_imageUrl,
          normalImageUrl: newData.normal,
          happyImageUrl: newData.happy,
          sadImageUrl: newData.sad,
          angryImageUrl: newData.angry,
          underWaterImageUrl: newData.underWater,
          overWaterImageUrl: newData.overWater,
          underLightImageUrl: newData.underLight,
          overLightImageUrl: newData.overLight,
          underTemperatureImageUrl: newData.underTemperature,
          overTemperatureImageUrl: newData.overTemperature,
          underHumidityImageUrl: newData.underHumidity,
          overHumidityImageUrl: newData.overHumidity,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  getNormalImageUrl: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_imageUrl,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].normalImageUrl);
        else reject();
      });
    });
  },
  emptyDB: function () {
    const url = 'luna://com.webos.service.db/del';
    const params = {
      query: {
        from: kindID_imageUrl,
      },
    };
    service.call(url, params, (res) => {});
  },
};

///////////////////////// DB: plantEnvInfo
const kindID_plantEnvInfo = 'com.team11.homegardening.plantEnvInfo:1';
const plantEnvInfo = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_plantEnvInfo,
      owner: busID,
    };
    service.call(url, params, (res) => {});
  },
  putPermissions: function () {
    const url = 'luna://com.webos.service.db/putPermissions';
    const params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID_plantEnvInfo,
          type: 'db.kind',
          caller: busID,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: function (newData) {
    emptyDB();
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_plantEnvInfo,
          waterValue: newData.waterValue,
          waterRange: newData.waterRange,
          lightValue: newData.lightValue,
          lightRange: newData.lightRange,
          temperatureValue: newData.temperatureValue,
          temperatureRange: newData.temperatureRange,
          humidityValue: newData.humidityValue,
          humidityRange: newData.humidityRange,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  getWaterValue: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].waterValue);
        else reject();
      });
    });
  },
  getWaterRange: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].waterRange);
        else reject();
      });
    });
  },
  getLightValue: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].lightValue);
        else reject();
      });
    });
  },
  getLightRange: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].lightRange);
        else reject();
      });
    });
  },
  getTemperatureValue: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].temperatureValue);
        else reject();
      });
    });
  },
  getTemperatureRange: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].temperatureRange);
        else reject();
      });
    });
  },
  getHumidityValue: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].humidityValue);
        else reject();
      });
    });
  },
  getHumidityRange: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].humidityRange);
        else reject();
      });
    });
  },
  emptyDB: function () {
    const url = 'luna://com.webos.service.db/del';
    const params = {
      query: {
        from: kindID_plantEnvInfo,
      },
    };
    service.call(url, params, (res) => {});
  },
};

///////////////////////// DB: envSensingData
const kindID_envSensingData = 'com.team11.homegardening.envSensingData:1';
const envSensingData = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_envSensingData,
      owner: busID,
      indexes: [
        {
          name: 'index0',
          props: [{ name: 'time' }],
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  putPermissions: function () {
    const url = 'luna://com.webos.service.db/putPermissions';
    const params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID_envSensingData,
          type: 'db.kind',
          caller: busID,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  putData: function (data) {
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_envSensingData,
          time: data.time,
          water: data.water,
          light: data.light,
          humidity: data.humidity,
          temperature: data.temperature,
          satisfaction: data.satisfaction,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
};

///////////////////////// DB: latestSensingData  -> db 쿼리 효율 위해 가장 최신 데이터 하나만 따로 유지
const kindID_latestSensingData = 'com.team11.homegardening.latestSensingData:1';
const latestSensingData = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_latestSensingData,
      owner: busID,
    };
    service.call(url, params, (res) => {});
  },
  putPermissions: function () {
    const url = 'luna://com.webos.service.db/putPermissions';
    const params = {
      permissions: [
        {
          operations: {
            read: 'allow',
            create: 'allow',
            update: 'allow',
            delete: 'allow',
          },
          object: kindID_latestSensingData,
          type: 'db.kind',
          caller: busID,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: function (newData) {
    emptyDB();
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_latestSensingData,
          time: newData.time,
          water: newData.water,
          light: newData.light,
          humidity: newData.humidity,
          temperature: newData.temperature,
          satisfaction: newData.satisfaction,
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  getLatestData: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_latestSensingData,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.results.length != 0) resolve(res.payload.results[0]);
        else reject();
      });
    });
  },
  emptyDB: function () {
    const url = 'luna://com.webos.service.db/del';
    const params = {
      query: {
        from: kindID_latestSensingData,
      },
    };
    service.call(url, params, (res) => {});
  },
};
