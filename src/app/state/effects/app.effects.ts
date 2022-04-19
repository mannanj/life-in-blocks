import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// App
import * as app from 'src/app/models/app.model';
import { help } from 'src/app/helpers/help';
import * as DEFAULTS from 'src/app/state/DEFAULTS';
import * as user from 'src/app/models/user.model';
import * as blocks from 'src/app/models/blocks.model';

// NGRX
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as userActions from 'src/app/state/actions/user.actions';
import * as appActions from 'src/app/state/actions/app.actions';
import * as blockActions from 'src/app/state/actions/blocks.actions';
import * as userSelectors from 'src/app/state/selectors/user.selectors';
import * as blocksSelectors from 'src/app/state/selectors/blocks.selectors';

// 3rd Party
import { combineLatest, of } from 'rxjs';
import { map, switchMap, tap, take} from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';

@Injectable()
export class AppEffects {
    /**
     * App starts, and is done starting after we get the user and their settings.
     * App loads, and is done loading after we get the last block from firebase.
     */
    // @TODO: Make robust by adding retries where necessary.
    public initializeApp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(appActions.initApp),
            tap(() => {
                this.setFlags();
            }),
            switchMap(() => {
                return help.fsh.getUserAccount$().pipe(take(1));
            }),
            map((account: any) => {
                this.store.dispatch(userActions.setAccount({account}));
                this.store.dispatch(userActions.setLoading({loading: false}));
                if (account !== DEFAULTS.NO_ACCOUNT) {
                  this.store.dispatch(userActions.setLoggedIn({loggedIn: true}));
                  return appActions.retrieveSettings(account);
                } else {
                  this.store.dispatch(userActions.setLoggedIn({loggedIn: false}));
                  this.store.dispatch(appActions.setLoading({ loading: false }));
                  this.router.navigate(['user']);
                  return appActions.setStart({ starting: false });
                }
            })
        )
    );

    // Usually I use get<MethodName> as a convention
    // but retrieve<> symbolizes touching a server more clearly.
    public retrieveSettings$ = createEffect(() => 
        this.actions$.pipe(
            ofType(appActions.retrieveSettings),
            switchMap((account: any) => {
                return combineLatest([
                    of(account),
                    help.fsh.getSettings$(account, this.firestore, true).pipe(take(1))
                ]);
            }),
            map(([account, settings]) => {
                this.store.dispatch(appActions.setSettings({settings}));
                this.store.dispatch(appActions.setStart({ starting: false }));
                const dobYear = parseInt(format(settings.dob, 'yyyy'));
                const yearRange = help.dth.getUserYears(dobYear);
                this.store.dispatch(blockActions.initYears({ yearRange }));
                this.retrieveBlockData(account, settings, yearRange)
                return appActions.retrieveBlockData({ settings, yearRange });
            })
        )
    );

    // This ones not ready yet.
    // public retrieveBlockData$ = createEffect(() => 
    //     this.actions$.pipe(
    //         ofType(appActions.retrieveBlockData),
    //         switchMap(({settings, yearRange}) => {
    //             return combineLatest([
    //                 this.store.select(userSelectors.getAccount),
    //                 of(settings),
    //                 of(yearRange)
    //             ]);
    //         }),
    //         map(([account, settings, yearRange]) => {
    //             console.log('Values:', account, settings, yearRange);
    //             const thisWeek = help.dth.getMondayForWeek(new Date());
    //             const thisYear = parseInt(format(thisWeek, 'y'));
    //             const yearsInDb = settings.yearsWithData;


    //             return appActions.setStart({ starting: false });
    //         })
    //     )
    // );
    
    private setFlags(): void {
        this.store.dispatch(appActions.setStart({starting: true}));
        this.store.dispatch(appActions.setLoading({loading: true}));
        this.store.dispatch(userActions.setLoading({loading: true}));
    }

    // Temporary placeholders for stuff until its worked into the effect.
    private retrieveBlockData(account: user.account, settings: app.settings, yearRange: number[]): void {
        const thisWeek = help.dth.getMondayForWeek(new Date());
        const thisYear = parseInt(format(thisWeek, 'y'));
        const yearsInDb = settings.yearsWithData;
        yearRange.forEach(yearNum => {
          // Set app-defaults for each year.
          let year = cloneDeep(DEFAULTS.GENERATE_YEAR(yearNum));
          this.store.dispatch(blockActions.setYear({ year, yearNum }));
          yearNum === thisYear ? this.setActiveBlock(yearNum, year, thisWeek) : null;
          this.fetchBlocksByYear(account, yearNum, yearsInDb);
        });
        // Once all year blocks are done loading, mark the app as done loading too.
        // In reality, this should be marked as true when the PAGE itself is ready to be viewed.
        this.store.select(blocksSelectors.getYearsLoading$).subscribe(yearsLoading => {
          if (yearsLoading.length === 0) {
            this.store.dispatch(appActions.setLoading({ loading: false }));
          }
        });
    }

    private setActiveBlock(yearNum: number, year: blocks.year, thisWeek: Date): void {
        let activeBlockId = '';
        Object.keys(year).forEach(numStr => {
          if (!activeBlockId && format(thisWeek, 'MM/dd/yyyy') === format(year[parseInt(numStr)].date, 'MM/dd/yyyy')) {
            activeBlockId = `${yearNum}_block_${year[parseInt(numStr)].num}`;
            this.store.dispatch(blockActions.setActiveBlockId({ activeBlockId }));
          }
        })
      }

    // Retrieves values from db, and sets these values in store.
    // Manages a loading flag set at the year level.
    fetchBlocksByYear(account: user.account, yearNum: number, yearsInDb: number[]): void {
        if (!!yearsInDb.find(yearN => yearN === yearNum)) {
          this.store.dispatch(blockActions.setYearLoading({ loading: true, yearNum}));
          help.fsh.getWeeks$(account, yearNum, this.firestore, true).subscribe((blocks: blocks.week[]) => {
            blocks.forEach(block => this.store.dispatch(blockActions.updateWeek({ yearNum, week: block })));
            this.store.dispatch(blockActions.setYearLoading({ loading: false, yearNum}));
          })
        }
      }

    constructor(
        private actions$: Actions,
        private store: Store,
        private http: HttpClient,
        private firestore: AngularFirestore,
        private router: Router
    ) {}
}
