import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  locations;

  constructor(private geolocation: Geolocation) {
    this.locations = [];
   }

  async getLocation() {
    const out = await this.geolocation.getCurrentPosition({
      maximumAge: 1,
      timeout: 5000,
      enableHighAccuracy: true
    });

    console.log(out);
    const longitudeLatitudeTimestamp = {long: out.coords.longitude, lat: out.coords.latitude, time: out.timestamp};
    this.locations.push(longitudeLatitudeTimestamp);
    await this.setData();
  }

  async ngOnInit(){
    await this.getData();
    await this.getLocation();
  }

  async setData(){
    await Storage.set({key: 'loc', value: JSON.stringify(this.locations)});
  }

  async getData(){
    const {value} = await Storage.get({key: 'loc'});
    if (value){
      this.locations = JSON.parse(value);
    }
    else{
      this.locations = [];
    }
  }

  async onDelete(timestamp){
    this.locations = this.locations.filter(e => e.time !== timestamp);
    await this.setData();
  }

}


