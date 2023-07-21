import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Output, Input, ComponentFactoryResolver } from '@angular/core';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.css']
})
export class EventdetailComponent {
  @Input() eventId: any;
  @Input() eventName: any;
  @Input() venueName: any;
  

  @Output() dataEvent = new EventEmitter<boolean>();

  constructor(public searchService: ServiceService) { }

  date: string = "";
  artist: string = "";
  
  venue: string = "";
  genre: string = "";
  minPrice: string = "";
  maxPrice: string = "";
  priceRange: string = "";
  ticketStatus: string = "";
  seatMap: string = "";
  ticketUrl: string = "";
  name: string = "";
  urlName: string = "";
  
  detailVenueName:string = "";
  venueAddress:string = "";
  venuePhone:string = "";

  venueOpenHours:string = "";
  venueGeneralRule:string = "";
  venueChildRule:string = "";

  buttonLabelOpen:string = 'Show more';
  buttonLabelGeneral:string = 'Show more';
  buttonLabelChild:string = 'Show more';

  detailsVisibleOpen:boolean = false;
  detailsVisibleGeneral:boolean = false;
  detailsVisibleChild:boolean = false;
  
  artists_list: string[] = [];
  spotifyLink_list: string[] = [];
  follower_list: number[] = [];
  follower_list_num: string[] = [];
  popularity_list: number[] = [];
  artistImg_list: string[] = [];
  artistName_list:string[] = [];

  spotifyLink:string = "";
  follower:number = 0;
  popularity:number = 0;
  artistName:string = "";
  artistImg:string = "";

  artistId:string = "";
  artistId_list:string[] = [];
  first:string = "";
  second:string = "";
  third:string = "";
  albumUrl_list: string[][] = [];

  latitude: string = "";
  longitude: string = "";

  //localStorage
  id: string = "";
  // this.id this.date, this.name, this.genre, this.venue
  favorite = {favId:this.id, favDate:this.date, favName:this.name, favGenre:this.genre, favVenue:this.venue};
  emptyHeart:boolean = true;
  fullHeart:boolean = false;

