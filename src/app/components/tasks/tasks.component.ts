import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Observable,
  Subject,
  takeUntil,
  tap
} from 'rxjs';

import { TaskApiService } from '../../services/task-api.service';
import { ITask } from '../../interfaces/ITask';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Statuses} from '../../common/statuses.enum';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-tasks',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgForOf,
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TasksComponent implements OnInit, OnDestroy {
  public taskForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [ Validators.required ] }),
    status: new FormControl<string>('Не выполнена', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
  })
  public allTasks$: Observable<ITask[]> = new Observable();
  public openTaskForm: boolean = false;
  public statuses: Statuses[] = [...Object.values(Statuses)];

  private readonly _taskApiService: TaskApiService = inject(TaskApiService);
  private _destroy$: Subject<void> = new Subject<void>();
  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.loadTasks();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public openModalTaskForm(): void {
    this.openTaskForm = true;
  }

  public closeModalTaskForm(): void {
    this.openTaskForm = false;
  }

  public getCurrentStatus(task: ITask): string {
    return task.status || Statuses.NOT_COMPLETED;
  }

  public onStatusChange(userId: number, newStatus: string): void {
    this._taskApiService.updateStatus(userId, newStatus)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (): void => {
          this._cdr.markForCheck();
          console.log('все гуд')
        },
        error: (): void => {
          this.loadTasks();
          console.log('все НЕ гуд')
        }
      });
  }

  public addTask(task: ITask) {
    this._taskApiService.addTask(task)
      .pipe(
        tap(() => {
          this.loadTasks();
          this._cdr.markForCheck();
        }),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.taskForm.reset();
      })

    this.closeModalTaskForm();
  }

  public deleteTask(id: number): void {
    this._taskApiService.deleteTask(id)
      .pipe(
        tap(() => {
          this.loadTasks();
          this._cdr.markForCheck();
        }),
        takeUntil(this._destroy$)
      )
      .subscribe()
  }

  private loadTasks(): void {
    this.allTasks$ = this._taskApiService.getTasks();
  }
}
