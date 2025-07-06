import {
  inject,
  Injectable
} from '@angular/core';

import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root'
})

export class AlertsService {
  private _alerts = inject(TuiAlertService);

  public showErrorStatusChangeNotification(): void {
    this._alerts
      .open('<strong>Произошла ошибка при изменении статуса</strong>', { label: 'Ошибка' })
      .subscribe();
  }

  public showSuccessStatusChangeNotification(): void {
    this._alerts
      .open('<strong>Статус задачи изменен</strong>', { label: 'Успешно' })
      .subscribe();
  }

  public showErrorAddTaskNotification(): void {
    this._alerts
      .open('<strong>Произошла ошибка при добавлении задачи</strong>', { label: 'Ошибка' })
      .subscribe();
  }

  public showSuccessAddTaskNotification(): void {
    this._alerts
      .open('<strong>Задача добавлена</strong>', { label: 'Успешно' })
      .subscribe();
  }

  public showErrorDeleteTaskNotification(): void {
    this._alerts
      .open('<strong>Произошла ошибка при удалении задачи</strong>', { label: 'Ошибка' })
      .subscribe();
  }

  public showSuccessDeleteTaskNotification(): void {
    this._alerts
      .open('<strong>Задача удалена</strong>', { label: 'Успешно' })
      .subscribe();
  }
}
