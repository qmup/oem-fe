class AccountDTO {
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

export class UserAccount {
  accountDTO: AccountDTO;
  picture: string;
  roleId: number;

  constructor() {
    this.accountDTO = new AccountDTO();
    this.picture = '';
    this.roleId = 0;
  }
}
