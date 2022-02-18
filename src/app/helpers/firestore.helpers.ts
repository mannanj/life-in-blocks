import { AngularFirestore } from "@angular/fire/compat/firestore";
import { delay, map, Observable, of, take, tap } from "rxjs";
import * as app from 'src/app/models/app.model';
import * as blocks from "../models/blocks.model";
import * as DEFAULTS from 'src/app/state/DEFAULTS';

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

export function getData$(user: string, fs: AngularFirestore, debug?: boolean): Observable<blocks.weeksByYear> {
  // For speed purposes, we always try to get data for current year first.
  // To reduce future requests:
  // Then we hit an index/config file, and check which years
  // have data available, and hit those next.
  // Any data not returned here defaults to new-user default.
  // As user makes a save for that year for the first time,
  // it gets written to firestore for first time and the index/config
  // is updated.

  const year = 2022;
  const collection = `${user}_${year}_weeks`;
  const logDescriptor = `Firestore pinged for ${collection}`;
  const obs$ = fs.collection(collection).valueChanges({ idField: 'id' }) as Observable<any>;
  (obs$).subscribe(val => console.log(logDescriptor, val));
  return of(DEFAULTS.WEEKS_BY_YEAR);
}

export function getUser$(): Observable<string> {
  const DEFAULT_USER$ = of('mannanj');
  return DEFAULT_USER$;
}

export function getSettings$(user: string, fs: AngularFirestore, debug?: boolean): Observable<app.settings> {
  const collection = `${user}_settings`;
  const logDescriptor = `Firestore pinged for ${collection}`;
  const obs$ = (fs.collection(collection).valueChanges({ idField: 'id' }) as Observable<any>)
    .pipe(
      take(1),
      map(val => {
        if (!val || val.length <= 0) {
          const newSettings = {
            ...DEFAULTS.SETTINGS,
            user
          }
          fs.collection(collection).add(newSettings);
          debug ? console.log(`Firestore written new value to ${collection}: `, newSettings) : null;
          return newSettings;
        } else {
          return val[0]; // first entry is our settings.
        }
      }));
  return obs$;
}

export function setZoom(user: string, zoomLevel: number, settings: app.settings, fs: AngularFirestore, debug?: boolean) {
  const collection = `${user}_settings`;
  const logDescriptor = `Updating zoom setting for: ${collection}`;
  fs.collection(collection).doc(settings.id).update({...settings});
}