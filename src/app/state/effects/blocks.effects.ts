import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { HttpClient } from '@angular/common/http';

import * as blocksActions from 'src/app/state/actions/blocks.actions';

@Injectable()
export class BlocksEffects {
    // public setIsSideMenuHidden$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(blocksActions.updateWeekBlockText),
    //         switchMap(() => {
    //             return this.firestore.collection(list).doc(task.id).update(task)
    //                 .pipe(
    //                     map((jsOrders: JsOrder[]) => {  
    //                       const orders = jsOrders.map(jsOrder =>
    //                           Order.create(jsOrder)
    //                       );
    //                       return new LoadOrders(orders);
    //                     }),
    //                    catchError(err => of(new LoadOrdersFailure(err)))
    //                 )
    //         })
    //     )
    // );

    constructor(
        private actions$: Actions,
        private store: Store,
        private http: HttpClient
    ) {}
}
