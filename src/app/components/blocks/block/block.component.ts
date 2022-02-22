import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as blocks from 'src/app/models/blocks.model';
import * as pah from 'src/app/helpers/page.helpers';
import * as blockActions from 'src/app/state/blocks.actions';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit, AfterViewInit {
  @Input() size!: string; // in px
  @Input() zoom = 1.0;
  @Input() year!: number;
  @Input() week!: blocks.week;
  hasChanges = false;
  // Needs improvments i.e. id-specific block state change tracking.
  @Input() set editing(editing: boolean) {
    // if we receive an editing = false event here, it means user cancelled edit
    // somewhere else i.e. a mouse click outside a block. It has already been confirmed.
    // NOTE: This editing in state is only set in other components, NEVER here.
    if (this.hasChanges && !editing) {
      this.cancelAllEdits();
    }
  };

  // flags
  viewHasInit!:boolean;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.getObjectKeys(this.week) && this.year) {
      this.setScrollBar();
    } else {
      this.viewHasInit = true;
    }
  }

  setHovered(unit: blocks.week | blocks.entry, hovered: boolean) {
    unit.hovered = hovered;
  }

  setEditing(entry: blocks.entry) {
    entry.editing = true;
    entry.backupText = entry.text;
    this.store.dispatch(blockActions.setEditing({ editing: true }));
    this.hasChanges = true;
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

  keyDown(entry: blocks.entry, event: any) {
    console.log('entry', entry, 'key', event);
    if (event.code === pah.KEYS['escape']) {
      pah.confirmChanges() ? this.cancelAllEdits() : null;
    }
  }

  cancelAllEdits() {
    this.week.entries.forEach(entry => {
      if (entry.editing) {
        delete entry.editing;
      }
      if (entry.backupText) {
        entry.text = entry.backupText;
        delete entry.backupText;
      }
    })
    this.hasChanges = false;
  }

  saveChanges(week: blocks.week, entry: blocks.entry) {
    delete entry.backupText;
    delete entry.editing;
    // TODO: dispatch changes.
    if (!week.entries.find(entry => entry.editing)) {
      this.hasChanges = false;
      // @TODO: need an NGRX state improvement that can check if unsaved changes exist and
      // and check now if this was the last of them, and update state as necessary.
      // this.store.dispatch(blockActions.savedAChange...({ ... }));
    }
  }
}
