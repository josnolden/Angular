import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../restaurants/restaurants.component';
import { Eten, WinkelwagenService } from '../winkelwagen.service';

declare var $: any;

$('#bon').modal({
  backdrop: 'static',
keyboard: false
})

@Component({
  selector: 'ab-winkelwagen',
  templateUrl: './winkelwagen.component.html',
  styleUrls: ['./winkelwagen.component.css']
})
export class WinkelwagenComponent implements OnInit {

  eten: Eten[] = [];
  bonData: string = '';

  restaurantsMetItemsInWinkelwagen: Restaurant[] = [];

  //keuzemenu afhalen of bezorgen
  public KeuzeAfhalenOfBezorgen: string = 'Afhalen';
  dataChanged(): void {
    this.KeuzeAfhalenOfBezorgen = this.KeuzeAfhalenOfBezorgen;
    this.winkelwagenService.KeuzeAfhalenOfBezorgen = this.KeuzeAfhalenOfBezorgen;
    this.winkelwagenService.totaalPrijsUitrekenen();
  }

  constructor(public winkelwagenService: WinkelwagenService) {
    this.eten = this.winkelwagenService.eten.filter(etens => etens.aantal > 0);
  }

  //knop Leegmaken
  winkelWagenLegen(): void {
    this.winkelwagenService.leegWinkelwagen();
    this.winkelwagenService.totaalPrijsUitrekenen();
    this.updateEten();
  }

  //verhoogt aantal van een product
  etenAantalPlus(id: number, restaurantId: number) {
    this.winkelwagenService.aantalAanKnopToevoegen();
    this.winkelwagenService.etenAanWinkelwagenToevoegen(id, restaurantId);
    this.winkelwagenService.totaalPrijsUitrekenen();
    this.updateEten();
  }

  //verlaagt aantal van een product
  etenAantalMin(id: number, restaurantId: number) {
    this.winkelwagenService.eenVanKnopAfhalen();
    this.winkelwagenService.etenInWinkelWagenVerlagen(id, restaurantId);
    this.winkelwagenService.totaalPrijsUitrekenen();
    this.updateEten();
  }

  //update eten aan voorkant
  updateEten(): void {
    this.eten = this.winkelwagenService.eten.filter(etens => etens.aantal > 0);
  }

  betalen(): void {
    this.winkelwagenService.vertaalAantallen();
    $('#bon').modal('show');
  }

  afrekenen(): void {
    localStorage.setItem('etenBetaald', JSON.stringify(this.eten));
    $('#bon').modal('hide');
    alert('Bedankt voor uw bestelling!');
    this.winkelWagenLegen();
  }

  betalingAnnuleren(): void {
    $('#bon').modal('hide');
  }

  
  ngOnInit(): void {
    //Bij starten pagina, checkt of aantallen eten al in localstorage staan, zo niet draait ie de functie die dat doet
    if(!localStorage.getItem('eten')) {
      this.winkelwagenService.etenAantalInstellen();
    }
    else {
      this.winkelwagenService.vertaalAantallen();
    }
    this.updateEten();
    this.winkelwagenService.totaalPrijsUitrekenen();
  }

}
