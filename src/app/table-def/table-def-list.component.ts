import {Component, OnInit} from '@angular/core';
import {OnActivate, RouteSegment, Tree} from '@angular/router';

import {DataGridComponent} from '../shared/components';
import {TableDef} from '../shared/models';
import {TableDefService} from '../shared/services';

@Component({
  moduleId: module.id,
  selector: 'app-table-def-list',
  templateUrl: 'table-def-list.component.html',
  providers: [TableDefService],
  directives: [DataGridComponent]
})
export class TableDefListComponent implements OnInit, OnActivate {

  tableDef: TableDef;

  constructor(private tableDefService: TableDefService) {
    console.log('Table list, constructor called');
  }

  ngOnInit(): void {
    console.log('Table list, ng init called');
    this.tableDefService.findByCodeName('table-def').subscribe(
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
    console.log('Table list,routerOnActivate called');
  }

}
