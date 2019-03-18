import { TaskBasic } from 'src/app/task/models/task-basic';
import { Shared, PaginationResponse } from 'src/app/core/models/shared';

export class PlaceModel {
  description: string;
  id: number;
  name: string;
  numberOfReworks: number;
  picture: string;
  zoneId: number;
  managerId: number;

  constructor() {
    this.description = '';
    this.id = 0;
    this.name = '';
    this.numberOfReworks = 0;
    this.picture = '';
    this.zoneId = 0;
    this.managerId = 0;
  }
}

export class Place {
  id: number;
  name: string;
  description: string;
  numberOfReworks: number;
  picture: string;
  zone: ZoneDTO;
  company: CompanyDTO;
  basicTaskList: TaskBasic[];

  constructor() {
    this.description = '';
    this.id = 0;
    this.name = '';
    this.picture = '';
    this.description = '';
    this.zone = new ZoneDTO();
    this.company = new CompanyDTO();
    this.numberOfReworks = 0;
    this.basicTaskList = new Array<TaskBasic>();
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

export class ManageWorkplace {
  companyId: number;
  id: number;
  managerId: number;
  workplaceId: number;
  zoneId: number;

  constructor() {
    this.companyId = 0;
    this.id = 0;
    this.managerId = 0;
    this.workplaceId = 0;
    this.zoneId = 0;
  }
}

export class PlacePagination {
  company: Shared;
  zone: Shared;
  listOfWorkplace: PaginationResponse;
}
