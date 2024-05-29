const kindID = 'com.team17.homegardening.plantInfo:1';
const busID = 'com.team17.homegardening.service';
const pkgInfo = require('./package.json');
const Service = require('webos-service');

const service = new Service(pkgInfo.name);

const putKind = function () {
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
  service.call(url, JSON.stringify(params), (msg) => {});
};

const putPermissions = function () {
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
        caller: busID,
      },
    ],
  };
  service.call(url, JSON.stringify(params), (msg) => {});
};

const replaceData = function (newData) {
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
  service.call(url, JSON.stringify(params), (msg) => {});
};

const getData = function () {
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
};

const emptyDB = function () {
  let url = 'luna://com.webos.service.db/del';
  let params = {
    query: {
      from: kindID,
    },
  };
  service.call(url, JSON.stringify(params), (msg) => {});
};

module.exports = {
  putKind,
  putPermissions,
  replaceData,
  getData,
};