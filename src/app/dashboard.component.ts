import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import {SidebarComponent, FooterComponent, NavbarComponent} from './shared/components';
import {RoleListComponent, RoleEditComponent} from './role';

@Component({
  moduleId: module.id,
  selector: 'dashboard-app',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [NavbarComponent, FooterComponent, SidebarComponent],
})
@Routes([
  { path: '/role/new', component: RoleEditComponent },
  { path: '/role/:id', component: RoleEditComponent },
  { path: '/role', component: RoleListComponent },
])
export class DashboardAppComponent {
}
