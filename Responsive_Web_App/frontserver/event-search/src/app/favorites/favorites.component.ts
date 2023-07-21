import { ServiceService } from '../service.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  constructor(public searchService: ServiceService) { }
  favorites: any;

  ngOnInit(): void {
    var favoritesString = localStorage.getItem("favorites");
    if (favoritesString !== null) {
      const favorites = JSON.parse(favoritesString);
      this.favorites = favorites;
    } 
  }

  removeFav(id:string){
    this.favorites = this.searchService.removeFavorite(id);
  }
}
