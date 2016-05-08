import {Component, ChangeDetectionStrategy, OnChanges, SimpleChange, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'dg-page-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div>
      <select  class="form-control pull-xs-left"
          [(ngModel)]="size" (change)="onPageSizeChange($event)">
        <option *ngFor="let pageSize of pageSizes">{{pageSize}}</option>
       </select>
  </div>`,
  directives: [CORE_DIRECTIVES],
})
export class PageSizeComponent implements OnChanges {
  @Input() size: number;
  @Input() pageSizes: Array<number> = [10, 20, 50, 100, 200];

  @Output() private pageSizeChanged: EventEmitter<number> = new EventEmitter<number>();

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (typeof this.size === 'undefined' || typeof this.pageSizes === 'undefined') {
      return;
    }
    if (this.size > 0 && this.pageSizes.indexOf(this.size) <= -1) {
      // Size does not exist. Insert and sort
      console.log('Page size to add:' + this.size);
      console.log('Page sizes:' + this.pageSizes);
      this.pageSizes.push(this.size);
      this.pageSizes.sort((a, b) => a - b);
    }
  }

  onPageSizeChange(event?: Event) {
    if (event) {
      let targetValue: number = (event.target as any).value as number;
      if (targetValue > 0) {
        console.log('New page size:' + targetValue);
        this.pageSizeChanged.next(targetValue);
      }
    }
  }
}
