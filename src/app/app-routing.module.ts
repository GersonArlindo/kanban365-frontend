import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Kanban365Component } from './kanban365/kanban365.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'kanban365',
    component: Kanban365Component
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
