import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as blocksSelectors from 'src/app/state/blocks.selectors';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  blocks = [] as blocks.weeksByYear;
  private _unsubscribe$ = new Subject<void>();
  
  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.select(blocksSelectors.getWeeksByYear)
      .pipe(takeUntil(this._unsubscribe$),tap(blocks => console.log()))
      .subscribe((blocks) => this.blocks = blocks);
  }

  ngAfterViewInit() {
  }

  getObjectKeys(obj: any): string[] {
    return !!obj && Object.keys(obj) ? Object.keys(obj) : [];
  }

  strToNum(str: string) {
    return parseInt(str) ? parseInt(str) : 0;
  }
}
