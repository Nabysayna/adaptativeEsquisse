import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import {CrmService, Portefeuille, Relance, Promotion, Prospection, Suivicommande, Servicepoint} from "../services/crm.service";
import { ModalDirective } from 'ng2-bootstrap/modal';


@Component({
  selector: 'app-accueiladminpdv',
  templateUrl: './accueiladminpdv.component.html',
  styleUrls: ['./accueiladminpdv.component.css']
})
export class AccueiladminpdvComponent implements OnInit {

  displayedPage = "accueil";
  isMobile : boolean ;
  message:any;
   checkerRelance : any[] = [] ;
  checkerPromo : any[] = []  ;
  categMsg:any;
  choosedCustomerPhone : string ;
  loading = false ;

  public servicepoint:Servicepoint[];
  public relance:any[];
  public promotion:Promotion[];
  public prospection:Prospection[];
  public suivicommande:Suivicommande[];
  public portefeuille:Portefeuille[];



  constructor(private _authService:AuthService,
              private _crmService: CrmService
            ) { }

  ngOnInit() {

    // détéction de la taille de l'écran
    if ( window.screen.width <= 768 )
      this.isMobile = true; // mobile screen

        // détéction de la taille de l'écran
    else
      this.isMobile = false; // descktop  screen
      this.loading = true ;

    this._crmService.servicepoint().subscribe(
      data => {
        console.log(data)
        this.servicepoint = data ;
        console.log(this.servicepoint)
      },
      error => alert(error),
      () => {
        this._crmService.portefeuille().subscribe(
          data => {
            this.portefeuille = data ;
          },
          error => alert(error),
          () => {
            console.log("Here Dashboard Test")
            this.loading = false ;
          }
        )
      }
    )

  }


  relanceMeth(){
    this.loading = true ;
    this.checkerRelance = [] ;
    this._crmService.relance().subscribe(
      data => {
        this.relance = data ;
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
        this.loading = false ;
      }
    )
  }

  promotionMeth(){
    this.loading = true ;
    this.checkerPromo = [];
    this._crmService.promotion().subscribe(
      data => {
        this.promotion = data ;
        console.log(this.promotion)
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
        this.loading = false ;
      }
    )
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

  mail(){}

   sms(telephone){
    let destinataire = '+221'+telephone ;
     this._crmService.sendSms({destinataires:destinataire, messageContain:this.message}).subscribe(
       data => {
         this.childModalcrm.hide();
       },
       error => alert(error),
       () => {
         console.log("Here Dashboard Test")
       }
     )
   }

   appel(){}


  detail(){}

  envoyersmsPromo(){
    let destinataires : string ;
    destinataires = '+221'+this.checkerPromo[0].customer.telephone ;

    for( var i=1 ; i<this.checkerPromo.length ; i++ ){
      destinataires = destinataires+'#+221'+this.checkerPromo[i].customer.telephone ;
    }

    this._crmService.sendSms({destinataires:destinataires, messageContain:this.message}).subscribe(
      data => {
        this.childModalcrm.hide();
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
      }
    )
  }

  envoyersmsRelance(){
    let destinataires : string ;
    destinataires = '+221'+this.checkerRelance[0].customer.telephone ;
    for( var i=1 ; i<this.checkerRelance.length ; i++ ){
      destinataires = destinataires+'#+221'+this.checkerRelance[i].customer.telephone ;
    }

    this._crmService.sendSms({destinataires:destinataires, messageContain:this.message}).subscribe(
      data => {
        this.childModalcrm.hide();
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
      }
    )
  }


  tester(){
    console.log("Checker activated!") ;
  }

@ViewChild('childModalcrm') public childModalcrm:ModalDirective;

  public showChildModalcrm(typeSuivi, tel):void {
    this.categMsg = typeSuivi ;
    if (typeSuivi=='single')
      this.choosedCustomerPhone = tel ;
    this.childModalcrm.show();
  }

  public hideChildModalcrm():void {
    this.message = '' ;
    this.childModalcrm.hide();
  }


}


