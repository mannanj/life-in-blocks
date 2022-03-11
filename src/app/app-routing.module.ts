import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocksComponent } from './components/blocks/blocks.component';

const routes: Routes = [
  { path: 'blocks', component: BlocksComponent },
  { path: '**', component:  BlocksComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
