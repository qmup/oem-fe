export class Employee {
  address: string;
  birthDate: string;
  dateCreate: string;
  deviceToken: string;
  email: string;
  employeeId: string;
  firstName: string;
  fullName: string;
  coordinateId: number;
  id: number;
  lastName: string;
  managerId: number;
  password: string;
  phoneMacAddress: string;
  phoneNumber: string;
  picture: string;
  resetPasswordToken: string;
  roleId: number;
  sex: boolean;
  latitude: number;
  longitude: number;
  status: number;
  roleName: string;

  constructor() {
    this.address = '';
    this.birthDate = '';
    this.dateCreate = '';
    this.deviceToken = '';
    this.email = '';
    this.coordinateId = 0;
    this.employeeId = '';
    this.firstName = '';
    this.fullName = '';
    this.id = 0;
    this.lastName = '';
    this.managerId = 0;
    this.password = '';
    this.phoneMacAddress = '';
    this.phoneNumber = '';
    this.picture = '';
    this.resetPasswordToken = '';
    this.roleId = 4;
    this.sex = false;
    this.latitude = 0;
    this.longitude = 0;
    this.status = 1;
    this.roleName = '';
  }
}
