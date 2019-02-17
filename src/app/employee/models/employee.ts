export class Employee {
  address: string;
  birthDate: string;
  email: string;
  firstName: string;
  fullName: string;
  id: number;
  lastName: string;
  managerId: number;
  phoneMacAddress: string;
  phoneNumber: string;
  picture: string;
  resetPasswordToken: string;
  roleId: number;
  sex: boolean;
  password: string;

  constructor() {
    this.address = '';
    this.birthDate = '';
    this.email = '';
    this.firstName = '';
    this.fullName = '';
    this.id = 0;
    this.lastName = '';
    this.managerId = 0;
    this.phoneMacAddress = '';
    this.phoneNumber = '';
    this.picture = '';
    this.resetPasswordToken = '';
    this.roleId = 0;
    this.sex = false;
    this.password = '';
  }
}

export class EmployeeCreateModel {
  roleId: number;
  managerId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  picture: string;
  birthDate: string;
  address: string;
  sex: boolean;
  phoneNumber: string;
  phoneMacAddress: string;
  resetPasswordToken: string;
  password: string;

  constructor() {
    this.roleId = 0;
    this.managerId = 0;
    this.firstName = '';
    this.lastName = '';
    this.fullName = '';
    this.email = '';
    this.picture = '';
    this.birthDate = '';
    this.address = '';
    this.sex = false;
    this.phoneNumber = '';
    this.phoneMacAddress = '';
    this.resetPasswordToken = '';
    this.password = '';
  }
}

export class EmployeeUpdateModel {
  address: string;
  birthDate: string;
  email: string;
  firstName: string;
  fullName: string;
  id: number;
  lastName: string;
  managerId: number;
  phoneMacAddress: string;
  phoneNumber: string;
  picture: string;
  password: string;
  resetPasswordToken: string;
  roleId: number;
  sex: boolean;

  constructor() {
    this.address = '';
    this.birthDate = '';
    this.email = '';
    this.firstName = '';
    this.fullName = '';
    this.id = 0;
    this.lastName = '';
    this.managerId = 0;
    this.phoneMacAddress = '';
    this.phoneNumber = '';
    this.picture = '';
    this.resetPasswordToken = '';
    this.roleId = 0;
    this.sex = false;
    this.password = '';
  }
}
