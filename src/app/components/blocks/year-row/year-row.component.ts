import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { delay, filter, Subject, takeUntil } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as blocksSelectors from 'src/app/state/blocks.selectors';

@Component({
  selector: 'app-year-row',
  templateUrl: './year-row.component.html',
  styleUrls: ['./year-row.component.scss']
})
export class YearRowComponent implements OnInit, OnDestroy {
  @Input() size!: string; // in px
  @Input() isEditing!: boolean;
  @Input() zoom!: number;
  year!: number;
  @Input() set _year(year: number) {
    this.year = year;
    this.getWeekData();
  }
  @Input() thisYear!: number;
  @Input() weeks!: blocks.week[];

  // flags
  private _unsubscribe$ = new Subject<void>();

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();      
  }

  getWeekData() {
    this.store.select(blocksSelectors.getYear$(this.year))
      .pipe(takeUntil(this._unsubscribe$), filter(blocks => !!blocks && Object.keys(blocks).length > 0), delay(0))
      .subscribe(blocks => {
        // this.weeks = cloneDeep(blocks);
    });
    
  }

}
