export class Manager {
  address: string;
  birthDate: string;
  email: string;
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
    this.email = '';
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