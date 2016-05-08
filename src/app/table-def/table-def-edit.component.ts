import {Component, OnInit} from '@angular/core';
import {ControlGroup, ControlArray, Control, Validators} from '@angular/common';
import {OnActivate, RouteSegment, Tree} from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {TableDefService} from '../shared/services';
import {TableDef, ColumnDef} from '../shared/models';

@Component({
  moduleId: module.id,
  selector: 'app-table-def-edit',
  templateUrl: 'table-def-edit.component.html',
  providers: [TableDefService],
})
export class TableDefEditComponent implements OnInit, OnActivate {

  isNew: boolean;
  id: number;
  role: TableDef;

  form: ControlGroup;
  columns: ControlArray;

  columnTypes: Array<string> = ['REGULAR', 'CREATED_BY', 'CREATED_DATE', 'LAST_MODIFIED_BY',
    'LAST_MODIFIED_DATE', 'PRIMARY_KEY', 'VERSION',];

  dataTypes: Array<string> = [
    'NUMBER', 'DECIMAL', 'STRING', 'PASSWORD', 'DATE', 'DATETIME', 'BOOLEAN',];


  constructor(private tableDefService: TableDefService) {
    this.columns = new ControlArray([]);
    let tableNameControl = new Control('',
      Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_]+$')]));

    let codeNameControl = new Control('',
      Validators.compose([Validators.required, Validators.pattern('^[a-z0-9-]+$')]));

    this.form = new ControlGroup({
      id: new Control(''),
      tableName: tableNameControl,
      codeName: codeNameControl,
      displayLabel: new Control('',
        Validators.compose([Validators.required, Validators.maxLength(30)])),
      insertable: new Control(true, Validators.required),
      updatable: new Control(true, Validators.required),
      deletable: new Control(true, Validators.required),
      multiSelectable: new Control(true, Validators.required),
      columns: this.columns
    });

    tableNameControl.valueChanges.debounceTime(400)
      .distinctUntilChanged((a, b) => {
        if (typeof a === 'string' && typeof b === 'string') {
          return (<string>a).toUpperCase() === (<string>b).toUpperCase();
        } else {
          return false;
        }
      })
      .filter(_ => tableNameControl.valid)
      .switchMap(name =>
        this.tableDefService.getByTableName(<string>name)
          .catch(error => { return Observable.empty(); })
      )
      .subscribe(
      res => { this.update(<TableDef>res); },
      err => { console.log(err); }
      );

  }

  ngOnInit() {
    if (!this.isNew) {
      this.tableDefService.findById(this.id).subscribe(
        tableDef => {
          this.updateControlValue('id', tableDef.id);
          this.updateControlValue('tableName', tableDef.tableName);
          this.updateControlValue('codeName', tableDef.codeName);
          this.updateControlValue('displayLabel', tableDef.displayLabel);
          this.updateControlValue('insertable', tableDef.insertable);
          this.updateControlValue('updatable', tableDef.updatable);
          this.updateControlValue('deletable', tableDef.deletable);
          this.updateControlValue('multiSelectable', tableDef.multiSelectable);

          if (typeof tableDef.columns !== 'undefined' && tableDef.columns instanceof Array) {
            for (var columnDef of tableDef.columns) {
              this.addColumn(columnDef);
            }
          }
        },
        err => {
          console.log('Error ' + err);
        }
      );
    }
  }

  routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: Tree<RouteSegment>,
    prevTree?: Tree<RouteSegment>): void {

    let paramId = curr.getParam('id');
    if (typeof paramId === 'undefined' || paramId == 'new') {
      this.isNew = true;
    } else {
      this.isNew = false;
      this.id = +paramId;
    }

  }

  addColumn(columnDef: ColumnDef) {
    if (typeof columnDef === 'undefined') {
      columnDef = {};
    }
    console.log('Adding Column');
    this.columns.push(new ControlGroup(
      {
        id: new Control(columnDef.id),
        index: new Control(columnDef.index, Validators.required),
        codeName: new Control(columnDef.codeName, Validators.required),
        columnName: new Control(columnDef.columnName, Validators.required),
        displayLabel: new Control(columnDef.displayLabel, Validators.required),
        searchable: new Control(columnDef.searchable, Validators.required),
        sortable: new Control(columnDef.sortable, Validators.required),
        showInList: new Control(columnDef.showInList, Validators.required),
        dataType: new Control(columnDef.dataType, Validators.required),
        columnType: new Control(columnDef.columnType, Validators.required),
        dataTemplate: new Control(columnDef.dataTemplate),
        headerTemplate: new Control(columnDef.headerTemplate),
      }));
  }


  onSubmit($event) {
    console.log('Table Def to save' + this.form.value);
    if (this.isNew) {
      this.tableDefService.save(this.form.value).subscribe(res => { console.log(res); });
    } else {
      this.tableDefService.update(this.id, this.form.value).subscribe(res => { console.log(res); });
    }
  }


  private update(tableDef: TableDef) {
    for (var key in tableDef) {
      if (tableDef.hasOwnProperty(key)) {
        let value = tableDef[key];
        if (!(value instanceof Array) && value != null && key !== 'primaryKeyColumn') {
          let control: Control = <Control>this.form.find(key);
          if (control) {
            control.updateValue(value);
          }
        }
      }
    }
    if (typeof tableDef.columns !== 'undefined' && tableDef.columns instanceof Array) {
      var length = this.columns.length;
      for (var i = 0; i < length; i++) {
        this.columns.removeAt(0);
      }
      for (var columnDef of tableDef.columns) {
        this.addColumn(columnDef);
      }
    }
  }

  private updateControlValue(key: string, value: any) {
    let control: Control = <Control>this.form.find(key);
    control.updateValue(value);
  }
}
