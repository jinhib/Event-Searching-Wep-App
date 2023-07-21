import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { FormGroup } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html', 
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Output() dataEvent =  new EventEmitter<boolean>();

  isDetail:boolean = false;

  constructor(public searchService: ServiceService) { }
  
  selectedIndex: number = -1;
  ngOnInit(): void {    

  }

  


  eventsDetail(i:number){
    this.isDetail = true;
    this.selectedIndex = i;
  }

  receiveData(child_is_detail: boolean) {
    this.isDetail = child_is_detail;
  }
}
