var WebSocketUtil = {};

WebSocketUtil.socket = new WebSocket("ws://52.79.60.122:8080/ws");

WebSocketUtil.socket.onopen = function(e) {
    const msg = {
        "method": 30,
        "userPlant": 0,
        "data": {
            "JSnum": false
        }
    };

    WebSocketUtil.socket.send(JSON.stringify(msg));
}

WebSocketUtil.socket.onmessage = function(event) {
    var arg = JSON.parse(event.data);
    if (arg.method === 11) {
        // console.log('arg : ', arg);
        WebSocketUtil.plants = arg.plants;
    } else if (arg.method === 13) {
        WebSocketUtil.plantData = arg;
    }
};

export default WebSocketUtil;