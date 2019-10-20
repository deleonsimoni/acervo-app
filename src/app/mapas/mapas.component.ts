import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { MapsAPILoader, AgmMap } from '@agm/core';
import * as MarkerClusterer from "@google/markerclusterer"

declare var google: any;
declare var MarkerClusterer: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-mapas',
  templateUrl: './mapas.component.html',
  styleUrls: ['./mapas.component.css']
})
export class MapasComponent implements OnInit { 

  constructor(private route: ActivatedRoute, private router: Router, public mapsApiLoader: MapsAPILoader) { 
    this.mapsApiLoader = mapsApiLoader;
    //new MarkerClusterer(map, opt_markers, opt_options)

    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  @ViewChild(AgmMap, { })
  map: AgmMap;

  geocoder: any;
  address_level: string="";
  
  location: Location = {
    lat: -23.877,
    lng: -49.804,
    zoom: 5
  };
  positions: any = [
    {
      lat: -23.8779431,
      lng: -49.8046873,
      label: 'Caverna 1',
      imagem: 'https://abrilsuperinteressante.files.wordpress.com/2018/07/56046e590e2163449306d1abmaior-caverna.jpeg?quality=70&strip=info'
    },
    {
      lat: -23.877,
      lng: -49.904,
      label: 'Caverna 2',
      imagem: 'https://assets.b9.com.br/wp-content/uploads/2019/04/resgate-meninos-tailandi-netflix-488x274.jpg'
    }
  ]

  ngOnInit() {
    this.route.queryParamMap.pipe(
      map(params => 
        this.location.address_level_1 = params.get('itemPesquisa')
      ));
  }

  updateOnMap() {
    let full_address: string = this.location.address_level_1 || ""
    if (this.location.address_level_2) { full_address = full_address + " " + this.location.address_level_2; }
    if (this.location.address_state) { full_address = full_address + " " + this.location.address_state; }
    if (this.location.address_country) { full_address = full_address + " " + this.location.address_country; }

    this.findLocation(full_address);
  }

  findLocation(address) {
    if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types;

          if (types.indexOf('locality') !== -1) {
            this.location.address_level_2 = results[0].address_components[i].long_name;
          }
          if (types.indexOf('country') !== -1) {
            this.location.address_country = results[0].address_components[i].long_name;
          }
          if (types.indexOf('postal_code') !== -1) {
            this.location.address_zip = results[0].address_components[i].long_name;
          }
          if (types.indexOf('administrative_area_level_1') !== -1) {
            this.location.address_state = results[0].address_components[i].long_name;
          }
        }

        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize();
      } else {
        alert("Sorry, this search produced no results.");
      }
    });
  }
}