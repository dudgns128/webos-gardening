const pkgInfo = require('./package.json');
const Service = require('webos-service');
// const WebSocket = require('ws');

const service = new Service(pkgInfo.name); // Create service by service name on package.json

module.exports = service;
