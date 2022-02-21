// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  Observable, take } from 'rxjs';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as fsh from 'src/app/helpers/firestore.helpers';
import * as blockActions from 'src/app/state/blocks.actions';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as appSelectors from 'src/app/state/app.selectors';
import * as appActions from 'src/app/state/app.actions';
import { format } from 'date-fns';
import { range } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  user = '';
  isLoading$: Observable<boolean> = this.store.select(appSelectors.getIsLoading$);
  yearsLoading$: Observable<number[]> = this.store.select(blocksSelectors.getYearsLoading$);
  weeks$: Observable<blocks.week[]> = fsh.getWeeks$(new Date().getFullYear(), this.firestore);

  constructor(
    private store: Store,
    private firestore: AngularFirestore) {
      this.initializeApp();
    }

    // @TODO: Could make more robust by adding retries to the chains if an action fails.
    /**
     * App is starting and loading when we get user and settings.
     * It is done starting once we have these responses.
     * It is done loading once...
     */
    initializeApp() {
      this.store.dispatch(appActions.setIsStarting({isStarting: true}));
      this.store.dispatch(appActions.setIsLoading({isLoading: true}));
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
        this.store.dispatch(appActions.setIsStarting({ isStarting: false }));
        this.retrieveBlockData(user, settings);
      });
    }

    retrieveBlockData(user: string, settings: app.settings): void {
      const dobYear = parseInt(format(settings.dob, 'yyyy'));
      const yearRange = range(dobYear, dobYear + 90);
      const yearsInDb = settings.hasEntriesForYears;
      yearsInDb.forEach(yearNum => {
        this.store.dispatch(blockActions.setYearLoading({ isLoading: true, yearNum}));
      });
      // Once all year blocks are done loading, mark the app as done loading too.
      // In reality, this should be marked as true when the PAGE itself is ready to be viewed.
      this.store.select(blocksSelectors.getYearsLoading$).subscribe(yearsLoading => {
        if (yearsLoading.length === 0) {
          this.store.dispatch(appActions.setIsLoading({ isLoading: false }));
        }
      });
      // now retrieve this data, and for other data, use app-defaults.
      console.log('yearRange', yearRange);
      yearRange.forEach(yearNum => {
        const year = DEFAULTS.WEEKS_FOR_YEAR(yearNum);
        if (!!yearsInDb.find(yearN => yearN === yearNum)) {
          // retrieve from DB
          this.store.dispatch(blockActions.setYear({ year, yearNum }));
          this.store.dispatch(blockActions.setYearLoading({ isLoading: false, yearNum}));                
        } else {
          this.store.dispatch(blockActions.setYear({ year, yearNum }));
        }
      });
      // @TODO: We want to query years from settings that have data,
      // set that particular block in state for the year, 
      // fsh.getYearWeekData$(user, settings, this.firestore, true).pipe(take(1)).subscribe(years => {
      //   this.store.dispatch(blockActions.setYears({ years }));
      //   this.store.dispatch(blockActions.setIsLoading({ isLoading: false }));
      //   this.store.dispatch(appActions.setIsStarting({ isStarting: false }));
      //   // test FS
      //   // const weeks = years[2022];
      //   // fsh.createYearWeeks$(2022, weeks, userResp, this.firestore, true).subscribe();
      // })
    }
}
