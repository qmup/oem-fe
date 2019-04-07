import { Component, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
declare var google: any;

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
  selector: 'app-saler',
  templateUrl: './saler.component.html',
  styleUrls: ['./saler.component.scss']
})

export class SalerComponent {

  geocoder: any;
  public location: Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 5
  };

  @ViewChild(AgmMap) map: AgmMap;

  constructor(public mapsApiLoader: MapsAPILoader) {
    this.mapsApiLoader = mapsApiLoader;

    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  updateOnMap() {
    let full_address: string = this.location.address_level_1 || '';
    if (this.location.address_level_2) { full_address = full_address + ' ' + this.location.address_level_2; }
    if (this.location.address_state) { full_address = full_address + ' ' + this.location.address_state; }
    if (this.location.address_country) { full_address = full_address + ' ' + this.location.address_country; }

    this.findLocation(full_address);
  }

  findLocation(address) {
    if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(status, google.maps.GeocoderStatus.OK);
      if (status = google.maps.GeocoderStatus.OK) {
        for (let i = 0; i < results[0].address_components.length; i++) {
          const types = results[0].address_components[i].types;

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
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize();
      } else {
      }
    });
  }


  findAddressByCoordinates() {
    this.geocoder.geocode({
      'location': {
        lat: this.location.marker.lat,
        lng: this.location.marker.lng
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    });
  }

  decomposeAddressComponents(addressArray) {
    if (addressArray.length === 0) { return false; }
    const address = addressArray[0].address_components;

    for (const element of address) {
      if (element.length === 0 && !element['types']) { continue; }

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
  }

}
