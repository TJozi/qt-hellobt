#include <QCoreApplication>
#include <QBluetoothDeviceInfo>
#include <QtDebug>
#include <QBluetoothUuid>
#include <cstdio>
#include <QThread>
#include <QLowEnergyController>
#include "thingyController.h"



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

    thingyController::getInstance()->initialize();

    puts("Starting...");

    thingyController::getInstance()->connect();

    QCoreApplication::exec();
}