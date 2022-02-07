import { Component, HostListener, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as pah from 'src/app/helpers/page.helpers';
import * as dth from 'src/app/helpers/datetime.helpers';
import { format } from 'date-fns';
import { cloneDeep, debounce, remove } from 'lodash';

// State
import { Store } from '@ngrx/store';
import * as blockActions from 'src/app/state/blocks.actions';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  weeksByYear = [] as blocks.weeksByYear;
  activeBlockId!:string;
  viewHasInit!:boolean;
  zoomLevel!:number;
  private _unsubscribe$ = new Subject<void>();

  // flags
  keysHeld = [] as string[];

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this._getData();
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

  _getData() {
    this.store.select(blocksSelectors.getZoomLevel$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(zoomLevel => {
        this.zoomLevel = zoomLevel;
    });
    this.store.select(blocksSelectors.getWeeksByYear$)
      .pipe(takeUntil(this._unsubscribe$),tap(blocks => console.log()))
      .subscribe(blocks => {
        this.weeksByYear = cloneDeep(blocks);
        this.setActiveBlock();
        if (this.viewHasInit) {
          pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250}, true);
        }
    });
  }

  getObjectKeys(obj: any): string[] {
    return !!obj && Object.keys(obj).length > 0 ? Object.keys(obj) : [];
  }

  strToNum(str: string) {
    return parseInt(str) ? parseInt(str) : 0;
  }


  // We handle zoom manually in this app.
  // @TODO: Add support for touchscreens.
  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    const { keysHeld, zoomLevel } = pah.keyDown(event, this.keysHeld, this.zoomLevel, true);
    this.keysHeld = keysHeld;
    this.store.dispatch(blockActions.setZoomLevel({ zoomLevel }));
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.keysHeld = pah.keyUp(event, this.keysHeld);
  }

  processKeyPresses(key: any) {
    console.log('key pressed', key);
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
