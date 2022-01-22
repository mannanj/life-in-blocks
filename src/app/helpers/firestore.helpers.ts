import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable, tap } from "rxjs";
import * as Blocks from "../models/blocks.model";
import * as Settings from "src/app/models/settings.model";

// @TODO: Want to safely check if no collection exists, if so
// get default value from our app and then create it in FS?
// Or just create defaults in a users account when first logged in /user created
// and then only ever update from there
// have a copy of defaults in our app in case firestore connection fails?
// DD#1: just make the app not work if a firestore connection or retrieval ever fails.
//     --> Going to go with this option eventually.
 
// Notes
// An empty result by collection().valueChanges is also returned if collection doesnt exist.

export function createWeeksInYear$(fs: AngularFirestore, debug?: boolean): Observable<Blocks.week[]> {
    const methodName = 'createWeeksInYear$';
    return (fs.collection('weeksInYear').valueChanges({ idField: 'id' }) as Observable<Blocks.week[]>)
    .pipe(
        tap((val) => debug ? console.log(`${methodName} val: `, val) : null),
        map(blocks => blocks.map(block => {
          return {
            ...block,
            date: block.date.toDate(),
            isInFs: true
          }
        })));
}

// @TODO: Idk why it appears emits two values on an update (when debug true from tap op)
export function createConfig$(fs: AngularFirestore, debug?: boolean): Observable<Settings.base> {
    const methodName = 'createConfig$';
    return (fs.collection('config').valueChanges() as Observable<Settings.base[]>)
    .pipe(
        tap((val) => debug ? console.log(`${methodName} val: `, val) : null),
        map((configArr) => configArr[0])
    );
}