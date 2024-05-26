const kindID = 'com.team13.homegardening.plantInfo:1';
const pkgInfo = require('./package.json');
const Service = require('webos-service');

const service = new Service(pkgInfo.name);

putKind();

function putKind() {
  let url = 'luna://com.webos.service.db/putKind';
  let params = {
    id: kindID,
    owner: 'com.cosmos.sample.db',
    indexes: [
      {
        name: 'index0',
        props: [{ name: 'deviceName' }],
      },
      {
        name: 'index1',
        props: [{ name: 'location' }],
      },
      {
        name: 'index2',
        props: [{ name: 'status' }],
      },
    ],
  };
  service.call(url, JSON.stringify(params), (msg) => {
    console.log(msg);
  });
}
