import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { from, map, Observable, of, take, tap } from "rxjs";
import * as cry from 'src/app/helpers/cryptography.helpers';
import * as bh from 'src/app/helpers/blocks.helpers';
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
          return newSettings;
        } else {
          return mapSettings(val, user, year);
        }
      }));
  return obs$;
}

function mapSettings(val: any, user: string, year: number): app.settings {
  const settings = val[0];
  const newSettings = DEFAULTS.NEW_SETTINGS(user, year);
  // because we may have added new settings since the last time user
  // wrote to db, we use defaults here for ones that don't exist.
  return {
    id: settings?.id ? settings.id : newSettings.id,
    user: settings?.user ? settings.user : newSettings.user,
    dob: settings?.dob ? settings.dob.toDate() : newSettings.dob,
    zoom: settings?.zoom ? settings.zoom : newSettings.zoom,
    hasEntriesForYears: settings?.hasEntriesForYears && settings.hasEntriesForYears.length > 0 ? settings.hasEntriesForYears : newSettings.hasEntriesForYears,
  }
}

// @TODO: how do I account for successful writes to firestore, and getting that data back? do I make a get after this?
export function writeBlock$(user: string, year: number, week: blocks.week, fs: AngularFirestore, debug?: boolean): Observable<any> {
  const collection = `${user}_${year}_weeks`;
  let logDescriptor;
  let result$: Observable<any>;
  if (!!week.id) {
    logDescriptor = `Updating block for ${collection}`;
    const result = fs.collection(collection).doc(week.id).update(week);
    result$ = from(result);
  } else {
    logDescriptor = `Writing new block for ${collection}`;
    const result = fs.collection(collection).add(week);
    result$ = from(result);
  } 
  debug ? console.log(`${logDescriptor}: `, week) : null;
  return result$;
}

export function getWeek$(user: string, year: number, week: blocks.week, fs: AngularFirestore, debug?: boolean): Observable<blocks.week> {
  const collection = `${user}_${year}_weeks`;
  let logDescriptor;
  let result$: Observable<any>;
  logDescriptor = `Getting block for ${collection}`;
  result$ = fs.collection(collection).doc(week.id).valueChanges({ idField: 'id' }) as Observable<blocks.week>;
  result$ = result$.pipe(map(block => {
    block.date = block.date.toDate();
    block.entries = block.entries.map((entry: any) => {
      return {
        ...entry,
        created: entry.created.toDate(),
        edited: entry.edited.toDate()
      }
    });
    bh.setFlags(block);
    return block;
  }));
  debug ? console.log(`${logDescriptor}: `, week) : null;
  return result$;
}

export function getWeeks$(user: string, year: number, fs: AngularFirestore, debug?: boolean): Observable<blocks.week[]> {
  const collection = `${user}_${year}_weeks`;
  let logDescriptor;
  let result$: Observable<any>;
  logDescriptor = `Getting blocks for ${collection}`;
  result$ = fs.collection(collection).valueChanges({ idField: 'id' }) as Observable<blocks.week[]>;
  result$ = result$.pipe(map(blocks => {
    blocks.forEach((block: any) => {
      block.date = block.date.toDate();
      block.entries = block.entries.map((entry: any) => {
        return {
          ...entry,
          created: entry.created.toDate(),
          edited: entry.edited.toDate()
        }
      });
      bh.setFlags(block);
    });
    return blocks;
  }));
  debug ? console.log(`${logDescriptor}: `) : null;
  return result$;
}

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