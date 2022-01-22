import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable, tap } from "rxjs";
import * as blocks from "../models/blocks.model";
import * as settings from "src/app/models/settings.model";

// @TODO: Want to safely check if no collection exists, if so
// get default value from our app and then create it in FS?
// Or just create defaults in a users account when first logged in /user created
// and then only ever update from there
// have a copy of defaults in our app in case firestore connection fails?
// DD#1: just make the app not work if a firestore connection or retrieval ever fails.
//     --> Going to go with this option eventually.
 
// Notes
// An empty result by collection().valueChanges is also returned if collection doesnt exist.

export function getWeeks$(year: number, fs: AngularFirestore, debug?: boolean): Observable<blocks.week[]> {
  const collection = `${year}_weeks`;
  const logDescriptor = `Firestore pinged for ${collection}`;
  return (fs.collection(collection).valueChanges({ idField: 'id' }) as Observable<blocks.week[]>)
  .pipe(
      tap((val) => debug ? console.log(`${logDescriptor} val: `, val) : null),
      map(blocks => blocks.map(block => {
        return {
          ...block,
          date: block.date.toDate(),
          isInFs: true
        }
      })));
}