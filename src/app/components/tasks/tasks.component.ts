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
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  BehaviorSubject,
  Subject,
  takeUntil
} from 'rxjs';

import {
  AsyncPipe,
  NgForOf,
  NgIf
} from '@angular/common';

import { TaskApiService } from '../../services/task-api.service';
import { ITask } from '../../interfaces/ITask';
import { Statuses } from '../../common/statuses.enum';
import { RouterLink } from '@angular/router';
import { SearchTasksService } from '../../services/search-tasks.service';


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
  styleUrls: ['./tasks.component.scss', 'tasks-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TasksComponent implements OnInit, OnDestroy {
  public taskForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [ Validators.required ] }),
    status: new FormControl<string>('Не выполнена', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
  })
  public openTaskForm: boolean = false;
  public statuses: Statuses[] = [...Object.values(Statuses)];
  public searchTerm: string = '';

  protected readonly _searchService: SearchTasksService = inject(SearchTasksService);

  private readonly _taskApiService: TaskApiService = inject(TaskApiService);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _destroy$: Subject<void> = new Subject<void>();
  private _tasksSubject$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);


  public ngOnInit(): void {
    this.loadTasks();
    this._searchService.searchTasks(this._tasksSubject$);
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
        next: () => {
          this.loadTasks();
          this._cdr.markForCheck();
        },
        error: () => {
          console.error('Ошибка при обновлении статуса');
        }
      });
  }

  public addTask(task: ITask) {
    this._taskApiService.addTask(task)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.loadTasks();
        this.taskForm.reset();
      });

    this.closeModalTaskForm();
  }

  public deleteTask(id: number): void {
    this._taskApiService.deleteTask(id)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.loadTasks();
      });
  }

  private loadTasks(): void {
    this._taskApiService.getTasks()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(tasks => {
        this._tasksSubject$.next(tasks);
      });
  }
}
