import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { TaskBasic } from 'src/app/task/models/task-basic';
import { TaskBasicService } from 'src/app/task/service/task-basic.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlaceService } from '../../services/place.service';
import { TaskService } from 'src/app/task/service/task.service';
import { TaskModel, TaskDetail } from 'src/app/task/models/task';

@Component({
  selector: 'app-place-task-basic',
  templateUrl: './place-task-basic.component.html',
  styleUrls: ['./place-task-basic.component.scss']
})
export class PlaceTaskBasicComponent implements OnInit {

  taskBasic = [];
  taskUM: TaskModel = new TaskModel();
  task: TaskDetail = new TaskDetail();
  workplaceId: number;
  refresh: EventEmitter<any> = new EventEmitter<any>();
  taskBasicList = [];
  selectedIds = [];
  selectedTaskBasic = [];
  taskBasicData: { listTaskID: number[], workplaceID: number};

  constructor(
    public modalRef: BsModalRef,
    private taskBasicService: TaskBasicService,
    private toastService: ToastService,
    private taskService: TaskService,
    private workplaceService: PlaceService

  ) { }

  ngOnInit() {
    (this.taskBasic.length !== 0) ? this.getTaskBasic() : this.getAllTaskBasic();
  }

  getTaskBasic() {
    this.taskBasicService.getListTaskBasic(1 , '', '', 'id', 0, 99)
      .then(
        (response: any) => {
          this.taskBasicList = response.content;
          this.taskBasicList.forEach((element1, i) => {
            this.taskBasic.forEach((element2, j) => {
              if (element1.id === element2.id) {
                element1.checked = true;
                i++;
                j = 0;
              }
            });
          });
        }
      );
  }

  getAllTaskBasic() {
    this.taskBasicService.getListTaskBasic(1 , '', '', 'id', 0, 99)
    .then(
      (response: any) => {
        this.taskBasicList = response.content;
      }
    );
  }

  changeCheckbox(id: number, event: any) {
    if (event.checked) {
      this.selectedTaskBasic.push(this.taskBasicList.find(task => task.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(task => task.id !== id);
    }
  }

  updateTaskBasic() {
    this.taskBasicData = {
      listTaskID: this.selectedIds,
      workplaceID: this.workplaceId
    };
    this.workplaceService.addTask(this.taskBasicData)
      .then(
        () => {
          this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  selectTaskBasic() {
    this.taskUM.taskBasics = this.selectedTaskBasic;
    this.taskUM.title = this.task.title;
    this.taskUM.attendanceStatus = this.task.attendanceStatus;
    this.taskUM.description = this.task.description;
    this.taskUM.id = this.task.id;
    this.taskUM.endTime = this.task.endTime;
    this.taskUM.picture = this.task.picture;
    this.taskUM.startTime = this.task.startTime;
    this.taskUM.status = this.task.status;
    this.taskUM.title = this.task.title;
    this.taskService.update(this.taskUM)
      .then(
        () => {
          this.taskService.updateWorkplace(this.task.id, this.workplaceId)
            .then(
              (response) => {
                this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
                this.modalRef.hide();
                this.refresh.emit();
              },
              (error) => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

}
