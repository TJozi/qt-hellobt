//
// Created by tjozi on 19.01.2022.
//

#include "thingyController.h"
#include <QThread>

thingyController* thingyController::instance = 0;

thingyController::thingyController(){}

thingyController* thingyController::getInstance(){
    static thingyController theController;
    if(instance == 0){
        instance = new thingyController;
    }
   return instance;
}

void thingyController::initialize(){
    emptyBluetoothCache();
    //The addresses of our devices
    //address.push_front((QBluetoothAddress)addressThingy1);
    //address.push_front((QBluetoothAddress)addressThingy2);


    //Opens and reads the json file for mqtt broker
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
        addrList = object["thingies"].toArray();
    }
    //Adds the addresses directly from the json file
    for(auto l :addrList){
        address.push_front((QBluetoothAddress)l.toString());
    }



    //Status of the connection
    appStatus.insert("connected",QJsonValue(false));
    appStatus.insert("thingies",QJsonArray());

    client.setHostname("vle" + host);
    client.setPort(port);
    client.setCleanSession(true);
    client.setUsername(username);
    client.setPassword(password);
    client.setWillTopic(username + "/hello/status");
    client.setWillMessage(QJsonDocument(appStatus).toJson());
    client.setWillRetain(true);
    client.connectToHost();

    QObject::connect(&client, &QMqttClient::connected, [&]() {
        appStatus["connected"] = QJsonValue(true);
        client.publish(QMqttTopicName(username + "/hello/status"), QJsonDocument(appStatus).toJson(), 0, true);
        client.subscribe(QMqttTopicFilter(username + "/+/led"));
    });

    QObject::connect(&client, &QMqttClient::messageReceived,
                     [&](const QByteArray& message, const QMqttTopicName& topic) {
                         qDebug() << "Received message:" << topic.name();
                         qDebug() << message;

                         auto json = QJsonDocument::fromJson(message);
                         auto object = json.object();
                         QStringList splitTopic = topic.name().split("/");

                         if(splitTopic.at(2) == "led" && address.contains((QBluetoothAddress)splitTopic.at(1)))
                            setColorOnMessage(object["red"].toInt(), object["green"].toInt(), object["blue"].toInt(), (QBluetoothAddress)splitTopic.at(1));
                     });
}

//Establishes the connection
void thingyController::connect(){

    //Does discovering until all devices are connected
    while(true){
        thingies = Thingy::discover(address);

        if(thingies.count() == addrList.count())
            break;
    }

    //Connects thingies
    for(auto t: thingies){
        connectedDevices.append(Thingy::connect(t));
    }

    //Updates the status on the broker with the connected devices' addresses
    for(auto d : connectedDevices) {
        statusAddresses.append(d->address().toString());
    }
    appStatus["thingies"] = statusAddresses;
    client.publish(QMqttTopicName(username + "/hello/status"), QJsonDocument(appStatus).toJson(), 0, true);
}

void thingyController::emptyBluetoothCache()
{
    system("sudo sh -c \"systemctl stop bluetooth && rm -rf /var/lib/bluetooth/* && systemctl start bluetooth\"");
    QThread::msleep(1000);
}

//The button's state has changed
void thingyController::onButtonChanged(bool value){
    qDebug() << "Button press notified to controller";
    auto* t=qobject_cast<Thingy*>(sender());

    if(value){
        client.publish(QMqttTopicName(username + "/" + t->address().toString() + "/button"),"true");    //Btn pressed
        qDebug() << "Turning on leds";
        for(auto d : connectedDevices) {
            if(d == t){
                d->setLedColor(0,255,0);        //Set led to green color
            }else
                d->setLedColor(255, 0, 0);      //Set led to red color
        }
    }else
        client.publish(QMqttTopicName(username + "/" + t->address().toString() + "/button"),"false");   //Btn released
}

//Broker sets the led color
void thingyController::setColorOnMessage(int red, int green, int blue, QBluetoothAddress addr) {
    for(auto d : connectedDevices) {
        if (d->address() == addr)
            d->setLedColor(red, green, blue);
    }
}