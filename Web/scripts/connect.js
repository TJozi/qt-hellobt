var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi09");

client.onConnectionLost = function (responseObject) {
    if (responseObject.errorCode !== 0) {
        console.error("Lost connection:" + responseObject.errorMessage);
    } else {
        console.log("Connection closed.");
    }
}

client.onMessageArrived = function (message) {
    console.log("Got message: topic=" + message.destinationName + ', payload=' +
        message.payloadString);
        
    //processMessage(message);
    //processMessage(message.destinationName, message.payloadString);
    thingyButtonPressed(message);
}

client.connect({
    userName: 'sdi09',
    password: '18681422d3fc90fcb3bed30757aebb3f',
    keepAliveInterval: 30,
    cleanSession: true,

    onSuccess: function () {
        setClient(client);

        console.log("Connected.");
        client.subscribe("sdi09/status");
        client.subscribe("sdi09/+/button");
        client.send('sdi09/D5:2F:7E:30:10:5A/led', JSON.stringify({
            red: 0,
            green: 0,
            blue: 255
        }));
    },
    onFailure: function () {
        console.error("Failed to connect.");
    }
});