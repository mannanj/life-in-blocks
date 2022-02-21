import { AngularFirestore } from "@angular/fire/compat/firestore";
import { from, map, Observable, of, take, tap } from "rxjs";
import * as cry from 'src/app/helpers/cryptography.helpers';
import * as app from 'src/app/models/app.model';
import * as blocks from "../models/blocks.model";
import * as DEFAULTS from 'src/app/state/DEFAULTS';
import { format } from "date-fns";


export function getUser$(): Observable<string> {
  const DEFAULT_USER$ = of('mannanj');
  return DEFAULT_USER$;
}

export function getSettings$(user: string, fs: AngularFirestore, debug?: boolean): Observable<app.settings> {
  const year = parseInt(format(new Date(), 'yyyy'));
  const collection = `${user}_settings`;
  const logDescriptor = `Firestore pinged for ${collection}`;
  const obs$ = (fs.collection(collection).valueChanges({ idField: 'id' }) as Observable<any>)
    .pipe(
      take(1),
      map(val => {
        if (!val || val.length <= 0) {
          const newSettings: app.settings = DEFAULTS.NEW_SETTINGS(user, year);
          fs.collection(collection).add(newSettings);
          debug ? console.log(`Firestore written new value to ${collection}: `, newSettings) : null;
          // whenever we write new settings, we also write the first block
          writeFirstBlock(user, year, fs, debug);
          return newSettings;
        } else {
          return mapSettings(val, user, year);
        }
      }));
  return obs$;
}

export function writeFirstBlock(user: string, year: number, fs: AngularFirestore, debug?: boolean) {
  const collection = `${user}_${year}_weeks`;
  const logDescriptor = `Writing first block for ${collection}`;
  // const firstBlock = DEFAULTS.getFirstBlock(user, year);
  const firstBlock = {};
  debug ? console.log(`${logDescriptor}: `, firstBlock) : null;
  fs.collection(collection).add(firstBlock);
}

function mapSettings(val: any, user: string, year: number): app.settings {
  const settings = val[0];
  const newSettings = DEFAULTS.NEW_SETTINGS(user, year);
  // because we may have added new settings,
  // we smartly use defaults here for ones not returned.
  return {
    id: settings?.id ? settings.id : newSettings.id,
    user: settings?.user ? settings.user : newSettings.user,
    dob: settings?.dob ? settings.dob.toDate() : newSettings.dob,
    zoom: settings?.zoom ? settings.zoom : newSettings.zoom,
    hasEntriesForYears: settings?.hasEntriesForYears && settings.hasEntriesForYears.length > 0 ? settings.hasEntriesForYears : newSettings.hasEntriesForYears,
  }
}

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

// export function getYearWeekData$(user: string, settings: app.settings, fs: AngularFirestore, debug?: boolean): Observable<blocks.years> {
//   const year = 2022;
//   const collection = `${user}_${year}_weeks`;
//   const logDescriptor = `Firestore pinged for ${collection}`;
//   const obs$ = (fs.collection(collection).valueChanges({ idField: 'id' }) as Observable<any>);
//     // .pipe(
//     //   take(1),
//     //   map(val => {
//     //     if (!val || val.length <= 0) {
//     //       const newSettings = {
//     //         ...DEFAULTS.SETTINGS,
//     //         user
//     //       }
//     //       fs.collection(collection).add(newSettings);
//     //       debug ? console.log(`Firestore written new value to ${collection}: `, newSettings) : null;
//     //       return newSettings;
//     //     } else {
//     //       return val[0]; // first entry is our settings.
//     //     }
//     //   }));
//   (obs$).subscribe(val => console.log(logDescriptor, val));
//   return of(DEFAULTS.WEEKS_BY_YEAR);
// }

export function setZoom(user: string, zoom: number, settings: app.settings, fs: AngularFirestore, debug?: boolean) {
  const collection = `${user}_settings`;
  const logDescriptor = `Updating zoom setting for: ${collection}`;
  fs.collection(collection).doc(settings.id).update({
    ...settings,
    zoom
  });
}

export function setDob(user: string, dob: Date, settings: app.settings, fs: AngularFirestore, debug?: boolean) {
  const collection = `${user}_settings`;
  const logDescriptor = `Updating date setting for: ${collection}`;
  fs.collection(collection).doc(settings.id).update({
    ...settings,
    dob
  });
  debug ? console.log(`${logDescriptor} to: ${dob}`) : null;
}

// Back write year as a batch of documents to a collection.
export function createYearWeeks$(year: number, weeks: blocks.week[], user: string, fs: AngularFirestore, debug?: boolean): Observable<any> {
  const collection = `${user}_${year}_weeks`;
  const logDescriptor = `Firestore written new value to ${collection}`;
  const batch = fs.firestore.batch();

  weeks.forEach(week => {
    batch.set(fs.collection(collection).doc(cry.genUid()).ref , week);
  });

  return from(batch.commit()).pipe(tap(outcome => debug ? console.log(`${logDescriptor}: `, weeks) : null));
}