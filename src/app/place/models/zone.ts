import { Shared, PaginationResponse } from 'src/app/core/models/shared';

export class Zone {
  companyModel: Shared;
  id: number;
  name: string;
  picture: string;
  status: number;

  constructor() {
    this.companyModel = new Shared();
    this.status = 1;
    this.id = 0;
    this.name = '';
    this.picture = '';
  }
}

export class ZoneModel {
  companyId: number;
  id: number;
  name: string;
  picture: string;
  status: number;

  constructor() {
    this.companyId = 0;
    this.status = 1;
    this.id = 0;
    this.name = '';
    this.picture = '';
  }
}

export class ZonePagination {
  company: Shared;
  zone: Shared;
  listOfZone: PaginationResponse;
}
