import { Component, Input, OnInit } from '@angular/core';
import * as blocks from 'src/app/models/blocks.model';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() zoomLevel = 1.0;
  @Input() year!: number;
  @Input() week!: blocks.week;

  constructor() { }

  ngOnInit(): void {
  }

  setIsHovered(week: blocks.week, isHovered: boolean) {
    week.isHovered = isHovered;
  }

  getObjectKeys(obj: any): string[]|boolean {
    return !!obj && Object.keys(obj).length > 0 ? Object.keys(obj) : false;
  }

}
