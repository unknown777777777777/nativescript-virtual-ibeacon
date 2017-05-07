import {Common} from './nativescript-virtual-ibeacon.common';
import * as dialogs from 'ui/dialogs';
import * as application from "application";

declare var org: any;

export declare namespace android {
    export namespace bluetooth {
        export namespace le {
            export class AdvertiseCallback {

                static extend(param: { onStartFailure: ((errorCode) => any); onStartSuccess: ((settingsInEffect) => any) });
            }

            export class AdvertiseSettings {

            }

        }
    }
    export namespace os {

    }
}

export class NativescriptVirtualIbeacon extends Common {

    private beaconParser = null;
    private beaconTransmitter = null;

    private MyAdvertiseCallback = null;

    constructor() {
        super();
        this.beaconParser = new org.altbeacon.beacon.BeaconParser().setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24");  // iBeacon layout
        this.beaconTransmitter = new org.altbeacon.beacon.BeaconTransmitter(this.getContext(), this.beaconParser);

        this.MyAdvertiseCallback = android.bluetooth.le.AdvertiseCallback.extend({
            //constructor
            /*init: function() {
             this.super();
             },*/
            onStartFailure: function (errorCode) {
                //dialogs.alert("Android Error");
                console.log("Android Error");
            },

            onStartSuccess: function (settingsInEffect) {
                //dialogs.alert("Android Started2");
                console.log("Android Started2");
            }
        });

        let result = org.altbeacon.beacon.BeaconTransmitter.checkTransmissionSupported(this.getContext());
        if (result!=0) {
            console.log("iBeacon transmission NOT supported");
        } else {
            console.log("iBeacon transmission supported");
        }
    }

    public startAdvertisingBeaconWithString(uuid, identifier, major, minor) {

        // TODO integrate more checks

        let beacon = new org.altbeacon.beacon.Beacon.Builder()
            .setId1(uuid)
            .setId2(major + "")
            .setId3(minor + "")
            .setManufacturer(0x004C)
            .setTxPower(-56)
            // .setDataFields(Arrays.asList(new Long[] {0l})) // Remove this for beacon layouts without d: fields
            .build();

        this.beaconTransmitter.startAdvertising(beacon, new this.MyAdvertiseCallback());
        //dialogs.alert("Android Started");
        console.log("Android Started");
    }

    public stopAdvertisingBeacon() {
        this.beaconTransmitter.stopAdvertising();
        //dialogs.alert("Android Stopped");
        console.log("Android Stopped");
    }

    private getContext() {
        let context = application.android.context;
        return context
    }

}