  ngOnInit(): void {

    var myserver = "https://event-382303.wn.r.appspot.com";
    // var myserver = "http://localhost:8080"
    fetch(myserver + '/getDetails?eventId=' + this.eventId)
      .then((response) => response.json())
      .then((data) => {
        
        if ('dates' in data && 'start' in data.dates && 'localDate' in data.dates.start){
          this.date = data.dates.start.localDate;
        }
        
        if ('_embedded' in data && data._embedded.venues.length > 0 && 'name' in data._embedded.venues[0]){
          this.venue = data._embedded.venues[0].name;
        }
        
        var artistNum = -1;
        if ('_embedded' in data && 'attractions' in data._embedded){
          artistNum = data._embedded.attractions.length;

          for (var i = 0; i < artistNum; i++) {
            this.artist += data._embedded.attractions[i].name + ' | ';
            this.artists_list.push(data._embedded.attractions[i].name);
          }
          this.artist = this.artist.slice(0, -2);
        }

        if ('classifications' in data && data.classifications.length > 0 && 'segment' in data.classifications[0] && 'name' in  data.classifications[0].segment && data.classifications[0].segment.name != "Undefined") {
          this.genre += data.classifications[0].segment.name + " | ";
        }

        if ('classifications' in data && data.classifications.length > 0 && 'genre' in data.classifications[0] && 'name' in  data.classifications[0].genre && data.classifications[0].genre.name != "Undefined") {
          this.genre += data.classifications[0].genre.name + " | ";
        }
        if ('classifications' in data && data.classifications.length > 0 && 'subGenre' in data.classifications[0] && 'name' in  data.classifications[0].subGenre && data.classifications[0].subGenre.name != "Undefined") {
          this.genre += data.classifications[0].subGenre.name + " | ";
        }
        if ('classifications' in data && data.classifications.length > 0 && 'type' in data.classifications[0] && 'name' in  data.classifications[0].type && data.classifications[0].type.name != "Undefined") {
          this.genre += data.classifications[0].type.name + " | ";
        }
        if ('classifications' in data && data.classifications.length > 0 && 'subType' in data.classifications[0] && 'name' in  data.classifications[0].subType && data.classifications[0].subType.name != "Undefined") {
          this.genre += data.classifications[0].subType.name + " | ";
        }
        this.genre = this.genre.slice(0, -2);

        if ('priceRanges' in data && data.priceRanges.length > 0 && data.priceRanges[0].min != "Undefined") {
          this.minPrice = data.priceRanges[0].min;
        }

        if ('priceRanges' in data && data.priceRanges.length > 0 && data.priceRanges[0].max != "Undefined") {
          this.maxPrice = data.priceRanges[0].max;
        }

        this.priceRange = this.minPrice + "-" + this.maxPrice;

        this.ticketStatus = data.dates.status.code;
        
        if (this.ticketStatus == "onsale") {
          this.ticketStatus = "On Sale";
        }
        else if (this.ticketStatus == "offsale") {
          this.ticketStatus = "Off Sale";
        }
        else if (this.ticketStatus == "rescheduled") {
          this.ticketStatus = "Rescheduled";
        }
        else if (this.ticketStatus == "postponed") {
          this.ticketStatus = "Postponed";
        }
        else if (this.ticketStatus == "cancelled") {
          this.ticketStatus = "Cancelled";
        }

        if ('seatmap' in data && data.seatmap.staticUrl != "Undefined") {
          this.seatMap = data.seatmap.staticUrl;
        }

        if (data.url != "Undefined") {
          this.ticketUrl = data.url;
        }

        this.name = data.name;
        // this.searchService.getFavorite(this.date, this.name, this.genre, this.venue)
        
        this.id = data.id;

        var favoritesString = localStorage.getItem("favorites");
        if (favoritesString !== null) {
          const favorites = JSON.parse(favoritesString);
          for(let i =0; i < favorites.length; i++){
            
            const favorite = favorites[i];
            if (favorite.favId == this.id) {
              this.fullHeart = true;
              this.emptyHeart = false;
            } else {
              this.emptyHeart = true;
              this.fullHeart = false;
            }  
          }
        } 

                /*
         * Artitst/Team Tab
         */
        // if music 장르일때 
        if (data.classifications[0].segment.name == "Music") {
          Promise.all(this.artists_list.map(artist =>
            fetch(myserver + '/spotify?artistName=' + artist)
                .then(response => response.json())
                ))
            .then(dataArr => {
                dataArr.forEach(data => {
                    
                      this.spotifyLink_list.push(data.body.artists.items[0].external_urls.spotify);
                      this.follower_list.push(data.body.artists.items[0].followers.total);
                      this.popularity_list.push(data.body.artists.items[0].popularity);
                      this.artistName_list.push(data.body.artists.items[0].name);
                      this.artistImg_list.push(data.body.artists.items[0].images[0].url);
                      this.artistId_list.push(data.body.artists.items[0].id);
                });

                this.follower_list_num = this.follower_list.map(num => {
                  const str = num.toString();
                  let newStr = '';
                  let cnt = 0;
                  for (let i = str.length - 1; i >= 0; i--) {
                    if ((str.length - i - 1) % 3 === 0 && i !== str.length - 1) {
                      newStr = ',' + newStr;
                    }
                    newStr = str.charAt(i) + newStr;
                  }
                  return newStr;
                });
                
        
                const albumPromises = this.artistId_list.map(artistId =>
                    fetch(myserver + '/spotifyAlbum?artistId=' + artistId)
                        .then(response => response.json())
                );
      
                return Promise.all(albumPromises);
            })
            .then(albumDataArr => {
                albumDataArr.forEach(data => {
                    let eachAlbumUrl: string[] = [];
                    eachAlbumUrl.push(data.items[0].images[0].url);
                    eachAlbumUrl.push(data.items[1].images[0].url);
                    eachAlbumUrl.push(data.items[2].images[0].url);
                    this.albumUrl_list.push(eachAlbumUrl);
                });

            })
            .catch(error => console.log(error));
    
        }
        else{
          this.artists_list = [];
        }
      })

    const venueUrlName = (this.venueName).replace(/\s+/g, '%20');
    fetch(myserver + '/getVenues?venueName=' + venueUrlName)
      .then((response) => response.json())
      .then((data) => {
        this.detailVenueName = data.name;
        this.venueAddress = data.address.line1 + ", " + data.city.name + ", " + data.state.name;
        if (data.boxOfficeInfo){
          this.venuePhone = data.boxOfficeInfo.phoneNumberDetail;
          this.venueOpenHours = data.boxOfficeInfo.openHoursDetail;
        }
        if('generalInfo' in data && 'childRule' in data.generalInfo && data.generalInfo.childRule != "Undefined"){
          this.venueChildRule = data.generalInfo.childRule;
        }
        if('generalInfo' in data && 'generalRule' in data.generalInfo && data.generalInfo.generalRule != "Undefined"){
          this.venueGeneralRule = data.generalInfo.generalRule;
        }
        
        this.longitude = data.location.longitude;
        this.latitude = data.location.latitude;
        
      })

    // interface Favorites {
    //   favId: string;
    //   // add other properties of the "favorites" object here if needed
    // }

    
}

