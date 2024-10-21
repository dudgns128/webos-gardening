// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');
const WebSocket = require('ws');

const service = new Service(pkgInfo.name);
const logHeader = '[' + pkgInfo.name + ']';
// *************** WebSocket ********************//
const wsurl = 'ws://15.164.95.57:8080/ws';
const connection = new WebSocket(wsurl);
connection.on('open', () => {
  console.log("연결 됨");
});

// *************************************** APIs ***************************************
// (일단 임시) 메인페이지 데이터 조회 API
service.register('getPlantInfos', async function (message) {
  try {
    const plantName = await plantInfo.getPlantName();
    const normalImageUrl = await imageUrl.getNormalImageUrl();
    const satisfaction = await plantCurrentInfo.getSatisfaction();
    const level = await plantCurrentInfo.getLevel();
    const waterCount = await plantCurrentInfo.getWaterCount();
    const currentSensingData = await plantCurrentInfo.getSensingData();

    message.respond({
      success: true,
      imageUrl: normalImageUrl,
      name: plantName,
      satisfaction: satisfaction,
      level: level,
      exp: (100 * waterCount) / (level * 2),
      waterTankLevel: currentSensingData.waterTankLevel
    });
  } catch (e) {
    message.respond({
      customErrorMessage: e,
      success: false,
    });
  }
});

service.register('capture', function (message) {
  const url = 'luna://com.webos.service.applicationmanager/launch';
  const params = {
    id: "com.team17.app.camera"
  };
  service.call(url, params, (res) => {});
})

