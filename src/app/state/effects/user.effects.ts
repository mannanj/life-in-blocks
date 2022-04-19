import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { HttpClient } from '@angular/common/http';
import * as userActions from 'src/app/state/actions/user.actions';
import * as appActions from 'src/app/state/actions/app.actions';
import { of } from 'rxjs';


@Injectable()
export class UserEffects {
    public createAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.createAccount),
            switchMap((account: any) => {
                this.store.dispatch(appActions.setLoading({loading: true}));
                console.log('account!?', account);
                const httopstuddff = '';
                return of(false);
                // return this.http
                //     .post<IAcmRollupResponse>(url, data, memeRequestOptions)
                //     .pipe(
                //         map(rollup =>
                //             transformAcm(
                //                 JSON.parse(rollup[`acmInfo`][`acm`]),
                //                 share
                //             )
                //         )
                //     );
            }),
            map((outcome: boolean) => {
                console.log('outcome?', outcome);
                this.store.dispatch(appActions.setLoading({loading: false}));
                return outcome
                    ? userActions.setLoggedIn({ loggedIn: true })
                    : userActions.setLoggedIn({ loggedIn: false })
            })
        )
    );

    public signIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.signIn),
            switchMap((account: any) => {
                this.store.dispatch(appActions.setLoading({loading: true}));
                console.log('account!?', account);
                const httopstuddff = '';
                return of(false);
            }),
            map((outcome: boolean) => {
                console.log('outcome?', outcome);
                this.store.dispatch(appActions.setLoading({loading: false}));
                return outcome
                    ? userActions.setLoggedIn({ loggedIn: true })
                    : userActions.setLoggedIn({ loggedIn: false })
            })
        )
    );

    constructor(
        private actions$: Actions,
        private store: Store,
        private http: HttpClient
    ) {}
}
