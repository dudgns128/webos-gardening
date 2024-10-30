var WebSocketUtil = {};

WebSocketUtil.socket = new WebSocket("ws://15.164.95.57:8080/ws");

WebSocketUtil.socket.onopen = function (e) {
    const msg = {
        "method": 30,
        "userPlant": 0,
        "data": {
            "JSnum": false
        }
    };

    WebSocketUtil.socket.send(JSON.stringify(msg));
}

WebSocketUtil.socket.onmessage = function (event) {
    var arg = JSON.parse(event.data);
    if (arg.method === 11) {
        // console.log('arg : ', arg);
        if (WebSocketUtil.onReceivePlantsCallback !== undefined) {
            WebSocketUtil.plants = arg.plants;
            WebSocketUtil.onReceivePlantsCallback(arg.plants);
        }
    } else if (arg.method === 13) {
        if (WebSocketUtil.onReceivePlantPageDataCallback !== undefined) {
            WebSocketUtil.onReceivePlantPageDataCallback(arg);
        }
        if (WebSocketUtil.onReceivePlantConditionDataCallback !== undefined) {
            WebSocketUtil.onReceivePlantConditionDataCallback(arg);
        }
    } else if (arg.method === 3) {
        if (WebSocketUtil.onReceiveAutoControlCallback !== undefined) {
            WebSocketUtil.isAutoControl = (Boolean)(arg.autoControl);
            WebSocketUtil.onReceiveAutoControlCallback((Boolean)(arg.autoControl));
        }
    } else if (arg.method === 18) {
        if (WebSocketUtil.onReceiveCalendarDataCallback !== undefined) {
            WebSocketUtil.calendarData = arg.data;
            console.log("Received calendarData:", WebSocketUtil.calendarData);
            WebSocketUtil.onReceiveCalendarDataCallback(arg.data);
        }
    }
};

export default WebSocketUtil;