// 초기 데이터 등록 및 백그라운드 작업 시작
service.register('start', async function (message) {
  // Open sensor
  openI2C();

  // 모든 DB kind 생성 및 권한 할당
  plantInfo.putKind();
  plantCurrentInfo.putKind();
  imageUrl.putKind();
  plantEnvInfo.putKind();
  envSensingData.putKind();
  wateringRecord.putKind();
  avgSatisfactionRecord.putKind();
  plantInfo.putPermissions();
  plantCurrentInfo.putPermissions();
  imageUrl.putPermissions();
  plantEnvInfo.putPermissions();
  envSensingData.putPermissions();
  wateringRecord.putPermissions();
  avgSatisfactionRecord.putPermissions();

  // 식물 기본 데이터 등록
  try {
    await plantInfo.replaceData({
      plantId: message.payload.plantId,
      plantName: message.payload.plantName,
      plantBirthDate: message.payload.plantBirthDate,
      scientificName: message.payload.scientificName,
      shortDescription: message.payload.shortDescription,
      maxLevel: message.payload.maxLevel,
    });
  } catch(e) {
    message.respond({
      customErrorMessage: e,
      success: false,
      message: 'plantInfo.replaceData() failed',
    });
    return;
  }
  try {
    await imageUrl.replaceData({
      normal: message.payload.imageUrls.normal,
      happy: message.payload.imageUrls.happy,
      sad: message.payload.imageUrls.sad,
      angry: message.payload.imageUrls.angry,
      underWater: message.payload.imageUrls.underWater,
      overWater: message.payload.imageUrls.overWater,
      underLight: message.payload.imageUrls.underLight,
      overLight: message.payload.imageUrls.overLight,
      underTemperature: message.payload.imageUrls.underTemperature,
      overTemperature: message.payload.imageUrls.overTemperature,
      underHumidity: message.payload.imageUrls.underHumidity,
      overHumidity: message.payload.imageUrls.overHumidity,
    });
  } catch (e) {
    message.respond({
      customErrorMessage: e,
      success: false,
      message: 'imageUrl.replaceData() failed',
    });
    return;
  }
  try {
    await plantEnvInfo.replaceData({
      waterValue: message.payload.properEnvironments.waterValue,
      waterRange: message.payload.properEnvironments.waterRange,
      lightValue: message.payload.properEnvironments.lightValue,
      lightRange: message.payload.properEnvironments.lightRange,
      temperatureValue: message.payload.properEnvironments.temperatureValue,
      temperatureRange: message.payload.properEnvironments.temperatureRange,
      humidityValue: message.payload.properEnvironments.humidityValue,
      humidityRange: message.payload.properEnvironments.humidityRange,
    });
  } catch (e) {
    message.respond({
      customErrorMessage: e,
      success: false,
      message: 'plantEnvInfo.replaceData() failed',
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

  // Websocket : 메시지 수신 (제어하는 경우)
  connection.on('message', async (rawMessage) => {
    const wMessage = JSON.parse(rawMessage);
    const method = wMessage.method
    switch (method) {
      case 1:  case '1':
        await controlWater();
        break;
      case 2:  case '2':
        controlLight(wMessage.light);
        break;
      case 16:  case '16':
        await plantCurrentInfo.updateIsAutoControl(wMessage.autoControl);
        break;
      default:
        break;
    }
  });

  // WebSocket 서버 연결 설정 (초기화)
  const plantId = await plantInfo.getPlantId();
  connection.send(
    JSON.stringify({
      method: 30,
      userPlant: plantId,
      data: {
        JSnum: true
      }
    })
  );

  // plantCurrentInfo DB 내용 초기화
  if ((await plantCurrentInfo.isDataExist()) != true)
    await plantCurrentInfo.putData({
      isAutoControl: true,
      level: 1,
      waterCount: 0,
      satisfaction: 0,
      sensingData: null,
    });
  else {
    await plantCurrentInfo.replaceData({
      isAutoControl: true,
      level: 1,
      waterCount: 0,
      satisfaction: 0,
      sensingData: null,
    })
  }

  // 5초 주기로 센싱
  // 1. envSensingData 에 저장
  // 2. 분석해 만족도 결정(-> 자동제어 여부에 따라 제어는 이때 같이!), 만족도 평균값 갱신
  // 3. 이 최신 센싱 결과 및 만족도는 plantCurrentInfo 에도 따로 저장
  let satisfaction;
  const intervalId2 = setInterval(async function () {
    try {
      const now = new Date();
      const yearNow = now.getFullYear();
      const monthNow = now.getMonth() + 1; // 월 (0부터 시작하므로 1을 더해야 함)
      const dayNow = now.getDate();
      const data = await getSensingDataJSON();
      
      if ((await avgSatisfactionRecord.isDataExist(yearNow, monthNow, dayNow)) != true)
        await avgSatisfactionRecord.putData({
          year: yearNow,
          month: monthNow,
          day: dayNow,
          avgSatisfaction: satisfaction,
          count: 1,
        });
      satisfaction = await calcSatisfaction(data);
      await envSensingData.putData({
        time: 1,
        water: data.water,
        light: data.light,
        humidity: data.humidity,
        temperature: data.temperature,
        satisfaction,
      });
      await avgSatisfactionRecord.updateAvgSatisfaction(
        yearNow,
        monthNow,
        dayNow,
        satisfaction
      );
      await plantCurrentInfo.updateSensingData(data);
      await plantCurrentInfo.updateSatisfaction(satisfaction);
      // ****************** 서버로 데이터 보내기 ************************//
      const plantId = await plantInfo.getPlantId();
      const plantName = await plantInfo.getPlantName();
      const normalImageUrl = await imageUrl.getNormalImageUrl();
      const level = await plantCurrentInfo.getLevel();
      const waterCount = await plantCurrentInfo.getWaterCount();
      connection.send(
        JSON.stringify({
          method: 0,
          userPlant: plantId,
          data: {
            plantName,
            water: data.water,
            light: data.light,
            humidity: data.humidity,
            temperature: data.temperature,
            satisfaction,
            level,
            exp: (100 * waterCount) / (level * 2),
            imageUrl: normalImageUrl,
            waterTankLevel: data.waterTankLevel
          }
        })
      );
    } catch (e) {
      message.respond({
        e,
      });
    }
  }, 3000);

  message.respond({
    success: true,
  });
});

service.register('hitest', async function (message) {
  try {
    const today = new Date();
    const hours = today.getUTCHours() + 9;
    const isNight = ((18 < hours) || (hours < 6)) ? true : false;
    message.respond({today, hours, isNight});
    return;
  } catch(e) {
    message.respond(e);
    return;
  }
});

// 최근 센싱 데이터 가져오기
service.register('getSensingData', async function (message) {
  try {
    const sensingData = await plantCurrentInfo.getSensingData();
    message.respond({
      success: true,
      water: sensingData.water,
      light: sensingData.light,
      temperature: sensingData.temperature,
      humidity: sensingData.humidity,
    });
  } catch (e) {
    message.respond({
      success: false,
      customErrorMessage: e,
    });
  }
});

// (현재 사용 X) 식물 기본 정보 조회(캐릭터 이미지 url, 이름)
service.register('getPlantInfo', function (message) {
  message.respond({
    normalImageUrl: 'example.image.url',
    name: 'example name',
  });
});

// (현재 사용 X) 식물 만족도 조회하기
service.register('getPlantSatisfaction', function (message) {
  message.respond({
    satisfaction: 50,
  });
});

// (현재 사용 X) 식물 레벨 조회하기
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
service.register('controlWater', async function (message) {
  await controlWater();
  message.respond({
    success: true,
  });
});

// 캘린더 데이터 조회
service.register('calendar', async function (message) {
  const year = message.payload.year;
  const month = message.payload.month;
  const waterData = await wateringRecord.getMonthData(year, month);
  const satisfactionData = await avgSatisfactionRecord.getMonthData(
    year,
    month
  );

  let result = { success: true, isWater: {}, satisfaction: {} };
  // 초기화
  for (let i = 1; i < 32; i++) {
    result.isWater[`day${i}`] = false;
    result.satisfaction[`day${i}`] = null;
  }
  // 있는 값은 할당
  for (const data of waterData) {
    result.isWater[`day${data.day}`] = true;
  }
  for (const data of satisfactionData) {
    result.satisfaction[`day${data.day}`] = data.avgSatisfaction;
  }

  message.respond(result);
});

// 자동제어 ON/OFF
service.register('toggleAutocontrol', async function (message) {
  try {
    let currentState = await plantCurrentInfo.getIsAutoControl();
    await plantCurrentInfo.updateIsAutoControl(!currentState);
    // 서버에도 자동제어 여부 반영
    const plantId = await plantInfo.getPlantId();
    connection.send(
      JSON.stringify({
        method: 3,
        userPlant: plantId,
        data: {
          isAutoControl: !currentState
        }
      })
    );
    message.respond({
      success: true,
      currentState: !currentState,
    });
  } catch (e) {
    message.respond({
      success: false,
    });
  }
});

// 자동제어 조회
service.register('isAutocontrol', async function (message) {
  try {
    let currentState = await plantCurrentInfo.getIsAutoControl();
    message.respond({
      success: true,
      currentState,
    });
  } catch (e) {
    message.respond({
      success: false,
    });
  }
});

// 환경 적정 범위
service.register('envData', async function (message) {
  const waterValue = await plantEnvInfo.getWaterValue();
  const waterRange = await plantEnvInfo.getWaterRange();
  const lightValue = await plantEnvInfo.getLightValue();
  const lightRange = await plantEnvInfo.getLightRange();
  const temperatureValue = await plantEnvInfo.getTemperatureValue();
  const temperatureRange = await plantEnvInfo.getTemperatureRange();
  const humidityValue = await plantEnvInfo.getHumidityValue();
  const humidityRange = await plantEnvInfo.getHumidityRange();
  try {
    message.respond({
      success: true,
      waterValue,
      waterRange,
      lightValue,
      lightRange,
      temperatureValue,
      temperatureRange,
      humidityValue,
      humidityRange
    });
  } catch (e) {
    message.respond({
      success: false,
    });
  }
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

// sensors 조회/제어 관련 함수들
async function getSensingDataJSON() {
  // 실제 센서 연결 후 실제 값 받아는 코드
  const data = await readSensor();

  return {
    water: data.water,
    light: data.light,
    temperature: data.temperature,
    humidity: data.humidity,
    waterTankLevel: data.watertank_level
  };
}

// 만족도 판정 로직 + 만족도 판단하며 자동 제어 로직
// 일단 단순하게 이상적인 범위 벗어나면 10점씩 깎음.
async function calcSatisfaction(data) {
  let satisfaction = 100;
  const isAutoControl = await plantCurrentInfo.getIsAutoControl();
  const waterValue = await plantEnvInfo.getWaterValue();
  const waterRange = await plantEnvInfo.getWaterRange();
  const lightValue = await plantEnvInfo.getLightValue();
  const lightRange = await plantEnvInfo.getLightRange();
  const temperatureValue = await plantEnvInfo.getTemperatureValue();
  const temperatureRange = await plantEnvInfo.getTemperatureRange();
  const humidityValue = await plantEnvInfo.getHumidityValue();
  const humidityRange = await plantEnvInfo.getHumidityRange();

  const today = new Date();
  const hours = today.getUTCHours() + 9;
  const isNight = ((18 < hours) || (hours < 6)) ? true : false;
  if (!isNight && (data.light < lightValue - lightRange)) {
    satisfaction -= 10;
    // light 제어 api 사용
    if (isAutoControl) {
      controlNeopixel(lightValue);
    }
  }
  if (!isNight && (lightValue - lightRange <= data.light)) {
    satisfaction -= 10;
    // light 제어 api 사용
    if (isAutoControl) {
      controlNeopixel(0);
    }
  }
  if (isNight) {
    if (isAutoControl) {
      controlNeopixel(0);
    }
  }
  if (
    data.humidity < humidityValue - humidityRange ||
    humidityValue + humidityRange < data.humidity
  )
    satisfaction -= 10;
  if (
    data.temperature < temperatureValue - temperatureRange ||
    temperatureValue + temperatureRange < data.temperature
  )
    satisfaction -= 10;
  if (data.water < waterValue - waterRange) {
    satisfaction -= 10;
    if (isAutoControl)
      await controlWater();
  }
  if (waterValue + waterRange < data.water) satisfaction -= 10;
  return satisfaction;
}

function controlLight(lightValue) {
  // light 제어 api 사용하기
  controlNeopixel(lightValue);
}

// controlWater()가 호출되면 물을 주는 것
async function controlWater() {
  const now = new Date();
  const yearNow = now.getFullYear();
  const monthNow = now.getMonth() + 1; // 월 (0부터 시작하므로 1을 더해야 함)
  const dayNow = now.getDate();
  if (await wateringRecord.isDataExist(yearNow, monthNow, dayNow))
    await wateringRecord.updateCount(yearNow, monthNow, dayNow);
  else await wateringRecord.putData({ yearNow, monthNow, dayNow, count: 0 });
  // [todo] 레벨업 로직 관련 : 일단은 단순하게 level*2 횟수만큼 물을 주면 레벨업이 됨.
  const curWaterCount = await plantCurrentInfo.getWaterCount();
  const curLevel = await plantCurrentInfo.getLevel();
  if (curWaterCount + 1 >= curLevel * 2) {
    await plantCurrentInfo.updateWaterCount(0);
    await plantCurrentInfo.updateLevel(curLevel + 1);
  } else await plantCurrentInfo.updateWaterCount(curWaterCount + 1);
  // water 제어 api 사용
  controlPump(1);
  await delay(2000);
  controlPump(0);
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
const plantInfo = {
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
          caller: '*', // 원래는 busID 를 넣어야 함!
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: async function (newData) {
    try {
      await plantInfo.emptyDB();
    } catch (e) {
      return Promise.reject('emptyDB failed');
    }
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('put failed');
      });
    });
  },
  getPlantId: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject('getPlantId failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].plantId);
        else reject('getPlantId failed');
      });
    });
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
        if (res.payload.returnValue != true) reject('getPlantName failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].plantName);
        else reject('getPlantName failed');
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
};

