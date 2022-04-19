import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

// App
import { BlocksComponent } from './components/blocks/blocks.component';
import { UserFormComponent } from './components/user-form/user-form.component';

// NGRX Store and RXJS
import { Store } from '@ngrx/store';
import * as userSelectors from 'src/app/state/selectors/user.selectors';
import { map, Observable, take } from 'rxjs';
import * as DEFAULTS from 'src/app/state/DEFAULTS';

// Guard
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(userSelectors.getAccount).pipe(
      take(1),
      map(account => account !== DEFAULTS.NO_ACCOUNT ? true : false)
      );
  }
}

// Routing
const routes: Routes = [
  { 
    path: 'blocks',
    component: BlocksComponent,
    canActivate: [AuthGuard]
  
  },
  { path: 'user', component: UserFormComponent },
  { path: '**', component:  BlocksComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
