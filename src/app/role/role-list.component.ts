import {Component, OnInit} from '@angular/core';
import {OnActivate, RouteSegment, Tree} from '@angular/router';

import {TableDefService} from '../shared/services';
import {TableDef} from '../shared/models';
import {DataGridComponent} from '../shared/components';

@Component({
  moduleId: module.id,
  selector: 'role-list',
  templateUrl: 'role-list.component.html',
  providers: [TableDefService],
  directives: [DataGridComponent]
})
export class RoleListComponent implements OnInit, OnActivate {
  tableDef: TableDef;

  constructor(private tableDefService: TableDefService) {
    console.log('Role list, constructor called');
  }

  ngOnInit(): void {
    console.log('Role list, ng init called');
    this.tableDefService.findByCodeName('role').subscribe(
      response => {
        this.tableDef = response;
      },
      error => {
        alert(error.text());
        console.log(error.text());
      });
  }

  routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: Tree<RouteSegment>,
    prevTree?: Tree<RouteSegment>): void {
    console.log('Role list,routerOnActivate called');
  }
}