///////////////////////// DB: plantCurrentInfo
const kindID_plantCurrentInfo = 'com.team17.homegardening.plantCurrentInfo:1';
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
          caller: '*',
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
          _kind: kindID_plantCurrentInfo,
          level: data.level,
          waterCount: data.waterCount,
          isAutoControl: data.isAutoControl,
          satisfaction: data.satisfaction,
          sensingData: data.sensingData,
        },
      ],
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('plantCurrentInfo.putData failed');
      });
    });
  },
  updateLevel: function (level) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
      props: {
        level,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
  updateWaterCount: function (waterCount) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
      props: {
        waterCount,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('plantCurrentInfo.updateSatisfaction failed');
      });
    });
  },
  updateSensingData: function (sensingData) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
      props: {
        sensingData,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('plantCurrentInfo.updateSensingData failed');
      });
    });
  },
  replaceData: async function (newData) {
    try {
      await plantCurrentInfo.emptyDB();
    } catch (e) {
      return Promise.reject();
    }
    const url = 'luna://com.webos.service.db/put';
    const params = {
      objects: [
        {
          _kind: kindID_plantCurrentInfo,
          level: newData.level,
          isAutoControl: newData.isAutoControl,
          waterCount: data.waterCount,
          satisfaction: newData.satisfaction,
          sensingData: newData.sensingData,
        },
      ],
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
  getLevel: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject('getLevel failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].level);
        else reject('getLevel failed');
      });
    });
  },
  getWaterCount: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject('getWaterCount failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].waterCount);
        else reject('getWaterCount failed');
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
        if (res.payload.returnValue != true) reject();
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
        if (res.payload.returnValue != true) reject();
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].satisfaction);
        else reject();
      });
    });
  },
  getSensingData: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject();
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].sensingData);
        else reject();
      });
    });
  },
  isDataExist: function () {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject();
        if (res.payload.results.length != 0) resolve(true);
        else resolve(false);
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
};

