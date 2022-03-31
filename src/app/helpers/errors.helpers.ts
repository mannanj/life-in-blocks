import { Observable, of } from "rxjs";

export function handleFsError(err: any, method: string, debug = false): Observable<any> {
    debug ? console.log('err', err) : null;
    // Week progress
    let fallback;
    switch(method) { 
        case 'settings': {
            fallback = {};
            break; 
        }
        case 'blocks': {
            fallback = [];
            break; 
        }
        default: { 
            fallback = null;
            break; 
        }
    }
    return of(fallback);
  }