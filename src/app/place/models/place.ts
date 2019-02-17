export class Place {
  id: number;
  address: string;
  beaconId: number;
  description: string;
  name: string;

  constructor() {
    this.id = 0;
    this.address = '';
    this.beaconId = 0;
    this.description = '';
    this.name = '';
  }
}