///////////////////////// DB: imageUrl
const kindID_imageUrl = 'com.team17.homegardening.imageUrl:1';
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
          caller: '*',
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: async function (newData) {
    try {
      await imageUrl.emptyDB();
    } catch (e) {
      return Promise.reject('emptyDB failed');
    }
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('put failed');
      });
    });
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
        if (res.payload.returnValue != true) reject('getNormalImageUrl failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].normalImageUrl);
        else reject('getNormalImageUrl failed');
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
};

///////////////////////// DB: plantEnvInfo
const kindID_plantEnvInfo = 'com.team17.homegardening.plantEnvInfo:1';
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
          caller: '*',
        },
      ],
    };
    service.call(url, params, (res) => {});
  },
  replaceData: async function (newData) {
    try {
      await plantEnvInfo.emptyDB();
    } catch (e) {
      return Promise.reject();
    }
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
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
        if (res.payload.returnValue != true) reject('getWaterValue failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].waterValue);
        else reject('getWaterValue failed');
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
        if (res.payload.returnValue != true) reject('getWaterRange failed');
        if (res.payload.results.length != 0)
          resolve(res.payload.results[0].waterRange);
        else reject('getWaterRange failed');
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
        if (res.payload.returnValue != true) reject();
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
        if (res.payload.returnValue != true) reject();
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
        if (res.payload.returnValue != true) reject();
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
        if (res.payload.returnValue != true) reject();
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
        if (res.payload.returnValue != true) reject();
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
        if (res.payload.returnValue != true) reject();
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
};

///////////////////////// DB: envSensingData
const kindID_envSensingData = 'com.team17.homegardening.envSensingData:1';
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
          caller: '*',
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
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('envSensingData.putData failed');
      });
    });
  },
};

