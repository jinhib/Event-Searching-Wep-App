import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';



@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) { }
  // backend_url: string = "http://localhost:8080/";
  backend_url: string = "https://event-382303.wn.r.appspot.com/";
  events: any;
  favoriteData: string[] = [];
  favorites: any;

  ngOnInit(): void {
  }

  tablesorting(){
    var events = this.events;
    // console.log(events);
    var i;
    var change = true;
    var needtochange = false;

    while (change) {
      change = false;
      for (i = 0; i < (events.length-1); i++) {
        needtochange = false;
        var x = events[i].dates.start.dateTime;
        var y = events[i+1].dates.start.dateTime;
        if (x>y) {
          needtochange = true;
          break;
        }
      }
      if (needtochange) {
        var temp = events[i+1];
        events[i+1] = events[i];
        events[i] = temp;
        
        change = true;
      }
    }
    return events;
  }

  getEvents(keyword: string, distance: number, category: string, latitude: number, longitude: number){
    var url = this.backend_url + 'searchEvents?keyword=' + keyword + "&distance=" + distance + "&category=" + category + "&longitude=" + longitude + "&latitude=" + latitude;
    
    var response = this.http.get<any>(url);
    response.subscribe((data) => {
      if ('_embedded' in data){
        this.events = data['_embedded']['events'];
        console.log(this.events);
        this.events = this.tablesorting();
        console.log(this.events);
      }
      else{
        this.events = [];
      }
    });
    return response;
  }

  removeFavorite(removeId:string){
    var favoritesString = localStorage.getItem("favorites");
    var favorites = [];
    if (favoritesString !== null) {
      favorites = JSON.parse(favoritesString);
      for(let i = 0; i < favorites.length; i++){
        if(favorites[i].favId == removeId){
          favorites.splice(i, 1);
        }
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    this.favorites = favorites;
    alert('Removed from Favorites!');

    return this.favorites;


    } 

}
