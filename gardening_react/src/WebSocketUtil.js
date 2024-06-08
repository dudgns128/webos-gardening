var WebSocketUtil = {};

WebSocketUtil.socket = new WebSocket("wss://52.79.60.122:8080/webpage");

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
    if (arg.method == 11) {
        WebSocketUtil.plants = arg.data.plants;
    } else if (arg.method == 13) {
        WebSocketUtil.plantData = arg.data;
    }
};

export default WebSocketUtil;