// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  Observable, take } from 'rxjs';

// State
import { Store } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as fsh from 'src/app/helpers/firestore.helpers';
import * as blockActions from 'src/app/state/blocks.actions';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as appActions from 'src/app/state/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  user = '';
  isLoading$: Observable<boolean> = this.store.select(blocksSelectors.getIsLoading$);
  weeks$: Observable<blocks.week[]> = fsh.getWeeks$(new Date().getFullYear(), this.firestore);

  constructor(
    private store: Store,
    private firestore: AngularFirestore) {
      this.initializeApp();
    }

    // @TODO: Could make more robust by adding retries to the chains if an action fails.
    initializeApp() {
      this.store.dispatch(appActions.setIsStarting({isStarting: true}));
      this.store.dispatch(blockActions.setIsLoading({ isLoading: true })); // @TODO: move to later once app accepts isStarting as a way to display loading in it.
      fsh.getUser$().pipe(take(1)).subscribe(user => {
        this.user = user;
        this.store.dispatch(appActions.setUser({user}));
        this.retrieveSettings(user);
      });
    }

    // Usually I use get<MethodName> as a convention
    // but retrieve<> symbolizes touching a server more clearly.
    retrieveSettings(user: string): void {
      fsh.getSettings$(user, this.firestore, true).pipe(take(1)).subscribe(settings => {
        this.store.dispatch(appActions.setSettings({settings}));
        this.retrieveBlockData(user, settings);
      });
    }

    retrieveBlockData(user: string, settings: app.settings): void {
      // @TODO: Refactor such that a sequence of calls for each year gets returned
      // and we simultaneously set that week in state correspondingly.
      fsh.getYearWeekData$(user, settings, this.firestore, true).pipe(take(1)).subscribe(weeksByYear => {
        this.store.dispatch(blockActions.setAllWeeksByYear({ weeksByYear }));
        this.store.dispatch(blockActions.setIsLoading({ isLoading: false }));
        this.store.dispatch(appActions.setIsStarting({ isStarting: false }));
        // test FS
        // const weeks = weeksByYear[2022];
        // fsh.createYearWeeks$(2022, weeks, userResp, this.firestore, true).subscribe();
      })
    }
}
