import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanCardPage } from './scan-card.page';

const routes: Routes = [
  {
    path: '',
    component: ScanCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanCardPageRoutingModule {}
