#ifndef HELLOBT_THINGY_H
#define HELLOBT_THINGY_H

#pragma once
#include <QObject>
#include <QBluetoothAddress>
#include <QList>
#include <QBluetoothUuid>
#include <QBluetoothDeviceInfo>
#include <QLowEnergyController>
#include <QLowEnergyService>
#include <QLowEnergyCharacteristic>
#include <QByteArray>
#include <functional>
#include <QEventLoop>
#include "thingyController.h"
#include <QtMqtt>

class thingyController;

class Thingy : public QObject {
Q_OBJECT
public:
    enum State { Connecting, Discovering, Ready, Disconnected };

    QEventLoop loop;

    static QList<QBluetoothDeviceInfo> discover(const QList<QBluetoothAddress>& addresses = QList<QBluetoothAddress>());
    //static void discoverInfinitely(std::function<void(const QBluetoothDeviceInfo& info)> deviceDiscoveredCallback);
    static Thingy* connect(const QBluetoothDeviceInfo& info, QObject* parent = nullptr);
    void disconnect();

    inline State state() const {
        return state_;
    }

    inline QBluetoothAddress address() const {
        return controller_->remoteAddress();
    }

    void setLedOff();
    void setLedColor(quint8 red, quint8 green, quint8 blue);

signals:
    void stateChanged(State state);
    void buttonStateChanged(bool value);

private slots:
    void onConnected_();
    void onServiceDiscovered_(const QBluetoothUuid& newService);
    void onServiceStateChanged_(QLowEnergyService::ServiceState newState);
    void onCharacteristicChanged_(const QLowEnergyCharacteristic& characteristic, const QByteArray& value);
    void onDisconnected_();


private:
    explicit Thingy(QObject* parent) : QObject(parent) {}
    static bool setNotify_(QLowEnergyService& service, const QLowEnergyCharacteristic& characteristic, bool enabled);
    void setState_(State state);

    State state_ = Connecting;
    QLowEnergyController* controller_ = nullptr;
    QLowEnergyService* uiService_ = nullptr;

    QLowEnergyCharacteristic button;
    QLowEnergyCharacteristic led;


    static const QBluetoothUuid ThingyServiceUuid_;
    static const QBluetoothUuid UiServiceUuid_;
    static const QBluetoothUuid UiLedCharacteristicUuid_;
    static const QBluetoothUuid UiButtonCharacteristicUuid_;


};

#endif //HELLOBT_THINGY_H
