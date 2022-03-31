// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  Observable, take } from 'rxjs';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import { help } from 'src/app/helpers/help';
import * as blockActions from 'src/app/state/blocks.actions';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as appSelectors from 'src/app/state/app.selectors';
import * as appActions from 'src/app/state/app.actions';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  user = '';
  loading$: Observable<boolean> = this.store.select(appSelectors.getLoading$);

  constructor(
    private store: Store,
    private firestore: AngularFirestore) {
      this.initializeApp();
    }

    // @TODO: Could make more robust by adding retries to the chains if an action fails.
    /**
     * App starts, and is done when we get user and their settings.
     * It is done loading here when we get the last block from firebase.
     */
    initializeApp(): void {
      // @TODO: Move this chain to an effect that is initiated by appActions.setStart.
      this.store.dispatch(appActions.setStart({starting: true}));
      this.store.dispatch(appActions.setLoading({loading: true}));
      // @TODO: This is a concat operation. use concat pipe.
      help.fsh.getUser$().pipe(take(1)).subscribe(user => {
        this.user = user;
        this.store.dispatch(appActions.setUser({user}));
        this.retrieveSettings(user);
      });
    }

    // Usually I use get<MethodName> as a convention
    // but retrieve<> symbolizes touching a server more clearly.
    retrieveSettings(user: string): void {
      help.fsh.getSettings$(user, this.firestore, true).pipe(take(1)).subscribe(settings => {
        this.store.dispatch(appActions.setSettings({settings}));
        this.store.dispatch(appActions.setStart({ starting: false }));
        const dobYear = parseInt(format(settings.dob, 'yyyy'));
        const yearRange = help.dth.getUserYears(dobYear);
        this.store.dispatch(blockActions.initYears({ yearRange }));
        this.retrieveBlockData(user, settings, yearRange);
      });
    }

    retrieveBlockData(user: string, settings: app.settings, yearRange: number[]): void {
      const thisWeek = help.dth.getMondayForWeek(new Date());
      const thisYear = parseInt(format(thisWeek, 'y'));
      const yearsInDb = settings.yearsWithData;
      yearRange.forEach(yearNum => {
        // Set app-defaults for each year.
        let year = cloneDeep(DEFAULTS.GENERATE_YEAR(yearNum));
        this.store.dispatch(blockActions.setYear({ year, yearNum }));
        yearNum === thisYear ? this.setActiveBlock(yearNum, year, thisWeek) : null;
        this.fetchBlocksByYear(yearNum, yearsInDb);
      });
      // Once all year blocks are done loading, mark the app as done loading too.
      // In reality, this should be marked as true when the PAGE itself is ready to be viewed.
      this.store.select(blocksSelectors.getYearsLoading$).subscribe(yearsLoading => {
        if (yearsLoading.length === 0) {
          this.store.dispatch(appActions.setLoading({ loading: false }));
        }
      });
    }

    // Retrieves values from db, and sets these values in store.
    // Manages a loading flag set at the year level.
    fetchBlocksByYear(yearNum: number, yearsInDb: number[]): void {
      if (!!yearsInDb.find(yearN => yearN === yearNum)) {
        this.store.dispatch(blockActions.setYearLoading({ loading: true, yearNum}));
        help.fsh.getWeeks$(this.user, yearNum, this.firestore, true).subscribe((blocks: blocks.week[]) => {
          blocks.forEach(block => this.store.dispatch(blockActions.updateWeek({ yearNum, week: block })));
          this.store.dispatch(blockActions.setYearLoading({ loading: false, yearNum}));
        })
      }
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
