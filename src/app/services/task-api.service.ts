import {
  inject,
  Injectable
} from '@angular/core';

import { Observable } from 'rxjs';
import { ITask } from '../interfaces/ITask';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TaskApiService {
  private readonly API_URL = 'http://localhost:3000/tasks';
  private readonly http: HttpClient = inject(HttpClient)

  public getTasks(): Observable<ITask[]>  {
    return this.http.get<ITask[]>(this.API_URL);
  }

  public getTaskById(id: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.API_URL}/${id}`);
  }

  public addTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.API_URL, task);
  }

  public updateStatus(id: number, status: string): Observable<ITask> {
    return this.http.patch<ITask>(`${this.API_URL}/${id}`, { status });
  }

  public deleteTask(id: number): Observable<ITask> {
    return this.http.delete<ITask>(`${this.API_URL}/${id}`);
  }
}
