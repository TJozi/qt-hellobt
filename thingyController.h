//
// Created by tjozi on 19.01.2022.
//

#ifndef HELLOBT_THINGYCONTROLLER_H
#define HELLOBT_THINGYCONTROLLER_H


#include <QString>
#include <QBluetoothAddress>
#include <QBluetoothDeviceInfo>
#include <QList>
#include "Thingy.h"


class Thingy;

class thingyController : public QObject {
Q_OBJECT
public:
    static thingyController* getInstance();
    void emptyBluetoothCache();
    void initialize();
    void connect();
    void notifyButtonPressed(Thingy* thingy);


    QList<QBluetoothDeviceInfo> thingies;
    QList<Thingy*> connectedDevices;
    QList<QBluetoothAddress> address;
    QString addressThingy1 = "FD:17:0C:19:6A:F7";
    QString addressThingy2 = "D5:2F:7E:30:10:5A";

public slots:
    void onButtonChanged(bool value);

private:
    thingyController();

    static thingyController* instance;
};


#endif //HELLOBT_THINGYCONTROLLER_H
