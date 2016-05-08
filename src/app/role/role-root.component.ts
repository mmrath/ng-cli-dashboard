import {Component, OnInit} from '@angular/core';
import {Routes} from '@angular/router';
import {RoleListComponent} from './role-list';
import {RoleEditComponent} from './role-edit';

@Component({
  moduleId: module.id,
  selector: 'role-root',
  template: '<router-outlet></router-outlet>',
})
@Routes([
  { path: '/new', component: RoleEditComponent },
  { path: '/:id', component: RoleEditComponent },
  { path: '/', component: RoleListComponent },
])
export class RoleRootComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
