import { Component, OnInit } from '@angular/core';
import restaurantData from '../../assets/restaurants.json';
import { Restaurant } from '../restaurants/restaurants.component';
import { ActivatedRoute } from '@angular/router';
import { WinkelwagenService, Eten } from '../winkelwagen.service';

@Component({
  selector: 'ab-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})

export class RestaurantComponent implements OnInit {

  eten: Eten[] = this.winkelwagenService.eten;
  filteredEten: Eten[] = [];
  public etenCategories: string[] = [];
  public categorieFilter: string = "default";
  
  //past categoriefilter voor eten toe
  filterChanged(){
    this.categorieFilter = this.categorieFilter;
    this.filterEtens();
  }

  restaurant: Restaurant | undefined;
  id: number = 0;
  public aantalEtenInWinkelWagen: number = 0;
  constructor(private route: ActivatedRoute, private winkelwagenService: WinkelwagenService) { }

  //voegt product toe aan winkelwagen
  winkelWagenToevoegen(etenId: number, restaurantId: number) {
    if (localStorage.getItem('aantalInWinkelwagen') === '0' || restaurantId === JSON.parse(localStorage.getItem('restaurantInWinkelwagen') || '') as number) {
      this.winkelwagenService.aantalAanKnopToevoegen();
      this.winkelwagenService.etenAanWinkelwagenToevoegen(etenId, restaurantId);
      console.log('restaurantId: ' + restaurantId);
      this.winkelwagenService.totaalPrijsUitrekenen();
    }
    else {
      alert('U kunt voor maar een restaurant tegelijk bestellen, maak eerst uw bestelling af of leeg de winkelwagen.');
    }
  }

  //filter etenswaren aan de hand van restaurantId
  filterEtens(): void {
    this.eten = this.eten.filter(etens => etens.restaurantId === this.id);
    if (this.categorieFilter !== "default") {
      this.filteredEten = this.eten.filter(etens => etens.categorie === this.categorieFilter);
    }
    else {
      this.filteredEten = this.eten;
    }
  }
  
  //Toont enkel het restaurant aan de hand van het restaurantId dat gelijk moet zijn aan de paginalink
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.restaurant = restaurantData.find(res => res.restaurantId === this.id) as Restaurant || undefined;
    console.log('restaurantdata: ',  restaurantData);
    this.filterEtens();
    //haalt duplicates uit etencategoriefilter
    this.etenCategories = [...new Set( this.eten.map(eten => eten.categorie))];
    //Bij starten pagina, checkt of aantallen eten al in localstorage staan, zo niet draait ie de functie die dat doet
    if(!localStorage.getItem('eten')) {
      this.winkelwagenService.etenAantalInstellen();
    }
    if(!localStorage.getItem('aantalInWinkelwagen')) {
      localStorage.setItem('aantalInWinkelwagen', JSON.stringify(0));
    }
    console.log('INIT Restaurant');
  }

}
