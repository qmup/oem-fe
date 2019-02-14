import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput, humanizeBytes } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  taskList: any;
  private sorted = false;

  ngOnInit() {
    this.taskList = [
      { id: 1, work: 'OEM-1 Dọn vệ sinh tầng 1', activity: 'Commented, yesterday', location: 'Nhà vệ sinh 1',
      employee: 'Nguyễn Văn Laborer' },
      { id: 2, work: 'OEM-2 Dọn vệ sinh tầng 2', activity: 'Created, January 21', location: 'Nhà vệ sinh 2',
      employee: 'Nguyễn Văn Laborer' },
      { id: 3, work: 'OEM-3 Dọn vệ sinh tầng 3', activity: 'Edited, Januray 22', location: 'Nhà vệ sinh 3',
      employee: 'Nguyễn Văn Laborer' },
      { id: 4, work: 'OEM-4 Dọn vệ sinh tầng 4', activity: 'Commented, yesterday', location: 'Nhà vệ sinh 4',
      employee: 'Nguyễn Văn Laborer' },
      { id: 5, work: 'OEM-5 Dọn vệ sinh tầng 5', activity: 'Created, January 21', location: 'Nhà vệ sinh 5',
      employee: 'Nguyễn Văn Laborer' },
      { id: 6, work: 'OEM-6 Dọn vệ sinh tầng 6', activity: 'Edited, Januray 22', location: 'Nhà vệ sinh 6',
      employee: 'Nguyễn Văn Laborer' },
      { id: 7, work: 'OEM-7 Dọn vệ sinh tầng 7', activity: 'Commented, yesterday', location: 'Nhà vệ sinh 7',
      employee: 'Nguyễn Văn Laborer' },
      { id: 8, work: 'OEM-8 Dọn vệ sinh tầng 8', activity: 'Commented, yesterday', location: 'Nhà vệ sinh 8',
      employee: 'Nguyễn Văn Laborer' },
      { id: 9, work: 'OEM-9 Dọn vệ sinh tầng 9', activity: 'Created, January 21', location: 'Nhà vệ sinh 9',
      employee: 'Nguyễn Văn Laborer' },
      { id: 10, work: 'OEM-10 Dọn vệ sinh tầng 10', activity: 'Edited, Januray 22', location: 'Nhà vệ sinh 10',
      employee: 'Nguyễn Văn Laborer' },
    ];
  }

  sortBy(by: string | any): void {

    this.taskList.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }

}
