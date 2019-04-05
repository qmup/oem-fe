import { Component, OnInit, EventEmitter } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Employee } from 'src/app/employee/models/employee';
import { Place } from '../../models/place';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap';
import { ToastService } from 'ng-uikit-pro-standard';
import { TaskBasic } from 'src/app/task/models/task-basic';
import { PlaceTaskBasicComponent } from '../place-task-basic/place-task-basic.component';
import { TaskBasicService } from 'src/app/task/service/task-basic.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlaceService } from '../../services/place.service';
import { TaskService } from 'src/app/task/service/task.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {

  userAccount: Employee;
  workplace: Place;
  refresh: EventEmitter<any> = new EventEmitter<any>();
  taskBasicList = [];
  taskBasicResponse: PaginationResponse;
  taskBasic = [];
  selectedIds = [];


  constructor(
    private globalService: GlobalService,
    public modalRef: BsModalRef,
    private taskBasicService: TaskBasicService,
    private toastService: ToastService,
    private taskService: TaskService,
    private workplaceService: PlaceService,

  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getTaskBasicByWorkplace();
    this.getTaskBasicByManager();
  }

  getTaskBasicByManager() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id , '', '', 'id', 0, 99)
      .then(
        (response: any) => {
          this.taskBasicResponse = response;
          this.taskBasicList = response.content;
          this.taskBasicList.forEach((element1, i) => {
            if (this.taskBasic.length !== 0) {
              this.taskBasic.forEach((element2, j) => {
                if (element1.id === element2.id) {
                  element1.checked = true;
                  i++;
                  j = 0;
                }
              });

            }
          });
        }
      );
  }

  getTaskBasicByWorkplace() {
    this.workplaceService.getTaskBasic(this.workplace.id)
      .then(
        (response) => {
          this.taskBasic = response;
          this.taskBasicList.forEach((element1, i) => {
            this.taskBasic.forEach((element2, j) => {
              if (element1.id === element2.id) {
                this.selectedIds.push(element1.id);
                element1.checked = true;
                i++;
                j = 0;
              }
            });
          });
        }
      );
  }

  changeCheckbox(id: number, event: any) {
    if (event.checked) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds = this.selectedIds.filter(el => el !== id);
    }
  }

  updateTaskBasic() {
    const taskBasicData = {
      listTaskID: this.selectedIds,
      workplaceID: this.workplace.id
    };
    this.workplaceService.addTask(taskBasicData)
      .then(
        () => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

}
