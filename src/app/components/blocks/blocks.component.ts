import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import * as pah from 'src/app/helpers/page.helpers';
import * as dth from 'src/app/helpers/datetime.helpers';
import * as fsh from 'src/app/helpers/firestore.helpers';
import { format } from 'date-fns';
import { cloneDeep, sortBy, values } from 'lodash';
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
  years = [] as blocks.years;
  activeBlockId!:string;
  zoom!:number;
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
  appIsLoading!: boolean;
  yearsLoading!: number[];
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

  setActiveBlock() {
    const thisWeek = dth.getMondayForWeek(new Date());
    const year = parseInt(format(thisWeek, 'y'));
    this.thisYear = year;
    // this.years[year].forEach(week => {
    //   if (format(thisWeek, 'MM/dd/yyyy') === format(week.date, 'MM/dd/yyyy')) {
    //     this.activeBlockId = `${year}_block_${week.num}`;
    //   }
    // })
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
    this.store.select(appSelectors.getZoom$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(zoom => {
        // @TODO: need a better way to detect this.
        if (this.zoom) {
          setTimeout(() =>{
            this.store.dispatch(appActions.setIsLoading({ isLoading: false }));
            console.log('@TODO: blocks zoom 1s loading delay');
          }, 1000);
        }
        this.zoom = zoom;
        this.size = pah.getBlocksize(zoom) + 'px';
        this.sizeHr = pah.getSizeHr(this.zoom);
    });
    // week data
    this.store.select(blocksSelectors.getYears)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(years => {
        this.years = cloneDeep(years);
        // this.setActiveBlock();
        // if (this.viewHasInit) {
        //   pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250});
        // }
    });
    // loading flag
    this.store.select(appSelectors.getIsLoading$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(isLoading => {
        this.appIsLoading = isLoading;
        pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250});
      });
    // years loading flag
    this.store.select(blocksSelectors.getYearsLoading$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(yearsLoading => {
        this.yearsLoading = yearsLoading;
        // pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 100, y: 250});
      });
    // is editing flag
    this.store.select(blocksSelectors.getIsEditing$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(isEditing => {
        this.isEditing = isEditing;
      });

  }

  hasValues(obj: any): string[] {
    return !!obj && Object.keys(obj).length > 0 ? Object.keys(obj) : [];
  }

  getWeeksForYear(yearNum: string) {
    const weeksMap = this.years[parseInt(yearNum)] ? this.years[parseInt(yearNum)] : {};
    let weeksArr = [] as blocks.week[];
    if (Object.keys(weeksMap).length > 0) {
      weeksArr = sortBy(values(weeksMap), ['num']);
    }
    return weeksArr;
  }

  strToNum(str: string) {
    return parseInt(str) ? parseInt(str) : 0;
  }

  cancelEdits() {
    pah.confirmChanges() ? this.store.dispatch(blockActions.setIsEditing({ isEditing: false })): null;
  }

  changeZoom(event: any) {
    const zoom = event.detail.value += 0.5;
    this.store.dispatch(appActions.setIsLoading({ isLoading: true }));
    this.store.dispatch(appActions.setZoom({ zoom }));
    // Update zoom in firestore setting too.
    // @TODO: Move to effect.
    fsh.setZoom(this.user, zoom, this.settings, this.firestore, true);
    this.sizeHrTemp = '';
  }

  setSizeText(event: any) {
    const zoom = event.detail.value += 0.5;
    this.sizeHrTemp = pah.getSizeHr(zoom);
  }

  floorVal(zoom: number) {
    return Math.floor(zoom);
  }
}
