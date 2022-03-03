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


    client.setHostname("vlesdi.hevs.ch");
    client.setPort(1883);
    client.setCleanSession(true);
    client.setUsername("sdi09");
    client.setPassword(QCryptographicHash::hash("sdi09", QCryptographicHash::Md5).toHex());
    client.setWillTopic("sdi09/hello/status");
    client.setWillMessage("offline");
    client.setWillRetain(true);
    client.connectToHost();

    QObject::connect(&client, &QMqttClient::connected, [&]() {
        client.publish(QMqttTopicName("sdi09/hello/status"), "online", 0, true);
        client.subscribe(QMqttTopicFilter("sdi09/hello/text"));
    });

    QObject::connect(&client, &QMqttClient::messageReceived,
                     [&](const QByteArray& message, const QMqttTopicName& topic) {
                         qDebug() << "Received message:" << topic.name();
                         qDebug() << message;
                         client.publish(QMqttTopicName("sdi09/hello/TEXT"), message.toUpper());
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