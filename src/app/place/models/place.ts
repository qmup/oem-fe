export class Place {
  id: number;
  address: string;
  description: string;
  name: string;
  beaconName: string;

  constructor() {
    this.id = 0;
    this.address = '';
    this.description = '';
    this.name = '';
    this.beaconName = '';
  }
}
