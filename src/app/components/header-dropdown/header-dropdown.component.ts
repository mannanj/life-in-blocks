import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import * as pah from 'src/app/helpers/page.helpers';
import * as fsh from 'src/app/helpers/firestore.helpers';
import Calendar  from "color-calendar";
import { Store } from '@ngrx/store';
import * as appSelectors from 'src/app/state/app.selectors';
import * as appActions from 'src/app/state/app.actions';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss']
})
export class HeaderDropdownComponent implements OnInit, OnDestroy {
  @Input() user!: string;
  dob!: Date;
  hovered = false;
  keepOpen = false;
  calendarOpen = false;
  calendarSize = { width: 385, height: 320 };
  calendarOptions = {
    id: "#calendar",
    calendarSize: "small",
    dateChanged: (currentDate?: Date, filteredDateEvents?: any[]) => {
      currentDate ? this.setDob(currentDate) : null;
    }
  };
  private _unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
      this.store.select(appSelectors.getDob$)
        .pipe(takeUntil(this._unsubscribe$), tap(dob => console.log('dob', dob)))
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
    if (event.code === pah.KEYS['escape']) {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.hovered = false;
    this.keepOpen = false;
  }

  openCalendar(): void {
    this.calendarOpen = !this.calendarOpen;
    console.log('opening calendar!', this.calendarOpen);
    new Calendar(this.calendarOptions);
    const calendarRef = document.getElementById('calendar');
    if (calendarRef && calendarRef.clientWidth && calendarRef.clientHeight) {
      this.calendarSize = {
        width: calendarRef.clientWidth,
        height: calendarRef.clientHeight
      }
    }
    console.log('size', this.calendarSize);
  }

  getCalendarLeft(): string {
    return `calc(50% - ${this.calendarSize.width / 2}px + 50px)`; // idk why 50px needs added but it fixes width.
  }

  getCalendarTop(): string {
    return `calc(50% - ${this.calendarSize.height / 2}px)`;
  }

  closeCalendar(): void {
    this.calendarOpen = false;
    this.closeMenu();
    // @TODO: Save the changes.
  }

  setDob(dob: Date) {
    this.store.dispatch(appActions.setDob({dob}));
    this.store.select(appSelectors.getSettings$).pipe(take(1)).subscribe(settings => {
      fsh.setDob(this.user, dob, settings, this.firestore, true);
    })
  }
}
