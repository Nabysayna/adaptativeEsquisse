import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import {CrmService, Portefeuille, Relance, Promotion, Prospection, Suivicommande, Servicepoint} from "../services/crm.service";
import {ModalDirective,ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import {AdminpdvService} from "../services/adminpdv.service";
import {UtilsService} from "../services/utils.service";
import {ComptabiliteService} from "../services/comptabilite.service";
import { Location }  from '@angular/common';
import {BaseChartDirective} from "ng2-charts";
import {Router, ActivatedRoute} from "@angular/router";
import {Http, Headers, RequestOptions} from "@angular/http";
import * as _ from "lodash";
import * as sha1 from 'js-sha1';



class UserExploitation{
  nom : string;
  prenom : number;
  idpdv:number;
}

class PdvCaisse{
  nom : string ;
  caisse : number ;
  prenom : number ;
  id : number ;
  idpdv:number;
}

class Charges{
  dateajout:string;
  libelle:string;
  montant:number;
  service:string;

}

class Revenus{
  date:string;
  libelle:string;
  montant:number;
  service:string;

}
class Revenustransfert{
  date:string;
  libelle:string;
  montant:number;
  frais:number;
  commission:number;
  service:string;

}

class Exploitation{
  dateajout:string;
  designation:string;
  stocki:number;
  vente:number;
  stockf:number;
  mnt:number;
}

class Exploitationaveccommission{
  dateajout:string;
  designation:string;
  vente:number;
  mnt:number;
  frais:number;
  commission:number;
}

class Supservice{
  idservice:number;
  services:string;
  design:string;
}

class Designation{
  name:string;
  stock:number;
  prixAchat:number;
  prixunitaire:number;
}


@Component({
  selector: 'app-accueiladminpdv',
  templateUrl: './accueiladminpdv.component.html',
  styleUrls: ['./accueiladminpdv.component.css']
})
export class AccueiladminpdvComponent implements OnInit {

  displayedPage = "accueil";
  isMobile : boolean ;
  loading = false ;
  comptecaissier : any;
  //parametre de compte

  process=[];
  
  adminpdvDashboardNbreReclVente: any;


  constructor(private _utilsService:UtilsService,
              private _authService:AuthService,
              private _crmService: CrmService,
              private _adminpdvService:AdminpdvService,
              private location: Location,
              private _comptabiliteService: ComptabiliteService,
              private _http: Http, private route:ActivatedRoute, 
              private router: Router,
              
              
            ) { }

  ngOnInit() {

    // détéction de la taille de l'écran
    if ( window.screen.width <= 768 )
      this.isMobile = true; // mobile screen

        // détéction de la taille de l'écran
    else
      this.isMobile = false; // descktop  screen
      this.loading = true ;

     this.loading = true ;


    // ngOninit CRM


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
            console.log("this.portefeuille :"+ this.portefeuille);
          },
          error => alert(error),
          () => {
            console.log("Here Dashboard Test")
            this.loading = false ;
          }
        )
      }
    )


    //  contabilite ngOnInit

    this._comptabiliteService.listecaisse()
      .subscribe(
      data => {
        console.log("Localhost Test");
        this.pdvCaisses = data.response ;
        console.log("this.pdvCaisses :"+this.pdvCaisses);
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )

    //  reclamation ngOnInit

    this._adminpdvService.historiquereclamation({type:"azrrtt"}).subscribe(
      data => {
        console.log("Localhost Test");
        console.log(data.response);
        this.adminmultipdvReclamation = data.response ;
        console.log("this.adminmultipdvReclamation"+ this.adminmultipdvReclamation);
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )

    // paramaitres ngOnInit
    console.log("test");
    this._adminpdvService.listuserpdv({type:"azrrtt"}).subscribe(
      data => {
        this.monitoringAdminpdvUserpdv = data.response ;
        console.log("this.monitoringAdminpdvUserpdv :"+ this.monitoringAdminpdvUserpdv);
      },
      error => alert(error),
      () => {
        this.getRegionNewCaissier();
        this.loading = false ;
      }
    );


    // Dashbord ngOnInit
    this._adminpdvService.nombredereclamationpdvvente({type:"azrrtt"}).subscribe(
      data => {
        console.log("Localhost Test");
        console.log(data.response);
        this.adminpdvDashboardNbreReclVente = data.response ;
        console.log("this.adminpdvDashboardNbreReclVente"+ this.adminpdvDashboardNbreReclVente);
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
        this.suivionepointIntervalleDashboard();
      }
    )

    //monitoring ngOnInit

    this.coordonneesgeospatiales();
    this._adminpdvService.bilandeposit({type:"azrrtt"}).subscribe(
      data => {
        this.monitoringAdminpdvDeposit = data.response;
        this.getEtatDepot();
        console.log("this.monitoringAdminpdvDeposit :"+this.monitoringAdminpdvDeposit);
      },
      error => alert(error),
      () => {
        this.getAlldepotsSup();
        this.loading = false ;
      }
    )

  }


  mobileProcessing (obj:any){
      let 
      infos,
      datas,
      operateur,
      operation;

      datas = obj.data;
      operateur =  datas.operateur;
      operation =  datas.operation;

      switch(operateur){
          case 1:{
              switch(operation){

                case 1:{
      
                  break;
                }

                case 1:{
      
                  break;
                }

              }

              break;
          }

          case 1:{
              switch(operation){

                case 1:{
      
                  break;
                }

                case 1:{
      
                  break;
                }

              }
            
              break;
          }
          case 1:{
              switch(operation){

                case 1:{
      
                  break;
                }

                case 1:{
      
                  break;
                }

              }
              break;
          }
          case 1:{
              switch(operation){

                case 1:{
      
                  break;
                }

                case 1:{
      
                  break;
                }

              }
              break;
          }

          default: break;

      }
  

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


@ViewChild('closeBtn') closeBtn: ElementRef;

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
email :any ;
telephone :any ;
nometps : any ;
nomshop : any ;
adresse : any ;

existLogin = false ;

public monitoringAdminpdvUserpdv: any;
public modifuserpdv: any;
public password:string;
public confirmPassword:string;
public errorConfirm:boolean = false;





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
                       Monitoring des deposites
*******************************************************************************/
/* -------- Variables -----------*/

@ViewChild('monitoringModal') public monitoringModal:ModalDirective;
@ViewChild("baseChart3")  chart3: BaseChartDirective;
@ViewChild('depositeModal') public depositeModal:ModalDirective;
@ViewChild('dechargeModal') public dechargeModal:ModalDirective;
@ViewChild('apercudechargeModal') public apercudechargeModal:ModalDirective;
@ViewChild('apercuPhotoComModal') public apercuPhotoComModal:ModalDirective;
@ViewChild('voirplusdedemandeModal') public voirplusdedemandeModal:ModalDirective;

public touslesdepots:any[] = [];
public affichelesdepots:any = {jours:[], montant:[]};


public barChartOptions:any = {
  scaleShowVerticalLines: false,
  responsive: true
};

public barChartLabels:string[] = [];
public barChartType:string = 'bar';
public barChartLegend:boolean = true;

public barChartData:any[] = [];

selectdemanretrait=false;
public monitoringAdminpdvDeposit: any;
public montantdeposit:number;
agentcc:any;
modeversement : string = "Direct";
montant:number;
ibanExcessif = false ;
listedeposit:any[] = [];
public listedepositsvalide:any[] = [];
public listedepositsencours:any[] = [];
viewonedetaildeposit:any;

dataImpression:any;

/* -------- Fonctions ---------*/

// rôle   : afficher le modal
// entres : null
// sorties: null

public showmonitoringModal():void {
  this.monitoringModal.show();
}

// rôle   : cacher le modal
// entres : null
// sorties: null

public hidemonitoringModal():void {
  this.monitoringModal.hide();
}

private closeModal(): void {
  this.iszones = false;
  this.issouszones = false;
  this.getRegionNewCaissier();

  this.errorConfirm = false;
  this.closeBtn.nativeElement.click();
  console.log('close');
}

public toInt(num: string) {
  return +num;
}

public sortByWordLength = (a: any) => {
  return a.pdv.length;
}

getAdress(adresse){
  return JSON.parse(adresse).address+" / "+JSON.parse(adresse).zone ;
}

public modif(item):void {
  this.modifuserpdv = item;
}

public validermodif():void {
  if(this.password == this.confirmPassword) {
    this._adminpdvService.modifypdv({idpdv: this.modifuserpdv.idpdv, modifydata: sha1(this.password)}).subscribe(
      data => {
        console.log(data);
      },
      error => alert(error),
      () => console.log("Localhost Test")
    );

    this.errorConfirm = false;
    this.password= null;
    this.confirmPassword = null;
    this.closeBtn.nativeElement.click();
  }
  else{
    this.errorConfirm = true;
  }
}

inscrire(){
  this.loading = true ;
  this._authService.creerProfilCaissier({
    prenom:this.prenom,
    nom:this.nom,
    email:this.email,
    telephone:this.telephone,
    nometps:this.nometps,
    nomshop:this.nomshop,
    adresse : JSON.stringify({
      region:this.region,
      zone:this.zone,
      souszone:this.souszone,
      address:this.adresse
    })
  }).subscribe(
    data => {
      console.log(data);
      if(data!="bad"){
        this._adminpdvService.listuserpdv({type:"azrrtt"}).subscribe(
          data => {
            this.monitoringAdminpdvUserpdv = data.response ;
          },
          error => alert(error),
          () => {
            this.loading = false ;
          }
        );
      }else{
        this.existLogin = true ;
      }

    },
    error => alert(error),
    () => {
      this.prenom=undefined ;
      this.nom=undefined ;
      this.email=undefined ;
      this.telephone=undefined ;
      this.nometps=undefined ;
      this.nomshop=undefined ;
      this.region=undefined ;
      this.zone=undefined ;
      this.souszone=undefined ;
      this.adresse=undefined ;
      this.existLogin = false ;
      this.closeModal();
      this.loading = false ;
    }
  );

}

public autoriseravoirdeposir(gerant, estautorise:number){
  console.log("Localhost autoriseravoirdeposir")
  console.log(gerant)
  this.loading = true ;
  this._adminpdvService.autoriservoirdepot({idpdv: gerant.idpdv, estautoriser: estautorise}).subscribe(
    data => {
      this._adminpdvService.listuserpdv({type:"azrrtt"}).subscribe(
        data => {
          this.monitoringAdminpdvUserpdv = data.response ;
        },
        error => alert(error),
        () => {
          this.loading = false ;
        }
      );
    },
    error => alert(error),
    () => console.log("Localhost Test")
  );
}

public deconnexionsession(pdv,i):void {
  this.loading = true ;
  this._adminpdvService.deconnectpdv({idpdv: pdv.idpdv}).subscribe(
    data => {
      this._adminpdvService.listuserpdv({type:"azrrtt"}).subscribe(
        data => {
          this.monitoringAdminpdvUserpdv = data.response ;
        },
        error => alert(error),
        () => {
          this.loading = false ;
        }
      );
    },
    error => alert(error),
    () => console.log("Localhost Test")
  );
}


validerdmde(){
  if(confirm("Confirmer la demande")){
    console.log("je confirme")
    this.loading = true ;
    this.selectdemanretrait = false;

    if (this.monitoringAdminpdvDeposit.etatdeposit < this.montant){
      this.ibanExcessif = true ;
      return 1 ;
    }
    this._adminpdvService.demandeRetrait({montant:this.montant.toString()}).subscribe(
      data => this.montant = undefined,
      error => alert(error),
      () => this.loading = false
    )
  } else{
    console.log("Je ne confirme pas")
  }
}

currencyFormat(somme) : String{
  return Number(somme).toLocaleString() ;
}

clickeddemanderetrait(){
    this.selectdemanretrait = true;
  }

public getEtatDepot(){
    /*this._crmdoorServiceWeb.getEtatDemandeDepot('infosup').then(adminpdvServiceWebList => {
      if(adminpdvServiceWebList.errorCode==0){
        let newdepot = false;
        this.listedeposit = adminpdvServiceWebList.response.map(function (opt) {
          if ( (newdepot==false && opt.etatdemande==0) || (newdepot==false && opt.etatdemande==1) ){
            newdepot = true;
          }
          console.log('-------------test--------------');
          return {
            datedemande: opt.datedemande.date.split('.')[0],
            montantdemande: opt.montantdemande,
            accepteur: opt.accepteur,
            representantbbs: (opt.accepteur=='attente' || opt.etatdemande==0)?'attente':JSON.parse(opt.accepteur).prenom+" "+JSON.parse(opt.accepteur).nom,
            etatdemande: opt.etatdemande,
            statusetatdemande: opt.etatdemande==0?'En cours de traitement':opt.etatdemande==1?'En cours de validation':opt.etatdemande==2?'chargement deposit':'Validé',
          }
        });
        this.listedepositsencours = this.listedeposit.filter(opt => opt.etatdemande!=3);
        this.listedepositsvalide = this.listedeposit.filter(opt => opt.etatdemande==3);
        if (!newdepot){
          clearInterval(this.killsetinterval);
        }

      }
    });*/
  }

public getInitDeposit(){
  console.log("getInitDeposit")
  this._utilsService.recupererInfosCC()
    .subscribe(
      data => {
        console.log(data);
        this.agentcc = data.response;
      },
      error => alert(error),
      () => {
        console.log('est')
      }
    );
}
public demndedeposit(data){
  console.log('------------------------------------');
  console.log('Ca fait quoi la');
  this._utilsService.demandedeposit(data)
    .subscribe(
      datas => {
        console.log('-----------------');
        console.log(datas);
      },
      error => alert(error),
      () => {
        console.log('est demandedeposit')
      }
    );
}

public showdepositeModal():void {
  this.montantdeposit=undefined;
  this.modeversement=undefined;
  this.getInitDeposit();
  this.depositeModal.show();
}
public hidedepositeModal():void {
  this.depositeModal.hide();
  console.log('hidedepositeModal')
}
public validerdeposite(){
  console.log("-1-------------------------------")
  if(confirm("Confirmer la demande")){
    console.log("je confirme")
    this._adminpdvService.validerDemandeDepot({montant: this.montantdeposit, infocc: JSON.stringify(this.agentcc).toString(), infocom: this.modeversement!=undefined?this.modeversement:""})
      .subscribe(
        data => {
          console.log("---------------------------------------");
          console.log(data);
        },
        error => alert(error),
        () => this.hidedepositeModal()
      );
  } else{
    console.log("Je ne confirme pas")
  }

}

public geoloc:{latitude:number, longitude:number} = JSON.parse(localStorage.getItem("coordonneesgeospatiales")==null?localStorage.getItem("coordonneesgeospatiales"):JSON.stringify({latitude:0, longitude:0}));
coordonneesgeospatiales(){
  console.log('coordonneesgeospatiales wait');
  navigator.geolocation.getCurrentPosition(position => {
    this.geoloc.longitude = position.coords.longitude;
    this.geoloc.latitude = position.coords.latitude;
    console.log('coordonneesgeospatiales 2222');
    console.log(this.geoloc);
    localStorage.setItem("coordonneesgeospatiales",JSON.stringify(this.geoloc))
  }, error => {
    console.log('Veuillez activer la géolocalisation: ');
    localStorage.setItem("coordonneesgeospatiales",JSON.stringify(this.geoloc))
  });
}


public showdechargeModal():void {
  this.dechargeModal.show();
}
public hidedechargeModal():void {
  this.dechargeModal.hide();
}

public showapercudechargeModal(detail:any):void {
  this.viewonedetaildeposit = detail;
  this.apercudechargeModal.show();
}
public hideapercudechargeModal():void {
  this.viewonedetaildeposit = undefined;
  this.apercudechargeModal.hide();
}

imprimerdecharge(decharge:any){
  console.log('-----------');
  this.dataImpression = {
    apiservice:'adminpdv',
    service:'faireundepot',
    infotransaction:{
      client:decharge,
    },
  };
  sessionStorage.setItem('dataImpression', JSON.stringify(this.dataImpression));
  this.router.navigate(['accueiladmpdv/impressionadminpdv']);
}

public showapercuPhotoComModal():void {
  this.apercuPhotoComModal.show();
}
public hideapercuPhotoComModal():void {
  this.apercuPhotoComModal.hide();
}

public showvoirplusdedemandeModal():void {
  this.voirplusdedemandeModal.show();
}
public hidevoirplusdedemandeModal():void {
  this.voirplusdedemandeModal.hide();
}

public suiviDepots(depots){
  this.touslesdepots = depots.map(function(type){
    return {
      date_depot: type.daterenflu.date.split('.')[0],
      date_depot_jour: type.daterenflu.date.split('.')[0].split(' ')[0],
      montant_depot: JSON.parse(type.infosup).montant,
    }
  });
  let depotjours = this.touslesdepots.map(type => type.date_depot_jour);
  depotjours.sort();

  let tabjours:string[] = [];
  let jour:string = depotjours[0];
  tabjours.push(jour);
  depotjours.forEach(type => { if(type!=jour){
    tabjours.push(type);
    jour = type;
  }});

  let tabjoursmontant:number[] = [];
  tabjours.forEach(date => {
    let montant:number = 0
    this.touslesdepots.forEach( type=> { if(type.date_depot_jour==date){ montant  += Number(type.montant_depot); } });
    tabjoursmontant.push(montant);
  });

  this.affichelesdepots.jours = tabjours;
  this.affichelesdepots.montant = tabjoursmontant;

  this.barChartLabels = tabjours;
  this. barChartData = [{data: tabjoursmontant, label: 'Dépots'}];
}

getAlldepotsSup(){
  this._utilsService.getOnePointSuivicc({infoinit:'initmonitoringsup', type:'depots'})
    .subscribe(
      data => {
        if(data.errorCode){
          console.log('--------')
          this.suiviDepots(data.message);
        }
      },
      error => alert(error),
      () => {
        if(this.chart3 !== undefined){
          this.chart3.chart.config.data.labels = this.barChartLabels;
        }
        this.loading = false;
      }
    );
}

/* ***************************************************************************
                     Guide d'iutilisation
********************************************************************************/
/* -------- Variables -----------*/


@ViewChild('guideModal') public guideModal:ModalDirective;


/* -------- Fonctions ---------*/


// rôle   : afficher le modal
// entres : null
// sorties: null

public showguideModal():void {
  this.guideModal.show();
}

// rôle   : cacher le modal
// entres : null
// sorties: null

public hideguideModal():void {
  this.guideModal.hide();
}

/* ***************************************************************************
                     exploitation
********************************************************************************/
/* -------- Variables -----------*/


  filtreaveccommission:any;









/* -------- Fonctions ---------*/


/* ***************************************************************************
                    Tableau de bord 
********************************************************************************/
/* -------- Variables -----------*/

public datapointrecup:any;
public touslesgerants:any[] = [];
public suivionepointSelectionintervalledateinit:string;
public suivionepointSelectionintervalledatefinal:string;

public touslescommissions:any[] = [];
public touslesjours:any[] = [];
public touslescommissionsbyGerant:any[] = [];
public id_gerant_selectionne:number=-1;

public lineChartData:Array<any> = [];
public lineChartLabels:Array<any> = [];
public lineChartOptions:any = { responsive: true };
public lineChartType:string = 'line';
public lineChartLegend:boolean = true;

@ViewChild("baseChart")  chart: BaseChartDirective;

/* -------- Fonctions ---------*/

tocurrency(number){
  return Number(number).toLocaleString();
}

public suivionepointIntervalle(gerant:any){
  this.touslescommissions = [];
  this.loading = true;
  this._utilsService.getOnePointSuivicc({infoinit:'notinitdashboard', type:'intervalle', infotype:this.suivionepointSelectionintervalledateinit+" "+this.suivionepointSelectionintervalledatefinal})
    .subscribe(
      data => {
        console.log(data);
        this.id_gerant_selectionne = -1;
        if(data.errorCode){
          this.touslescommissions = data.message.map(function(type){
            return {
              id_gerant: type.idUser,
              dateop: type.dateoperation.date.split('.')[0],
              dateop_jour: type.dateoperation.date.split('.')[0].split(' ')[0],
              montant: Number(type.montant),
              commission: Number(type.commissionpdv),
              service: type.nomservice.toLowerCase(),
              produit: type.libelleoperation.toLowerCase(),
            }
          });
        }
      },
      error => alert(error),
      () => {
        this.suivionepointSelectionGerant(-1);
        this.loading = false;
      }
    );
}

public suivionepointIntervalleDashboard(){
  this.loading = true;
  console.log("suivionepointIntervalleDashboard")
  this._utilsService.getOnePointSuivicc({infoinit:'initdashboard', type:'intervalle', infotype:this.suivionepointSelectionintervalledateinit+" "+this.suivionepointSelectionintervalledatefinal})
    .subscribe(
      data => {
        console.log(data)
        this.id_gerant_selectionne = -1;
        if(data.errorCode){
          this.datapointrecup = data.message;
          this.suivionepointSelectionintervalledateinit = data.dateinitial;
          this.suivionepointSelectionintervalledatefinal = data.datefinale;
          this.touslesgerants = this.datapointrecup.gerants.map(function(type){
            return {
              id_gerant: type.id_gerant,
              nom_gerant: type.nom_gerant,
              telephone: type.telephone,
              last_connection: type.last_connection.date.split('.')[0],
            }
          });
          this.touslescommissions = this.datapointrecup.commissions.map(function(type){
            return {
              id_gerant: type.idUser,
              dateop: type.dateoperation.date.split('.')[0],
              dateop_jour: type.dateoperation.date.split('.')[0].split(' ')[0],
              montant: Number(type.montant),
              commission: Number(type.commissionpdv),
              service: type.nomservice.toLowerCase(),
              produit: type.libelleoperation.toLowerCase(),
            }
          });
        }
      },
      error => alert(error),
      () => {
        this.suivionepointSelectionGerant(-1);
        this.loading = false;
      }
    );

  /*

   this._utilService.getOnePointSuivicc({infoinit:'initdashboard', type:'intervalle', infotype:this.suivionepointSelectionintervalledateinit+" "+this.suivionepointSelectionintervalledatefinal})
   .subscribe(
   data => {
   this.id_gerant_selectionne = -1;
   if(data.errorCode){
   this.datapointrecup = data.message;
   this.suivionepointSelectionintervalledateinit = data.dateinitial;
   this.suivionepointSelectionintervalledatefinal = data.datefinale;
   this.touslesgerants = this.datapointrecup.gerants.map(function(type){
   return {
   id_gerant: type.id_gerant,
   nom_gerant: type.nom_gerant,
   telephone: type.telephone,
   last_connection: type.last_connection.date.split('.')[0],
   }
   });
   this.touslescommissions = this.datapointrecup.commissions.map(function(type){
   return {
   id_gerant: type.idUser,
   dateop: type.dateoperation.date.split('.')[0],
   dateop_jour: type.dateoperation.date.split('.')[0].split(' ')[0],
   montant: Number(type.montant),
   commission: Number(type.commissionpdv),
   service: type.nomservice.toLowerCase(),
   produit: type.libelleoperation.toLowerCase(),
   }
   });
   }
   },
   error => alert(error),
   () => {
   this.suivionepointSelectionGerant(-1);
   this.loading = false;
   }
   );
   */
}


public suivionepointSelectionGerant(indice: number){
  this.lineChartData = [];
  this.lineChartLabels = [];
  this.touslesjours = [];

  this.id_gerant_selectionne = indice;
  if(this.id_gerant_selectionne==-1){ this.touslescommissionsbyGerant = this.touslescommissions;  }
  else {  this.touslescommissionsbyGerant = this.touslescommissions.filter( opt => opt.id_gerant==this.id_gerant_selectionne); }

  this.touslesjours = this.touslescommissions.map( type => type.dateop_jour);
  this.touslesjours.sort();
  let tabjours:string[] = [];
  let jour:string = this.touslesjours[0];
  tabjours.push(jour);
  this.lineChartLabels.push(jour);
  this.touslesjours.forEach(type => {
    if(type!=jour){
      tabjours.push(type);
      this.lineChartLabels.push(type);
      jour = type;
    }
  });

  if(this.chart !== undefined){
    this.chart.chart.config.data.labels = this.lineChartLabels;
  }

  let nbrebyjourom:number[] = [];
  let nbrebyjourtnt:number[] = [];
  let nbrebyjourpost:number[] = [];
  let nbrebyjourwizall:number[] = [];
  let nbrebyjouremoney:number[] = [];
  let nbrebyjourtigocash:number[] = [];
  tabjours.forEach(type => {
    let nbrebyjouromSom:number = 0;
    let nbrebyjourtntSom:number = 0;
    let nbrebyjourpostSom:number = 0;
    let nbrebyjourwizallSom:number = 0;
    let nbrebyjouremoneySom:number = 0;
    let nbrebyjourtigocashSom:number = 0;

    console.log("**************************************************************")

    this.touslescommissionsbyGerant.forEach( opt => { if(opt.dateop_jour==type && opt.service=='orangemoney'){ nbrebyjouromSom += Number(opt.montant); } }); nbrebyjourom.push( nbrebyjouromSom );
    this.touslescommissionsbyGerant.forEach( opt => { if(opt.dateop_jour==type && opt.service=='tnt'){ nbrebyjourtntSom += Number(opt.montant); } }); nbrebyjourtnt.push( nbrebyjourtntSom );
    this.touslescommissionsbyGerant.forEach( opt => { if(opt.dateop_jour==type && opt.service=='postcash'){ nbrebyjourpostSom += Number(opt.montant); } }); nbrebyjourpost.push( nbrebyjourpostSom );
    this.touslescommissionsbyGerant.forEach( opt => { if(opt.dateop_jour==type && opt.service=='wizall'){ nbrebyjourwizallSom += Number(opt.montant); } }); nbrebyjourwizall.push( nbrebyjourwizallSom );
    this.touslescommissionsbyGerant.forEach( opt => { if(opt.dateop_jour==type && opt.service=='emoney'){ nbrebyjouremoneySom += Number(opt.montant); } }); nbrebyjouremoney.push( nbrebyjouremoneySom );
    this.touslescommissionsbyGerant.forEach( opt => { if(opt.dateop_jour==type && opt.service=='tigocash'){ nbrebyjourtigocashSom += Number(opt.montant); } }); nbrebyjourtigocash.push( nbrebyjourtigocashSom );
  });

  this.lineChartData = [
    {data: nbrebyjourom, label: 'OM'},
    {data: nbrebyjourtnt, label: 'TNT'},
    {data: nbrebyjourpost, label: 'POSTECASH'},
    {data: nbrebyjourwizall, label: 'WIZALL'},
    {data: nbrebyjouremoney, label: 'E-MONEY'},
    {data: nbrebyjourtigocash, label: 'TIGOCASH'},
  ];
  console.log("**************************************************************")
}


/* ***************************************************************************
                     exploitation
********************************************************************************/
/* -------- Variables -----------*/


public adminmultipdvReclamation: any;

/* -------- Fonctions ---------*/

/* ***************************************************************************
                     CRM
********************************************************************************/
/* -------- Variables -----------*/


  public relance:any[];
  public promotion:Promotion[];
  public prospection:Prospection[];
  public suivicommande:Suivicommande[];
  public portefeuille:Portefeuille[];
  public servicepoint:Servicepoint[];
  token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;

  message  : string = '' ;
  categMsg : string ;
  filtre = "" ;
  choosedCustomerPhone : string ;

  filtreSuiviCmd ="";
  filtreProspect ="";
  filtrePromo ="";
  filtreService ="---Choisir un service---";
  filtreRel ="";
  filtrePortFeuil ="";

  nom="nom";
  asc="asc";

  checkerRelance : any[] = [] ;
  checkerPromo : any[] = []  ;

  public menuHead = {menuHead1:true, menuHead2:false, menuHead3:false, menuHead4:false, menuHead5:false};



/* -------- Fonctions ---------*/

  public menuHeadClick(option: number){
    if(option == 1){
      this.menuHead.menuHead1 = true;
      this.menuHead.menuHead2 = false;
      this.menuHead.menuHead3 = false;
      this.menuHead.menuHead4 = false;
      this.menuHead.menuHead5 = false;
    }
    if(option == 2){
      this.menuHead.menuHead1 = false;
      this.menuHead.menuHead2 = true;
      this.menuHead.menuHead3 = false;
      this.menuHead.menuHead4 = false;
      this.menuHead.menuHead5 = false;
    }
    if(option == 3){
      this.menuHead.menuHead1 = false;
      this.menuHead.menuHead2 = false;
      this.menuHead.menuHead3 = true;
      this.menuHead.menuHead4 = false;
      this.menuHead.menuHead5 = false;
    }
    if(option == 4){
      this.menuHead.menuHead1 = false;
      this.menuHead.menuHead2 = false;
      this.menuHead.menuHead3 = false;
      this.menuHead.menuHead4 = true;
      this.menuHead.menuHead5 = false;
    }
    if(option == 5){
      this.menuHead.menuHead1 = false;
      this.menuHead.menuHead2 = false;
      this.menuHead.menuHead3 = false;
      this.menuHead.menuHead4 = false;
      this.menuHead.menuHead5 = true;
    }
  }

  getNom(infosop : string ){
    return JSON.parse(infosop).nom ;
  }

  getPrenom(infosop:string){
    return JSON.parse(infosop).prenom;
  }

  getTelephone(infosop:string){
    return JSON.parse(infosop).tel;
  }

  prospect(){
      this.loading = true ;

    this._crmService.prospection().subscribe(
      data => {
        this.prospection = data ;
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
        this.loading = false ;
      }
    )
  }

  commandes(){
      this.loading = true ;
    this._crmService.suivicommande().subscribe(
      data => {
        this.suivicommande = data ;
        console.log(this.suivicommande);
      },
      error => alert(error),
      () => {
        console.log("Here Dashboard Test")
        this.loading = false ;
      }
    )
  }

  prtflle(){
    this.loading = true ;
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

  checkThisForRelance( isChecked:boolean, customer:any, index ){
    if(isChecked){
      this.checkerRelance.push( {unicity :index, customer} ) ;
    }else
    if ( _.find( this.checkerRelance, { 'unicity': index } ) )
      this.checkerRelance = _.filter( this.checkerRelance, function(o) { return (o.unicity!=index) } );
  }

  checkThisForPromo( isChecked:boolean, customer:any, index ){
    if(isChecked){
      this.checkerPromo.push( {unicity :index, customer} ) ;
    }else
    if ( _.find( this.checkerPromo, { 'unicity': index } ) )
      this.checkerPromo = _.filter( this.checkerPromo, function(o) { return (o.unicity!=index) } );
  }

  getAddressRecup(pointderecuperation){
    return JSON.parse(pointderecuperation).address ;
  }


  @ViewChild('childModal') public childModal:ModalDirective;

  public showChildModal(typeSuivi, tel):void {
    this.categMsg = typeSuivi ;
    if (typeSuivi=='single')
      this.choosedCustomerPhone = tel ;
    this.childModal.show();
  }

  public hideChildModal():void {
    this.message = '' ;
    this.childModal.hide();
  }


/* ***************************************************************************
                     Contabilité
********************************************************************************/
/* -------- Variables -----------*/

pdvCaisses : PdvCaisse[] ;
libelleCharge : string ;
montantCharge : number ;

service : string ;
designationsService: Designation[] = [];
nbreDesignation:number = 0;

approvisionnement = "" ;
estselectionne:number = -1;
estselectionr:number;
estselectionf:number;
estselectionouvert:number;
estselectionfff:number;
estselectionas:number;
estselectionms:number;
estselectionss:number;
montreautredesignation:number;
estselectionmods:number = -1;

onPostUpdate = false ;

estclickeJour = true;
estclickeAnnee = false;
estclickeIntervalle = false;

charges:Charges[];
revenus:Revenus[];
revenustransfert:Revenustransfert[];
supservice:Supservice[];

usersExploitation:UserExploitation[];

montantajoutecaisse:number;

public checkModel:any = {jour: true, annee: false, intervalle: false};
selectionannee:string;
selectionjour:string;
selectionintervalledateinit:string;
selectionintervalleddatefinal:string;
selectionintervalle:string;



isselectlisterrevenuautre:boolean = true;


/* -------- Fonctions ---------*/



isActif(nomPdv : string) : boolean{
  return (this.approvisionnement.indexOf("-"+nomPdv+"-")>-1) ;
}

approvisionnercaisse(idpdv: number, i:number){
  this.approvisionnement="" ;
  this.loading = true ;
  this._comptabiliteService.approvisionner({idpdv: idpdv, montant: this.montantajoutecaisse})
    .subscribe(
      data => {
        this.pdvCaisses[i].caisse = Number(this.pdvCaisses[i].caisse) + Number(this.montantajoutecaisse);
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}


listercharges(i){
  this.estselectionne = i ;
  this.loading = true ;

  this._comptabiliteService.listecharge({idpdv: this.pdvCaisses[i].idpdv})
    .subscribe(
      data => {
        this.charges = data.response;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

listerrevenus(i){
  this.estselectionr = i;
  this.estselectionne = i ;
  this.loading = true ;

  this._comptabiliteService.listerevenu({idpdv: this.pdvCaisses[i].idpdv})
    .subscribe(
      data => {
        this.revenus = data.response;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

listerrevenustransfert(i){
  this.estselectionr = i;
  this.estselectionne = i ;
  this.loading = true ;

  this._comptabiliteService.listerevenutransfert({idpdv: this.pdvCaisses[i].idpdv})
    .subscribe(
      data => {
        this.revenustransfert = data.response;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

ajoutercharges(i){
  this.estselectionf = i;
  this.estselectionne = i ;
}

validerajoutercharges(pdv){
  this.loading = true ;

  this._comptabiliteService.ajoutcharge({libelle: this.libelleCharge, idpdv: pdv.idpdv, service: this.service, montant: this.montantCharge})
    .subscribe(
      data => {
        console.log(data.response);
        this.libelleCharge = null;
        this.montantCharge = null;
        this.service = null;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}


/************************************************************************************
 *********************************   PARTIE EXPLOITATION   ****************************
 ***********************************************************************************/

exploitation:Exploitation[];
exploitationaveccommission:Exploitationaveccommission[];
exploitationbilan:any[]=[];
bilanexploitationaveccommission:any[] = [];

listeruserexploitation(){
  this.loading = true ;

  this._comptabiliteService.userexploitation()
    .subscribe(
      data => {
        this.usersExploitation = data.response;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

listerexploitation(i:number, isouvesrt:number, isferme:number ){
  this.estcheckModel("");
  this.estselectionne = i ;
  this.estselectionouvert = isouvesrt;
  this.estselectionfff = isferme;
  console.log(this.estselectionne +" "+ this.estselectionouvert +" "+ this.estselectionfff);
  let datenow = ((new Date()).toJSON()).split("T",2)[0];

  this.loading = true ;
  this._comptabiliteService.exploitation({idpdv: this.usersExploitation[i].idpdv, type: "jour", infotype: datenow})
    .subscribe(
      data => {
        this.exploitation = data.response.map(function (type) {
          return {
            dateajout: type.dateajout.date.split(".")[0],
            designation: type.designation,
            stocki: type.stocki,
            vente: type.vente,
            stockf: type.stockf,
            mnt: Number(type.mnt),
          }
        });
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

listerexploitationaveccommission(i:number, isouvesrt:number, isferme:number ){
  this.estcheckModel("");
  this.estselectionne = i ;
  this.estselectionouvert = isouvesrt;
  this.estselectionfff = isferme;
  console.log(this.estselectionne +" "+ this.estselectionouvert +" "+ this.estselectionfff);
  let datenow = ((new Date()).toJSON()).split("T",2)[0];

  this.loading = true ;
  this._comptabiliteService.exploitationaveccommission({idpdv: this.usersExploitation[i].idpdv, type: "jour", infotype: datenow})
    .subscribe(
      data => {
        this.exploitationaveccommission = data.response.map(function (type) {
          return {
            dateajout: type.dateajout.date.split(".")[0],
            designation: type.designation,
            mnt: Number(type.mnt),
            frais: Number(type.frais),
            commission: Number(type.commission),
            service: type.service.toLowerCase(),
          }
        });
      },
      error => alert(error),
      () => {
        this.calculbilanexploitationaveccommission();
        this.loading = false ;
      }
    )
}

listerexploitationrecherche(idpdv, iscommission){
  console.log(iscommission);
  let datenow = ((new Date()).toJSON()).split("T",2)[0];
  this.loading = true ;
  if(iscommission == 0){
    this._comptabiliteService.exploitationaveccommission({idpdv: idpdv, type: "jour", infotype: datenow})
      .subscribe(
        data => {
          this.exploitationaveccommission = data.response.map(function (type) {
            return {
              dateajout: type.dateajout.date.split(".")[0],
              designation: type.designation,
              mnt: Number(type.mnt),
              frais: Number(type.frais),
              commission: Number(type.commission),
              service: type.service.toLowerCase(),
            }
          });
        },
        error => alert(error),
        () => {
          this.calculbilanexploitationaveccommission();
          this.loading = false ;
        }
      )
  }
  else {
    this._comptabiliteService.exploitation({idpdv: idpdv, type: "jour", infotype: datenow})
      .subscribe(
        data => {
          this.exploitation = data.response.map(function (type) {
            return {
              dateajout: type.dateajout.date.split(".")[0],
              designation: type.designation,
              stocki: type.stocki,
              vente: type.vente,
              stockf: type.stockf,
              mnt: type.mnt,
            }
          });
        },
        error => alert(error),
        () => {
          this.loading = false ;
        }
      )
  }

}

listerexploitationrechercheannee(idpdv, iscommission){
  console.log(iscommission);
  this.loading = true ;
  if(iscommission == 0){

    this._comptabiliteService.exploitationaveccommission({idpdv: idpdv, type: "annee", infotype: this.selectionannee})
      .subscribe(
        data => {
          this.exploitationaveccommission = data.response.map(function (type) {
            return {
              dateajout: type.dateajout.date.split(".")[0],
              designation: type.designation,
              mnt: Number(type.mnt),
              frais: Number(type.frais),
              commission: Number(type.commission),
              service: type.service.toLowerCase(),
            }
          });
        },
        error => alert(error),
        () => {
          this.calculbilanexploitationaveccommission();
          this.loading = false ;
        }
      )
  }
  else {

    this._comptabiliteService.exploitation({idpdv: idpdv, type: "annee", infotype: this.selectionannee})
      .subscribe(
        data => {
          this.exploitation = data.response.map(function (type) {
            return {
              dateajout: type.dateajout.date.split(".")[0],
              designation: type.designation,
              stocki: type.stocki,
              vente: type.vente,
              stockf: type.stockf,
              mnt: type.mnt,
            }
          });
        },
        error => alert(error),
        () => {
          this.loading = false ;
        }
      )
  }

}

listerexploitationparjour(idpdv, iscommission){
  console.log(iscommission);
  if(this.selectionjour != ""){
    this.loading = true ;
    if(iscommission == 0){

      this._comptabiliteService.exploitationaveccommission({idpdv: idpdv, type: "jour", infotype: this.selectionjour})
        .subscribe(
          data => {
            this.exploitationaveccommission = data.response.map(function (type) {
              return {
                dateajout: type.dateajout.date.split(".")[0],
                designation: type.designation,
                mnt: Number(type.mnt),
                frais: Number(type.frais),
                commission: Number(type.commission),
                service: type.service.toLowerCase(),
              }
            });
          },
          error => alert(error),
          () => {
            this.calculbilanexploitationaveccommission();
            this.loading = false ;
          }
        )
    }
    else {
      this._comptabiliteService.exploitation({idpdv: idpdv, type: "jour", infotype: this.selectionjour})
        .subscribe(
          data => {
            this.exploitation = data.response.map(function (type) {
              return {
                dateajout: type.dateajout.date.split(".")[0],
                designation: type.designation,
                stocki: type.stocki,
                vente: type.vente,
                stockf: type.stockf,
                mnt: type.mnt,
              }
            });
          },
          error => alert(error),
          () => {
            this.loading = false ;
          }
        )
    }
  }
}

listerexploitationparannee(idpdv, iscommission){
  console.log(iscommission);
  this.loading = true ;
  if(iscommission == 0){

    this._comptabiliteService.exploitationaveccommission({idpdv: idpdv, type: "annee", infotype: this.selectionannee})
      .subscribe(
        data => {
          this.exploitationaveccommission = data.response.map(function (type) {
            return {
              dateajout: type.dateajout.date.split(".")[0],
              designation: type.designation,
              mnt: Number(type.mnt),
              frais: Number(type.frais),
              commission: Number(type.commission),
              service: type.service.toLowerCase(),
            }
          });
        },
        error => alert(error),
        () => {
          this.calculbilanexploitationaveccommission();
          this.loading = false ;
        }
      )
  }
  else {
    this._comptabiliteService.exploitation({idpdv: idpdv, type: "annee", infotype: this.selectionannee})
      .subscribe(
        data => {
          this.exploitation = data.response.map(function (type) {
            return {
              dateajout: type.dateajout.date.split(".")[0],
              designation: type.designation,
              stocki: type.stocki,
              vente: type.vente,
              stockf: type.stockf,
              mnt: type.mnt,
            }
          });
        },
        error => alert(error),
        () => {
          this.loading = false ;
        }
      )
  }
}

listerexploitationintervalle(idpdv, iscommission){
  console.log(iscommission);
  if(this.selectionintervalledateinit && this.selectionintervalleddatefinal){
    this.loading = true ;
    this.selectionintervalle = this.selectionintervalledateinit+" "+this.selectionintervalleddatefinal;
    if(iscommission == 0){
      this._comptabiliteService.exploitationaveccommission({idpdv: idpdv, type: "intervalle", infotype: this.selectionintervalle})
        .subscribe(
          data => {
            this.exploitationaveccommission = data.response.map(function (type) {
              return {
                dateajout: type.dateajout.date.split(".")[0],
                designation: type.designation,
                mnt: Number(type.mnt),
                frais: Number(type.frais),
                commission: Number(type.commission),
                service: type.service.toLowerCase(),
              }
            });
          },
          error => alert(error),
          () => {
            this.calculbilanexploitationaveccommission();
            this.loading = false ;
          }
        )
    }
    else {
      this._comptabiliteService.exploitation({idpdv: idpdv, type: "intervalle", infotype: this.selectionintervalle})
        .subscribe(
          data => {
            this.exploitation = data.response.map(function (type) {
              return {
                dateajout: type.dateajout.date.split(".")[0],
                designation: type.designation,
                stocki: type.stocki,
                vente: type.vente,
                stockf: type.stockf,
                mnt: type.mnt,
              }
            });
          },
          error => alert(error),
          () => {
            this.loading = false ;
          }
        )
    }
  }
}

calculbilanexploitationaveccommission(){
  this.bilanexploitationaveccommission = [
    {service:'tnt', cashin:0, cashout:0, commission:0},
    {service:'postcash', cashin:0, cashout:0, commission:0},
    {service:'wizall', cashin:0, cashout:0, commission:0},
    {service:'emoney', cashin:0, cashout:0, commission:0},
    {service:'orangemoney', cashin:0, cashout:0, commission:0},
    {service:'tigocash', cashin:0, cashout:0, commission:0},
    {service:'Total', cashin:0, cashout:0, commission:0},
  ];
  this.exploitationbilan = this.exploitationaveccommission;
  this.exploitationbilan.forEach(type => {
    this.bilanexploitationaveccommission[6].cashin+=type.mnt;
    this.bilanexploitationaveccommission[6].commission+=type.commission;
    if(type.service == 'tnt'){
      this.bilanexploitationaveccommission[0].cashin+=type.mnt;
      this.bilanexploitationaveccommission[0].commission+=type.commission;
    }
    if(type.service == 'postcash'){
      this.bilanexploitationaveccommission[1].cashin+=type.mnt;
      this.bilanexploitationaveccommission[1].commission+=type.commission;
    }
    if(type.service == 'wizall'){
      this.bilanexploitationaveccommission[2].cashin+=type.mnt;
      this.bilanexploitationaveccommission[2].commission+=type.commission;
    }
    if(type.service == 'emoney'){
      if(type.designation == 'depot'){
        this.bilanexploitationaveccommission[3].cashin+=type.mnt;
      }
      else{
        this.bilanexploitationaveccommission[3].cashout+=type.mnt;
        this.bilanexploitationaveccommission[6].cashout+=type.mnt;
        this.bilanexploitationaveccommission[6].cashin-=type.mnt;
      }
      this.bilanexploitationaveccommission[3].commission+=type.commission;
    }
    if(type.service == 'orangemoney'){
      if(type.designation == 'depot'){
        this.bilanexploitationaveccommission[4].cashin+=type.mnt;
      }
      else{
        this.bilanexploitationaveccommission[4].cashout+=type.mnt;
        this.bilanexploitationaveccommission[6].cashout+=type.mnt;
        this.bilanexploitationaveccommission[6].cashin-=type.mnt;
      }
      this.bilanexploitationaveccommission[4].commission+=type.commission;
    }
    if(type.service == 'tigocash'){
      if(type.designation == 'depot'){
        this.bilanexploitationaveccommission[5].cashin+=type.mnt;
      }
      else{
        this.bilanexploitationaveccommission[5].cashout+=type.mnt;
        this.bilanexploitationaveccommission[6].cashout+=type.mnt;
        this.bilanexploitationaveccommission[6].cashin-=type.mnt;
      }
      this.bilanexploitationaveccommission[5].commission+=type.commission;
    }
  });

}




/************************************************************************************
 *********************************   PARTIE PERSONNALISATION   ****************************
 ***********************************************************************************/



clickIsselectlisterrevenuautre(){

}

ajouterdesignation(){
  this.designationsService.push(new Designation());
}

ajouterservice(i){
  this.estselectionne = i ;
  this.estselectionas = i;
  this.service = null;
  this.designationsService = [];
  this.designationsService.push(new Designation());
}

modifierservice(i){
  this.estselectionne = i ;
  this.estselectionms = i;
  this.loading = true ;

  this._comptabiliteService.listeservice({idpdv: this.pdvCaisses[i].idpdv})
    .subscribe(
      data => {
        this.supservice = data.response;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

supprimerservice(i){
  this.estselectionne = i;
  this.service = null;
  this.designationsService = [];
  this.loading = true ;

  this._comptabiliteService.listeservice({idpdv: this.pdvCaisses[i].idpdv})
    .subscribe(
      data => {
        this.supservice = data.response;
      },
      error => alert(error),
      () => {
        this.loading = false ;
      }
    )
}

effacerunedesignation(i){
  this.designationsService = this.designationsService.filter(item => item !==this.designationsService[i]);
}

validerajouterservice(pdv:any){
  this.loading = true ;
  this._comptabiliteService.ajoutservice({nom: this.service, idpdv: pdv.idpdv, designations: ""+JSON.stringify(this.designationsService)})
    .subscribe(
      data => {
        console.log(data.response);
      },
      error => alert(error),
      () => {
        this._comptabiliteService.listeservice({idpdv: pdv.idpdv})
          .subscribe(
            data => {
              this.supservice = data.response;
            },
            error => alert(error),
            () => {
              this.loading = false ;
            }
          )
        this.loading = false ;
      }
    )

}

validermodifierservice(pdv:any){
  this.loading = true ;
  this._comptabiliteService.modifierservice({service: this.service, designations: ""+JSON.stringify(this.designationsService), idservice: this.serviceamodifier().idservice})
    .subscribe(
      data => {
        console.log(data.response);
      },
      error => alert(error),
      () => {
        this._comptabiliteService.listeservice({idpdv: pdv.idpdv})
          .subscribe(
            data => {
              this.supservice = data.response;
              this.estselectionmods = -1 ;
            },
            error => alert(error),
            () => {
              this.loading = false ;
            }
          )
        this.loading = false ;
      }
    )
}

deleteservice(supservice:Supservice, pdv) {
  this.loading = true ;

  this._comptabiliteService.supprimerservice({idsupprimer: supservice.idservice})
    .subscribe(
      data => {
        console.log(data.response);
      },
      error => alert(error),
      () => {
        this._comptabiliteService.listeservice({idpdv: pdv.idpdv})
          .subscribe(
            data => {
              this.supservice = data.response;
            },
            error => alert(error),
            () => {
              this.loading = false ;
            }
          )
        this.loading = false ;
      }
    )
}

serviceamodifier(){
  return this.supservice[this.estselectionmods];
}

modifyservice(i){
  // this.estselectionne = i ;
  this.estselectionmods=i;
  this.service = this.supservice[i].services;
  this.designationsService = JSON.parse(this.supservice[i].design);
}

autredesignation(i){
  this.estselectionne = i ;
  this.montreautredesignation=i;
}
}


