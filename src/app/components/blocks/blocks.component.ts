import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, filter, Subject, take, takeUntil } from 'rxjs';
import * as app from 'src/app/models/app.model';
import * as blocks from 'src/app/models/blocks.model';
import { help } from 'src/app/helpers/help';
import { cloneDeep, isEqual, sortBy, values } from 'lodash';
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
  years!: blocks.years;
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
  appLoading!: boolean;
  yearsLoading!: number[];
  lastYear!: number;
  editing = false;
  jumpedToBlock = false;

  constructor(
    private store: Store,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this._getData();
    // this._getData();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();      
  }

  ngAfterViewInit() {
    this.viewHasInit = true;
  }

  // Get flags, user, settings, first instance of years, then update years data as it arrives from API.
  _getData(): void {
    this._getFlags();
    const user$ = this.store.select(appSelectors.getUser$).pipe(filter(user => user !== DEFAULTS.NO_USER), take(1));
    const settings$ = this.store.select(appSelectors.getSettings$).pipe(filter(settings => !isEqual(settings, DEFAULTS.NO_SETTINGS)), take(1));
    combineLatest([user$, settings$]).subscribe(val => {
      this.user = val[0];
      this.settings = val[1];
      this._initYears();
    });
  }

  _getFlags(): void {
    // zoom
    this.store.select(appSelectors.getZoom$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(zoom => {
        // @TODO: need a better way to detect this.
        if (this.zoom) {
          setTimeout(() =>{
            this.store.dispatch(appActions.setLoading({ loading: false }));
            help.pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 450, y: 250});
            console.log('@TODO: blocks zoom 1s loading delay');
          }, 500);
        }
        this.zoom = zoom;
        this.size = help.pah.getBlocksize(zoom) + 'px';
        this.sizeHr = help.pah.getSizeHr(this.zoom);
    });
    // loading
    this.store.select(appSelectors.getLoading$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(loading => {
        this.appLoading = loading;
    });
    // years loading
    this.store.select(blocksSelectors.getYearsLoading$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(yearsLoading => {
        this.yearsLoading = yearsLoading;
    });
    // is editing
    this.store.select(blocksSelectors.getEditing$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(editing => {
        this.editing = editing;
    });
    // active block id
    this.store.select(blocksSelectors.getActiveBlockId$)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(activeBlockId => {
        this.activeBlockId = activeBlockId;
    });
  }


  _initYears(): void {
    this.store.select(blocksSelectors.getYears)
      .pipe(filter(years => !!Object.keys(years) && Object.keys(years).length > 0), take(1))
      .subscribe(years => {
        this.years = cloneDeep(years);
        this._getLatestYears();
    });
  }

  // Get latest versions of each year.
  _getLatestYears(): void {
    Object.keys(this.years).forEach(yearNum => {
      this.store.select(blocksSelectors.getYear$(parseInt(yearNum)))
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe(year => {
          this.years[parseInt(yearNum)] = cloneDeep(year);
        })
    });
  }

  // Used for first time app loading to jump to block.
  triggerJumpToBlock(): void {
    if (!this.jumpedToBlock) {
      setTimeout(()=> {
        help.pah.scrollToBlock(this.activeBlockId, 'blocks', {x: 450, y: 250});
        this.jumpedToBlock = true;
      }, 500);
    }
  }

  viewAndAppReady(): boolean {
    return this.viewHasInit && !this.appLoading && !!this.activeBlockId;
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
    help.pah.confirmChanges() ? this.store.dispatch(blockActions.setEditing({ editing: false })): null;
  }

  changeZoom(event: any) {
    const zoom = event.detail.value += 0.5;
    this.store.dispatch(appActions.setLoading({ loading: true }));
    this.store.dispatch(appActions.setZoom({ zoom }));
    // Update zoom in firestore setting too.
    // @TODO: Move to effect.
    help.fsh.setZoom(this.user, zoom, this.settings, this.firestore, true);
    this.sizeHrTemp = '';
  }

  setSizeText(event: any) {
    const zoom = event.detail.value += 0.5;
    this.sizeHrTemp = help.pah.getSizeHr(zoom);
  }

  floorVal(zoom: number) {
    return Math.floor(zoom);
  }

  // Write a week change to db, get result, and write to store.
  saveWeekChange(yearNum: number, week: blocks.week): void {
    week.user = this.user;
    const result$ = help.fsh.writeBlock$(this.user, yearNum, week, this.firestore, true);
    result$.pipe(take(1)).subscribe(res => {
      if (res && res.id) {
        week.id = res.id;
      }
      if (week.id) {
        help.fsh.getWeek$(this.user, yearNum, week, this.firestore, true).subscribe((weekRes: blocks.week) => {
          this.store.dispatch(blockActions.updateWeek({ yearNum, week: weekRes }));
        });
      }
    })
  }
}
