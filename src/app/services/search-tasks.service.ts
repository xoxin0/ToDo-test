import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject
} from 'rxjs';

import { Injectable } from '@angular/core';
import { ITask } from '../interfaces/ITask';

@Injectable({
  providedIn: 'root'
})
export class SearchTasksService {
  public filteredTasks$!: Observable<ITask[]>;

  private _searchSubject$: Subject<string> = new Subject<string>();

  public searchTasks(_tasksSubject$: BehaviorSubject<ITask[]>) {
    this.filteredTasks$ = combineLatest([
      _tasksSubject$.asObservable(),
      this._searchSubject$.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(term => term.toLowerCase().trim())
      )
    ]).pipe(
      map(([tasks, searchTerm]) =>
        tasks.filter(task =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.status.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  public updateSearch(term: string): void {
    this._searchSubject$.next(term);
  }
}
