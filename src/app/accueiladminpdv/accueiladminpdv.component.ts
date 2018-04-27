import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import {CrmService, Portefeuille, Relance, Promotion, Prospection, Suivicommande, Servicepoint} from "../services/crm.service";
import { ModalDirective } from 'ng2-bootstrap/modal';
import {AdminpdvService} from "../services/adminpdv.service";
import {UtilsService} from "../services/utils.service";
import {ComptabiliteService} from "../services/comptabilite.service";
import { Location }  from '@angular/common';




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

  //parametre de compte
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "pdv";
  public sortOrder = "asc";

  public regions:any[] = [];
  public zones:any[] = [];
  public iszones:boolean;
  public souszones:any[] = [];
  public issouszones:boolean;

  region : any ;
  zone : any ;
  souszone : any ;
  chaine : string ;

  prenom : any ;
  nom :any ;
  email :any ;
  telephone :any ;
  nometps : any ;
  nomshop : any ;
  adresse : any ;

  existLogin = false ;

  public servicepoint:Servicepoint[];
  public relance:any[];
  public promotion:Promotion[];
  public prospection:Prospection[];
  public suivicommande:Suivicommande[];
  public portefeuille:Portefeuille[];

  public monitoringAdminpdvUserpdv: any;
  public modifuserpdv: any;
  public password:string;
  public confirmPassword:string;
  public errorConfirm:boolean = false;



  constructor(private _utilsService:UtilsService,
              private _authService:AuthService,
              private _crmService: CrmService,
              private _adminpdvService:AdminpdvService,
              private location: Location,
              private _comptabiliteService: ComptabiliteService
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

     console.log("test");
    this._adminpdvService.listuserpdv({type:"azrrtt"}).subscribe(
      data => {
        this.monitoringAdminpdvUserpdv = data.response ;
      },
      error => alert(error),
      () => {
        this.getRegionNewCaissier();
        this.loading = false ;
      }
    );

  }
estcheckModel(type: string){
    if(type == 'jour'){
      this.checkModel.jour = true;
      this.checkModel.annee = false;
      this.checkModel.intervalle = false;

      this.selectionannee = "";
      this.selectionintervalledateinit = "";
      this.selectionintervalleddatefinal = "";
    }
    else if(type == 'annee'){
      this.checkModel.jour = false;
      this.checkModel.annee = true;
      this.checkModel.intervalle = false;

      this.selectionjour = "";
      this.selectionannee = "2017";
      this.selectionintervalledateinit = "";
      this.selectionintervalleddatefinal = "";
    }
    else if(type == 'intervalle'){
      this.checkModel.jour = false;
      this.checkModel.annee = false;
      this.checkModel.intervalle = true;

      this.selectionjour = "";
      this.selectionannee = "";
    }
    else{
      this.checkModel.jour = true;
      this.checkModel.annee = false;
      this.checkModel.intervalle = false;

      this.selectionjour = "";
      this.selectionannee = "";
      this.selectionintervalledateinit = "";
      this.selectionintervalleddatefinal = "";
    }
    this.selectionintervalle="";
  }

  goBack() {
    this.location.back();
  }



/* ***************************************************************************
                      parametre de compte caissier
  *******************************************************************************/
/* -------- Variables -----------*/







/* -------- Fonctions ---------*/

// rôle   :
// entres :
// sorties:

  getRegionNewCaissier(){
    this._utilsService.getRegion()
      .subscribe(
        data => {
          this.regions = data;
        },
        error => alert(error),
        () => {
          console.log('test init sentool')
        }
      );
  }

    
  selectRegionNewCaissier(){
    this.iszones = false;
    this.zone = '--Choix zone--';
    this.souszone = '--Choix sous zone--';
    this._utilsService.getZoneByRegion(this.region)
      .subscribe(
        data => {
          this.zones = data;
          this.iszones = true;
        },
        error => alert(error),
        () => console.log('getZoneByRegion')
      );
  }

  selectZoneNewCaissier(){
    this.issouszones = false;
    this._utilsService.getSouszoneByZoneByRegion({region:this.region, zone: this.zone})
      .subscribe(
        data => {
          this.souszones = data;
          this.issouszones = true;
        },
        error => alert(error),
        () => console.log('getSouszoneByZoneByRegion')
      );
  }

  
//fin parametre de compte caissier

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

  /* ***************************************************************************
                     exploitation
  *******************************************************************************/
/* -------- Variables -----------*/
public checkModel:any = {jour: true, annee: false, intervalle: false};
  selectionannee:string;
  selectionjour:string;
  selectionintervalledateinit:string;
  selectionintervalleddatefinal:string;
  selectionintervalle:string;

  filtre:any;
  filtreaveccommission:any;
  asc="asc";








/* -------- Fonctions ---------*/




 



}


