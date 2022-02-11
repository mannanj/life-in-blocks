import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as pah from 'src/app/helpers/page.helpers';
import * as dth from 'src/app/helpers/datetime.helpers';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as blockActions from 'src/app/state/blocks.actions';
@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit, AfterViewInit{
  weeksByYear = [] as blocks.weeksByYear;
  activeBlockId!:string;
  zoomLevel!:number;
  private _unsubscribe$ = new Subject<void>();

  // flags
  thisYear!: number;
  viewHasInit!:boolean;
  isLoading = true;

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
    this.thisYear = year;
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
        // @TODO: need a better way to detect this.
        if (this.zoomLevel) {
          setTimeout(() =>{
            this.store.dispatch(blockActions.setIsLoading({ isLoading: false }));
          }, 2500);
        }
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
    this.store.select(blocksSelectors.getIsLoading$)
      .pipe(takeUntil(this._unsubscribe$), tap((val)=> console.log('isLoading', val)))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
        pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250}, true);
      });
  }

  getObjectKeys(obj: any): string[] {
    return !!obj && Object.keys(obj).length > 0 ? Object.keys(obj) : [];
  }

  strToNum(str: string) {
    return parseInt(str) ? parseInt(str) : 0;
  }

  zoomIn() {
    this.zoomLevel += 1.0;
    this.store.dispatch(blockActions.setIsLoading({ isLoading: true }));
    this.store.dispatch(blockActions.setZoomLevel({ zoomLevel: this.zoomLevel }));
  }

  zoomOut() {
    this.zoomLevel -= 1.0;
    this.store.dispatch(blockActions.setIsLoading({ isLoading: true }));
    this.store.dispatch(blockActions.setZoomLevel({ zoomLevel: this.zoomLevel }));
  }

  zoomReset() {
    this.zoomLevel = DEFAULTS.zoomLevel;
    this.store.dispatch(blockActions.setIsLoading({ isLoading: true }));
    this.store.dispatch(blockActions.setZoomLevel({ zoomLevel: this.zoomLevel }));
  }
}
