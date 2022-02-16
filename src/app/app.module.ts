// Angular
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlocksComponent } from './components/blocks/blocks.component';

// Libraries
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';

// NGRX
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { blocksReducer } from './state/blocks.reducer';
import { BlocksEffects } from './state/blocks.effects';
import { BlockComponent } from './components/blocks/block/block.component';
import { appReducer } from './state/app.reducer';
import { YearRowComponent } from './components/blocks/year-row/year-row.component';

@NgModule({
  declarations: [
    AppComponent,
    BlocksComponent,
    BlockComponent,
    YearRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase), // legacy firestore,
    StoreModule.forRoot({
      app: appReducer,
      blocks: blocksReducer,
    }),
    StoreDevtoolsModule.instrument({
      name: 'Year In Review',
      logOnly: environment.production
    }),
    EffectsModule.forRoot([BlocksEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