///////////////////////// DB: (캘린더용) wateringRecord
const kindID_wateringRecord = 'com.team17.homegardening.wateringRecord:1';
const wateringRecord = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_wateringRecord,
      owner: busID,
      indexes: [
        {
          name: 'index0',
          props: [{ name: 'year' }],
        },
        {
          name: 'index1',
          props: [{ name: 'month' }],
        },
        {
          name: 'index2',
          props: [{ name: 'day' }],
        },
        {
          name: 'index3',
          props: [{ name: 'year' }, { name: 'month' }],
        },
        {
          name: 'index4',
          props: [{ name: 'year' }, { name: 'month' }, { name: 'day' }],
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
          object: kindID_wateringRecord,
          type: 'db.kind',
          caller: '*',
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
          _kind: kindID_wateringRecord,
          year: data.year,
          month: data.month,
          day: data.day,
          count: data.count,
        },
      ],
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
  updateCount: function (year, month, day) {
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_plantCurrentInfo,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
          { prop: 'day', op: '=', val: day },
        ],
      },
      props: {
        count: count + 1,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject();
      });
    });
  },
  getMonthData: function (year, month) {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_wateringRecord,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject();
        resolve(res.payload.results);
      });
    });
  },
  isDataExist: function (year, month, day) {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_wateringRecord,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
          { prop: 'day', op: '=', val: day },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject();
        if (res.payload.results.length != 0) resolve(true);
        else resolve(false);
      });
    });
  },
};

