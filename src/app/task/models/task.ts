import { Shared } from 'src/app/core/models/shared';
import { TaskBasic } from './task-basic';
import { BeaconModel, Beacon } from 'src/app/beacon/models/beacon';
import { TaskReport } from 'src/app/report/models/report';
import { ZoneDTO, CompanyDTO, PlaceModel } from 'src/app/place/models/place';

export class Task {
  attendanceStatus: number;
  basic: boolean;
  checkInTime: string;
  dateCreate: string;
  description: string;
  duration: number;
  id: number;
  picture: string;
  priority: number;
  scheduleId: number;
  startTime: string;
  status: number;
  title: string;
  taskBasics: TaskBasic[];
  editable: boolean;
  endTime: string;
  workplaceName: string;
  companyDTO: CompanyDTO;

  constructor() {
    this.attendanceStatus = 0;
    this.basic = false;
    this.checkInTime = '';
    this.dateCreate = '';
    this.description = '';
    this.duration = 0;
    this.id = 0;
    this.picture = '';
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 0;
    this.title = '';
    this.taskBasics = new Array<TaskBasic>();
    this.editable = false;
  }
}

export class TaskDaily {
  assignee: Shared;
  assigner: Shared;
  beacon: Beacon;
  date_create: string;
  description: string;
  id: number;
  picture: string;
  report: TaskReport[];
  startTime: string;
  status: string;
  title: string;
  workplace: {
    beaconDTO: {
      description: string,
      id: number,
      major: number,
      minor: number,
      name: string,
      uuid: string,
      workplace: PlaceModel;
      workplaceId: number;
    },
    companyDTO: CompanyDTO;
    description: string;
    id: number;
    name: string;
    numberOfReworks: number;
    picture: string;
    zoneDTO: ZoneDTO;
  };

  constructor() {
    this.assignee = new Shared();
    this.assigner = new Shared();
    this.beacon = new Beacon();
    this.date_create = '';
    this.description = '';
    this.id = 0;
    this.picture = '';
    this.report = new Array<TaskReport>();
    this.startTime = '';
    this.status = '';
    this.title = '';
  }
}

export class TaskModel {
  attendanceStatus: number;
  basic: boolean;
  checkInTime: string;
  dateCreate: string;
  description: string;
  duration: number;
  id: number;
  endTime: string;
  picture: string;
  priority: number;
  scheduleId: number;
  startTime: string;
  status: number;
  title: string;
  taskBasics: TaskBasic[];

  constructor() {
    this.endTime = '';
    this.attendanceStatus = 0;
    this.basic = false;
    this.checkInTime = '';
    this.dateCreate = '';
    this.description = '';
    this.duration = 0;
    this.id = 0;
    this.picture = '';
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 0;
    this.title = '';
    this.taskBasics = new Array<TaskBasic>();
  }
}

export class TaskResponse {
  content: Task[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  sort: null;
  first: boolean;
  size: number;
  number: number;
}

export class TaskDetail {
  id: number;
  assignee: Shared;
  title: string;
  workplace: Shared;
  beaconModel: BeaconModel;
  startTime: string;
  endTime: string;
  attendanceStatus: number;
  picture: string;
  status: number;
  description: string;
  rating: number;
  checkList: TaskBasic[];

  constructor() {
    this.id = 0;
    this.assignee = new Shared();
    this.title = '';
    this.workplace = new Shared();
    this.beaconModel = new BeaconModel();
    this.startTime = '';
    this.endTime = '';
    this.attendanceStatus = 0;
    this.picture = '';
    this.status = 0;
    this.description = '';
    this.checkList = new Array<TaskBasic>();
  }
}
