import { AfterViewInit, Component, OnInit, ViewChild,Renderer2,ElementRef} from '@angular/core';
import { ToastController,Platform,IonContent, IonList } from '@ionic/angular';
import { GoogleMap,GoogleMapsEvent,Marker,GoogleMaps,GoogleMapsAnimation,MyLocation, MarkerOptions,BaseArrayClass,ILatLng} from '@ionic-native/google-maps';
import { DrawerState } from 'ion-bottom-drawer';
import { data } from '../common/data';
import { NumberObserverService } from '../service/number-observer.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,AfterViewInit {
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
  scrollAmount:any;
  value = 0;
  constructor(
      public toastCtrl: ToastController,
      private platform: Platform,
      private rendered: Renderer2,
      private numberObserver : NumberObserverService) {
        this.sampleData = data;
  }

  ngOnInit() {
      this.platform.ready();
      this.loadMap();
  }

  ngAfterViewInit(){
      window.addEventListener('scroll',this.onScroll,true)
  }
  
  onScroll = (event) => {
    const number = event.srcElement.scrollTop;
    const itemHeight = 55;
    let rowsInHeight = Math.floor(number/itemHeight);
    if(rowsInHeight != this.value){
        let activeElement = this.sampleData[rowsInHeight];
        this.onItemClick(activeElement);
        this.value = rowsInHeight;
    }
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
    //this.goToMyLocation();
    this.showMarkers();
  }

  showMarkers(){
    this.map.animateCamera({
      target: this.sampleData[0].position,
      zoom: 17,
      duration: 5000
    });

    this.sampleData.forEach(element => {
        //add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'I can locate you',
        snippet: 'This is awesome!',
        position: element.position,
        animation: GoogleMapsAnimation.BOUNCE
      });

      //show the infoWindow
      marker.showInfoWindow();
      this.onItemClick(this.sampleData[0]);
      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
            console.log("Click MAP",data);
        }
      );
    });

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
        zoom: 1,
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

  onItemClick(activeElement){
      let options: MarkerOptions = {
          styles: {
              'text-align': 'center',
              'font-style': 'italic',
              'font-weight': '600',
              'color': 'red'
          },
          position : activeElement.position,
          title: 'Activated!!!',
          visible : true
      }
      this.map.addMarker(options).then((marker: Marker) => {
          marker.showInfoWindow();
      });
  }
}
