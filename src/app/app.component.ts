// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  Observable, take } from 'rxjs';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as app from 'src/app/models/app.model';
import * as user from 'src/app/models/user.model';
import * as blocks from 'src/app/models/blocks.model';
import { help } from 'src/app/helpers/help';
import * as blockActions from 'src/app/state/actions/blocks.actions';
import * as blocksSelectors from 'src/app/state/selectors/blocks.selectors';
import * as appSelectors from 'src/app/state/selectors/app.selectors';
import * as appActions from 'src/app/state/actions/app.actions';
import * as userActions from 'src/app/state/actions/user.actions';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  account!: user.account;
  loading$: Observable<boolean> = this.store.select(appSelectors.getLoading$);

  constructor(
    private store: Store,
    private firestore: AngularFirestore,
    private router: Router
    ) {
      // Triggers NGRX Effect in app.effects.ts
      this.store.dispatch(appActions.initApp());
    }
}
