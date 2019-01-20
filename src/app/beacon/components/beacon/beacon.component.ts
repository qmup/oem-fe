import { Component, OnInit, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';
import { Http } from '@angular/http';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-beacon',
  templateUrl: './beacon.component.html',
  styleUrls: ['./beacon.component.scss']
})
export class BeaconComponent {

  searchText: string;
  tableData = [
    { id: '1', floorName: 'Floor 1', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
    uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a1', major: '0be6'},
    { id: '2', floorName: 'Floor 2', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
    uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a2', major: '0be6'},
    { id: '3', floorName: 'Floor 3', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
    uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a3', major: '0be6'},
    { id: '4', floorName: 'Floor 4', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
    uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a4', major: '0be6'},
    { id: '5', floorName: 'Floor 5', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
    uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a5', major: '0be6'},
    { id: '6', floorName: 'Floor 6', location: '12.12312312312; -23.2323232323', time: '2015-04-20 12:12',
    uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', minor: '01a6', major: '0be6'},
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
}
