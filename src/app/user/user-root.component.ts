import {Component, OnInit} from '@angular/core';
import {Routes} from '@angular/router';
import {UserListComponent} from './user-list';
import {UserEditComponent} from './user-edit';


@Component({
  moduleId: module.id,
  selector: 'user-root',
  template: '<router-outlet></router-outlet>',
})
@Routes([
  { path: '/', component: UserListComponent },
  { path: '/:id', component: UserEditComponent }
])
export class UserRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
