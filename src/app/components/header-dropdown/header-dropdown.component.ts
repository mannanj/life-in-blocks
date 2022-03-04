import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { help } from 'src/app/helpers/help';
import Calendar  from "color-calendar";
import { Store } from '@ngrx/store';
import * as appSelectors from 'src/app/state/app.selectors';
import * as appActions from 'src/app/state/app.actions';
import { Subject, take, takeUntil } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { isEqual } from 'date-fns';

@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss']
})
export class HeaderDropdownComponent implements OnInit, OnDestroy {
  @Input() user!: string;
  @Input() loading!: boolean | null;
  dob!: Date;
  hovered = false;
  keepOpen = false;
  calendarOpen = false;
  calendarSize = { width: 385, height: 320 };
  calendarOptions = {
    id: "#calendar",
    calendarSize: "small",
    dateChanged: (currentDate?: Date, filteredDateEvents?: any[]) => {
      currentDate && this.calendarSet ? this.setDob(currentDate) : null;
    }
  };
  calendarSet!: boolean;
  calendar: any;
  private _unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
      this.store.select(appSelectors.getDob$)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe(dob => this.dob = dob);
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();      
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.keyDown(event);
}

  setHovered(val: boolean): void {
    this.hovered = val;
  }

  setKeepOpen(): void {
    this.keepOpen = !this.keepOpen;
  }

  keyDown(event: any) {
    if (event.code === help.pah.KEYS['escape']) {
      this.closeMenu();
      this.closeCalendar();
    }
  }

  closeMenu(): void {
    this.hovered = false;
    this.keepOpen = false;
  }

  openCalendar(): void {
    this.calendarOpen = !this.calendarOpen;
    this.calendar = new Calendar(this.calendarOptions);
    this.calendar.setDate(this.dob);
    this.calendarSet = true;
    const calendarRef = document.getElementById('calendar');
    if (calendarRef && calendarRef.clientWidth && calendarRef.clientHeight) {
      this.calendarSize = {
        width: calendarRef.clientWidth,
        height: calendarRef.clientHeight
      }
    }
  }

  getCalendarLeft(): string {
    return `calc(50% - ${this.calendarSize.width / 2}px + 50px)`; // idk why 50px needs added but it fixes width.
  }

  getCalendarTop(): string {
    return `calc(50% - ${this.calendarSize.height / 2}px)`;
  }

  closeCalendar(): void {
    this.calendarOpen = false;
    this.calendarSet = false;
    this.closeMenu();
  }

  setDob(dob: Date) {
    if (!isEqual(dob, this.dob)) {
      this.store.dispatch(appActions.setDob({dob}));
      this.store.select(appSelectors.getSettings$).pipe(take(1)).subscribe(settings => {
        help.fsh.setDob(this.user, dob, settings, this.firestore, true);
        this.closeCalendar();
      });
    }
  }
}