  backPrev() {
    this.dataEvent.emit(false);
  }

  shareTwt() {
    for (var i = 0; i < this.searchService.events.length; i++) {
      if (this.name === this.searchService.events[i].name) {
        this.urlName = this.searchService.events[i].url;
        break;
      }
    }
    var content = "Check " + this.eventName + " on Ticketmaster.";
    var url = "http://twitter.com/intent/tweet?text=" + content + " " + this.urlName;
    window.open(url);
  }

  shareFb() {
    for (var i = 0; i < this.searchService.events.length; i++) {
      if (this.name === this.searchService.events[i].name) {
        this.urlName = this.searchService.events[i].url;
        break;
      }
    }
    var url = "http://facebook.com/sharer/sharer.php?u=" + this.urlName;
    window.open(url);
  }

  openHoursToggle() {
    this.detailsVisibleOpen = !this.detailsVisibleOpen;
    if (this.detailsVisibleOpen) {
      this.buttonLabelOpen = 'Show less';
    } else {
      this.buttonLabelOpen = 'Show more';
    }
  }

  childRuleToggle(){
    this.detailsVisibleChild = !this.detailsVisibleChild;
    if (this.detailsVisibleChild) {
      this.buttonLabelChild = 'Show less';
    } else {
      this.buttonLabelChild = 'Show more';
    }
  }

  generalRuleToggle(){
    this.detailsVisibleGeneral = !this.detailsVisibleGeneral;
    if (this.detailsVisibleGeneral) {
      this.buttonLabelGeneral = 'Show less';
    } else {
      this.buttonLabelGeneral = 'Show more';
    }
  }

  mapOptions: google.maps.MapOptions = {
    center: { lat: 34.02250304892608, lng: -118.2848487817432}, 
    zoom : 15
  }

  marker = {
      position: { lat: 34.02250304892608, lng: -118.2848487817432 },
  }


  getMap(){
    // console.log("!!");
    // console.log(this.longitude);
    this.mapOptions = {
      center:{
        lat: parseFloat(this.latitude),
        lng: parseFloat(this.longitude)
      },
      zoom:15
    };
    this.marker = {
      position:{
        lat: parseFloat(this.latitude),
        lng: parseFloat(this.longitude)
      }
    };
  }

  checkFavorite(){
    this.favorite = {favId:this.id, favDate:this.date, favName:this.name, favGenre:this.genre, favVenue:this.venue};
    var savedFavs = [];
    var savedFavElement = localStorage.getItem("favorites");

    if(savedFavElement){ // if id가 local storage에 있으면
      savedFavs = JSON.parse(savedFavElement);
    }
    savedFavs.push(this.favorite);
    localStorage.setItem("favorites", JSON.stringify(savedFavs));
    alert('Event added to Favorites!');

    this.emptyHeart = false;
    this.fullHeart = true;
  }

  removeFavorite(id:string){
    var favorites= [];
    favorites = this.searchService.removeFavorite(id);
    this.emptyHeart = true;
    this.fullHeart = false;
    alert('Event removed to Favorites!');
    
  }

}


