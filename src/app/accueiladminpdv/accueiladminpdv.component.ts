import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-accueiladminpdv',
  templateUrl: './accueiladminpdv.component.html',
  styleUrls: ['./accueiladminpdv.component.css']
})
export class AccueiladminpdvComponent implements OnInit {

  displayedPage = "accueil";
  isMobile : boolean ;

  constructor(private _authService:AuthService) { }

  ngOnInit() {

    // détéction de la taille de l'écran
    if ( window.screen.width <= 768 )
      this.isMobile = true; // mobile screen

        // détéction de la taille de l'écran
    else
      this.isMobile = false; // descktop  screen

  }

  // routage 
  public roadTo(choosedRoad){
      this.displayedPage = this.displayedPage + "-" + choosedRoad ;
      console.log("Next url: " + this.displayedPage);
      this.reinitialiser();
  }

  //Initialisation des variable globaux
  public reinitialiser (){

  }

  //retour en arrier
  public pdvacueilretour(){
      this.displayedPage = this.displayedPage.substring(0, this.displayedPage.lastIndexOf("-")) ;
      console.log("Cancel url: " + this.displayedPage);
  } 

  // deconnection 
  deconnexion(){
    this._authService.deconnexion();
  }


}
