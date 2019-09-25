import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class AutoUnsubscribe implements OnDestroy {

  protected subscriptions: Subscription[] = [];

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
