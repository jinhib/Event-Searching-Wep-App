import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgForm} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ServiceService } from '../service.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  implements OnInit {
  response: any;
  autoChecked:boolean = false;
  sumbit_clicked:boolean = false;
  isSearched:boolean = false;
  
  
  //autocomplete
  backend_autocomplete = "https://event-382303.wn.r.appspot.com/autocomplete/";
  // backend_autocomplete = "http://localhost:8080/autocomplete/";
  keywordSearch = new FormControl();
  filtered: any;
  isLoading = false;
  errorMsg!: string;

  constructor(private searchService: ServiceService, private http: HttpClient) { }

  ngOnInit() {
    this.keywordSearch.valueChanges
    .pipe(
      filter(res => {
        return res !== null && res.length >= 0
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.errorMsg = "";
        this.filtered = [];
        this.isLoading = true;
      }),
    
      switchMap(value => this.http.get(this.backend_autocomplete + value)
      .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((data: any) => {
      if (data == undefined || data['_embedded'] == undefined) {
        this.errorMsg = data['Error'];
        this.filtered = [];
      } else {
        this.errorMsg = "";
        for(var i = 0; i < data['_embedded']['attractions'].length; i++){
          this.filtered.push(data['_embedded']['attractions'][i]['name']);
        }
      }
    });
  }


  keyword: string = '';
  distance: number = 10;
  category: string ='Default';
  location: string = '';
  latitude: number = 0;
  longitude: number = 0;

  clickSubmit(){
    if(this.autoChecked == true){
      var mytoken = "7c5267ff4ea8ad";
      var info_url = "https://ipinfo.io/json?token="
      this.http.get(info_url + mytoken).subscribe((data:any)=>{
        var location = data['loc'].split(',');
        this.latitude = location[0];
        this.longitude = location[1];
        if (this.distance == undefined){
          this.distance = 10;
        }
        this.searchService.getEvents(this.keywordSearch.value, this.distance, this.category, this.latitude, this.longitude)
      });
    }
    else{
      this.latitude = 0;
      this.longitude = 0;
      var mytoken = "AIzaSyDEctEPi8ZsLJy8ClTdJxe7V-r7JYnlMqA";
      var google_url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
      this.http.get(google_url + this.location + "&key=" + mytoken).subscribe((data:any)=>{
        if ('results' in data && data['results'].length > 0 && 'geometry' in data['results'][0] && 'location' in data['results'][0]['geometry'] && 'lat' in data['results'][0]['geometry']['location']){
          this.latitude = data['results'][0]['geometry']['location']['lat'];
        }
        if ('results' in data && data['results'].length > 0 && 'geometry' in data['results'][0] && 'location' in data['results'][0]['geometry'] && 'lng' in data['results'][0]['geometry']['location']){
          this.longitude = data['results'][0]['geometry']['location']['lng'];
        }
        this.searchService.getEvents(this.keywordSearch.value, this.distance, this.category, this.latitude, this.longitude)

      });
    }
    this.isSearched = true;
  }

  clear(){
    this.autoChecked = false;
    this.isSearched = false;
    this.keywordSearch.reset();
    this.distance = 10;
    this.category = 'Default';
    this.location= '';
  }

  autoClicked(event:Event){
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked == false){
        this.autoChecked = false;
    }else{
        this.autoChecked = true;
        this.location = '';
    }
  }
}

