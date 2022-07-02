import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
@Directive()
export class AutoUnsubscribe implements OnDestroy {
  protected subscriptions: Subscription[] = [];

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
