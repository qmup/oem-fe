import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  searchText: string;
  tableData = [
    { id: '1', firstName: 'Mark', lastName: 'Otto', age: '30', address: 'HCM City', email: 'test@gmail.com',
    phone: '0909090909', gender: 'Male' },
    { id: '2', firstName: 'Jacob', lastName: 'Thornton', age: '30', address: 'HCM City', email: 'test@gmail.com',
    phone: '0909090909', gender: 'Male' },
    { id: '3', firstName: 'Larry', lastName: 'Last', age: '30', address: 'HCM City', email: 'test@gmail.com',
    phone: '0909090909', gender: 'Female' },
    { id: '4', firstName: 'John', lastName: 'Doe', age: '30', address: 'HCM City', email: 'test@gmail.com',
    phone: '0909090909', gender: 'Male' },
    { id: '5', firstName: 'Zigi', lastName: 'Kiwi', age: '30', address: 'HCM City', email: 'test@gmail.com',
    phone: '0909090909', gender: 'Female' },
    { id: '6', firstName: 'Beatrice', lastName: 'Selphie', age: '30', address: 'HCM City', email: 'test@gmail.com',
    phone: '0909090909', gender: 'Male' },
  ];

  filterIt(arr: any, searchKey: any) {
    return arr.filter((obj: any) => {
      return Object.keys(obj).some((key) => {
        return obj[key].includes(searchKey);
      });
    });
  }

  search() {
    if (!this.searchText) {
      return this.tableData;
    }
    if (this.searchText) {
      return this.filterIt(this.tableData, this.searchText);
    }
  }

  constructor() { }

  ngOnInit() {
  }
}
