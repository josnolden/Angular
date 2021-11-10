import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { ContactComponent } from './contact/contact.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { WinkelwagenComponent } from './winkelwagen/winkelwagen.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    RestaurantsComponent,
    ContactComponent,
    RestaurantComponent,
    WinkelwagenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'start', component: StartComponent },
      { path: 'restaurants', component: RestaurantsComponent },
      { path: 'restaurants/0', redirectTo: 'restaurants', pathMatch: 'full' },
      { path: 'restaurants/:id', component: RestaurantComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'winkelwagen', component: WinkelwagenComponent },
      { path: '', redirectTo: 'start', pathMatch: 'full' },
      { path: '**', redirectTo: 'start', pathMatch: 'full' }
    ]),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
