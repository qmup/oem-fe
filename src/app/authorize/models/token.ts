export class UserAccount {
  id: number;
  employeeId: number;
  username: string;
  password: string;
  roleId: number;

  constructor() {
    this.id = 0;
    this.employeeId = 0;
    this.username = '';
    this.password = '';
    this.roleId = 0;
  }
}
