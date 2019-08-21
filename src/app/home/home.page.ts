import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import { ToastController,Platform } from '@ionic/angular';
import { GoogleMap,GoogleMapsEvent,Marker,GoogleMaps,GoogleMapsAnimation,MyLocation, MarkerOptions} from '@ionic-native/google-maps';
import { DrawerState } from 'ion-bottom-drawer';
import { data } from '../common/data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: GoogleMap;
  address:string;
  shouldBounce = true;
  disableDrag = false;
  dockedHeight = 150;
  distanceTop = 56;
  drawerState = DrawerState.Docked;
  states = DrawerState;
  minimumHeight = 0;
  latlong : any;
  sampleData:any;
  constructor(
      public toastCtrl: ToastController,
      private platform: Platform) {
        this.sampleData = data;
  }

  ngOnInit() {
      this.platform.ready();
      this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      // camera: {
      //   target: {
      //     lat: 43.0741704,
      //     lng: -89.3809802
      //   },
      //   zoom: 18,
      //   tilt: 30
      // }
    });
    this.goToMyLocation();
  }


  goToMyLocation(){
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null ,2));
      this.latlong = location.latLng;
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });
      
      //add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'I can locate you',
        snippet: 'This is awesome!',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      //show the infoWindow
      marker.showInfoWindow();

      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
            console.log("Click MAP",data);
        }
      );
    })
    .catch(err => {
      //this.loading.dismiss();
      this.showToast(err.error_message);
    });
  }

  async showToast(message: string) {
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'middle'
      });
      toast.present();
  }

  onItemClick(index){
      if(index == 0){
            let options: MarkerOptions = {
              styles: {
                'text-align': 'center',
                'font-style': 'italic',
                'font-weight': '600',
                'color': 'red'
              },
              position : this.latlong,
              title: 'Activated!!!',
              visible : true
          }
          this.map.addMarker(options).then((marker: Marker) => {
              marker.showInfoWindow();
          });
      }
      
  }
}
