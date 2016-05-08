import {Component, Input, OnChanges} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {TableDef, ColumnDef, Page, PageRequest, Order} from '../../models';
import {PagerComponent} from './pager.component';
import {PageSizeComponent} from './page-size.component';
import {DataGridService} from './data-grid.service';

@Component({
  moduleId: module.id,
  selector: 'data-grid',
  providers: [DataGridService],
  templateUrl: 'data-grid.component.html',
  styleUrls: ['data-grid.component.css'],
  directives: [ROUTER_DIRECTIVES, PageSizeComponent, PagerComponent]
})
export class DataGridComponent implements OnChanges {
  @Input() tableDef: TableDef;
  @Input() pageSizes: Array<number> = [10, 20, 50, 100, 200];
  @Input() apiBase: string;
  @Input() newLink: string;
  @Input() editLink: string; // This must take id as a paramater
  page: Page<any>;
  pageRequest: PageRequest = new PageRequest();
  advancedSearchQuery: string;
  search: string = '';

  selectedRows: Array<boolean> = new Array();
  allSelected: boolean = false;

  constructor(
    private router: Router,
    private http: Http,
    private dataGridService: DataGridService
  ) {
    this.pageRequest.size = 10;
  }

  ngOnChanges() {
    console.log('changed TableDef:' + JSON.stringify(this.tableDef));
    if (typeof this.tableDef !== 'undefined') {
      this.sortColumnDefByIndex();
      this.refreshPage();
    }
  }

  onPageSizeChange(pageSize: number) {
    console.log('Page size:' + pageSize);
    if (pageSize <= 0 || (pageSize >= this.page.totalElements
      && this.page.size >= this.page.totalElements)) {
      console.log('No need to refresh');
      return;
    }
    this.pageRequest.size = pageSize;
    let newPage = ((this.page.number * this.page.size) + this.page.numberOfElements) / pageSize;
    this.pageRequest.page = Math.floor(newPage);
    this.refreshPage();
  }

  onPageChange(pageNumber: number) {
    console.log('Page number:' + pageNumber);
    if (pageNumber < 1 || pageNumber > this.page.totalPages) {
      return;
    }
    this.pageRequest.page = pageNumber - 1;
    this.pageRequest.size = this.page.size;
    this.refreshPage();
  }

  navigateToNew(event?: MouseEvent) {
    console.log('Navigating to new');
    this.router.navigate([this.newLink]);
    event.preventDefault();
  }

  navigateToEdit(id: number, event?: MouseEvent) {
    console.log('Navigating to edit:' + this.editLink);
    this.router.navigate([this.editLink, id]);
    event.preventDefault();
  }

  deleteRow(row: any, event?: MouseEvent) {
    event.preventDefault();
    let id: number = row[this.tableDef.primaryKeyColumn.codeName];
    console.log('Deleting row:' + JSON.stringify(row));
    let headers = new Headers();
    this.http.delete(this.apiBase + '/' + id, { headers: headers }).subscribe(
      res => {
        if (this.page.numberOfElements === 1 && this.page.number !== 0) {
          this.pageRequest.page = this.pageRequest.page - 1;
        }
        this.refreshPage();
      },
      err => { console.log('Error:' + err); }
    );
  }

  sort(col: ColumnDef) {
    if (typeof col.sortable === 'undefined' || !col.sortable) {
      return;
    }
    console.log('Sort by column:' + col.codeName);
    let colName = col.codeName;
    let found = false;
    let remove = false;
    let index = -1;
    if (typeof this.pageRequest.sort !== 'undefined') {
      for (let i = 0; i < this.pageRequest.sort.length; i++) {
        let order = this.pageRequest.sort[i];
        if (order.property === colName) {
          found = true;
          index = i;
          if (order.direction === Order.DESC) {
            remove = true;
          } else {
            order.direction = Order.DESC;
          }
        }
      }
    } else {
      this.pageRequest.sort = [];
    }
    if (found) {
      let order = this.pageRequest.sort[index];
      this.pageRequest.sort.splice(index, 1); // remove
      if (!remove) {
        this.pageRequest.sort.unshift(order); // add at the begining
      }
    } else {
      let order = new Order(); // A new order
      order.property = colName;
      order.direction = Order.ASC;
      this.pageRequest.sort.unshift(order);
    }
    this.pageRequest.sort = this.pageRequest.sort.slice(0, 1);
    this.pageRequest.page = 0;
    this.refreshPage();
  }

  getSortClass(col: ColumnDef): string {
    if (typeof col.sortable !== 'undefined' && col.sortable) {
      for (let order of this.pageRequest.sort) {
        if (order.property === col.codeName) {
          if (order.direction === Order.ASC) {
            return 'fa-sort-asc';
          } else {
            return 'fa-sort-desc';
          }
        }
      }
      return 'fa-sort';
    }
    return 'invisible';
  }

  advancedSearch() {
    console.log('Search query:' + this.advancedSearchQuery);
    this.search = this.advancedSearchQuery;
    this.pageRequest.page = 0;
    this.refreshPage();
  }

  toggleSelectAll(event: Event) {
    if (event.target['checked']) {
      this.selectAllRows();
    } else {
      this.resetSelectedRows();
    }
  }

  rowSelectionChange(event: Event) {
    if (!event.target['checked'] && this.allSelected) {
      this.allSelected = false;
    }
  }

  selectAllRows() {
    if (this.tableDef.multiSelectable) {
      this.selectedRows = new Array();
      this.page.content.forEach(() => this.selectedRows.push(true));
    }
  }

  private refreshPage() {
    let sortStrings = new Array();
    if (typeof this.pageRequest.sort !== 'undefined' && this.pageRequest.sort instanceof Array) {
      this.pageRequest.sort.forEach(order => {
        sortStrings.push(order['property'] + ',' + order['direction']);
      });
    }

    this.dataGridService.getPage(this.apiBase, this.pageRequest.page, this.pageRequest.size, this.search, sortStrings)
      .map((data: Page<any>) => { return data; })
      .subscribe(
      response => {
        console.log('Received page:' + JSON.stringify(response));
        this.page = response; this.resetSelectedRows();
      },
      err => { console.error('Error while fetching data:' + err); });
  }

  private resetSelectedRows() {
    if (this.tableDef.multiSelectable) {
      this.selectedRows = new Array();
      this.page.content.forEach(() => this.selectedRows.push(false));
    }
  }

  private sortColumnDefByIndex() {
    if (typeof this.tableDef !== 'undefined' && this.tableDef.columns instanceof Array) {
      this.tableDef.columns.sort((colDef1, colDef2) => colDef1.index - colDef2.index);
    }
  }
}
