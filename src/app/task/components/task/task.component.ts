import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput, humanizeBytes } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  iconPrioritySelect: Array<any>;
  iconStatusSelect: Array<any>;
  manager = 'Nguyễn Sinh Cung';
  employee = 'Nguyễn Hoàng Vũ';
  timeFrom: any;
  timeTo: any;
  dateFrom: any;
  dateTo: any;
  lightClock: any;
  darkClock: any;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  selectedPriority = '3';
  selectedStatus = '1';

  constructor() {
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
  }

  showFiles() {
      let files = '';
      for (let i = 0; i < this.files.length; i ++) {
        files += this.files[i].name;
         if (!(this.files.length - 1 === i)) {
           files += ',';
        }
      }
      return files;
   }

  startUpload(): void {
      const event: UploadInput = {
      type: 'uploadAll',
      url: 'your-path-to-backend-endpoint',
      method: 'POST',
      data: { foo: 'bar' },
      };
      this.files = [];
      this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
      this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {

      if (output.type === 'allAddedToQueue') {
      } else if (output.type === 'addedToQueue') {
        this.files.push(output.file); // add file to array when added
      } else if (output.type === 'uploading') {
        // update current data in files array for uploading file
        const index = this.files.findIndex(file => file.id === output.file.id);
        this.files[index] = output.file;
      } else if (output.type === 'removed') {
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
      } else if (output.type === 'dragOver') {
        this.dragOver = true;
      } else if (output.type === 'dragOut') {
      } else if (output.type === 'drop') {
        this.dragOver = false;
      }
      this.showFiles();
  }

  ngOnInit() {
    this.iconStatusSelect = [
      { value: '1', label: 'To Do',
      icon: 'https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/History_clock_time_clear_url_watch_hourglass.png' },
      { value: '2', label: 'Progress',
      icon: 'https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Hourglass_time_loading_wait_go_delete_add.png' },
      { value: '3', label: 'Done',
      icon: 'https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Ok_check_yes_tick_accept_success_green_correct.png' },
      { value: '4', label: 'Late',
      icon: 'https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Danger_hanger_triangle_traffic_cone.png' },
    ];
    this.iconPrioritySelect = [
      { value: '1', label: 'Highest',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/highest.svg' },
      { value: '2', label: 'High',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/high.svg' },
      { value: '3', label: 'Medium',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/medium.svg' },
      { value: '4', label: 'Low',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/low.svg' },
      { value: '5', label: 'Lowest',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/lowest.svg' },
    ];
  }

}
