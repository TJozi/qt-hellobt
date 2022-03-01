#include <QCoreApplication>
#include <QBluetoothDeviceInfo>
#include <QtDebug>
#include <QBluetoothUuid>
#include <cstdio>
#include <QThread>
#include <QLowEnergyController>
#include "thingyController.h"

#include <QtCore>
#include <QtMqtt>


static const QBluetoothUuid ThingyServiceUuid(QStringLiteral("ef680100-9b35-4933-9b10-52ffa9740042"));
static const QBluetoothUuid ThingyUiService(QStringLiteral("ef680300-9b35-4933-9b10-52ffa9740042"));
static const QBluetoothUuid ThingyButtonState(QStringLiteral("ef680302-9b35-4933-9b10-52ffa9740042"));
static const QBluetoothUuid ThingyRgb(QStringLiteral("ef680301-9b35-4933-9b10-52ffa9740042"));

QList<QBluetoothDeviceInfo> thingies;
QLowEnergyController *lec = nullptr;
QList<QBluetoothUuid> services;
QLowEnergyService *uis = nullptr;
QLowEnergyCharacteristic led;
QLowEnergyCharacteristic button;

QList<QBluetoothAddress> address;


int main(int argc, char** argv) {
    QCoreApplication application(argc, argv);

    QMqttClient client;
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




    thingyController::getInstance()->initMqtt(&client);
    thingyController::getInstance()->initialize();

    puts("Starting...");

    thingyController::getInstance()->connect();

    QCoreApplication::exec();
}