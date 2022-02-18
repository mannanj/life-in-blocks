import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as pah from 'src/app/helpers/page.helpers';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as fsh from 'src/app/helpers/firestore.helpers';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// State
import { Store } from '@ngrx/store';
import * as appSelectors from 'src/app/state/app.selectors';
import * as blocksSelectors from 'src/app/state/blocks.selectors';
import * as appActions from 'src/app/state/app.actions';
import * as blockActions from 'src/app/state/blocks.actions';

// 3rd Party Libs
import 'src/app/components/custom/discrete-slider';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit, OnDestroy, AfterViewInit{
  user = '';
  years = dth.getUserYears();
  weeksByYear = [] as blocks.weeksByYear;
  activeBlockId!:string;
  zoomLevel!:number;
  settings!:app.settings;
  // @TODO: refactor below into one variable.
  size!:string;
  sizeHr!:string;
  sizeHrTemp!:string;
  // @TODO: Refactor top into one variable.
  private _unsubscribe$ = new Subject<void>();

  // flags
  thisYear!: number;
  viewHasInit!:boolean;
  isLoading = true;
  isEditing = false;

  constructor(
    private store: Store,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this._getData();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();      
  }

  ngAfterViewInit() {
    if (this.activeBlockId) {
      pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 250, y: 250});
    } else {
      this.viewHasInit = true;
    }
  }

  initSlider() {
    console.log('initializing slider');

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
    // user
    this.store.select(appSelectors.getUser$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(user => this.user = user);
    // settings
    this.store.select(appSelectors.getSettings$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(settings => this.settings = settings);
    //zoom
    this.store.select(appSelectors.getZoomLevel$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(zoomLevel => {
        // @TODO: need a better way to detect this.
        if (this.zoomLevel) {
          setTimeout(() =>{
            this.store.dispatch(blockActions.setIsLoading({ isLoading: false }));
            console.log('blocks zoomlevel loading delay');
          }, 1000);
        }
        this.zoomLevel = zoomLevel;
        this.size = pah.getBlocksize(zoomLevel) + 'px';
        this.sizeHr = pah.getSizeHr(this.zoomLevel);
    });
    // week data
    this.store.select(blocksSelectors.getWeeksByYear$)
      .pipe(takeUntil(this._unsubscribe$), filter(blocks => !!blocks && Object.keys(blocks).length > 0))
      .subscribe(blocks => {
        this.weeksByYear = cloneDeep(blocks);
        this.setActiveBlock();
        if (this.viewHasInit) {
          pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250});
        }
    });
    // loading flag
    this.store.select(blocksSelectors.getIsLoading$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
        pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250});
      });
    // is editing flag
    this.store.select(blocksSelectors.getIsEditing$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(isEditing => {
        this.isEditing = isEditing;
      });

  }

  getObjectKeys(obj: any): string[] {
    return !!obj && Object.keys(obj).length > 0 ? Object.keys(obj) : [];
  }

  strToNum(str: string) {
    return parseInt(str) ? parseInt(str) : 0;
  }

  cancelEdits() {
    pah.confirmChanges() ? this.store.dispatch(blockActions.setIsEditing({ isEditing: false })): null;
  }

  changeZoom(event: any) {
    const zoomLevel = event.detail.value += 0.5;
    this.store.dispatch(blockActions.setIsLoading({ isLoading: true }));
    this.store.dispatch(appActions.setZoomLevel({ zoomLevel }));
    // Update zoom in firestore setting too.
    // @TODO: Move to effect.
    fsh.setZoom(this.user, zoomLevel, this.settings, this.firestore, true);
    this.sizeHrTemp = '';
  }

  setSizeText(event: any) {
    const zoomLevel = event.detail.value += 0.5;
    this.sizeHrTemp = pah.getSizeHr(zoomLevel);
  }

  floorVal(zoom: number) {
    return Math.floor(zoom);
  }
}
