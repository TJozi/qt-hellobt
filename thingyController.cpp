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
}

void thingyController::initMqtt(QMqttClient* c){
    client = c;
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
        qDebug() << "Turning on leds";
        for(auto d : connectedDevices) {
            if(d == t){
                d->setLedColor(0,255,0);
            }else
                d->setLedColor(255, 0, 0);
        }
    }else{
        qDebug() << "Turning off leds";
        for(auto d : connectedDevices){
            d->setLedOff();
        }
    }



}