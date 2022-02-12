import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as blocks from 'src/app/models/blocks.model';
import * as dth from 'src/app/helpers/datetime.helpers';
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit, AfterViewInit {
  @Input() size!: string; // in px
  @Input() zoomLevel = 1.0;
  @Input() year!: number;
  @Input() week!: blocks.week;

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

  hasValues(arr: any[]): boolean {
    return !!arr && arr.length > 0;
  }
}
