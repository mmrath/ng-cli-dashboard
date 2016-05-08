import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import {SidebarComponent, FooterComponent, NavbarComponent} from './shared/components';
import {RoleListComponent, RoleEditComponent} from './role';
import {UserListComponent, UserEditComponent} from './user';
import { TableDefListComponent, TableDefEditComponent } from './table-def';

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

  { path: '/user/new', component: UserEditComponent },
  { path: '/user/:id', component: UserEditComponent },
  { path: '/user', component: UserListComponent },

  { path: '/table-def/new', component: TableDefEditComponent },
  { path: '/table-def/:id', component: TableDefEditComponent },
  { path: '/table-def', component: TableDefListComponent }
])
export class DashboardAppComponent {
}
