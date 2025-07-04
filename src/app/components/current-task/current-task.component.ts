import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TaskApiService} from '../../services/task-api.service';
import {map, Subject, takeUntil} from 'rxjs';
import {ITask} from '../../interfaces/ITask';

@Component({
  selector: 'app-current-task',
  imports: [],
  templateUrl: './current-task.component.html',
  styleUrl: './current-task.component.scss'
})

export class CurrentTaskComponent implements OnInit, OnDestroy {
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _taskApiService: TaskApiService = inject(TaskApiService);
  private _destroy$: Subject<void> = new Subject<void>();
  public taskId: number = this._route.snapshot.params['id'];
  public currentTask: ITask = {
    title: '',
    status: ''
  }

  public ngOnInit(): void {
    this._taskApiService.getTaskById(this.taskId)
      .pipe(
        takeUntil(this._destroy$),
        map(task => this.currentTask = task)
      )
      .subscribe()
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
