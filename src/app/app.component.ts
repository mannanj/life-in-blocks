// @TODO: Handle zooming events here.
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as blocks from 'src/app/models/blocks.model';
import * as fsh from 'src/app/helpers/firestore.helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'life-in-blocks';
  isLoading = true;
  weeks$: Observable<blocks.week[]> = fsh.getWeeks$(new Date().getFullYear(), this.firestore);

  constructor(
    private store: Store,
    private firestore: AngularFirestore) {}
}
