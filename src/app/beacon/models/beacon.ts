import { Place } from 'src/app/place/models/place';

export class Beacon {
  id: number;
  workplace: Place;
  workplaceId: number;
  description: string;
  name: string;
  placeName: string;
  major: number;
  minor: number;
  uuid: string;

  constructor() {
    this.id = 0;
    this.workplaceId = 0;
    this.description = '';
    this.name = '';
    this.uuid = '';
  }
}

export class BeaconModel {
  id: number;
  major: number;
  minor: number;
  uuid: string;

  constructor() {
    this.id = 0;
    this.major = 0;
    this.minor = 0;
    this.uuid = '';
  }
}
