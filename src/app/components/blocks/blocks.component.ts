import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as pah from 'src/app/helpers/page.helpers';
import * as dth from 'src/app/helpers/datetime.helpers';
import { format } from 'date-fns';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  weeksByYear = [] as blocks.weeksByYear;
  activeBlockId!:string;
  viewHasInit!:boolean;
  private _unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.select(blocksSelectors.getWeeksByYear)
      .pipe(takeUntil(this._unsubscribe$),tap(blocks => console.log()))
      .subscribe((blocks) => {
        this.weeksByYear = blocks;
        this.setActiveBlock();
        if (this.viewHasInit) {
          pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250}, true);
        }
      });
  }

  ngAfterViewInit() {
    if (this.activeBlockId) {
      pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250}, true);
    } else {
      this.viewHasInit = true;
    }
  }

  setActiveBlock() {
    const thisWeek = dth.getStartOfWeek();
    const year = parseInt(format(thisWeek, 'y'));
    this.weeksByYear[year].forEach(week => {
      if (format(thisWeek, 'MM/dd/yyyy') === format(week.date, 'MM/dd/yyyy')) {
        this.activeBlockId = `${year}_block_${week.num}`;
      }
    })
  }

  getObjectKeys(obj: any): string[] {
    return !!obj && Object.keys(obj) ? Object.keys(obj) : [];
  }

  strToNum(str: string) {
    return parseInt(str) ? parseInt(str) : 0;
  }

  zoomIn() {
    console.log('zoom in clicked');
  }

  zoomOut() {
    console.log('zoom out clicked');
  }

  zoomReset() {
    console.log('zoom Reset');
  }
}