///////////////////////// DB: (캘린더용) avgSatisfactionRecord
const kindID_avgSatisfactionRecord =
  'com.team17.homegardening.avgSatisfactionRecord:1';
const avgSatisfactionRecord = {
  putKind: function () {
    const url = 'luna://com.webos.service.db/putKind';
    const params = {
      id: kindID_avgSatisfactionRecord,
      owner: busID,
      indexes: [
        {
          name: 'index0',
          props: [{ name: 'year' }],
        },
        {
          name: 'index1',
          props: [{ name: 'month' }],
        },
        {
          name: 'index2',
          props: [{ name: 'day' }],
        },
        {
          name: 'index3',
          props: [{ name: 'year' }, { name: 'month' }],
        },
        {
          name: 'index4',
          props: [{ name: 'year' }, { name: 'month' }, { name: 'day' }],
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
          object: kindID_avgSatisfactionRecord,
          type: 'db.kind',
          caller: '*',
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
          _kind: kindID_avgSatisfactionRecord,
          year: data.year,
          month: data.month,
          day: data.day,
          avgSatisfaction: data.avgSatisfaction,
          count: data.count, // 지금까지 더해진 데이터 개수 (평균내야되니 따로 저장)
        },
      ],
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('avgSatisfactionRecord.putData failed');
      });
    });
  },
  updateAvgSatisfaction: async function (year, month, day, satisfactionNow) {
    let curData;
    try {
      curData = await avgSatisfactionRecord.getDayData(year, month, day);
    } catch (e) {
      return Promise.reject('avgSatisfactionRecord.getDayData failed');
    }
    const url = 'luna://com.webos.service.db/merge';
    const params = {
      query: {
        from: kindID_avgSatisfactionRecord,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
          { prop: 'day', op: '=', val: day },
        ],
      },
      props: {
        avgSatisfaction:
          (curData.avgSatisfaction + satisfactionNow * curData.count) /
          (curData.count + 1),
        count: curData.count + 1,
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue == true) resolve();
        else reject('avgSatisfactionRecord.updateAvgSatisfaction failed');
      });
    });
  },
  getMonthData: function (year, month) {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_avgSatisfactionRecord,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject();
        resolve(res.payload.results);
      });
    });
  },
  getDayData: function (year, month, day) {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_avgSatisfactionRecord,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
          { prop: 'day', op: '=', val: day },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true) reject();
        if (res.payload.results.length != 0) resolve(res.payload.results[0]);
        else reject();
      });
    });
  },
  isDataExist: function (year, month, day) {
    const url = 'luna://com.webos.service.db/find';
    const params = {
      query: {
        from: kindID_avgSatisfactionRecord,
        where: [
          { prop: 'year', op: '=', val: year },
          { prop: 'month', op: '=', val: month },
          { prop: 'day', op: '=', val: day },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      service.call(url, params, (res) => {
        if (res.payload.returnValue != true)
          reject('avgSatisfactionRecord.isDataExist failed');
        if (res.payload.results.length != 0) resolve(true);
        else resolve(false);
      });
    });
  },
};

// *************************************** HW ***************************************
function openI2C() {
  var openI2CApi = 'luna://com.webos.service.peripheralmanager/i2c/open';
  var openI2CParams = {name:"I2C1", address:1};

  service.call(openI2CApi, openI2CParams, (res) => {
    if (res.payload.returnValue) {
        console.log("open success");
    } else {
        console.log("open failed");
    }
  });
}

