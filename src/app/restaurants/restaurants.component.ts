import { Component, OnInit } from '@angular/core';
import restaurantData from '../../assets/restaurants.json';

export interface Restaurant {
  restaurantId: number;
  naam: string;
  favoriet: boolean;
  categorie: string;
  openingstijden: string;
  bezorgtijden: number;
  bezorgprijs: number;
  bezorgen: boolean;
  afhalen: boolean;
  imageUrl: string;
}

@Component({
  selector: 'ab-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  public filteredRestaurants: Restaurant[] = restaurantData;

  private restaurants: Restaurant[] = restaurantData;

  public sterFilter: boolean = false;

  //Toggle voor sterfilter waarbij enkel de favoriete restaurants worden getoond
  public toggleFavorietenFilter() {
    this.sterFilter = !this.sterFilter;
    const zoekFilter = this._zoekFilter;
    this.filteredRestaurants = this.filterRestaurants(zoekFilter);
  }

  private _zoekFilter: string = '';
  get zoekFilter(): string {
    return this._zoekFilter;
  }
  set zoekFilter(value: string) {
    this._zoekFilter = value;
    this.filteredRestaurants = this.filterRestaurants(value);
  }

  //Zoekfunctie draait zodra het zoekveld gebruikt wordt, let ook op of de sterfilter/favorietenfilter aan staat
  public filterRestaurants(filterBy: string): Restaurant[] {
    this.setStorage();
    filterBy = filterBy.toLocaleLowerCase();
    if (this.sterFilter === true) {
      return this.restaurants.filter((restaurant: Restaurant) =>
      restaurant.favoriet === (true) && restaurant.naam.toLocaleLowerCase().includes(filterBy) || restaurant.favoriet === (true) && restaurant.categorie.toLocaleLowerCase().includes(filterBy));
    }
    else {
      return this.restaurants.filter((restaurant: Restaurant) =>
      restaurant.naam.toLocaleLowerCase().includes(filterBy) || restaurant.categorie.toLocaleLowerCase().includes(filterBy));
    }
  }

  //Favorietendata wordt uit jsonbestand gehaald en in localstorage gezet. Moet enkel gebeuren als localstorage leeg is, dus wordt niets overgeschreven.
  public setStorage(): void {
    var storage = window.localStorage;
    restaurantData.forEach(Restaurant => {
      storage.setItem('isFavorietRestaurant'+JSON.stringify(Restaurant.restaurantId), JSON.stringify(Restaurant.favoriet));
    });
    this.convertFavorietBools();
  }

  //Favorietendata voor alle restaurants wordt uit localstorage gehaald en past de data in de website aan
  public convertFavorietBools(): void {
    restaurantData.forEach(Restaurant => {
      Restaurant.favoriet = (localStorage.getItem('isFavorietRestaurant'+JSON.stringify(Restaurant.restaurantId)) === "true") ? true : false;
    });
  }
  
  //Toggle favoriet voor individuele restaurants
  public toggleFavoriet(id: number): void {
    console.log("ToggleFavoriet aangeroepen met ID" + id);
    let isFavoriet = localStorage.getItem('isFavorietRestaurant'+id);
    if (isFavoriet === 'true' ) {
      localStorage.setItem('isFavorietRestaurant'+JSON.stringify(id), 'false');
    }
    else {
      localStorage.setItem('isFavorietRestaurant'+JSON.stringify(id), 'true'); 
    }
    this.convertFavorietBools();
  }

  //Bij starten pagina, checkt of favorietendata al in localstorage staat en behandelt dat naar behoeven.
  ngOnInit(): void {
    if(!localStorage.getItem('isFavorietRestaurant1')) {
      this.setStorage();
    }
    else {
      this.convertFavorietBools();
    }
  }

}
