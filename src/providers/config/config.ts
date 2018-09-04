import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocketOne } from '../../app/app.module';
import { NetworkInterface } from '@ionic-native/network-interface';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class ConfigProvider {
  loader: any;
  socket: SocketOne;

  constructor(public http: HttpClient,
    public loadingCtrl: LoadingController,
    private networkInterface: NetworkInterface) {
  }

  scanNetwork(callback) {
    var answer = {
      success: false,
      msg: 'Couldnt find your device. Your plant and your phone need to be in the same network to find each other.\n Try to turn off and on you plant and try again.',
      deviceIpAddress:'0.0.0.0'
    }
    //this.networkInterface.getIPAddress().then((value: string) => {
      this.presentLoading();
      //var str = value;  
      var str = "192.168.1.1";
      var pos = str.lastIndexOf('.');
      var prefix = str.slice(0, pos + 1);
      
      for (var i = 1; i < 2; i++) {
        let url = prefix + i + ":3001";
        let dummyUrl = "http://localhost:3001";// JUST FOR TESTING
        let s: SocketOne = new SocketOne(dummyUrl);
  
        s.on('connect_error', () => {
          s.disconnect();
        })
        s.on('connect', () => {
          answer.deviceIpAddress = dummyUrl;
        })
        s.connect();
      }
  
      setTimeout(() => {
        this.loader.dismiss();
        if(answer.deviceIpAddress!='0.0.0.0'){
          answer.success = true;
        }
        callback(answer);
      }, 5000);
    // },
    // error => {
    //   console.log(error)
    //   answer.msg = "You are not connected to any network!";
    //   callback(answer);
    // });
  }

  private presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait while we searching for your device",
    });
    this.loader.present();
  }
}
