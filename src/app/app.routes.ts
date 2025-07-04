import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./components/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./components/current-task/current-task.component').then(
        (m) => m.CurrentTaskComponent
      ),
  }
];
