export class Company {
  address: string;
  coordinateId: number;
  id: number;
  name: string;
  picture: string;
  latitude: number;
  longitude: number;
  phone: string;
  status: number;

  constructor() {
    this.address = '';
    this.id = 0;
    this.coordinateId = 0;
    this.name = '';
    this.picture = '';
    this.latitude = 0;
    this.longitude = 0;
    this.phone = '';
    this.status = 1;
  }
}
