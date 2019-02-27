// export class ManagerModel {
//   address: string;
//   birthDate: string;
//   email: string;
//   deviceToken: string;
//   firstName: string;
//   fullName: string;
//   employeeId: number;
//   id: number;
//   lastName: string;
//   managerId: number;
//   password: string;
//   phoneMacAddress: string;
//   phoneNumber: string;
//   picture: string;
//   resetPasswordToken: string;
//   roleId: number;
//   sex: boolean;

//   constructor() {
//     this.address = '';
//     this.deviceToken = '';
//     this.managerId = 0;
//     this.birthDate = '';
//     this.email = '';
//     this.firstName = '';
//     this.fullName = '';
//     this.id = 0;
//     this.lastName = '';
//     this.managerId = 0;
//     this.password = '';
//     this.phoneMacAddress = '';
//     this.phoneNumber = '';
//     this.picture = '';
//     this.resetPasswordToken = '';
//     this.roleId = 0;
//     this.sex = false;
//   }
// }

export class Manager {
  address: string;
  birthDate: string;
  deviceToken: string;
  email: string;
  employeeId: string;
  firstName: string;
  fullName: string;
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

  constructor() {
    this.address = '';
    this.birthDate = '';
    this.deviceToken = '';
    this.email = '';
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
    this.roleId = 0;
    this.sex = false;
  }
}
