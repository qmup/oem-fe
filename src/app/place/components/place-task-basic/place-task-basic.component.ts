import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { TaskBasic } from 'src/app/task/models/task-basic';
import { TaskBasicService } from 'src/app/task/service/task-basic.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place-task-basic',
  templateUrl: './place-task-basic.component.html',
  styleUrls: ['./place-task-basic.component.scss']
})
export class PlaceTaskBasicComponent implements OnInit {

  taskBasic = [];
  workplaceId: number;
  refresh: EventEmitter<any> = new EventEmitter<any>();
  taskBasicList = [];
  selectedIds = [];
  taskBasicData: { listTaskID: number[], workplaceID: number};

  constructor(
    public modalRef: BsModalRef,
    private taskBasicService: TaskBasicService,
    private toastService: ToastService,
    private workplaceService: PlaceService

  ) { }

  ngOnInit() {
    this.getTaskBasic();
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

  changeCheckbox(id: number, event: any) {
    if (event.checked === true) {
      this.selectedIds.push(id);
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

}