function closeI2C() {
  var closeI2CApi = 'luna://com.webos.service.peripheralmanager/i2c/close';
  var closeI2CParams = {name:"I2C1", address:1};

  function closeI2CApi_callback(res) {
      if (res.payload.returnValue) {
          console.log("close success");
      } else {
          console.log("close failed");
      }
  }
  service.call(closeI2CApi, closeI2CParams, closeI2CApi_callback);
}

function controlNeopixel(br) {
  var writeI2CApi = 'luna://com.webos.service.peripheralmanager/i2c/write';
  var writeI2CParams1 = {name:"I2C1", address:1, data:[0, 0]};
  var writeI2CParams2 = {name:"I2C1", address:1, data:[br]};

  function writeI2CApi_callback1(res) {
    if (res.payload.returnValue) {
      service.call(writeI2CApi, writeI2CParams2, writeI2CApi_callback2);
    } else {
      console.log("fail to control Neopixel");
    }
  }

  function writeI2CApi_callback2(res) {
    if (res.payload.returnValue) {
      console.log("success to control Neopixel");
    } else {
      console.log("fail to control Neopixel");
    }
  }
  service.call(writeI2CApi, writeI2CParams1, writeI2CApi_callback1);
}

function controlPump(on) {  // 0: turn off, 1: turn on
  var writeI2CApi = 'luna://com.webos.service.peripheralmanager/i2c/write';
  var writeI2CParams1 = {name:"I2C1", address:1, data:[0, 1]};
  var writeI2CParams2 = {name:"I2C1", address:1, data:[on]};

  function writeI2CApi_callback1(res) {
      if (res.payload.returnValue) {
          service.call(writeI2CApi, writeI2CParams2, writeI2CApi_callback2);
      } else {
          console.log("fail to control water pump");
      }
  }

  function writeI2CApi_callback2(res) {
      if (res.payload.returnValue) {
          console.log("success to control water pump");
      } else {
          console.log("fail to control water pump");
      }
  }

  service.call(writeI2CApi, writeI2CParams1, writeI2CApi_callback1);
}

async function readSensor() {
  var readI2CApi = 'luna://com.webos.service.peripheralmanager/i2c/read';
  var readI2CParams = {name:"I2C1", address:1, size:10};
  var writeI2CApi = 'luna://com.webos.service.peripheralmanager/i2c/write';
  var writeI2CParams = {name:"I2C1", address:1, data:[0, 2]};

  let water, light, temperature, humidity, watertank_level;

  function readI2CApi_callback(res) {
    const arg = res.payload;
    if (res.payload.returnValue) {
        var humid = arg.data[0] + arg.data[1] * 0.1;

        var temp = arg.data[2];
        if (arg.data[3] & 0x80) {
            temp = - 1 - temp;
        }
        temp += (arg.data[3] & 0x0f) * 0.1;

        var cds = arg.data[4] * 256 + arg.data[5];

        var water_level = arg.data[6] * 256 + arg.data[7];

        var soil_moisture = arg.data[8] * 256 + arg.data[9];

        humidity = humid;
        temperature = temp;
        light = Math.round(100 - (cds) / 10.23);
        watertank_level = Math.round(water_level / 10.23);
        water = Math.round(soil_moisture / 10.23);
    } else {
        console.log("fail to read from sensors");
    }
  }

  function writeI2CApi_callback(res) {
    if (res.payload.returnValue) {
        setTimeout(function() {
            service.call(readI2CApi, readI2CParams, readI2CApi_callback);
        }, 30);
    } else {
        console.log("fail to read from sensors");
    }
  }

  service.call(writeI2CApi, writeI2CParams, writeI2CApi_callback);

  await delay(500);
  // water tank level 판단 로직
  if (watertank_level < 180)
      watertank_level = 0
  else
    watertank_level = 1

  return {
    water,
    light: (100 - light),
    temperature,
    humidity,
    watertank_level
  }
}

async function delay(n) {
  return new Promise(resolve => setTimeout(resolve, n));
}