#include <QEventLoop>
#include <QBluetoothDeviceDiscoveryAgent>
#include "Thingy.h"


const QBluetoothUuid Thingy::UiLedCharacteristicUuid_= QBluetoothUuid(QStringLiteral("ef680301-9b35-4933-9b10-52ffa9740042"));
const QBluetoothUuid Thingy::ThingyServiceUuid_= QBluetoothUuid(QStringLiteral("ef680100-9b35-4933-9b10-52ffa9740042"));;
const QBluetoothUuid Thingy::UiServiceUuid_= QBluetoothUuid(QStringLiteral("ef680300-9b35-4933-9b10-52ffa9740042"));;
const QBluetoothUuid Thingy::UiButtonCharacteristicUuid_= QBluetoothUuid(QStringLiteral("ef680302-9b35-4933-9b10-52ffa9740042"));;

QList<QBluetoothDeviceInfo> Thingy::discover(const QList<QBluetoothAddress>& addresses){


    QBluetoothDeviceDiscoveryAgent agent;
    QList<QBluetoothDeviceInfo> devices;
    QEventLoop loop;

    QObject::connect(&agent, SIGNAL(finished()), &loop, SLOT(quit()));
    agent.start();
    loop.exec();
    for (auto device : agent.discoveredDevices()) {
        qDebug() << device.name() << device.address() << device.rssi();

        if (device.serviceUuids().contains(ThingyServiceUuid_) && (addresses.contains(device.address()))) {
            qDebug() << device.address() << " found.";
            devices << device;
        }
    }
    return devices;
}

Thingy* Thingy::connect(const QBluetoothDeviceInfo& info, QObject* parent){
    qDebug() << "Connecting to " << info.name() << info.address() << info.rssi();
    Thingy* thingy = new Thingy(parent);
    thingy->controller_ = QLowEnergyController::createCentral(info, nullptr);

    if (thingy->controller_ != nullptr)
    {
        QObject::connect(thingy->controller_,SIGNAL(connected()),thingy,SLOT(onConnected_()));
        thingy->controller_->setRemoteAddressType(QLowEnergyController::RandomAddress);
        thingy->controller_->connectToDevice();

    }
    return thingy;
}

void Thingy::setLedOff(){
    qDebug() << "Turn off the led";
    uiService_->writeCharacteristic(led, QByteArray::fromHex("01000000"));
}

void Thingy::setLedColor(quint8 red, quint8 green, quint8 blue){
    qDebug() << "Set led color: " << red << ";" << green << ";" << blue;

    const char newColor[] = {0x01, red, green, blue};
    uiService_->writeCharacteristic(led, QByteArray::fromRawData(newColor, sizeof(newColor)), QLowEnergyService::WriteWithoutResponse);
}


bool Thingy::setNotify_(QLowEnergyService& service, const QLowEnergyCharacteristic& characteristic, bool enabled){
    auto notifyDescriptor = characteristic.descriptor(
            QBluetoothUuid::ClientCharacteristicConfiguration);
    if (!notifyDescriptor.isValid()) {
        return false;
    }
    service.writeDescriptor(notifyDescriptor, QByteArray()
            .append(static_cast<char>(enabled ? 1U : 0U))
            .append(static_cast<char>(0U)));
    return true;
}


void Thingy::onServiceStateChanged_(QLowEnergyService::ServiceState newState){
    qDebug() << "Service state changed: " << newState;
    QObject::connect(uiService_,SIGNAL(characteristicChanged(const QLowEnergyCharacteristic&,const QByteArray&)),
                     this,SLOT(onCharacteristicChanged_(const QLowEnergyCharacteristic&, const QByteArray&)));

    led = uiService_->characteristic(UiLedCharacteristicUuid_);
    button = uiService_->characteristic(UiButtonCharacteristicUuid_);

    setNotify_(*uiService_, button, true);
    setState_(Thingy::Ready);

    QObject::connect(this,SIGNAL(buttonStateChanged(bool)),thingyController::getInstance(),SLOT(onButtonChanged(bool)));
    setLedOff();
}

void Thingy::onServiceDiscovered_(const QBluetoothUuid& newService){
    if(newService == UiServiceUuid_){
        qDebug() << "Service discovered: " << newService;
        uiService_ = controller_->createServiceObject(newService);
        uiService_->discoverDetails();
        QObject::connect(uiService_,SIGNAL(stateChanged(QLowEnergyService::ServiceState)),this,SLOT(onServiceStateChanged_(QLowEnergyService::ServiceState)));

    }
}

void Thingy::setState_(Thingy::State state){
    qDebug() << "Set state " << state_ << " to " << state;
    state_ = state;
    emit stateChanged(state);
}

void Thingy::onConnected_(){
    qDebug() << "Connected";
    QObject::connect(controller_,SIGNAL(serviceDiscovered(const QBluetoothUuid &)),this,SLOT(onServiceDiscovered_(const QBluetoothUuid &)));

    setState_(Thingy::Discovering);

    controller_->discoverServices();
}

void Thingy::onCharacteristicChanged_(const QLowEnergyCharacteristic& characteristic, const QByteArray& value){
    qDebug() << "Characteristic has changed. Value: " << value;

    if(characteristic == button){
        emit buttonStateChanged(*value);
    }

}

void Thingy::onDisconnected_(){

}

void Thingy::disconnect(){

}

