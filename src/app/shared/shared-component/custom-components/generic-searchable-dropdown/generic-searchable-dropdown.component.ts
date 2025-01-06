import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/shared-module/material/material.module';

@Component({
  selector: 'app-generic-searchable-dropdown',
  imports: [CommonModule, MaterialModule],
  templateUrl: './generic-searchable-dropdown.component.html',
  styleUrl: './generic-searchable-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericSearchableDropdownComponent),
      multi: true,
    },
  ],
})
export class GenericSearchableDropdownComponent implements ControlValueAccessor, OnInit {
  @Input() dataItems: any[] = [];
  @Input() selectedItem: any;
  @Input() labelField: any;
  @Input() fValue: any;
  @Input() fDisplay: any;
  @Input() displayTextFn: any;
  @Input() isOptionDisabled: any;
  @Input() appearanceType: any = 'outline';
  @Input() isMultiple: boolean = false;
  @Input() showSelectAll: boolean = false;
  @Output() onSelectionChangeEvent: any = new EventEmitter<any>();
  @ViewChild('searchTextBox') searchTextBox!: ElementRef;

  selectedRow: any;
  selectedDataList: any = {
    dataItemsList: [],
  }

  dataList: any = {
    dataItemsList: [],
  }
  onChange: any = () => { }
  onTouched: any = () => { }

  constructor() { }

  ngOnInit(): void {
    this.dataList['dataItemsList'] = Array.isArray(this.dataItems) ? this.dataItems : [];
    this.selectedDataList['dataItemsList'] = [...this.dataList['dataItemsList']];
  }

  ngOnChanges(changes: any) {
    if (changes.dataItems) {
      if (!changes.dataItems.firstChange) {
        // const currentValue = changes.dataItems.currentValue;
        if (Array.isArray(changes?.dataItems?.currentValue)) {
          this.dataItems = [...changes?.dataItems?.currentValue];
          this.dataList['dataItemsList'] = this.dataItems;
          this.selectedDataList['dataItemsList'] = [...this.dataList['dataItemsList']];
        } else {
          // console.error('currentValue is not an array:', currentValue);
          this.dataItems = [];
          this.dataList['dataItemsList'] = [];
          this.selectedDataList['dataItemsList'] = [];
        }
      }
    }
  }

  writeValue(value: any): void {
    // this.selectedItem = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ondropDownChange(e: any): void {
    this.onSelectionChangeEvent.emit({ 'value': e, 'selectedRow': this.selectedRow })
    this.onChange(e);
  }

  filterApply(event: Event, ListName: string, searchKeyName: string) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.selectedDataList[ListName] = this.dataList[ListName].filter((el: any) => {
      if (searchKeyName) {
        return el[searchKeyName].toLowerCase().includes(filterValue);
      }
      else if (typeof this.displayTextFn == 'function') {
        return this.displayTextFn(el).toLowerCase().includes(filterValue);;
      }
      else {
        return el.toLowerCase().includes(filterValue);
      }
    })
  };

  clearSearchBox(nEl: any, ListName: string) {
    nEl.value = ''
    this.selectedDataList[ListName] = [...this.dataList[ListName]];
  };

  openedChange(event: any, nEl: any, ListName: string) {
    nEl.value = ''
    this.selectedDataList[ListName] = [...this.dataList[ListName]];
    if (event === true) {
      nEl.focus();
    }
  };

  onSelectionChangeVal(event: any, row: any) {
    if (event.isUserInput) {
      console.log('event::', event);
      console.log('row::', row);
      this.selectedRow = row
    }
  }

  displayText(item: any) {
    if (typeof this.displayTextFn == 'function') {
      return this.displayTextFn(item);
    } else {
      return this.fDisplay ? item[this.fDisplay] : item
    }
  }
  isDisabled(item: any) {
    if (typeof this.isOptionDisabled == 'function') {
      return this.isOptionDisabled(item, this.selectedItem);
    } else {
      return false;
    }
  }

  checkIfAllChecked(): boolean {
    if (Array.isArray(this.selectedItem)) {
      if (this.selectedDataList['dataItemsList'].length == this.selectedItem.length) {
        return true
      }
    }
    return false
  }

  onSelectAllChange(event: any) {
    if (event.checked) {
      if (this.fValue) {
        this.selectedItem = this.selectedDataList['dataItemsList'].map((item: any) => item[this.fValue]);

      } else {
        this.selectedItem = this.selectedDataList['dataItemsList'].map((item: any) => item);

      }
      this.selectedRow = this.selectedDataList['dataItemsList'].map((item: any) => item);

    } else {
      if (this.fValue) {
        this.selectedItem = '';
      } else {
        this.selectedItem = [];
      }
      this.selectedRow = [];
    }

    this.onSelectionChangeEvent.emit({ 'value': this.selectedItem, 'selectedRow': this.selectedRow })
    this.onChange(this.selectedItem);
  }

}


