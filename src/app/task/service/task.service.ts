import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskModel, TaskResponse, TaskDetail } from '../models/task';
import { environment } from 'src/environments/environment';
import { PaginationResponse, AssignTask, AssignTaskResponse } from 'src/app/core/models/shared';
import { TaskBasic } from '../models/task-basic';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  create(taskCM: TaskModel): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.task.create}`, taskCM
    ).toPromise();
  }
  getTaskDetail(taskId: number): Promise<TaskDetail> {
    return this.httpClient.get<TaskDetail>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskDetail}`,
      {
        params: {
          taskId: `${taskId}`
        }
      }
    ).toPromise();
  }
  getTaskByDate(employeeId: number, fromDate: string, toDate: string, page: number, size: number): Promise<TaskResponse> {
    return this.httpClient.get<TaskResponse>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByDate}`,
      {
        params: {
          id: `${employeeId}`,
          fromDate: `${fromDate}`,
          toDate: `${toDate}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }
  getTodayTaskByEmployee(assigneeId: number): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTodayTask}?assigneeId=${assigneeId}`
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.task.remove}?taskId=${id}`
    ).toPromise();
  }

  update(taskUM: TaskModel): Promise<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.endPoint}${environment.apiPaths.task.update}`, taskUM,
    ).toPromise();
  }
  updateWorkplace(taskId: number, workplaceId: number): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.task.updateWorkplace}/${taskId}/${workplaceId}`, {}
    ).toPromise();
  }

  search(searchRequest: string, sortRequest: string, filterRequest: string, managerId: number, page: number, size: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.search.search}`,
      {
        params: {
          managerId: `${managerId}`,
          searchRequest: `${searchRequest}`,
          sortRequest: `${sortRequest}`,
          filterRequest: `${filterRequest}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }

  updateField(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.task.updateField}${id}`,
        {
          key: `${key}`,
          value: `${value}`
        }
      ).toPromise();
  }

  addTaskBasic(taskId: number, taskBasic: TaskBasic): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.task.addTaskBasic + taskId}`, taskBasic
    ).toPromise();
  }
  updateTaskBasicList(parentTaskId: number, taskBasic: TaskBasic[]): Promise<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.endPoint}${environment.apiPaths.task.updateTaskBasicList}`, taskBasic ,
      {
        params: {
          parentTaskId: `${parentTaskId}`
        }
      }
    ).toPromise();
  }
  getAssignHistory(taskId: number, sort: string, fieldSort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.task.getAssignHistory}`,
      {
        params: {
          taskId: `${taskId}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`,

        }
      }
    ).toPromise();
  }

  checkRemove(taskId: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.task.checkRemove}`,
      {
        params: {
          taskId: `${taskId}`,
        }
      }
    ).toPromise();
  }

  checkRemoveTaskBasic(taskId: number, assignerId: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.task.checkRemoveTaskBasic + taskId}/${assignerId}`,
    ).toPromise();
  }
}
