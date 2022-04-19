import { Injectable } from '@angular/core';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { HttpClient } from '@angular/common/http';
import * as userActions from 'src/app/state/actions/user.actions';
import * as appActions from 'src/app/state/actions/app.actions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError } from 'firebase/app';
import * as user from 'src/app/models/user.model';

// rxjs
import { from, of, catchError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable()
export class UserEffects {
    public createAccount$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.createAccount),
            switchMap(({account}) => {
                this.store.dispatch(appActions.setLoading({loading: true}));
                console.log('account!?', account);
                return from(this.afAuth.createUserWithEmailAndPassword(account.email, account.password)).pipe(
                    map((val) => {
                        return {val};
                    }),
                    catchError((err: FirebaseError) => {
                        console.log('err.name', err.name);
                        console.log('err.stack', err.stack);
                        console.log('err.message', err.message);
                        console.log('err.customData', err.customData);
                        console.log('err.code', err.code);
                        return of({err, isError: true})
                    }));
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
            map((outcome: any | FirebaseError) => {
                if (outcome?.isError) {
                    console.log('is not logged in');
                    this.store.dispatch(appActions.setLoading({loading: false}));
                    return userActions.sendEmail();
                }
                console.log('islogged in');
                return userActions.sendEmail();
            })
        )
    );

    public sendActivationEmail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.sendEmail),
            switchMap(() => {
                return this.afAuth.currentUser;
            }),
            map((user)=> {
                console.log('user', user);
                user?.sendEmailVerification();
                return userActions.emailSent();
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
        private http: HttpClient,
        private afAuth: AngularFireAuth
    ) {}
}
