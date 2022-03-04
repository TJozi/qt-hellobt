//
// Created by tjozi on 19.01.2022.
//

#include "thingyController.h"
#include <QThread>

thingyController* thingyController::instance = 0;

thingyController::thingyController(){

}
thingyController* thingyController::getInstance(){
    static thingyController theController;
    if(instance == 0){
        instance = new thingyController;
    }
   return instance;
}


void thingyController::initialize(){
    emptyBluetoothCache();
    address.push_front((QBluetoothAddress)addressThingy1);
    address.push_front((QBluetoothAddress)addressThingy2);

    QFile jsonFile("../sdi-config.json");
    jsonFile.open(QIODevice::ReadOnly);
    auto jsonData = jsonFile.readAll();
    auto json = QJsonDocument::fromJson(jsonData);

    if(json.isObject())
    {
        auto object = json.object();
        auto broker = object["broker"].toObject();
        host = broker["host"].toString();
        port = broker["port"].toDouble();
        username = broker["username"].toString();
        password = broker["password"].toString();
    }

    appStatus.insert("connected",QJsonValue(false));
    appStatus.insert("thingies",QJsonArray());

    client.setHostname("vle" + host);
    client.setPort(port);
    client.setCleanSession(true);
    client.setUsername(username);
    client.setPassword(password);
    client.setWillTopic(username + "/hello/status");
    client.setWillMessage("offline");
    client.setWillRetain(true);
    client.connectToHost();

    QObject::connect(&client, &QMqttClient::connected, [&]() {
        appStatus["connected"] = QJsonValue(true);
        client.publish(QMqttTopicName(username + "/hello/status"), QJsonDocument(appStatus).toJson(), 0, true);
        //client.subscribe(QMqttTopicFilter(username + "/hello/text"));
        client.subscribe(QMqttTopicFilter(username + "/+/led"));
    });

    QObject::connect(&client, &QMqttClient::messageReceived,
                     [&](const QByteArray& message, const QMqttTopicName& topic) {
                         qDebug() << "Received message:" << topic.name();
                         qDebug() << message;
                         //client.publish(QMqttTopicName("sdi09/hello/TEXT"), message.toUpper());

                         auto json = QJsonDocument::fromJson(message);
                         auto object = json.object();
                         QStringList address = topic.name().split("/");


                         qDebug() << address;

                         setColorOnMessage(object["red"].toInt(), object["green"].toInt(), object["blue"].toInt(), (QBluetoothAddress)address.at(1));

                     });
}


void thingyController::connect(){
    thingies = Thingy::discover(address);


    for(auto t: thingies){
        connectedDevices.append(Thingy::connect(t));
       // connectedDevices << Thingy::connect(t);
    }
}

void thingyController::emptyBluetoothCache()
{
    system("sudo sh -c \"systemctl stop bluetooth && rm -rf /var/lib/bluetooth/* && systemctl start bluetooth\"");
    QThread::msleep(1000);
}

void thingyController::notifyButtonPressed(Thingy* thingy){

}
void thingyController::onButtonChanged(bool value){
    qDebug() << "Button press notified to controller";
    auto* t=qobject_cast<Thingy*>(sender());

    if(value){
        client.publish(QMqttTopicName("sdi09/" + t->address().toString() + "/button"),"true");
        qDebug() << "Turning on leds";
        for(auto d : connectedDevices) {
            if(d == t){
                d->setLedColor(0,255,0);
            }else
                d->setLedColor(255, 0, 0);
        }
    }else
        client.publish(QMqttTopicName("sdi09/" + t->address().toString() + "/button"),"false");
}

void thingyController::setColorOnMessage(int red, int green, int blue, QBluetoothAddress addr) {
    for(auto d : connectedDevices) {
        if (d->address() == addr)
            d->setLedColor(red, green, blue);
    }
}