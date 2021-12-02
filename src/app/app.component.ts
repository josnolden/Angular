import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WinkelwagenService } from './winkelwagen.service';

@Component({
  selector: 'ab-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  public title = 'Alkmaar-Bezorgd';
  
  constructor(public router: Router, public winkelwagenService: WinkelwagenService) { };
  
  //nodig voor aantal producten in winkelwagenknop, is onderdeel van basismenu in plaats van component
  public aantalInWinkelWagen = this.winkelwagenService.aantalEtenInWinkelWagen;
}