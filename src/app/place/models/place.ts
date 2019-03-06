export class PlaceModel {
    description: string;
    id: number;
    name: string;
    numberOfReworks: number;
    picture: string;
    zoneId: number;

  constructor() {
    this.description = '';
    this.id = 0;
    this.name = '';
    this.numberOfReworks = 0;
    this.picture = '';
    this.zoneId = 0;
  }
}

export class Place {
  id: number;
  name: string;
  description: string;
  picture: string;
  zoneDTO: ZoneDTO;
  companyDTO: CompanyDTO;

  constructor() {
    this.description = '';
    this.id = 0;
    this.name = '';
    this.picture = '';
    this.description = '';
    this.zoneDTO = new ZoneDTO();
    this.companyDTO = new CompanyDTO();
  }
}

export class ZoneDTO {
  id: number;
  name: string;
  companyId: number;
  picture: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.companyId = 0;
    this.picture = '';
  }
}

export class CompanyDTO {
  id: number;
  name: string;
  address: string;
  picture: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.address = '';
    this.picture = '';
  }
}
