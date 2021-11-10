import { Injectable } from '@angular/core';
import etenData from '../assets/eten.json';
import { Restaurant } from './restaurants/restaurants.component';
import restaurantData from '../assets/restaurants.json';

export interface Eten {
  etenId: number;
  restaurantId: number;
  naam: string;
  categorie: string;
  prijs: number;
  imageUrl: string;
  aantal: number;
}


@Injectable({
  providedIn: 'root'
})
export class WinkelwagenService {
  private restaurantsNietDoorDeWarHalen: Restaurant[] = restaurantData;
  public winkelwagenRestaurantId: number = 0;

  public eten: Eten[] = etenData;

  public aantalEtenInWinkelWagen: number = 0;

  public totaalPrijs: number = 0;
  public bezorgKosten: number = 0;

  public KeuzeAfhalenOfBezorgen: string = '';
  public ditRestaurantBezorgt: boolean = true;
  public ditRestaurantAfhalen: boolean = true;

  constructor() { }

  //Zorgt voor aantal producten in winkelwagen knop
  aantalAanKnopToevoegen() {
    if(localStorage.getItem('aantalInWinkelwagen')){
      this.aantalEtenInWinkelWagen = Number(JSON.parse(localStorage.getItem('aantalInWinkelwagen') as string));
      this.aantalEtenInWinkelWagen++;
      localStorage.setItem('aantalInWinkelwagen', JSON.stringify(this.aantalEtenInWinkelWagen));
    }
    else {
      localStorage.setItem('aantalInWinkelwagen', '1');
      this.aantalEtenInWinkelWagen = 1;
    }
  }

  //haalt 1 af van totaal aantal producten nummer in knop Winkelwagen
  eenVanKnopAfhalen() {
    this.aantalEtenInWinkelWagen = Number(JSON.parse(localStorage.getItem('aantalInWinkelwagen') as string));
    this.aantalEtenInWinkelWagen--;
    localStorage.setItem('aantalInWinkelwagen', JSON.stringify(this.aantalEtenInWinkelWagen));
  }

  //Knop winkelwagen legen
  leegWinkelwagen(): void {
    localStorage.setItem('aantalInWinkelwagen', JSON.stringify(0));
    this.aantalEtenInWinkelWagen = 0;
    localStorage.removeItem('eten');
    this.eten.forEach(etenIteratie => {
      etenIteratie.aantal = 0;
    })
    this.winkelwagenRestaurantId = 0;
    this.etenAantalInstellen();
    localStorage.setItem('restaurantInWinkelwagen', JSON.stringify(0));
  }

  //Eten product toevoegen aan winkelwagen (via restaurantscherm of in winkelwagen)
  etenAanWinkelwagenToevoegen(id: number, restaurantId: number) {
    let etenNu = JSON.parse(localStorage.getItem('eten') || '{}') as Eten[];
    const index = etenNu.findIndex(zoveelsteEten => zoveelsteEten.etenId === id);
    let nieuweAantal = etenNu.find(eten => eten.etenId === id)?.aantal as number;
    nieuweAantal++;
    etenNu[index] = Object.assign({}, etenNu[index], {aantal: nieuweAantal});
    localStorage.setItem('eten', JSON.stringify(etenNu));
    this.winkelwagenRestaurantId = restaurantId;
    this.vertaalAantallen();
    if(localStorage.getItem('restaurantInWinkelwagen') === '0') {
      localStorage.setItem('restaurantInWinkelwagen', JSON.stringify(restaurantId));
    }
  }

  //Eten aantal in winkelwagen verlagen
  etenInWinkelWagenVerlagen(id: number, restaurantId: number) {
    let etenNu = JSON.parse(localStorage.getItem('eten') || '{}') as Eten[];
    const index = etenNu.findIndex(hoeveelsteEten => hoeveelsteEten.etenId === id);
    let nieuwerAantal = etenNu.find(eten => eten.etenId === id)?.aantal as number;
    nieuwerAantal--;
    etenNu[index] = Object.assign({}, etenNu[index], {aantal: nieuwerAantal});
    localStorage.setItem('eten', JSON.stringify(etenNu));
    this.winkelwagenRestaurantId = restaurantId;
    this.vertaalAantallen();
    if(this.aantalEtenInWinkelWagen === 0) {
      localStorage.setItem('restaurantInWinkelwagen', JSON.stringify(0));
    }
  }

  //Haalt aantallen eten op uit JSON bestand en slaat op in LocalStorage
  public etenAantalInstellen(): void {
    var storage = window.localStorage;
    storage.setItem('eten', JSON.stringify(this.eten));
    this.vertaalAantallen();
  }

  //Aantallendata voor al het eten wordt uit localstorage gehaald(, gesorteerd op Id) en schrijft de data in de website uit de JSON over
  public vertaalAantallen(): void {
    //let sorteerEten = JSON.parse(localStorage.getItem('eten') || '{}') as Eten[];
    //this.eten = sorteerEten.sort((a, b) => a.etenId - b.etenId);
    this.eten = JSON.parse(localStorage.getItem('eten') || '{}') as Eten[]; //Sorteren niet meer nodig, houd het nog even hiero voor de zekerheid
    if(localStorage.getItem('restaurantInWinkelwagen')){
      this.winkelwagenRestaurantId = JSON.parse(localStorage.getItem('restaurantInWinkelwagen') || '') as number;
    }
    else {
      localStorage.setItem('restaurantInWinkelwagen', JSON.stringify(0));
    }
  }

  //rekent totaalprijs winkelwagen uit, inclusief bezorgkosten indien er bezorgt wordt
  totaalPrijsUitrekenen(): void {
    let totaalPrijs = 0;
    this.eten.forEach(tussenTotaal => {
      totaalPrijs += tussenTotaal.prijs*tussenTotaal.aantal
    });
    this.checkRestaurantBezorgt();
    this.totaalPrijs = totaalPrijs;
    if(this.ditRestaurantBezorgt && this.KeuzeAfhalenOfBezorgen === 'Bezorgen') {
      this.bezorgprijsUitrekenen();
      this.totaalPrijs += this.bezorgKosten;
    }
    console.log('totaalprijs is ' + totaalPrijs);
  }

  //checkt of restaurant bezorgt en/of je dr kan afhalen
  checkRestaurantBezorgt(): void {
    if(this.winkelwagenRestaurantId > 0) {
      let restaurantInWinkelwagen = this.restaurantsNietDoorDeWarHalen.find(ditRestaurant => ditRestaurant.restaurantId = this.winkelwagenRestaurantId);
      if(restaurantInWinkelwagen?.afhalen) {
        this.ditRestaurantAfhalen = true;
      }
      else {
        this.ditRestaurantAfhalen = false;
      }
      if(restaurantInWinkelwagen?.bezorgen) {
        this.ditRestaurantBezorgt = true;
      }
      else {
        this.ditRestaurantBezorgt = false;
      }
    }
    else {
      this.ditRestaurantBezorgt = true;
      this.ditRestaurantAfhalen = true;
    }
  }

  //bezorgprijs uitrekenen
  bezorgprijsUitrekenen(): number {
    this.bezorgKosten = 0;
    if(this.ditRestaurantBezorgt) {
      this.bezorgKosten = this.restaurantsNietDoorDeWarHalen.find(ditRestaurant => ditRestaurant.restaurantId === this.winkelwagenRestaurantId)?.bezorgprijs as number;
    }
    return this.bezorgKosten;
  }
}
