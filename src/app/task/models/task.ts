import { Shared, TaskCheckingModel } from 'src/app/core/models/shared';
import { TaskBasic } from './task-basic';
import { BeaconModel, Beacon } from 'src/app/beacon/models/beacon';
import { TaskReport } from 'src/app/report/models/report';
import { ZoneDTO, CompanyDTO, PlaceModel, CheckWorkplaceOverlap } from 'src/app/place/models/place';

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
    this.duration = 30;
    this.id = 0;
    this.picture = '';
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 1;
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
      description: string;
      id: number;
      major: number;
      minor: number;
      name: string;
      uuid: string;
      workplace: PlaceModel;
      workplaceId: number;
    };
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
    this.duration = 30;
    this.id = 0;
    this.picture = '';
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 1;
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
  dateCreate: string;
  priority: number;
  rating: number;
  scheduleId: number;
  assignee: Shared;
  title: string;
  workplace: Shared;
  beaconModel: BeaconModel;
  startTime: string;
  checkInTime: string;
  endTime: string;
  attendanceStatus: number;
  picture: string;
  status: number;
  description: string;
  checkList: TaskBasic[];

  constructor() {
    this.id = 0;
    this.rating = 5;
    this.assignee = new Shared();
    this.title = '';
    this.workplace = new Shared();
    this.beaconModel = new BeaconModel();
    this.startTime = '';
    this.endTime = '';
    this.checkInTime = '';
    this.attendanceStatus = 0;
    this.picture = '';
    this.status = 1;
    this.description = '';
    this.checkList = new Array<TaskBasic>();
  }
}

class DataTravel {
  distance: number;
  duration: number;

  constructor() {
    this.distance = 0;
    this.duration = 0;
  }
}

class TaskSuggestionModel {
  companyAddress: string;
  companyName: string;
  endTime: string;
  latitudeCompany: number;
  longitudeCompany: number;
  startTime: string;
  taskId: number;

  constructor() {
    this.companyAddress = '';
    this.companyName = '';
    this.endTime = '';
    this.latitudeCompany = 0;
    this.longitudeCompany = 0;
    this.startTime = '';
    this.taskId = 0;
  }
}

export class TaskSuggestion {
  caseCpaToCpcAvailable: boolean;
  caseCpcToCpbAvailable: boolean;
  cpaAddress: string;
  cpaName: string;
  cpbAddress: string;
  cpbName: string;
  dataTravelFromCpAtoCpc: DataTravel;
  dataTravelFromCpCtoCpB: DataTravel;
  employeeId: number;
  employeePicture: string;
  employeeName: string;
  endTimePreviousTask: string;
  moveFromHome: boolean;
  startTimeNextTask: string;
  taskSuggestionModels: TaskSuggestionModel[];
  timeAllowedCpaToCpc: number;
  timeAllowedCpcToCpB: number;
  totalPoint: number;
  typeCase: number;

  constructor() {
    this.caseCpaToCpcAvailable = false;
    this.caseCpcToCpbAvailable = false;
    this.cpaAddress = '';
    this.cpaName = '';
    this.cpbAddress = '';
    this.cpbName = '';
    this.dataTravelFromCpAtoCpc = new DataTravel();
    this.dataTravelFromCpCtoCpB = new DataTravel();
    this.employeeId = 0;
    this.employeePicture = '';
    this.employeeName = '';
    this.endTimePreviousTask = '';
    this.moveFromHome = false;
    this.startTimeNextTask = '';
    this.taskSuggestionModels = new Array<TaskSuggestionModel>();
    this.timeAllowedCpaToCpc = 0;
    this.timeAllowedCpcToCpB = 0;
    this.totalPoint = 0;
    this.typeCase = 0;
  }
}

export class AdvancedSearchRequest {
  taskId: number;
  status: number[];
  attendance: number[];
  assigneeId: number[];
  workplaceId: number[];
  moreList: number[];
  duration: number;
  name: string;
  dateCreate: string[];
  dateUpdate: string[];
  startTime: string[];

  constructor() {
    this.taskId = 0;
    this.status = [];
    this.attendance = [];
    this.assigneeId = [];
    this.workplaceId = [];
    this.moreList = [];
    this.duration = 0;
    this.name = '';
    this.dateCreate = [];
    this.dateUpdate = [];
    this.startTime = [];
  }
}

export class CheckTaskOverlap {
  workplaceTaskModel: CheckWorkplaceOverlap;
  timeOverlap: string;
  realizable: boolean;

  constructor() {
    this.workplaceTaskModel = new CheckWorkplaceOverlap();
    this.timeOverlap = '';
    this.realizable = false;
  }
}
