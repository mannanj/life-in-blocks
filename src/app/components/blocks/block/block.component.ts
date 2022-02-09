import { Component, Input, OnInit } from '@angular/core';
import * as blocks from 'src/app/models/blocks.model';
import * as dth from 'src/app/helpers/datetime.helpers';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() zoomLevel = 1.0;
  @Input() year!: number;
  week!: blocks.week;
  today = new Date(Date.now()); // @TODO: Make this come from store.
  weekProgress = 0;
  @Input() set _week(week: blocks.week) {
    if (!!week && Object.keys(week).length > 0) {
      this.week = week;
      this.weekProgress = week?.isNow ? dth.getWeekProgress(week, this.today) : 0;
      if (this.viewHasInit && this.year) {

      }
    }
  }

  // flags
  viewHasInit!:boolean;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.getObjectKeys(this.week) && this.year) {
      this.setScrollBar();
    } else {
      this.viewHasInit = true;
    }
  }

  setIsHovered(week: blocks.week, isHovered: boolean) {
    week.isHovered = isHovered;
  }

  getObjectKeys(obj: any): string[]|boolean {
    return !!obj && Object.keys(obj).length > 0 ? Object.keys(obj) : false;
  }

  // Doesn't do anything atm.
  setScrollBar():void {
  }
}
