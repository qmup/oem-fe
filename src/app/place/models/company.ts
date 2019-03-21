export class Company {
  address: string;
  id: number;
  name: string;
  picture: string;
  latitude: number;
  longitude: number;

  constructor() {
    this.address = '';
    this.id = 0;
    this.name = '';
    this.picture = '';
    this.latitude = 0;
    this.longitude = 0;
  }
}
