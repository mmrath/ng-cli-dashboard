import {
Component,
ChangeDetectionStrategy,
OnChanges,
SimpleChange,
Input,
Output,
EventEmitter
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dg-pager',
  templateUrl: 'pager.component.html',
  directives: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerComponent implements OnChanges {
  @Input() last: boolean;
  @Input() totalPages: number;
  @Input() totalElements: number;
  @Input() size: number;
  @Input() number: number; // Page number starts from zero
  @Input() first: boolean;
  @Input() numberOfElements: number;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  pageNumber: number; // Page number starts from 1
  pagerStartIndex: number;
  pagerEndIndex: number;

  pagerStartIndexRange: Array<number>;
  pagerEndIndexRange: Array<number>;
  elementStart: number;
  elementEnd: number;

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    this.compute();
  }

  selectPage(page: number, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (page !== this.pageNumber && page > 0 && page <= this.totalPages) {
      console.log('Navigating to page' + page);
      this.pageChanged.next(page);
    } else {
      console.log('Invalid navigation');
    }
  }

  get isPreviousDisabled() {
    if (this.pageNumber === 1) {
      return true;
    }
    return false;
  };

  get isNextDisabled() {
    if (this.pageNumber === this.totalPages) {
      return true;
    } else {
      return false;
    }
  };

  private compute() {
    this.pageNumber = this.number + 1;
    this.pagerStartIndex = this.pageNumber - 3;
    this.pagerEndIndex = this.pageNumber + 3;

    if (this.pagerStartIndex < 1) {
      this.pagerStartIndex = 1;
    }
    if (this.pagerEndIndex > this.totalPages) {
      this.pagerEndIndex = this.totalPages;
    }
    if (this.pagerEndIndex - this.pageNumber < 3 && this.pagerStartIndex !== 1) {
      this.pagerStartIndex = this.pagerStartIndex - (this.pageNumber + 3 - this.pagerEndIndex);
      if (this.pagerStartIndex < 1) {
        this.pagerStartIndex = 1;
      }
    }
    if (this.pageNumber - this.pagerStartIndex < 3 && this.pagerEndIndex !== this.totalPages) {
      this.pagerEndIndex = this.pagerEndIndex + (this.pagerStartIndex + 3 - this.pageNumber);
      if (this.pagerEndIndex > this.totalPages) {
        this.pagerEndIndex = this.totalPages;
      }
    }
    let pagerStartIndexRangeArr = [];
    for (let i = this.pagerStartIndex; i < this.pageNumber; i++) {
      pagerStartIndexRangeArr.push(i);
    }
    this.pagerStartIndexRange = pagerStartIndexRangeArr;

    let pagerEndIndexRangeArr = [];
    for (let i = this.pageNumber + 1; i <= this.pagerEndIndex; i++) {
      pagerEndIndexRangeArr.push(i);
    }
    this.pagerEndIndexRange = pagerEndIndexRangeArr;

    this.elementStart = ((this.pageNumber - 1) * this.size) + 1;
    this.elementEnd = ((this.pageNumber - 1) * this.size) + this.numberOfElements;
  }
}
