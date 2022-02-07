// @TODO: Handle zooming events here.
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as blockActions from 'src/app/state/blocks.actions';
import { Observable } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as fsh from 'src/app/helpers/firestore.helpers';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as DEFAULTS from 'src/app/state/DEFAULTS';
import { cloneDeep } from 'lodash';
import { compareDesc, format, isEqual } from 'date-fns';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  isLoading = true;
  weeks$: Observable<blocks.week[]> = fsh.getWeeks$(new Date().getFullYear(), this.firestore);

  constructor(
    private store: Store,
    private firestore: AngularFirestore) {
      this.getData();
    }

  getData() {
    // this.weeks();
  }

  weeks(): void {
    // input1Changes$.pipe(
    //   combineLatestWith(input2Changes$),
    //   map(([e1, e2]) => Number(e1.target.value) + Number(e2.target.value)),
    // )
    // .subscribe(x => console.log(x));
    // this.weeks$
    //   .subscribe(fsWeeks => {
    //     const weeks = cloneDeep(DEFAULTS.WEEKS()).map(block => {
    //       // @TODO: false negatives if host timezone mismatches server.
    //       const existsInFs = fsWeeks.find(fsBlock => isEqual(fsBlock.date, block.date));
    //       let blockToUse = block;
    //       const thisWeek = dth.getStartOfWeek();
    //       if (format(thisWeek, 'MM/dd/yyyy') === format(blockToUse.date, 'MM/dd/yyyy')) {
    //         blockToUse.isNow = true;
    //       } else if (compareDesc(blockToUse.date, thisWeek) === 1) {
    //         blockToUse.isInPast = true;
    //       }
    //       return blockToUse;
    //     });
    //     this.store.dispatch(blockActions.addWeeks({ weeks }));
    //   });
  }
}
