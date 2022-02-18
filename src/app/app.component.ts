// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, concat, concatMap, delay, filter, Observable, of, take, tap } from 'rxjs';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as blocks from 'src/app/models/blocks.model';
import * as fsh from 'src/app/helpers/firestore.helpers';
import * as blockActions from 'src/app/state/blocks.actions';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as appActions from 'src/app/state/app.actions';
import * as appSelectors from 'src/app/state/app.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  isLoading$: Observable<boolean> = this.store.select(blocksSelectors.getIsLoading$);
  weeks$: Observable<blocks.week[]> = fsh.getWeeks$(new Date().getFullYear(), this.firestore);

  constructor(
    private store: Store,
    private firestore: AngularFirestore) {
      this.initializeApp();
    }

    // We initialize the app by retrieving the user, their data, and setting state.
    // After that, the app is done loading.
    initializeApp() {
      // First get user, then their settings.
      // Note: In settings, we store first year of data.
      let userResp = '';
      fsh.getUser$().pipe(take(1)).subscribe(user => this.store.dispatch(appActions.setUser({user})));
      this.store.select(appSelectors.getUser$).pipe(take(1), tap(user => console.log('selector user', user))).subscribe(user => {
        userResp = user;
        fsh.getSettings$(user, this.firestore, true).pipe(take(1)).subscribe(settings => {
          this.store.dispatch(appActions.setSettings({settings}));
        });
      });
      // After we have a user and settings, load their data.
      this.store.select(appSelectors.getSettings$).pipe(filter(settings => settings.user === userResp), take(1)).subscribe(settings => {
        fsh.getData$(userResp, this.firestore, true).pipe(take(1)).subscribe(weeksByYear => {
          this.store.dispatch(blockActions.setAllWeeksByYear({ weeksByYear }));
          this.store.dispatch(blockActions.setIsLoading({ isLoading: false }));
        })
      })
    }
}
