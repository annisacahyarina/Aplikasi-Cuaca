import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap: string = "topo-vector";

  constructor () {}

  async ngOnInit() {
    this.initializeMap();
  }

  async initializeMap() {
    const map = new Map({
      basemap: this.selectedBasemap
    });

      this.mapView = new MapView({
        container: "container",
        map: map,
        zoom: 8
      });

      let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
      map.add(weatherServiceFL);

      this.addWeatherPointMarker();

      setInterval(this.updateUserLocationOnMap.bind(this), 10000);
    }

    async changeBasemap() {
      if (this.mapView) {
        this.mapView.map.basemap = this.selectedBasemap;
      }
    }

    addWeatherPointMarker() {
      // Create a point in London, Kanada
      let point = new Point({
        longitude:-81.25139185901055, // Longitude for Kansas
        latitude: 42.98529724814115   // Latitude for Kansas
      });

      // Create a symbol for the point
      let markerSymbol = new SimpleMarkerSymbol({
        color: [255, 0, 0], // Red color
        size: '12px', // Size of the marker
        outline: {
          color: [255, 255, 255], // White outline
          width: 2
        }
      });

      // Create a graphic and add it to the mapView
      let pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      this.mapView.graphics.add(pointGraphic);
    }

    //   await this.updateUserLocationOnMap();
    //   this.mapView.center = this.userLocationGraphic.geometry as Point;
    //   setInterval(this.updateUserLocationOnMap.bind(this), 10000)
    // }

    async getLocationService(): Promise<number[]> {
      return new Promise((resolve,reject) => {
        navigator.geolocation.getCurrentPosition((resp) => {
          resolve([resp.coords.latitude, resp.coords.longitude]);
        });
      });
    }


    async updateUserLocationOnMap() {
      let latLng = await this.getLocationService();
      let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
      if (this.userLocationGraphic) {
        this.userLocationGraphic.geometry = geom;
      } else {
        this.userLocationGraphic = new Graphic({
          symbol: new SimpleMarkerSymbol(),
          geometry: geom,
        });
        this.mapView.graphics.add(this.userLocationGraphic);
      }
    }
  }

  const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'

  // constructor() { }
  // private latitude: number | any;
  // private longitude: number | any;


  // public async ngOnInit() {
  //   const position = await Geolocation.getCurrentPosition();
  //   this.latitude = position.coords.latitude;
  //   this.longitude = position.coords.longitude;
  //   console.log("Latitude: ", this.latitude);
  //   console.log("Longitude: ", this.longitude);

  //   //this.longitude = 104.7636459590521;
  //   //this.latitude = -2.966622879803988;

  //   const map = new Map({
  //     basemap: "streets"
  //   });

  //   const view = new MapView({
  //     container: "container",
  //     map: map,
  //     zoom: 10,
  //     center: [this.longitude, this.latitude]

  //   });

  //   // Daftar koordinat marker yang ingin ditambahkan
  //   const locations = [
  //     {
  //       lat: -7.749466433390639, lon: 110.36959401342416,
  //       name: "Monumen Jogja Kembali",
  //       description: "Museum berbentuk kerucut yang menampilkan diorama & pameran lain tentang Revolusi Nasional Indonesia",
  //       image: ""
  //     }, // monumen jogja kembali

  //     {
  //       lat: -7.782914794662193, lon: 110.36707475818666,
  //       name: "Tugu Jogja",
  //       description: "Landmark berwarna putih & emas di pulau lalu lintas, dibangun pada tahun 1889 & diterangi lampu sorot setelah gelap",
  //       image: ""
  //     }, // tugu jogja

  //     {
  //       lat: -7.801038888707962, lon: 110.36522277667834,
  //       name: "Monumen 1 Maret 1949",
  //       description: "Monumen Serangan Umum 1 Maret 1949",
  //       image: ""
  //     }, // monumen 1 maret

  //     {
  //       lat: -7.789406623057842, lon: 110.36608644109619,
  //       name: "Yogyakarta Station Monument",
  //       description: "Monumen Stasiun KA Jogjakarta",
  //       image: ""
  //     }, // jogja station monumen

  //     {
  //       lat: -7.75481810823495, lon:  110.38797938281272,
  //       name: "Monumen Pahlawan Pancasila Kentungan",
  //       description: "Museum ini dibangun di Kentungan Yogyakarta yang diresmikan pada tahun 1991, diatas tanah tempat terjadinya pembunuhan kejam atas diri Pahlawan Revolusi Brigadir Jenderal TNI Anumerta Katamso dan Kolonel Infanteri Anumerta Sugiyono",
  //       image: ""
  //     } // monumen
  //   ];

  //   const markerSymbol = new SimpleMarkerSymbol({
  //     style: "circle",
  //     color: [226, 119, 40],  // Warna marker
  //     outline: {
  //       color: [255, 255, 255],  // Warna outline
  //       width: 2
  //     }
  //   });

  //   // Iterasi melalui setiap lokasi dan tambahkan marker ke peta
  //   view.when(() => {
  //     locations.forEach(location => {
  //       const point = new Point({
  //         latitude: location.lat,
  //         longitude: location.lon
  //       });

  //       const pointGraphic = new Graphic({
  //         geometry: point,
  //         symbol: markerSymbol,
  //         popupTemplate: {
  //           title: location.name,
  //           content: `
  //           <p>${location.description}</p>
  //           <br>
  //         `,
  //         },
  //       });

  //       // Menambahkan marker ke peta
  //       view.graphics.add(pointGraphic);

  //       // Membuka pop-up secara manual setelah menambahkan marker
  //       view.popup.open({
  //         title: location.name,
  //         content: `
  //         <p>${location.description}</p>
  //         <img src="${location.image}" alt="${location.name}" style="width: 100%; height: auto;" /> <br>
  //       `,
  //       location: point  // Koordinat lokasi di mana pop-up akan muncul
  //       });
  //     });
  //   });



