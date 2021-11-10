import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import restaurantData from '../../assets/restaurants.json';

export interface Formulier {
  naam: string;
  adres: string;
  postcode: string;
  categorie: string;
  bezorgen: boolean;
  afhalen: boolean;
  email: string;
  bericht: string;
}

@Component({
  selector: 'ab-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  formulier: Formulier[] =[];

  //Haalt alle unieke categoriën uit de restaurantdata en maakt er een array van voor de dropdown-lijst
  private restaurants = restaurantData;
  public restaurantCategories = [...new Set( this.restaurants.map(res => res.categorie))];

  //Slaat de contactformulier gegevens op in de localstorage
  submit(contactFormulier: NgForm) {
    localStorage.setItem('opgeslagenContactFormulier', JSON.stringify(contactFormulier.value));
  }
  
  ngOnInit(): void {
    
  }

}
