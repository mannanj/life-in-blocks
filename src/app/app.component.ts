// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  Observable, take } from 'rxjs';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as fsh from 'src/app/helpers/firestore.helpers';
import * as bh from 'src/app/helpers/blocks.helpers';
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
  loading$: Observable<boolean> = this.store.select(appSelectors.getLoading$);
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
      this.store.dispatch(appActions.setStarting({starting: true}));
      this.store.dispatch(appActions.setLoading({loading: true}));
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
        this.store.dispatch(appActions.setStarting({ starting: false }));
        const dobYear = parseInt(format(settings.dob, 'yyyy'));
        const yearRange = range(dobYear, dobYear + 90);
        this.store.dispatch(blockActions.initYears({ yearRange }));
        this.retrieveBlockData(user, settings, yearRange);
      });
    }

    retrieveBlockData(user: string, settings: app.settings, yearRange: number[]): void {
      const thisWeek = dth.getMondayForWeek(new Date());
      const thisYear = parseInt(format(thisWeek, 'y'));
      const yearsInDb = settings.hasEntriesForYears;
      yearsInDb.forEach(yearNum => {
        this.store.dispatch(blockActions.setYearLoading({ loading: true, yearNum}));
      });
      // Once all year blocks are done loading, mark the app as done loading too.
      // In reality, this should be marked as true when the PAGE itself is ready to be viewed.
      this.store.select(blocksSelectors.getYearsLoading$).subscribe(yearsLoading => {
        if (yearsLoading.length === 0) {
          this.store.dispatch(appActions.setLoading({ loading: false }));
        }
      });
      // now retrieve this data, and for other data, use app-defaults.
      yearRange.forEach(yearNum => {
        const year = DEFAULTS.GENERATE_YEAR(yearNum);
        if (!!yearsInDb.find(yearN => yearN === yearNum)) {
          // retrieve from DB
          this.store.dispatch(blockActions.setYear({ year, yearNum }));
          this.store.dispatch(blockActions.setYearLoading({ loading: false, yearNum}));
          yearNum === thisYear ? this.setActiveBlock(yearNum, year, thisWeek) : null;       
        } else {
          this.store.dispatch(blockActions.setYear({ year, yearNum }));
        }
      });
    }

    setActiveBlock(yearNum: number, year: blocks.year, thisWeek: Date): void {
      let activeBlockId = '';
      Object.keys(year).forEach(numStr => {
        if (!activeBlockId && format(thisWeek, 'MM/dd/yyyy') === format(year[parseInt(numStr)].date, 'MM/dd/yyyy')) {
          activeBlockId = `${yearNum}_block_${year[parseInt(numStr)].num}`;
          this.store.dispatch(blockActions.setActiveBlockId({ activeBlockId }));
        }
      })
    }
}
